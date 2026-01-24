import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { getDiscountPercentageForCode, normalizeDiscountCode } from "@/lib/discount-codes";

export async function POST(request: NextRequest) {
  try {
    // Verifică dacă STRIPE_SECRET_KEY este setat
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-12-15.clover",
    });

    const { items, discountPercentage, discountCode, customerEmail, customerName, language, currency = "RON", requestInvoice } = await request.json();
    const invoiceRequested = !!requestInvoice;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart items are required" },
        { status: 400 }
      );
    }

    // Determine discount (prefer code if provided)
    const normalizedCode = typeof discountCode === "string" ? normalizeDiscountCode(discountCode) : "";
    const percentageFromCode = normalizedCode ? getDiscountPercentageForCode(normalizedCode) : 0;
    if (normalizedCode && percentageFromCode <= 0) {
      return NextResponse.json(
        { error: "Invalid discount code" },
        { status: 400 }
      );
    }
    const effectiveDiscountPercentage =
      percentageFromCode > 0
        ? percentageFromCode
        : typeof discountPercentage === "number"
          ? Math.max(0, Math.min(100, discountPercentage))
          : 0;

    // Rate-uri de schimb (trebuie să fie identice cu cele din CurrencyContext)
    const exchangeRates: Record<string, number> = {
      RON: 1,
      EUR: 0.2,
      USD: 0.22,
      GBP: 0.18,
    };

    // Validează currency-ul și folosește RON dacă nu este suportat
    const validCurrencies = ["RON", "EUR", "USD", "GBP"];
    const selectedCurrency = validCurrencies.includes(currency) ? currency : "RON";
    const exchangeRate = exchangeRates[selectedCurrency] || 1;
    
    // Stripe folosește coduri de currency în lowercase
    const stripeCurrency = selectedCurrency.toLowerCase();

    // Calculează totalul în RON (prețurile din items sunt în RON)
    let totalAmountRON = items.reduce((sum: number, item: { product: { price: number }; quantity: number }) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    // Aplică discount dacă există
    if (effectiveDiscountPercentage > 0) {
      totalAmountRON = totalAmountRON * (1 - effectiveDiscountPercentage / 100);
    }

    // Convertește în currency-ul selectat
    const totalAmount = totalAmountRON * exchangeRate;

    // Construiește line items pentru Stripe
    const lineItems = items.map((item: { product: { name: string; price: number; description?: string }; quantity: number }) => {
      // Prețul este în RON, trebuie convertit
      let unitPriceRON = item.product.price;
      
      // Aplică discount dacă există
      if (effectiveDiscountPercentage > 0) {
        unitPriceRON = unitPriceRON * (1 - effectiveDiscountPercentage / 100);
      }

      // Convertește în currency-ul selectat
      const unitPrice = unitPriceRON * exchangeRate;
      const unitAmount = Math.round(unitPrice * 100);

      return {
        price_data: {
          currency: stripeCurrency,
          product_data: {
            name: item.product.name,
            description: item.product.description || "",
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    });

    // Creează sesiunea de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "revolut_pay"],
      line_items: lineItems,
      mode: "payment",
      customer_email: customerEmail || undefined, // Adaugă emailul clientului dacă este furnizat
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || request.headers.get("origin")}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || request.headers.get("origin")}/checkout/cancel`,
      metadata: {
        customer_email: customerEmail || "",
        customer_name: customerName?.trim() || "",
        language: language || "en",
        discount_percentage: effectiveDiscountPercentage ? effectiveDiscountPercentage.toString() : "0",
        discount_code: normalizedCode || "",
        request_invoice: invoiceRequested ? "true" : "false",
        original_currency: "RON",
        payment_currency: selectedCurrency,
        exchange_rate: exchangeRate.toString(),
        total_amount_ron: totalAmountRON.toFixed(2), // Prețul exact în RON la momentul checkout-ului
        amount_in_currency: totalAmount.toFixed(2), // Prețul în currency-ul selectat
      },
    });

    // Salvează comanda în MongoDB cu status "pending" imediat după crearea checkout-ului
    try {
      await connectDB();
      
      const formattedItems = items.map((item: { product: { name: string; price: number }; quantity: number }) => {
        let unitPriceRON = item.product.price;
        if (effectiveDiscountPercentage > 0) {
          unitPriceRON = unitPriceRON * (1 - effectiveDiscountPercentage / 100);
        }
        
        return {
          name: item.product.name,
          quantity: item.quantity || 1,
          price: unitPriceRON,
        };
      });

      await Order.findOneAndUpdate(
        { orderId: session.id },
        {
          orderId: session.id,
          provider: "stripe",
          customerEmail: customerEmail || "",
          customerName: customerName?.trim() || undefined,
          amountRON: totalAmountRON,
          amountCurrency: totalAmount,
          currency: selectedCurrency,
          status: "pending",
          items: formattedItems,
          discountPercentage: effectiveDiscountPercentage || undefined,
          discountCode: normalizedCode || undefined,
          metadata: {
            language: language || "en",
            discount_percentage: effectiveDiscountPercentage ? effectiveDiscountPercentage.toString() : "0",
            discount_code: normalizedCode || "",
            request_invoice: invoiceRequested,
            original_currency: "RON",
            payment_currency: selectedCurrency,
            exchange_rate: exchangeRate.toString(),
            total_amount_ron: totalAmountRON.toFixed(2),
            amount_in_currency: totalAmount.toFixed(2),
          },
        },
        { upsert: true, new: true }
      );

      console.log(`✅ Order ${session.id} saved to MongoDB with status "pending"`);
    } catch (error: any) {
      console.error("❌ Error saving order to MongoDB at checkout:", error);
      // Nu returnăm eroare, continuăm cu checkout-ul
    }

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

