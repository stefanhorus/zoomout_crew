import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import crypto from "crypto";
import { generateOrderConfirmationEmail } from "@/lib/email-templates";
import { getDownloadUrl, isDigitalProduct } from "@/lib/digital-products";

// Verifică semnătura webhook-ului Revolut
function verifyRevolutSignature(
  payload: string,
  signature: string,
  timestamp: string,
  secret: string
): boolean {
  try {
    const signedPayload = `${timestamp}.${payload}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(signedPayload)
      .digest("hex");
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Obține body-ul ca text pentru verificarea semnăturii
    const bodyText = await request.text();
    const signature = request.headers.get("revolut-signature");
    const timestamp = request.headers.get("revolut-request-timestamp");

    // Verifică semnătura dacă avem signing secret
    if (process.env.REVOLUT_WEBHOOK_SECRET && signature && timestamp) {
      const isValid = verifyRevolutSignature(
        bodyText,
        signature,
        timestamp,
        process.env.REVOLUT_WEBHOOK_SECRET
      );

      if (!isValid) {
        console.error("Invalid Revolut webhook signature");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }
    }

    const body = JSON.parse(bodyText);
    const eventType = body.event;

    // Verifică dacă este un eveniment de plată completată
    if (eventType === "ORDER_COMPLETED" || eventType === "ORDER_AUTHORISED") {
      const orderId = body.order_id;

      // Trebuie să obținem detaliile order-ului din Revolut API
      if (!process.env.REVOLUT_SECRET_KEY) {
        console.error("REVOLUT_SECRET_KEY is not set");
        return NextResponse.json({ received: true });
      }

      // Obține detaliile order-ului
      const baseUrl = process.env.REVOLUT_API_URL || "https://merchant.revolut.com";
      const orderResponse = await fetch(`${baseUrl}/api/1.0/orders/${orderId}`, {
        headers: {
          "Authorization": `Bearer ${process.env.REVOLUT_SECRET_KEY}`,
          "Revolut-Api-Version": "2024-05-01",
        },
      });

      if (!orderResponse.ok) {
        console.error("Failed to fetch order details");
        return NextResponse.json({ received: true });
      }

      const order = await orderResponse.json();

      try {
        const customerEmail = order.customer?.email || order.email || order.customer_email;
        const amountTotal = order.amount || 0;
        const currency = order.currency || "RON";
        const orderItems = order.items || [];
        const language = (order.metadata?.language as "en" | "ro") || "en";

        if (!customerEmail) {
          console.error("No customer email found in order");
          return NextResponse.json({ received: true });
        }

        // Format products list and collect digital downloads
        const digitalDownloads: Array<{ productName: string; downloadUrl: string }> = [];
        
        const productsList = orderItems
          .map((item: any) => {
            const productName = item.name || (language === "ro" ? "Produs" : "Product");
            const quantity = item.quantity || 1;
            const price = item.unit_price
              ? (item.unit_price / 100).toFixed(2)
              : "0.00";
            
            // Verifică dacă produsul este digital și adaugă link-ul de download
            if (isDigitalProduct(productName)) {
              const downloadUrl = getDownloadUrl(productName);
              if (downloadUrl) {
                // Adaugă pentru fiecare cantitate
                for (let i = 0; i < quantity; i++) {
                  digitalDownloads.push({ productName, downloadUrl });
                }
              }
            }
            
            return `• ${productName} (x${quantity}) - ${price} ${currency}`;
          })
          .join("<br>");

        const websiteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://zoomoutcrew.com";
        const logoUrl = `${websiteUrl}/assets/logo.png`;
        const fromEmail = process.env.EMAIL_FROM || "Zoomout Crew <contact@zoomoutcrew.com>";

        // Generate email content based on language
        const emailContent = generateOrderConfirmationEmail({
          productsList,
          amountTotal,
          currency,
          websiteUrl,
          logoUrl,
          language,
          digitalDownloads: digitalDownloads.length > 0 ? digitalDownloads : undefined,
        });

        // Send confirmation email to customer
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { data, error } = await resend.emails.send({
          from: fromEmail,
          to: customerEmail,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        });

        if (error) {
          console.error("❌ Error sending purchase confirmation email:", error);
        } else {
          console.log("✅ Purchase confirmation email sent to:", customerEmail);
        }
      } catch (error: any) {
        console.error("❌ Error processing Revolut order:", error);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("❌ Revolut webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook processing failed" },
      { status: 500 }
    );
  }
}

