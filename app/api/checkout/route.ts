import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { priceCart } from "@/lib/pricing";

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

    // Prețurile și reducerile se calculează pe server din catalog; ignorăm orice preț trimis de browser
    const { items, discountCode, customerEmail, customerName, language, currency, requestInvoice } = await request.json();
    const invoiceRequested = !!requestInvoice;

    const pricing = priceCart(items, discountCode, currency);
    if (!pricing.ok) {
      return NextResponse.json({ error: pricing.message }, { status: 400 });
    }

    const {
      lines,
      discountCodes: discountCodesArray,
      discountPercentage: effectiveDiscountPercentage,
      totalRON: totalAmountRON,
      totalInCurrency: totalAmount,
      currency: selectedCurrency,
      exchangeRate,
      isFree,
    } = pricing.cart;
    const normalizedCodes = discountCodesArray.join(", ");

    if (isFree) {
      return NextResponse.json(
        { error: "Free orders must use /api/checkout/free" },
        { status: 400 }
      );
    }

    // Stripe folosește coduri de currency în lowercase
    const stripeCurrency = selectedCurrency.toLowerCase();

    // Construiește line items pentru Stripe
    const lineItems = lines.map((line) => {
      // Prețul este în RON, trebuie convertit în currency-ul selectat
      const unitPrice = line.discountedUnitPriceRON * exchangeRate;
      const unitAmount = Math.round(unitPrice * 100);

      return {
        price_data: {
          currency: stripeCurrency,
          product_data: {
            name: line.name,
            description: line.description,
          },
          unit_amount: unitAmount,
        },
        quantity: line.quantity,
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
        discount_code: normalizedCodes || "",
        discount_codes: discountCodesArray.join(","), // Lista de coduri separate prin virgulă
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
      
      // Prețurile cu discount aplicat secvențial (calculate în priceCart)
      const formattedItems = lines.map((line) => ({
        name: line.name,
        quantity: line.quantity,
        price: line.discountedUnitPriceRON,
      }));

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
          discountCode: normalizedCodes || undefined,
          metadata: {
            language: language || "en",
            discount_percentage: effectiveDiscountPercentage ? effectiveDiscountPercentage.toString() : "0",
            discount_code: normalizedCodes || "",
            discount_codes: discountCodesArray.join(","),
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

