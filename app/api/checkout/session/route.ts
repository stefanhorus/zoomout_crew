import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-12-15.clover",
    });

    if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
      return NextResponse.json(
        { error: "Invalid session ID" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Returnăm doar ce afișează pagina de succes, nu toată sesiunea Stripe (metadata, adrese etc.)
    return NextResponse.json({
      session: {
        amount_total: session.amount_total,
        currency: session.currency,
        payment_status: session.payment_status,
        customer_details: { email: session.customer_details?.email ?? null },
      },
    });
  } catch (error: any) {
    console.error("Stripe session retrieval error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve session" },
      { status: 500 }
    );
  }
}

