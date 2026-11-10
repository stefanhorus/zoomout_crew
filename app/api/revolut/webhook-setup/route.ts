import { NextRequest, NextResponse } from "next/server";

// Acest endpoint creează webhook-ul în Revolut prin API
// Poți apela acest endpoint o singură dată pentru a configura webhook-ul
export async function GET(request: NextRequest) {
  // Returnează instrucțiuni pentru configurare
  return NextResponse.json({
    message: "Use POST method to create webhook",
    instructions: "Use curl or Postman to POST to this endpoint",
    curl_example: `curl -X POST ${process.env.NEXT_PUBLIC_BASE_URL || request.headers.get("origin")}/api/revolut/webhook-setup`,
    manual_setup: {
      url: "https://merchant.revolut.com/api/1.0/webhooks",
      method: "POST",
      headers: {
        "Authorization": "Bearer YOUR_REVOLUT_SECRET_KEY",
        "Content-Type": "application/json",
        "Revolut-Api-Version": "2024-05-01"
      },
      body: {
        url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://zoomoutcrew.com"}/api/webhooks/revolut`,
        events: ["ORDER_COMPLETED", "ORDER_AUTHORISED"]
      }
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.REVOLUT_SECRET_KEY) {
      return NextResponse.json(
        { error: "REVOLUT_SECRET_KEY is not set" },
        { status: 500 }
      );
    }

    const baseUrl = process.env.REVOLUT_API_URL || "https://merchant.revolut.com";
    const webhookUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://zoomoutcrew.com"}/api/webhooks/revolut`;

    // Creează webhook-ul în Revolut
    const response = await fetch(`${baseUrl}/api/1.0/webhooks`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.REVOLUT_SECRET_KEY}`,
        "Content-Type": "application/json",
        "Revolut-Api-Version": "2024-05-01",
      },
      body: JSON.stringify({
        url: webhookUrl,
        events: [
          "ORDER_COMPLETED",
          "ORDER_AUTHORISED",
          "ORDER_CANCELLED",
          "ORDER_FAILED",
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: data.message || "Failed to create webhook",
          details: data 
        },
        { status: response.status }
      );
    }

    // IMPORTANT: Salvează signing_secret în variabilele de mediu!
    return NextResponse.json({
      success: true,
      webhook: data,
      message: "Webhook created successfully!",
      important: `Add this to your .env.local and Vercel: REVOLUT_WEBHOOK_SECRET=${data.signing_secret}`,
    });
  } catch (error: any) {
    console.error("Webhook setup error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to setup webhook" },
      { status: 500 }
    );
  }
}

