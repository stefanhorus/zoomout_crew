import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address is required" },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        {
          error: "Email service is not configured. Please contact the administrator.",
        },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromEmail = process.env.EMAIL_FROM || "Zoomout Crew <contact@zoomoutcrew.com>";
    const adminEmail = process.env.CONTACT_EMAIL_TO || "curcaan@gmail.com";
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
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Welcome to Zoomout_crew Newsletter!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0; font-size: 28px;">Zoomout_crew</h1>
            <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Professional Aerial Footage & Cinematography</p>
          </div>
          
          <h2 style="color: #333; border-bottom: 2px solid #0070f3; padding-bottom: 10px; margin-top: 0;">
            Welcome to Our Newsletter!
          </h2>
          
          <p style="color: #555; line-height: 1.8; margin: 20px 0; font-size: 15px;">
            Thank you for subscribing to the <strong>Zoomout_crew</strong> newsletter!
          </p>
          
          <p style="color: #555; line-height: 1.8; margin: 20px 0; font-size: 15px;">
            You'll now receive updates about:
          </p>
          
          <ul style="color: #555; line-height: 1.8; margin: 20px 0; font-size: 15px; padding-left: 20px;">
            <li>Latest products and exclusive offers</li>
            <li>New aerial photography and videography content</li>
            <li>Tips and tricks for drone cinematography</li>
            <li>Behind-the-scenes from our adventures</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://zoomoutcrew.com" style="display: inline-block; background-color: #0070f3; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px;">Visit Our Website</a>
          </div>
          
          <p style="color: #555; line-height: 1.8; margin: 25px 0; font-size: 15px;">
            We're excited to share our journey with you!
          </p>
          
          <p style="color: #333; line-height: 1.8; margin: 25px 0; font-size: 15px;">
            Best regards,<br>
            <strong style="color: #0070f3;">The Zoomout_crew Team</strong>
          </p>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0 20px 0;">
          
          <div style="text-align: center; color: #999; font-size: 12px; line-height: 1.6;">
            <p style="margin: 5px 0;">
              <strong>Zoomout_crew</strong><br>
              Professional Aerial Footage & Cinematography Services
            </p>
            <p style="margin: 10px 0;">
              <a href="https://zoomoutcrew.com" style="color: #0070f3; text-decoration: none;">zoomoutcrew.com</a> | 
              <a href="mailto:contact@zoomoutcrew.com" style="color: #0070f3; text-decoration: none;">contact@zoomoutcrew.com</a>
            </p>
          </div>
        </div>
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
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to send email" },
        { status: 500 }
      );
    }

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
    console.error("Error subscribing to newsletter:", error);
    return NextResponse.json(
      { error: error.message || "Failed to subscribe" },
      { status: 500 }
    );
  }
}
