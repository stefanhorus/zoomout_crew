import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { generateOrderConfirmationEmail } from "@/lib/email-templates";
import { getDownloadUrl, isDigitalProduct } from "@/lib/digital-products";
import { generateInvoicePDF } from "@/lib/invoice-generator";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";

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

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not configured");
    // Continue without sending email
  }

  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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
    console.log("🔔 Stripe webhook received: checkout.session.completed");
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("📦 Session ID:", session.id);
    console.log("📧 Customer Email:", session.customer_details?.email);

    try {
      // Conectează la MongoDB
      console.log("🔌 Connecting to MongoDB...");
      await connectDB();
      console.log("✅ Connected to MongoDB");

      // Retrieve full session details including line items
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items", "line_items.data.price.product"],
      });

      const customerEmail = session.customer_details?.email;
      const customerName = metadata.customer_name || session.customer_details?.name || undefined;
      const amountTotal = session.amount_total || 0;
      const currency = (session.currency?.toUpperCase() || "RON");
      const lineItems = fullSession.line_items?.data || [];
      const metadata = fullSession.metadata || {};
      const language = (metadata.language as "en" | "ro") || "en";
      const invoiceRequested =
        metadata.request_invoice === "true" ||
        metadata.request_invoice === "1" ||
        (metadata.request_invoice as any) === true;

      if (!customerEmail) {
        console.error("No customer email found in session");
        return NextResponse.json({ received: true });
      }

      // Extrage informații din metadata pentru conversie
      const totalAmountRONFromMetadata = metadata.total_amount_ron ? parseFloat(metadata.total_amount_ron) : null;
      const amountInCurrency = metadata.amount_in_currency ? parseFloat(metadata.amount_in_currency) : null;
      const exchangeRate = metadata.exchange_rate ? parseFloat(metadata.exchange_rate) : null;
      
      // Rate-uri inverse pentru fallback
      const inverseExchangeRates: Record<string, number> = {
        RON: 1,
        EUR: 5,
        USD: 4.545,
        GBP: 5.556,
      };

      // Calculează amount în RON
      const amountInCurrencyDecimal = amountTotal / 100;
      let amountRON = amountInCurrencyDecimal;
      
      if (totalAmountRONFromMetadata && totalAmountRONFromMetadata > 0) {
        amountRON = totalAmountRONFromMetadata;
      } else if (currency !== "RON") {
        if (exchangeRate) {
          amountRON = amountInCurrencyDecimal / exchangeRate;
        } else if (inverseExchangeRates[currency]) {
          amountRON = amountInCurrencyDecimal * inverseExchangeRates[currency];
        }
      }

      // Format items pentru salvare
      const formattedItems = lineItems.map((item) => {
        const itemPriceInCurrency = item.price?.unit_amount ? item.price.unit_amount / 100 : 0;
        let itemPriceInRON = itemPriceInCurrency;
        
        // Convertim în RON dacă e necesar
        if (currency !== "RON" && amountRON && amountInCurrencyDecimal > 0) {
          const itemQuantity = item.quantity || 1;
          const itemTotalInCurrency = itemPriceInCurrency * itemQuantity;
          const itemPercentage = itemTotalInCurrency / amountInCurrencyDecimal;
          itemPriceInRON = (amountRON * itemPercentage) / itemQuantity;
        }
        
        return {
          name: item.description || item.price?.nickname || "Product",
          quantity: item.quantity || 1,
          price: itemPriceInRON,
        };
      });

      // Salvează sau actualizează comanda în MongoDB
      console.log("💾 Saving order to MongoDB...");
      console.log("📊 Order data:", {
        orderId: session.id,
        amountRON,
        amountCurrency: amountInCurrencyDecimal,
        currency,
        itemsCount: formattedItems.length,
      });
      
      const savedOrder = await Order.findOneAndUpdate(
        { orderId: session.id },
        {
          orderId: session.id,
          provider: "stripe",
          customerEmail,
          customerName: customerName?.trim() || undefined,
          amountRON,
          amountCurrency: amountInCurrencyDecimal,
          currency,
          status: session.payment_status || "paid",
          paymentIntentId: session.payment_intent as string,
          items: formattedItems,
          discountPercentage: metadata.discount_percentage ? parseFloat(metadata.discount_percentage) : undefined,
          discountCode: metadata.discount_code,
          metadata: {
            ...metadata,
            originalCurrency: metadata.original_currency || "RON",
          },
        },
        { upsert: true, new: true }
      );

      console.log(`✅ Order ${session.id} saved to MongoDB successfully`);
      console.log("📋 Saved order:", savedOrder);

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
      const orderNotificationEmail =
        process.env.ORDER_NOTIFICATION_EMAIL || "stefanhorus@zoomoutcrew.com";

      // Generate email content based on language
      const emailContent = generateOrderConfirmationEmail({
        productsList,
        amountTotal,
        currency,
        websiteUrl,
        logoUrl,
        language,
        digitalDownloads: digitalDownloads.length > 0 ? digitalDownloads : undefined,
        invoiceRequested,
      });

      // Send confirmation email to customer
      if (!resend) {
        console.error("Resend is not configured, skipping email");
        return NextResponse.json({ received: true });
      }

      // Optional: attach invoice PDF only if requested
      let invoiceAttachment: { filename: string; content: string } | null = null;
      if (invoiceRequested) {
        try {
          const invoicePDF = await generateInvoicePDF({
            orderId: session.id,
            customerEmail: customerEmail,
            customerName: customerName?.trim() || undefined,
            items: formattedItems,
            amountRON: amountRON,
            amountCurrency: amountInCurrencyDecimal,
            currency: currency,
            date: new Date(),
            language: language,
            discountPercentage: metadata.discount_percentage ? parseFloat(metadata.discount_percentage) : undefined,
            discountCode: metadata.discount_code,
          });

          invoiceAttachment = {
            filename: `Invoice_${session.id}.pdf`,
            content: invoicePDF.toString("base64"),
          };
        } catch (pdfError: any) {
          console.error("❌ Error generating invoice PDF (Stripe):", pdfError);
        }
      }

      const emailPayload: any = {
        from: fromEmail,
        to: customerEmail,
        bcc: orderNotificationEmail,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      };

      if (invoiceAttachment) {
        emailPayload.attachments = [invoiceAttachment];
      }

      const { data, error } = await resend.emails.send(emailPayload);

      if (error) {
        console.error("❌ Error sending purchase confirmation email:", error);
      } else {
        console.log("✅ Purchase confirmation email sent to:", customerEmail);
      }
    } catch (error: any) {
      console.error("❌ Error processing checkout.session.completed:", error);
      console.error("❌ Error stack:", error.stack);
      console.error("❌ Error details:", {
        message: error.message,
        name: error.name,
        sessionId: session.id,
      });
    }
  }

  return NextResponse.json({ received: true });
}

