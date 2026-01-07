import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY!);

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

        if (!customerEmail) {
          console.error("No customer email found in order");
          return NextResponse.json({ received: true });
        }

        // Format products list
        const productsList = orderItems
          .map((item: any) => {
            const productName = item.name || "Product";
            const quantity = item.quantity || 1;
            const price = item.unit_price
              ? (item.unit_price / 100).toFixed(2)
              : "0.00";
            return `• ${productName} (x${quantity}) - ${price} ${currency}`;
          })
          .join("<br>");

        const websiteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://zoomoutcrew.com";
        const logoUrl = `${websiteUrl}/assets/logo.png`;
        const fromEmail = process.env.EMAIL_FROM || "Zoomout Crew <contact@zoomoutcrew.com>";

        // Send confirmation email to customer
        const { data, error } = await resend.emails.send({
          from: fromEmail,
          to: customerEmail,
          subject: "Thank you for your purchase! 🎉",
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
                <tr>
                  <td align="center">
                    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1a1a1a; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);">
                      <!-- Header with Logo -->
                      <tr>
                        <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); padding: 40px 30px; text-align: center;">
                          <img src="${logoUrl}" alt="Zoomout Crew" style="max-width: 200px; height: auto; margin-bottom: 20px;" />
                          <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Thank You!</h1>
                          <p style="color: #b0b0b0; margin: 10px 0 0 0; font-size: 16px;">Your order has been confirmed</p>
                        </td>
                      </tr>
                      
                      <!-- Main Content -->
                      <tr>
                        <td style="padding: 40px 30px;">
                          <h2 style="color: #ffffff; font-size: 24px; font-weight: 600; margin: 0 0 20px 0; line-height: 1.3;">
                            Order Confirmation 🎉
                          </h2>
                          
                          <p style="color: #d0d0d0; line-height: 1.8; margin: 0 0 25px 0; font-size: 16px;">
                            Thank you for your purchase! We're excited to share our digital products with you.
                          </p>
                          
                          <div style="background-color: #252525; border-left: 4px solid #ffffff; padding: 20px; margin: 30px 0; border-radius: 8px;">
                            <p style="color: #ffffff; font-weight: 600; margin: 0 0 15px 0; font-size: 18px;">Order Details:</p>
                            <div style="color: #d0d0d0; line-height: 2; margin: 0; font-size: 15px;">
                              ${productsList}
                            </div>
                            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #3a3a3a;">
                              <p style="color: #ffffff; font-weight: 600; margin: 0; font-size: 18px;">
                                Total: ${(amountTotal / 100).toFixed(2)} ${currency}
                              </p>
                            </div>
                          </div>
                          
                          <div style="background-color: #252525; padding: 20px; margin: 30px 0; border-radius: 8px;">
                            <p style="color: #ffffff; font-weight: 600; margin: 0 0 15px 0; font-size: 18px;">What's Next?</p>
                            <p style="color: #d0d0d0; line-height: 1.8; margin: 0; font-size: 15px;">
                              You will receive your digital products via email shortly. If you have any questions or need assistance, please don't hesitate to contact us.
                            </p>
                          </div>
                          
                          <div style="text-align: center; margin: 35px 0;">
                            <a href="${websiteUrl}/shop" style="display: inline-block; background-color: #ffffff; color: #0a0a0a; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: 0.5px; transition: all 0.3s ease;">Continue Shopping</a>
                          </div>
                          
                          <p style="color: #d0d0d0; line-height: 1.8; margin: 30px 0 0 0; font-size: 16px;">
                            We appreciate your business and look forward to serving you again!
                          </p>
                          
                          <p style="color: #ffffff; line-height: 1.8; margin: 25px 0 0 0; font-size: 16px;">
                            Best regards,<br>
                            <strong style="color: #ffffff; font-size: 18px;">The Zoomout Crew Team</strong>
                          </p>
                        </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                        <td style="background-color: #151515; padding: 30px; border-top: 1px solid #2a2a2a;">
                          <div style="text-align: center; color: #808080; font-size: 14px; line-height: 1.8;">
                            <p style="margin: 0 0 15px 0;">
                              <strong style="color: #ffffff; font-size: 16px;">Zoomout Crew</strong><br>
                              <span style="color: #b0b0b0;">Professional Aerial Footage & Cinematography Services</span>
                            </p>
                            <p style="margin: 15px 0;">
                              <a href="${websiteUrl}" style="color: #ffffff; text-decoration: none; margin: 0 10px; font-weight: 500;">Website</a> | 
                              <a href="mailto:contact@zoomoutcrew.com" style="color: #ffffff; text-decoration: none; margin: 0 10px; font-weight: 500;">Contact</a>
                            </p>
                            <p style="margin: 20px 0 0 0; font-size: 12px; color: #606060;">
                              © ${new Date().getFullYear()} Zoomout Crew. All rights reserved.
                            </p>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `,
          text: `
Thank You for Your Purchase!

Your order has been confirmed.

Order Details:
${orderItems
  .map((item: any) => {
    const productName = item.name || "Product";
    const quantity = item.quantity || 1;
    const price = item.unit_price
      ? (item.unit_price / 100).toFixed(2)
      : "0.00";
    return `• ${productName} (x${quantity}) - ${price} ${currency}`;
  })
  .join("\n")}

Total: ${(amountTotal / 100).toFixed(2)} ${currency}

You will receive your digital products via email shortly. If you have any questions or need assistance, please don't hesitate to contact us.

Visit our website: ${websiteUrl}

Best regards,
The Zoomout Crew Team
          `,
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

