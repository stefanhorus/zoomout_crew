import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    console.log("📧 Newsletter subscription request for:", email);

    if (!email || !email.includes("@")) {
      console.error("❌ Invalid email:", email);
      return NextResponse.json(
        { error: "Valid email address is required" },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY is not configured");
      return NextResponse.json(
        {
          error: "Email service is not configured. Please contact the administrator.",
        },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromEmail = process.env.EMAIL_FROM || "Zoomout Crew <contact@zoomoutcrew.com>";
    const adminEmail = process.env.CONTACT_EMAIL_TO || "contact@zoomoutcrew.com";
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    // Salvează contactul în Resend Contacts
    try {
      const contactData: any = {
        email: email,
        unsubscribed: false,
      };
      
      // Adaugă audienceId doar dacă este configurat
      if (audienceId) {
        contactData.audienceId = audienceId;
      }
      
      await resend.contacts.create(contactData);
      console.log(`✅ Contact saved to Resend: ${email}`);
    } catch (contactError: any) {
      // Dacă contactul există deja sau dacă audienceId lipsește, continuă
      if (
        contactError.message?.includes("already exists") ||
        contactError.statusCode === 422 ||
        contactError.message?.includes("audience") ||
        contactError.message?.includes("Audience")
      ) {
        console.log(`ℹ️ Contact issue (may need audienceId): ${email}`, contactError.message);
      } else {
        console.error("Error saving contact to Resend (non-critical):", contactError);
      }
      // Continuăm chiar dacă salvarea contactului eșuează - emailul de confirmare este mai important
    }

    // Trimite email de confirmare către utilizator
    console.log("📤 Sending confirmation email to:", email);
    const websiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zoomoutcrew.com";
    const logoUrl = `${websiteUrl}/assets/logo.png`;
    
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Welcome to Zoomout Crew Newsletter! 🎬",
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
                      <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Welcome Aboard!</h1>
                      <p style="color: #b0b0b0; margin: 10px 0 0 0; font-size: 16px;">Professional Aerial Footage & Cinematography</p>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #ffffff; font-size: 24px; font-weight: 600; margin: 0 0 20px 0; line-height: 1.3;">
                        Thank you for subscribing! 🎉
                      </h2>
                      
                      <p style="color: #d0d0d0; line-height: 1.8; margin: 0 0 25px 0; font-size: 16px;">
                        We're thrilled to have you join the <strong style="color: #ffffff;">Zoomout Crew</strong> community! Get ready to be inspired by stunning aerial cinematography and behind-the-scenes content.
                      </p>
                      
                      <div style="background-color: #252525; border-left: 4px solid #ffffff; padding: 20px; margin: 30px 0; border-radius: 8px;">
                        <p style="color: #ffffff; font-weight: 600; margin: 0 0 15px 0; font-size: 18px;">You'll receive:</p>
                        <ul style="color: #d0d0d0; line-height: 2; margin: 0; padding-left: 20px; font-size: 15px;">
                          <li>Latest products and exclusive offers</li>
                          <li>New aerial photography and videography content</li>
                          <li>Tips and tricks for drone cinematography</li>
                          <li>Behind-the-scenes from our adventures</li>
                        </ul>
                      </div>
                      
                      <div style="text-align: center; margin: 35px 0;">
                        <a href="${websiteUrl}" style="display: inline-block; background-color: #ffffff; color: #0a0a0a; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: 0.5px; transition: all 0.3s ease;">Visit Our Website</a>
                      </div>
                      
                      <p style="color: #d0d0d0; line-height: 1.8; margin: 30px 0 0 0; font-size: 16px;">
                        We're excited to share our journey with you!
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
Welcome to Our Newsletter!

Thank you for subscribing to the Zoomout_crew newsletter!

You'll now receive updates about:
- Latest products and exclusive offers
- New aerial photography and videography content
- Tips and tricks for drone cinematography
- Behind-the-scenes from our adventures

Visit our website: https://zoomoutcrew.com

We're excited to share our journey with you!

Best regards,
The Zoomout_crew Team

---
Zoomout_crew
Professional Aerial Footage & Cinematography Services
Website: https://zoomoutcrew.com
Email: contact@zoomoutcrew.com
      `,
    });

    if (error) {
      console.error("❌ Resend email error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        { 
          success: false,
          error: error.message || "Failed to send email",
          details: error 
        },
        { status: 500 }
      );
    }
    
    console.log("✅ Confirmation email sent successfully:", data?.id);

    // Trimite notificare către admin (opțional)
    try {
      await resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        subject: "New Newsletter Subscription",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">New Newsletter Subscription</h2>
            <p style="color: #666;">A new user has subscribed to your newsletter:</p>
            <p style="color: #333; font-weight: bold; font-size: 18px;">${email}</p>
          </div>
        `,
        text: `New Newsletter Subscription\n\nA new user has subscribed to your newsletter:\n${email}`,
      });
    } catch (adminError) {
      console.error("Error sending admin notification:", adminError);
      // Nu returnăm eroare dacă notificarea admin eșuează
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to newsletter!",
      id: data?.id,
    });
  } catch (error: any) {
    console.error("❌ Unexpected error subscribing to newsletter:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || "Failed to subscribe",
        details: error.toString()
      },
      { status: 500 }
    );
  }
}
