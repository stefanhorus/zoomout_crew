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

    // Trimite email folosind Resend
    // Notă: Cu onboarding@resend.dev poți trimite doar către curcaan@gmail.com
    // Pentru a trimite către orice adresă, verifică domeniul în Resend și setează EMAIL_FROM
    const fromEmail = process.env.EMAIL_FROM || "Zoomout Crew <onboarding@resend.dev>";
    const toEmail = to || process.env.EMAIL_TO || "curcaan@gmail.com";
    
    // Verifică dacă încerci să trimiți către altă adresă fără domeniu verificat
    if (!process.env.EMAIL_FROM && toEmail !== "curcaan@gmail.com" && toEmail !== process.env.EMAIL_TO) {
      return NextResponse.json(
        { 
          success: false, 
          error: "With onboarding@resend.dev you can only send to curcaan@gmail.com. To send to other addresses, verify your domain in Resend and set EMAIL_FROM in .env.local" 
        },
        { status: 400 }
      );
    }
    
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: subject || "Test Email from Zoomout_crew",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Test Email from Zoomout_crew</h2>
          <p style="color: #666; line-height: 1.6;">${message || "This is a test email sent from the test page."}</p>
          <p style="color: #999; font-size: 12px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px;">
            Sent at: ${new Date().toLocaleString()}
          </p>
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


