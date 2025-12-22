import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    // Verifică dacă API key-ul este setat
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: "RESEND_API_KEY is not configured. Please add it to your .env.local file." 
        },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { to, subject, message } = await req.json();

    // Trimite email folosind Resend cu domeniul verificat
    const fromEmail = process.env.EMAIL_FROM || "Zoomout Crew <contact@zoomoutcrew.com>";
    const toEmail = to || process.env.EMAIL_TO || "curcaan@gmail.com";
    
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: subject || "Test Email from Zoomout_crew",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0; font-size: 28px;">Zoomout_crew</h1>
            <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Professional Aerial Footage & Cinematography</p>
          </div>
          
          <h2 style="color: #333; border-bottom: 2px solid #0070f3; padding-bottom: 10px; margin-top: 0;">
            Test Email
          </h2>
          
          <p style="color: #555; line-height: 1.8; margin: 20px 0; font-size: 15px;">
            ${message || "This is a test email sent from the Zoomout_crew test page to verify email functionality."}
          </p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 25px 0;">
            <p style="margin: 0; color: #666; font-size: 13px;">
              <strong>Sent at:</strong> ${new Date().toLocaleString()}<br>
              <strong>From:</strong> contact@zoomoutcrew.com<br>
              <strong>Domain:</strong> zoomoutcrew.com (Verified)
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://zoomoutcrew.com" style="display: inline-block; background-color: #0070f3; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px;">Visit Our Website</a>
          </div>
          
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
      text: message || "This is a test email sent from the test page.",
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { 
          success: false, 
          error: error.message || "Failed to send email" 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Email sent successfully!",
      data: data
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to send email" 
      },
      { status: 500 }
    );
  }
}


