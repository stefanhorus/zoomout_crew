import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { priceCart } from "@/lib/pricing";

export async function POST(request: NextRequest) {
  try {
    // Verifică dacă REVOLUT_SECRET_KEY este setat
    if (!process.env.REVOLUT_SECRET_KEY) {
      console.error("REVOLUT_SECRET_KEY is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

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

    // Construiește order items pentru Revolut
    const orderItems = lines.map((line) => {
      // Prețul este în RON, trebuie convertit în currency-ul selectat
      const unitPrice = line.discountedUnitPriceRON * exchangeRate;

      return {
        name: line.name,
        quantity: line.quantity,
        unit_price: Math.round(unitPrice * 100), // Revolut folosește cenți/bani
        total_amount: Math.round(unitPrice * line.quantity * 100),
      };
    });

    // Creează order în Revolut
    // URL-ul corect: https://merchant.revolut.com/api/1.0/orders (producție)
    // Sandbox: https://sandbox-merchant.revolut.com/api/1.0/orders
    const baseUrl = process.env.REVOLUT_API_URL || "https://merchant.revolut.com";
    const apiVersion = "1.0";
    const response = await fetch(`${baseUrl}/api/${apiVersion}/orders`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.REVOLUT_SECRET_KEY}`,
        "Content-Type": "application/json",
        "Revolut-Api-Version": "2024-05-01",
      },
      body: JSON.stringify({
        amount: Math.round(totalAmount * 100), // Total în cenți în currency-ul selectat
        currency: selectedCurrency,
        capture_mode: "AUTOMATIC",
        customer_id: undefined, // Poți adăuga customer_id dacă ai
        email: customerEmail || undefined, // Adaugă emailul clientului
        description: `Order from Zoomout Crew - ${lines.length} item(s)`,
        items: orderItems,
        metadata: {
          discount_percentage: effectiveDiscountPercentage || 0,
          discount_code: normalizedCodes || "",
          discount_codes: discountCodesArray.join(","), // Lista de coduri separate prin virgulă
          items_count: lines.length,
          customer_email: customerEmail || "",
          customer_name: customerName?.trim() || "",
          language: language || "en",
          request_invoice: invoiceRequested,
          original_currency: "RON",
          payment_currency: selectedCurrency,
          exchange_rate: exchangeRate.toString(),
          total_amount_ron: totalAmountRON.toFixed(2), // Prețul exact în RON la momentul checkout-ului
          amount_in_currency: totalAmount.toFixed(2), // Prețul în currency-ul selectat
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Revolut API error:", data);
      return NextResponse.json(
        { error: data.message || "Failed to create Revolut order" },
        { status: response.status }
      );
    }

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
        { orderId: data.id },
        {
          orderId: data.id,
          provider: "revolut",
          customerEmail: customerEmail || "",
          customerName: customerName?.trim() || undefined,
          amountRON: totalAmountRON,
          amountCurrency: totalAmount,
          currency: selectedCurrency,
          status: "pending",
          paymentIntentId: data.public_id,
          items: formattedItems,
          discountPercentage: effectiveDiscountPercentage || undefined,
          discountCode: normalizedCodes || undefined,
          metadata: {
            language: language || "en",
            original_currency: "RON",
            discount_percentage: effectiveDiscountPercentage || 0,
            discount_code: normalizedCodes || "",
            discount_codes: discountCodesArray.join(","),
            request_invoice: invoiceRequested,
            payment_currency: selectedCurrency,
            exchange_rate: exchangeRate.toString(),
            total_amount_ron: totalAmountRON.toFixed(2),
            amount_in_currency: totalAmount.toFixed(2),
          },
        },
        { upsert: true, new: true }
      );

      console.log(`✅ Order ${data.id} saved to MongoDB with status "pending"`);
    } catch (error: any) {
      console.error("❌ Error saving order to MongoDB at checkout:", error);
      // Nu returnăm eroare, continuăm cu checkout-ul
    }

    // Returnează order ID și checkout URL
    return NextResponse.json({
      orderId: data.id,
      checkoutUrl: data.checkout_url || `https://pay.revolut.com/checkout/${data.id}`,
      publicId: data.public_id,
    });
  } catch (error: any) {
    console.error("Revolut checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

