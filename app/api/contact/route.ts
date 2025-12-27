import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Folosește Formspree pentru trimiterea email-urilor
    const formspreeFormId = process.env.FORMSPREE_FORM_ID;
    
    if (!formspreeFormId) {
      console.error("FORMSPREE_FORM_ID is not configured");
      return NextResponse.json(
        {
          error: "Email service is not configured. Please contact the administrator.",
        },
        { status: 500 }
      );
    }

    console.log("📧 Attempting to send email via Formspree:", {
      formId: formspreeFormId,
      to: email,
    });

    // Trimite formularul la Formspree
    const formspreeResponse = await fetch(`https://formspree.io/f/${formspreeFormId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        message,
        _subject: `New Contact Form Message from ${name}`,
      }),
    });

    const formspreeData = await formspreeResponse.json();

    if (!formspreeResponse.ok) {
      console.error("❌ Formspree error:", formspreeData);
      return NextResponse.json(
        { error: formspreeData.error || "Failed to send email", details: formspreeData },
        { status: formspreeResponse.status }
      );
    }

    console.log("✅ Email sent successfully via Formspree:", formspreeData);

    return NextResponse.json({
      success: true,
      message: "Email sent successfully!",
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
