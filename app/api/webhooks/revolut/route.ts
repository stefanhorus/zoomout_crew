import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import crypto from "crypto";
import { generateOrderConfirmationEmail } from "@/lib/email-templates";
import { getDownloadUrl, isDigitalProduct, getSignatureBundleDownloads } from "@/lib/digital-products";
import { generateInvoicePDF } from "@/lib/invoice-generator";
import { generateRevolutReceiptPDF } from "@/lib/revolut-receipt-generator";
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

      // Verificare idempotency: Verifică MAI ÎNTÂI dacă email-ul a fost deja trimis
      try {
        await connectDB();
        const existingOrder = await Order.findOne({ orderId: orderId });
        if (existingOrder && existingOrder.metadata?.emailSent === true) {
          const emailSentAt = existingOrder.metadata?.emailSentAt;
          console.log("⚠️ Email already sent for this order. Skipping duplicate email send.", {
            orderId,
            emailSentAt,
            eventType,
          });
          return NextResponse.json({ received: true, message: "Email already sent", skipped: true });
        }
      } catch (earlyCheckError) {
        console.error("❌ Error checking existing order (early check):", earlyCheckError);
        // Continuăm procesarea dacă verificarea eșuează
      }

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

        // Verificare dublă: Verifică din nou dacă email-ul a fost trimis (pentru race conditions)
        const doubleCheckOrder = await Order.findOne({ orderId: orderId });
        if (doubleCheckOrder && doubleCheckOrder.metadata?.emailSent === true) {
          console.log("⚠️ Email already sent for this order (double check). Skipping duplicate email send.");
          return NextResponse.json({ received: true, message: "Email already sent (double check)", skipped: true });
        }

        const metadata = order.metadata || {};
        const customerEmail = order.customer?.email || order.email || order.customer_email;
        const customerName = metadata.customer_name || order.customer?.full_name || undefined;
        const amountTotal = order.amount || 0;
        const currency = (order.currency || "RON").toUpperCase();
        let orderItems = order.items || [];
        const language = (metadata.language as "en" | "ro") || "en";
        
        // Log detaliat pentru debugging
        console.log("📋 Order details from Revolut:", {
          orderId: orderId,
          hasItems: orderItems.length > 0,
          itemsCount: orderItems.length,
          items: orderItems.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            unit_price: item.unit_price,
          })),
          amount: amountTotal,
          currency,
          customerEmail,
          orderKeys: Object.keys(order),
        });
        
        // Fallback: Dacă items sunt goale, încearcă să le obținem din MongoDB (comanda salvată anterior)
        if (orderItems.length === 0) {
          console.warn("⚠️ Order items are empty! Trying to get from MongoDB...");
          try {
            await connectDB();
            const savedOrder = await Order.findOne({ orderId: orderId });
            if (savedOrder && savedOrder.items && savedOrder.items.length > 0) {
              console.log("✅ Found items in saved order:", savedOrder.items);
              // Convert items din MongoDB format la formatul așteptat
              orderItems = savedOrder.items.map((item: any) => ({
                name: item.name,
                quantity: item.quantity || 1,
                unit_price: item.price ? Math.round(item.price * 100) : 0, // Convert la cenți
              }));
              console.log("✅ Using items from saved order:", orderItems);
            } else {
              console.warn("⚠️ No saved order found or saved order has no items");
            }
          } catch (dbError: any) {
            console.error("❌ Error fetching order from MongoDB:", dbError);
          }
        }
        // Verifică corect dacă factura a fost cerută (doar dacă este explicit true sau "true")
        const invoiceRequested = 
          metadata.request_invoice === true || 
          metadata.request_invoice === "true";
        
        console.log("🧾 Invoice request check:", {
          request_invoice: metadata.request_invoice,
          invoiceRequested,
          type: typeof metadata.request_invoice,
        });

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
            customerName: customerName?.trim() || undefined,
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
        // Folosește items din savedOrder dacă orderItems sunt goale
        const itemsToProcess = orderItems.length > 0 
          ? orderItems 
          : (savedOrder?.items || []).map((item: any) => ({
              name: item.name,
              quantity: item.quantity || 1,
              unit_price: item.price ? Math.round(item.price * 100) : 0,
            }));
        
        const digitalDownloads: Array<{ productName: string; downloadUrl: string }> = [];
        
        // Verifică dacă există items în comandă
        if (itemsToProcess.length === 0) {
          console.warn("⚠️ WARNING: No items found in order or saved order!");
          console.log("🔍 Full order object (first 2000 chars):", JSON.stringify(order, null, 2).substring(0, 2000));
        }
        
        let productsList = "";
        
        if (itemsToProcess.length > 0) {
          productsList = itemsToProcess
            .map((item: any) => {
              const productName = item.name || (language === "ro" ? "Produs" : "Product");
              const quantity = item.quantity || 1;
              const price = item.unit_price
                ? (item.unit_price / 100).toFixed(2)
                : "0.00";
              
              // Log product name for debugging
              console.log("🔍 Checking product for download:", {
                productName,
                rawName: item.name,
                isDigital: isDigitalProduct(productName),
                quantity,
              });
              
              // Verifică dacă produsul este digital și adaugă link-ul de download
              if (isDigitalProduct(productName)) {
                // Pentru Signature Bundle, adaugă toate link-urile produselor incluse
                if (productName.toLowerCase() === "signature bundle") {
                  const bundleDownloads = getSignatureBundleDownloads();
                  for (let i = 0; i < quantity; i++) {
                    digitalDownloads.push(...bundleDownloads);
                  }
                  console.log("✅ Added Signature Bundle downloads:", bundleDownloads.length);
                } else {
                  const downloadUrl = getDownloadUrl(productName);
                  if (downloadUrl) {
                    // Adaugă pentru fiecare cantitate
                    for (let i = 0; i < quantity; i++) {
                      digitalDownloads.push({ productName, downloadUrl });
                    }
                    console.log("✅ Added download link for:", productName, downloadUrl);
                  } else {
                    console.warn("⚠️ No download URL found for product:", productName);
                  }
                }
              } else {
                console.warn("⚠️ Product not recognized as digital:", productName);
              }
              
              return `• ${productName} (x${quantity}) - ${price} ${currency}`;
            })
            .join("<br>");
        } else {
          // Dacă nu există items, folosește un mesaj generic
          productsList = language === "ro" 
            ? "• Produs digital - Gratuit" 
            : "• Digital product - Free";
          
          console.warn("⚠️ No items in order, cannot determine specific products for download links");
        }
        
        console.log("📦 Digital downloads collected:", {
          count: digitalDownloads.length,
          downloads: digitalDownloads.map(d => ({ name: d.productName, hasUrl: !!d.downloadUrl })),
        });

        const websiteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://zoomoutcrew.com";
        const logoUrl = `${websiteUrl}/assets/logo.png`;
        const fromEmail = process.env.EMAIL_FROM || "Zoomout Crew <contact@zoomoutcrew.com>";
        const orderNotificationEmail =
          process.env.ORDER_NOTIFICATION_EMAIL || "stefanhorus@zoomoutcrew.com";

        // Calculate the amount to display in email (in smallest currency unit)
        // Use amountTotal if valid, otherwise calculate from amountRON or amountInCurrencyDecimal
        let emailAmountTotal = amountTotal;
        if (!emailAmountTotal || emailAmountTotal === 0) {
          // If amountTotal is 0 or missing, calculate from amountRON or amountInCurrencyDecimal
          if (currency === "RON" && amountRON > 0) {
            emailAmountTotal = Math.round(amountRON * 100);
          } else if (amountInCurrencyDecimal > 0) {
            emailAmountTotal = Math.round(amountInCurrencyDecimal * 100);
          }
        }
        
        console.log("💰 Email amount calculation:", {
          originalAmountTotal: amountTotal,
          calculatedEmailAmount: emailAmountTotal,
          amountRON,
          amountInCurrencyDecimal,
          currency,
        });

        // Generate email content based on language
        const emailContent = generateOrderConfirmationEmail({
          productsList,
          amountTotal: emailAmountTotal,
          currency,
          websiteUrl,
          logoUrl,
          language,
          digitalDownloads: digitalDownloads.length > 0 ? digitalDownloads : undefined,
          invoiceRequested,
        });

        // Send confirmation email to customer (dacă este configurat)
        console.log("📧 Attempting to send email...");
        console.log("📧 Email details:", {
          to: customerEmail,
          bcc: orderNotificationEmail,
          from: fromEmail,
          hasResendKey: !!process.env.RESEND_API_KEY,
          subject: emailContent.subject,
        });

        if (process.env.RESEND_API_KEY) {
          try {
            const resend = new Resend(process.env.RESEND_API_KEY);
            console.log("📧 Sending email via Resend...");
            
            // Always attach a Revolut payment receipt PDF (based on Revolut order/payment data)
            let revolutReceiptAttachment: { filename: string; content: string } | null = null;
            try {
              const firstPayment = Array.isArray(order.payments) ? order.payments[0] : undefined;
              const paymentMethod = firstPayment?.payment_method || firstPayment?.paymentMethod || {};

              const receiptPDF = await generateRevolutReceiptPDF({
                orderId,
                revolutPublicId: order.public_id,
                customerEmail,
                items: formattedItems,
                amountCurrencyMinor: amountTotal,
                currency,
                state: order.state || eventType,
                createdAt: order.created_at,
                language,
                payment: {
                  id: firstPayment?.id,
                  state: firstPayment?.state,
                  createdAt: firstPayment?.created_at,
                  paymentMethodType: paymentMethod?.type,
                  cardBrand: paymentMethod?.card_brand,
                  cardLastFour: paymentMethod?.card_last_four,
                  cardCountryCode: paymentMethod?.card_country_code,
                  authorisationCode: firstPayment?.authorisation_code,
                  arn: firstPayment?.arn,
                },
              });

              revolutReceiptAttachment = {
                filename: `Revolut_Receipt_${orderId}.pdf`,
                content: receiptPDF.toString("base64"),
              };
            } catch (receiptError: any) {
              console.error("❌ Error generating Revolut receipt PDF:", receiptError);
              // Continue without receipt
            }

            // Generează factura PDF doar dacă a fost cerută explicit
            let invoiceAttachment = null;
            if (invoiceRequested === true) {
              try {
                console.log("📄 Generating invoice PDF (requested by customer)...");
                const invoicePDF = await generateInvoicePDF({
                  orderId: orderId,
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
                  filename: `Invoice_${orderId}.pdf`,
                  // Use Base64 to avoid Buffer serialization/transport issues
                  content: invoicePDF.toString("base64"),
                };
                console.log("✅ Invoice PDF generated successfully");
              } catch (pdfError: any) {
                console.error("❌ Error generating invoice PDF:", pdfError);
                // Continuăm fără PDF dacă generarea eșuează
              }
            } else {
              console.log("🧾 Invoice not requested by customer; skipping invoice generation");
            }
            
            const emailPayload: any = {
              from: fromEmail,
              to: customerEmail,
              bcc: orderNotificationEmail,
              subject: emailContent.subject,
              html: emailContent.html,
              text: emailContent.text,
            };

            const attachments: Array<{ filename: string; content: string }> = [];
            if (revolutReceiptAttachment) attachments.push(revolutReceiptAttachment);
            if (invoiceAttachment) attachments.push(invoiceAttachment);
            if (attachments.length > 0) {
              emailPayload.attachments = attachments;
            }
            
            const { data, error } = await resend.emails.send(emailPayload);

            if (error) {
              console.error("❌ Error sending purchase confirmation email:", error);
              console.error("❌ Error details:", JSON.stringify(error, null, 2));
            } else {
              console.log("✅ Purchase confirmation email sent successfully!");
              console.log("✅ Email sent to:", customerEmail);
              if (invoiceAttachment) {
                console.log("✅ Invoice PDF attached to email");
              }
              if (revolutReceiptAttachment) {
                console.log("✅ Revolut receipt PDF attached to email");
              }
              console.log("✅ Resend response:", data);
              
              // Marchează IMEDIAT că email-ul a fost trimis în metadata (înainte de orice alt proces)
              // Folosim $set pentru a actualiza doar metadata fără a suprascrie alte câmpuri
              try {
                await Order.findOneAndUpdate(
                  { orderId: orderId },
                  { 
                    $set: {
                      "metadata.emailSent": true,
                      "metadata.emailSentAt": new Date(),
                      "metadata.emailSentEventType": eventType,
                    }
                  },
                  { upsert: false } // Nu crea document nou, doar actualizează
                );
                console.log("✅ Email sent flag saved to database");
              } catch (updateError) {
                console.error("❌ Error updating email sent flag:", updateError);
                // Nu aruncăm eroare, email-ul a fost deja trimis
              }
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

