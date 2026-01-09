import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { generateOrderConfirmationEmail } from "@/lib/email-templates";
import { getDownloadUrl, isDigitalProduct } from "@/lib/digital-products";

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-12-15.clover",
  });

  const resend = new Resend(process.env.RESEND_API_KEY!);

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Retrieve full session details including line items
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items", "line_items.data.price.product"],
      });

      const customerEmail = session.customer_details?.email;
      const amountTotal = session.amount_total || 0;
      const currency = session.currency?.toUpperCase() || "RON";
      const lineItems = fullSession.line_items?.data || [];
      const language = (fullSession.metadata?.language as "en" | "ro") || "en";

      if (!customerEmail) {
        console.error("No customer email found in session");
        return NextResponse.json({ received: true });
      }

      // Format products list and collect digital downloads
      const digitalDownloads: Array<{ productName: string; downloadUrl: string }> = [];
      
      const productsList = lineItems
        .map((item) => {
          const productName = item.description || (language === "ro" ? "Produs" : "Product");
          const quantity = item.quantity || 1;
          const price = item.price?.unit_amount
            ? (item.price.unit_amount / 100).toFixed(2)
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
      console.error("❌ Error processing checkout.session.completed:", error);
    }
  }

  return NextResponse.json({ received: true });
}

