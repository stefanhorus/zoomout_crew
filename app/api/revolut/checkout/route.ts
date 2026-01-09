import { NextRequest, NextResponse } from "next/server";

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

    const { items, discountPercentage, customerEmail, language } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart items are required" },
        { status: 400 }
      );
    }

    // Calculează totalul
    let totalAmount = items.reduce((sum: number, item: { product: { price: number }; quantity: number }) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    // Aplică discount dacă există
    if (discountPercentage && discountPercentage > 0) {
      totalAmount = totalAmount * (1 - discountPercentage / 100);
    }

    // Construiește order items pentru Revolut
    const orderItems = items.map((item: { product: { name: string; price: number; description?: string }; quantity: number }) => {
      let unitPrice = item.product.price;
      
      // Aplică discount dacă există
      if (discountPercentage && discountPercentage > 0) {
        unitPrice = unitPrice * (1 - discountPercentage / 100);
      }

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
        amount: Math.round(totalAmount * 100), // Total în cenți
        currency: "RON",
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

