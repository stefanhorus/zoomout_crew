import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { generateInvoicePDF } from "@/lib/invoice-generator";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = (searchParams.get("email") || "stefanhorus@zoomoutcrew.com").trim();

    // Date de test pentru factură
    const testInvoiceData = {
      orderId: `TEST-${Date.now()}`,
      customerEmail: email,
      items: [
        {
          name: "Cinematic Video LUTs",
          quantity: 1,
          price: 99.99,
        },
        {
          name: "Movie LUTs",
          quantity: 1,
          price: 124.99,
        },
      ],
      amountRON: 224.98,
      amountCurrency: 224.98,
      currency: "RON",
      date: new Date(),
      language: "ro" as const,
      discountPercentage: 10,
      discountCode: "TEST10",
    };

    const invoicePDF = await generateInvoicePDF(testInvoiceData);

    return new NextResponse(invoicePDF, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="Invoice_${testInvoiceData.orderId}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error: any) {
    console.error("❌ Test invoice (GET) error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate test invoice PDF" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Handle empty/invalid JSON bodies gracefully
    let email: string | undefined;
    try {
      const body = await request.json();
      email = typeof body?.email === "string" ? body.email.trim() : undefined;
    } catch {
      email = undefined;
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Date de test pentru factură
    const testInvoiceData = {
      orderId: `TEST-${Date.now()}`,
      customerEmail: email,
      items: [
        {
          name: "Cinematic Video LUTs",
          quantity: 1,
          price: 99.99,
        },
        {
          name: "Movie LUTs",
          quantity: 1,
          price: 124.99,
        },
      ],
      amountRON: 224.98,
      amountCurrency: 224.98,
      currency: "RON",
      date: new Date(),
      language: "ro" as const,
      discountPercentage: 10,
      discountCode: "TEST10",
    };

    // Generează factura PDF
    console.log("📄 Generating test invoice PDF...");
    const invoicePDF = await generateInvoicePDF(testInvoiceData);
    console.log("✅ Invoice PDF generated successfully");

    // Trimite email cu factura atașată
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { 
          error: "RESEND_API_KEY not configured",
          message: "Invoice PDF generated successfully, but email cannot be sent without RESEND_API_KEY",
          pdfSize: invoicePDF.length,
        },
        { status: 200 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromEmail = process.env.EMAIL_FROM || "Zoomout Crew <contact@zoomoutcrew.com>";
    const orderNotificationEmail =
      process.env.ORDER_NOTIFICATION_EMAIL || "stefanhorus@zoomoutcrew.com";

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      bcc: orderNotificationEmail,
      subject: "🧪 Test Invoice - Zoomout Crew",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Test Invoice</h2>
          <p>This is a test email to verify invoice generation and email delivery.</p>
          <p><strong>Order ID:</strong> ${testInvoiceData.orderId}</p>
          <p><strong>Total:</strong> ${testInvoiceData.amountRON.toFixed(2)} ${testInvoiceData.currency}</p>
          <p>The invoice PDF is attached to this email.</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This is a test email. No actual payment was processed.
          </p>
        </div>
      `,
      text: `Test Invoice\n\nOrder ID: ${testInvoiceData.orderId}\nTotal: ${testInvoiceData.amountRON.toFixed(2)} ${testInvoiceData.currency}\n\nThe invoice PDF is attached to this email.\n\nThis is a test email. No actual payment was processed.`,
      attachments: [
        {
          filename: `Invoice_${testInvoiceData.orderId}.pdf`,
          // Use Base64 to avoid Buffer serialization/transport issues
          content: invoicePDF.toString("base64"),
        },
      ],
    });

    if (error) {
      console.error("❌ Error sending test email:", error);
      return NextResponse.json(
        { 
          error: "Failed to send email",
          details: error,
          pdfGenerated: true,
          pdfSize: invoicePDF.length,
        },
        { status: 500 }
      );
    }

    console.log("✅ Test invoice email sent successfully!");
    return NextResponse.json({
      success: true,
      message: "Test invoice sent successfully",
      orderId: testInvoiceData.orderId,
      email: email,
      pdfSize: invoicePDF.length,
      resendId: data?.id,
    });
  } catch (error: any) {
    console.error("❌ Test invoice error:", error);
    return NextResponse.json(
      { 
        error: error.message || "Failed to generate test invoice",
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
