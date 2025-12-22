import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
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

    // Configurează adresa de email destinatar - poți schimba aici sau folosi variabila de mediu
    const toEmail = process.env.CONTACT_EMAIL_TO || "contact@zoomoutcrew.com";
    const fromEmail = process.env.EMAIL_FROM || "Zoomout Crew <contact@zoomoutcrew.com>";

    // Trimite email către tine (proprietar)
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email, // Email-ul utilizatorului care trimite
      subject: `New Contact Form Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #0070f3; padding-bottom: 10px;">
            New Contact Form Message
          </h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong>Message:</strong></p>
            <p style="margin: 10px 0; white-space: pre-wrap; color: #666; line-height: 1.6;">
              ${message}
            </p>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            This message was sent from the contact form on zoomout_crew website.
          </p>
        </div>
      `,
      text: `
New Contact Form Message

Name: ${name}
Email: ${email}

Message:
${message}

---
This message was sent from the contact form on zoomout_crew website.
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to send email" },
        { status: 500 }
      );
    }

    // Trimite email de confirmare automat către persoana care a completat formularul
    const confirmationEmail = process.env.CONFIRMATION_EMAIL_FROM || "Zoomout Crew <contact@zoomoutcrew.com>";
    const { data: confirmationData, error: confirmationError } = await resend.emails.send({
      from: confirmationEmail,
      to: email, // Email-ul persoanei care a completat formularul
      subject: "Thank you for contacting Zoomout_crew!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0; font-size: 28px;">Zoomout_crew</h1>
            <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Professional Aerial Footage & Cinematography</p>
          </div>
          
          <h2 style="color: #333; border-bottom: 2px solid #0070f3; padding-bottom: 10px; margin-top: 0;">
            Thank you for reaching out!
          </h2>
          
          <p style="color: #333; line-height: 1.8; margin: 20px 0; font-size: 16px;">
            Dear ${name},
          </p>
          
          <p style="color: #555; line-height: 1.8; margin: 20px 0; font-size: 15px;">
            Thank you for contacting <strong>Zoomout_crew</strong>! We have successfully received your message and our team will review it shortly.
          </p>
          
          <p style="color: #555; line-height: 1.8; margin: 20px 0; font-size: 15px;">
            We typically respond within 24-48 hours. If your inquiry is urgent, please feel free to reach out to us directly at <a href="mailto:contact@zoomoutcrew.com" style="color: #0070f3; text-decoration: none;">contact@zoomoutcrew.com</a>.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #0070f3;">
            <p style="margin: 0 0 10px 0; color: #333; font-weight: bold; font-size: 14px;">Your message:</p>
            <p style="margin: 0; white-space: pre-wrap; color: #555; line-height: 1.8; font-size: 14px;">
              ${message}
            </p>
          </div>
          
          <p style="color: #555; line-height: 1.8; margin: 25px 0; font-size: 15px;">
            In the meantime, feel free to explore our work:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://zoomoutcrew.com" style="display: inline-block; background-color: #0070f3; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px;">Visit Our Website</a>
          </div>
          
          <p style="color: #555; line-height: 1.8; margin: 25px 0; font-size: 15px;">
            We appreciate your interest in our services and look forward to connecting with you!
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
            <p style="margin: 15px 0 5px 0; font-size: 11px;">
              This is an automated confirmation email sent to acknowledge receipt of your message.
            </p>
          </div>
        </div>
      `,
      text: `
Thank you for reaching out!

Dear ${name},

Thank you for contacting Zoomout_crew! We have successfully received your message and our team will review it shortly.

We typically respond within 24-48 hours. If your inquiry is urgent, please feel free to reach out to us directly at contact@zoomoutcrew.com.

Your message:
${message}

In the meantime, feel free to explore our work at https://zoomoutcrew.com

We appreciate your interest in our services and look forward to connecting with you!

Best regards,
The Zoomout_crew Team

---
Zoomout_crew
Professional Aerial Footage & Cinematography Services
Website: https://zoomoutcrew.com
Email: contact@zoomoutcrew.com

This is an automated confirmation email sent to acknowledge receipt of your message.
      `,
    });

    if (confirmationError) {
      console.error("Error sending confirmation email:", confirmationError);
      // Nu returnăm eroare dacă confirmarea eșuează, pentru că email-ul principal a fost trimis
    }

    return NextResponse.json({
      success: true,
      message: "Email sent successfully!",
      id: data?.id,
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
