import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { Resend } from "resend";
import { generateOrderConfirmationEmail } from "@/lib/email-templates";
import { getDownloadUrl, isDigitalProduct } from "@/lib/digital-products";

// Verifică și actualizează status-ul comenzilor "pending" din Revolut
export async function POST(request: NextRequest) {
  try {
    // Verifică autentificarea admin
    const username = request.headers.get("x-admin-username");
    const password = request.headers.get("x-admin-password");

    if (!username || !password) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verifică credențialele (folosește aceleași credențiale ca la orders)
    const adminUsers = await import("@/lib/admin-users");
    const isValid = await adminUsers.verifyAdminCredentials(username, password);

    if (!isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.REVOLUT_SECRET_KEY) {
      return NextResponse.json(
        { error: "REVOLUT_SECRET_KEY not configured" },
        { status: 500 }
      );
    }

    await connectDB();

    // Găsește toate comenzile "pending" de la Revolut
    const pendingOrders = await Order.find({
      provider: "revolut",
      status: "pending",
    });

    console.log(`🔍 Found ${pendingOrders.length} pending Revolut orders to sync`);

    const baseUrl = process.env.REVOLUT_API_URL || "https://merchant.revolut.com";
    const updatedOrders: string[] = [];
    const errors: Array<{ orderId: string; error: string }> = [];

    for (const order of pendingOrders) {
      try {
        console.log(`🔄 Checking order ${order.orderId}...`);

        // Obține status-ul actual din Revolut
        const orderResponse = await fetch(`${baseUrl}/api/1.0/orders/${order.orderId}`, {
          headers: {
            Authorization: `Bearer ${process.env.REVOLUT_SECRET_KEY}`,
            "Revolut-Api-Version": "2024-05-01",
          },
        });

        if (!orderResponse.ok) {
          const errorText = await orderResponse.text();
          console.error(`❌ Failed to fetch order ${order.orderId}:`, errorText);
          errors.push({ orderId: order.orderId, error: `HTTP ${orderResponse.status}` });
          continue;
        }

        const revolutOrder = await orderResponse.json();
        const orderState = revolutOrder.state;

        console.log(`📊 Order ${order.orderId} state: ${orderState}`);

        // Dacă comanda este completată sau autorizată, actualizează status-ul
        if (orderState === "COMPLETED" || orderState === "AUTHORISED") {
          const customerEmail = revolutOrder.customer?.email || revolutOrder.email || order.customerEmail;
          const orderItems = revolutOrder.items || [];
          const metadata = revolutOrder.metadata || {};
          const language = (metadata.language as "en" | "ro") || "en";

          // Actualizează comanda în MongoDB
          await Order.findOneAndUpdate(
            { orderId: order.orderId },
            {
              status: orderState,
              customerEmail: customerEmail || order.customerEmail,
            },
            { new: true }
          );

          console.log(`✅ Updated order ${order.orderId} to status ${orderState}`);

          // Trimite email de confirmare dacă nu a fost trimis deja
          if (process.env.RESEND_API_KEY && customerEmail) {
            try {
              const amountTotal = revolutOrder.amount || 0;
              const currency = (revolutOrder.currency || "RON").toUpperCase();

              // Format products list and collect digital downloads
              const digitalDownloads: Array<{ productName: string; downloadUrl: string }> = [];

              const productsList = orderItems
                .map((item: any) => {
                  const productName = item.name || (language === "ro" ? "Produs" : "Product");
                  const quantity = item.quantity || 1;
                  const price = item.unit_price
                    ? (item.unit_price / 100).toFixed(2)
                    : "0.00";

                  if (isDigitalProduct(productName)) {
                    const downloadUrl = getDownloadUrl(productName);
                    if (downloadUrl) {
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

              const emailContent = generateOrderConfirmationEmail({
                productsList,
                amountTotal,
                currency,
                websiteUrl,
                logoUrl,
                language,
                digitalDownloads: digitalDownloads.length > 0 ? digitalDownloads : undefined,
              });

              const resend = new Resend(process.env.RESEND_API_KEY);
              const { error: emailError } = await resend.emails.send({
                from: fromEmail,
                to: customerEmail,
                subject: emailContent.subject,
                html: emailContent.html,
                text: emailContent.text,
              });

              if (emailError) {
                console.error(`❌ Error sending email for order ${order.orderId}:`, emailError);
              } else {
                console.log(`✅ Confirmation email sent to ${customerEmail} for order ${order.orderId}`);
              }
            } catch (emailError: any) {
              console.error(`❌ Error sending email for order ${order.orderId}:`, emailError);
            }
          }

          updatedOrders.push(order.orderId);
        } else if (orderState === "PENDING" || orderState === "PROCESSING") {
          console.log(`⏳ Order ${order.orderId} still ${orderState}, skipping`);
        } else {
          console.log(`⚠️ Order ${order.orderId} has unexpected state: ${orderState}`);
        }
      } catch (error: any) {
        console.error(`❌ Error processing order ${order.orderId}:`, error);
        errors.push({ orderId: order.orderId, error: error.message });
      }
    }

    return NextResponse.json({
      success: true,
      checked: pendingOrders.length,
      updated: updatedOrders.length,
      updatedOrderIds: updatedOrders,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error("❌ Error syncing orders:", error);
    return NextResponse.json(
      { error: error.message || "Failed to sync orders" },
      { status: 500 }
    );
  }
}
