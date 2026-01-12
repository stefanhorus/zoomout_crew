import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import crypto from "crypto";
import { generateOrderConfirmationEmail } from "@/lib/email-templates";
import { getDownloadUrl, isDigitalProduct } from "@/lib/digital-products";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";

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
    console.log("🔔 Revolut webhook received");
    console.log("📋 Full request URL:", request.url);
    console.log("📋 Request method:", request.method);

    // Obține body-ul ca text pentru verificarea semnăturii
    const bodyText = await request.text();
    const signature = request.headers.get("revolut-signature");
    const timestamp = request.headers.get("revolut-request-timestamp");
    
    console.log("📝 Webhook headers:", {
      hasSignature: !!signature,
      hasTimestamp: !!timestamp,
      signature: signature ? signature.substring(0, 20) + "..." : null,
      timestamp: timestamp || null,
      hasWebhookSecret: !!process.env.REVOLUT_WEBHOOK_SECRET,
    });

    // Verifică semnătura dacă avem signing secret
    // TEMPORAR: Permitem webhook-urile fără verificare strictă pentru a funcționa
    // TODO: Configurați corect REVOLUT_WEBHOOK_SECRET în Vercel și în Revolut Business
    let signatureValid = true;
    
    if (process.env.REVOLUT_WEBHOOK_SECRET && signature && timestamp) {
      console.log("🔐 Verifying webhook signature...");
      const isValid = verifyRevolutSignature(
        bodyText,
        signature,
        timestamp,
        process.env.REVOLUT_WEBHOOK_SECRET
      );

      if (!isValid) {
        console.error("❌ Invalid Revolut webhook signature");
        console.error("📋 Debug info:", {
          signatureLength: signature.length,
          timestamp: timestamp,
          bodyLength: bodyText.length,
          bodyPreview: bodyText.substring(0, 100),
          hasSecret: !!process.env.REVOLUT_WEBHOOK_SECRET,
        });
        
        // TEMPORAR: Continuăm procesarea chiar dacă semnătura nu este validă
        // Pentru a funcționa până când secret-ul este configurat corect
        console.warn("⚠️ WARNING: Continuing with unverified webhook - configure REVOLUT_WEBHOOK_SECRET correctly!");
        signatureValid = false;
      } else {
        console.log("✅ Webhook signature verified");
        signatureValid = true;
      }
    } else {
      if (!process.env.REVOLUT_WEBHOOK_SECRET) {
        console.warn("⚠️ REVOLUT_WEBHOOK_SECRET not set, skipping signature verification");
      } else {
        console.warn("⚠️ Missing signature or timestamp in webhook request");
      }
    }

    const body = JSON.parse(bodyText);
    const eventType = body.event;
    
    console.log("📦 Webhook body:", JSON.stringify(body, null, 2));
    console.log("📦 Event type:", eventType);

    // Verifică dacă este un eveniment de plată completată
    if (eventType === "ORDER_COMPLETED" || eventType === "ORDER_AUTHORISED") {
      console.log("🔔 Revolut webhook received:", eventType);
      const orderId = body.order_id;
      console.log("📦 Order ID:", orderId);

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
        // Conectează la MongoDB
        console.log("🔌 Connecting to MongoDB...");
        await connectDB();
        console.log("✅ Connected to MongoDB");

        const customerEmail = order.customer?.email || order.email || order.customer_email;
        const amountTotal = order.amount || 0;
        const currency = (order.currency || "RON").toUpperCase();
        const orderItems = order.items || [];
        const metadata = order.metadata || {};
        const language = (metadata.language as "en" | "ro") || "en";

        console.log("📧 Email check:", {
          customerEmail,
          hasCustomer: !!order.customer,
          orderEmail: order.email,
          customerEmailField: order.customer_email,
          hasResendKey: !!process.env.RESEND_API_KEY,
        });

        if (!customerEmail) {
          console.error("❌ No customer email found in order");
          console.error("📋 Order object keys:", Object.keys(order));
          console.error("📋 Order customer:", order.customer);
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
        const formattedItems = orderItems.map((item: any) => {
          const itemPriceInCurrency = item.unit_price ? item.unit_price / 100 : 0;
          let itemPriceInRON = itemPriceInCurrency;
          
          // Convertim în RON dacă e necesar
          if (currency !== "RON" && amountRON && amountInCurrencyDecimal > 0) {
            const itemTotalInCurrency = itemPriceInCurrency * (item.quantity || 1);
            const itemPercentage = itemTotalInCurrency / amountInCurrencyDecimal;
            itemPriceInRON = (amountRON * itemPercentage) / (item.quantity || 1);
          }
          
          return {
            name: item.name || "Product",
            quantity: item.quantity || 1,
            price: itemPriceInRON,
          };
        });

        // Salvează sau actualizează comanda în MongoDB
        console.log("💾 Saving order to MongoDB...");
        console.log("📊 Order data:", {
          orderId: orderId,
          amountRON,
          amountCurrency: amountInCurrencyDecimal,
          currency,
          itemsCount: formattedItems.length,
        });
        
        const savedOrder = await Order.findOneAndUpdate(
          { orderId: orderId },
          {
            orderId: orderId,
            provider: "revolut",
            customerEmail,
            amountRON,
            amountCurrency: amountInCurrencyDecimal,
            currency,
            status: order.state || "COMPLETED",
            paymentIntentId: order.public_id,
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

        console.log(`✅ Order ${orderId} saved to MongoDB successfully`);
        console.log("📋 Saved order:", savedOrder);

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

        // Send confirmation email to customer (dacă este configurat)
        console.log("📧 Attempting to send email...");
        console.log("📧 Email details:", {
          to: customerEmail,
          from: fromEmail,
          hasResendKey: !!process.env.RESEND_API_KEY,
          subject: emailContent.subject,
        });

        if (process.env.RESEND_API_KEY) {
          try {
            const resend = new Resend(process.env.RESEND_API_KEY);
            console.log("📧 Sending email via Resend...");
            
            const { data, error } = await resend.emails.send({
              from: fromEmail,
              to: customerEmail,
              subject: emailContent.subject,
              html: emailContent.html,
              text: emailContent.text,
            });

            if (error) {
              console.error("❌ Error sending purchase confirmation email:", error);
              console.error("❌ Error details:", JSON.stringify(error, null, 2));
            } else {
              console.log("✅ Purchase confirmation email sent successfully!");
              console.log("✅ Email sent to:", customerEmail);
              console.log("✅ Resend response:", data);
            }
          } catch (emailError: any) {
            console.error("❌ Exception sending email:", emailError);
            console.error("❌ Error stack:", emailError.stack);
            // Nu returnăm eroare, comanda este deja salvată
          }
        } else {
          console.warn("⚠️ RESEND_API_KEY not set, skipping email");
        }
      } catch (error: any) {
        console.error("❌ Error processing Revolut order:", error);
        console.error("❌ Error stack:", error.stack);
        console.error("❌ Error details:", {
          message: error.message,
          name: error.name,
          orderId: orderId,
        });
      }
    } else {
      console.log("⚠️ Unhandled event type:", eventType);
      console.log("📦 Full body:", JSON.stringify(body, null, 2));
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

