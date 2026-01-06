import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: NextRequest) {
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
      process.env.STRIPE_WEBHOOK_SECRET!
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

      if (!customerEmail) {
        console.error("No customer email found in session");
        return NextResponse.json({ received: true });
      }

      // Format products list
      const productsList = lineItems
        .map((item) => {
          const productName = item.description || "Product";
          const quantity = item.quantity || 1;
          const price = item.price?.unit_amount
            ? (item.price.unit_amount / 100).toFixed(2)
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
${lineItems
  .map((item) => {
    const productName = item.description || "Product";
    const quantity = item.quantity || 1;
    const price = item.price?.unit_amount
      ? (item.price.unit_amount / 100).toFixed(2)
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
      console.error("❌ Error processing checkout.session.completed:", error);
    }
  }

  return NextResponse.json({ received: true });
}

