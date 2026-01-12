import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";

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

    const { items, discountPercentage, customerEmail, language, currency = "RON" } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart items are required" },
        { status: 400 }
      );
    }

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

    // Calculează totalul în RON (prețurile din items sunt în RON)
    let totalAmountRON = items.reduce((sum: number, item: { product: { price: number }; quantity: number }) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    // Aplică discount dacă există
    if (discountPercentage && discountPercentage > 0) {
      totalAmountRON = totalAmountRON * (1 - discountPercentage / 100);
    }

    // Convertește în currency-ul selectat
    const totalAmount = totalAmountRON * exchangeRate;

    // Construiește order items pentru Revolut
    const orderItems = items.map((item: { product: { name: string; price: number; description?: string }; quantity: number }) => {
      // Prețul este în RON, trebuie convertit
      let unitPriceRON = item.product.price;
      
      // Aplică discount dacă există
      if (discountPercentage && discountPercentage > 0) {
        unitPriceRON = unitPriceRON * (1 - discountPercentage / 100);
      }

      // Convertește în currency-ul selectat
      const unitPrice = unitPriceRON * exchangeRate;

      return {
        name: item.product.name,
        quantity: item.quantity,
        unit_price: Math.round(unitPrice * 100), // Revolut folosește cenți/bani
        total_amount: Math.round(unitPrice * item.quantity * 100),
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
        description: `Order from Zoomout Crew - ${items.length} item(s)`,
        items: orderItems,
        metadata: {
          discount_percentage: discountPercentage || 0,
          items_count: items.length,
          customer_email: customerEmail || "",
          language: language || "en",
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
      
      const formattedItems = items.map((item: { product: { name: string; price: number }; quantity: number }) => {
        let unitPriceRON = item.product.price;
        if (discountPercentage && discountPercentage > 0) {
          unitPriceRON = unitPriceRON * (1 - discountPercentage / 100);
        }
        
        return {
          name: item.product.name,
          quantity: item.quantity || 1,
          price: unitPriceRON,
        };
      });

      await Order.findOneAndUpdate(
        { orderId: data.id },
        {
          orderId: data.id,
          provider: "revolut",
          customerEmail: customerEmail || "",
          amountRON: totalAmountRON,
          amountCurrency: totalAmount,
          currency: selectedCurrency,
          status: "pending",
          paymentIntentId: data.public_id,
          items: formattedItems,
          discountPercentage: discountPercentage || undefined,
          metadata: {
            language: language || "en",
            original_currency: "RON",
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

