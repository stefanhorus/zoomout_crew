import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

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

    const { items, discountPercentage, customerEmail, language } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart items are required" },
        { status: 400 }
      );
    }

    // Construiește line items pentru Stripe
    const lineItems = items.map((item: { product: { name: string; price: number; description?: string }; quantity: number }) => {
      let unitAmount = Math.round(item.product.price * 100);
      
      // Aplică discount dacă există
      if (discountPercentage && discountPercentage > 0) {
        unitAmount = Math.round(unitAmount * (1 - discountPercentage / 100));
      }

      return {
        price_data: {
          currency: "ron", // Lei românești
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
        language: language || "en",
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

