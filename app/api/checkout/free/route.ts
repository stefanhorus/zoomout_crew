import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { generateOrderConfirmationEmail } from "@/lib/email-templates";
import { getDownloadUrl, isDigitalProduct, getSignatureBundleDownloads } from "@/lib/digital-products";
import { getDiscountPercentageForCode, normalizeDiscountCode } from "@/lib/discount-codes";
import { generateInvoicePDF } from "@/lib/invoice-generator";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { items, customerEmail, customerName, discountPercentage, discountCode, language, currency = "RON", requestInvoice } = await request.json();
    const invoiceRequested = !!requestInvoice;
    // Determine discount (prefer code if provided)
    const normalizedCode = typeof discountCode === "string" ? normalizeDiscountCode(discountCode) : "";
    const percentageFromCode = normalizedCode ? getDiscountPercentageForCode(normalizedCode) : 0;
    if (normalizedCode && percentageFromCode <= 0) {
      return NextResponse.json(
        { error: "Invalid discount code" },
        { status: 400 }
      );
    }
    const effectiveDiscountPercentage =
      percentageFromCode > 0
        ? percentageFromCode
        : typeof discountPercentage === "number"
          ? Math.max(0, Math.min(100, discountPercentage))
          : 0;


    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart items are required" },
        { status: 400 }
      );
    }

    if (!customerEmail) {
      return NextResponse.json(
        { error: "Customer email is required" },
        { status: 400 }
      );
    }

    // Calculează totalul
    let totalAmount = items.reduce((sum: number, item: { product: { price: number }; quantity: number }) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    // Aplică discount dacă există
    if (effectiveDiscountPercentage > 0) {
      totalAmount = totalAmount * (1 - effectiveDiscountPercentage / 100);
    }

    // Verifică dacă totalul este 0 (doar comenzile gratuite sunt permise)
    if (totalAmount > 0) {
      return NextResponse.json(
        { error: "This endpoint is only for free orders" },
        { status: 400 }
      );
    }

    // Pentru free orders, currency-ul nu contează (totalul este 0), dar îl acceptăm pentru consistență
    const selectedCurrency = currency || "RON";
    const lang = (language as "en" | "ro") || "en";

    // Format products list and collect digital downloads
    const digitalDownloads: Array<{ productName: string; downloadUrl: string }> = [];
    
    console.log("📦 Procesare produse pentru email...");
    const productsList = items
      .map((item: { product: { name: string; price: number }; quantity: number }) => {
        const productName = item.product.name || (lang === "ro" ? "Produs" : "Product");
        const quantity = item.quantity || 1;
        const freeText = lang === "ro" ? "Gratuit" : "Free";
        
        console.log(`🔍 Verificare produs: "${productName}"`);
        
        // Verifică dacă produsul este digital și adaugă link-ul de download
        if (isDigitalProduct(productName)) {
          console.log(`✅ Produs digital detectat: ${productName}`);
          // Pentru Signature Bundle, adaugă toate link-urile produselor incluse
          if (productName.toLowerCase() === "signature bundle") {
            const bundleDownloads = getSignatureBundleDownloads();
            for (let i = 0; i < quantity; i++) {
              digitalDownloads.push(...bundleDownloads);
            }
            console.log(`✅ Adăugat ${bundleDownloads.length} link-uri pentru Signature Bundle`);
          } else {
            const downloadUrl = getDownloadUrl(productName);
            if (downloadUrl) {
              // Adaugă pentru fiecare cantitate
              for (let i = 0; i < quantity; i++) {
                digitalDownloads.push({ productName, downloadUrl });
              }
              console.log(`✅ Link download găsit pentru: ${productName}`);
            } else {
              console.warn(`⚠️  Link download negăsit pentru: ${productName}`);
            }
          }
        } else {
          console.warn(`⚠️  Produsul nu este recunoscut ca digital: ${productName}`);
        }
        
        // Afișează prețul original, dar marchează ca fiind gratuit
        const priceText = lang === "ro" ? "Gratuit" : "Free";
        return `• ${productName} (x${quantity}) - ${priceText}`;
      })
      .join("<br>");
    
    console.log(`📦 Total produse digitale cu link-uri: ${digitalDownloads.length}`);

    const websiteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://zoomoutcrew.com";
    const logoUrl = `${websiteUrl}/assets/logo.png`;
    const fromEmail = process.env.EMAIL_FROM || "Zoomout Crew <contact@zoomoutcrew.com>";
    const orderNotificationEmail =
      process.env.ORDER_NOTIFICATION_EMAIL || "stefanhorus@zoomoutcrew.com";

    // Generate email content based on language
    // Folosim amountTotal: 0 pentru că toate comenzile sunt gratuite
    console.log("📧 Generare conținut email...");
    console.log(`   Produse digitale: ${digitalDownloads.length}`);
    console.log(`   Link-uri download: ${digitalDownloads.map(d => d.productName).join(", ")}`);
    
    const emailContent = generateOrderConfirmationEmail({
      productsList,
      amountTotal: 0, // Toate comenzile sunt gratuite
      currency: selectedCurrency,
      websiteUrl,
      logoUrl,
      language: lang,
      digitalDownloads: digitalDownloads.length > 0 ? digitalDownloads : undefined,
      invoiceRequested,
    });
    
    console.log("✅ Email generat cu succes");

    // Optional: attach invoice PDF only if requested
    let invoiceAttachment: { filename: string; content: string } | null = null;
    if (invoiceRequested) {
      try {
        const invoiceItems = items.map(
          (item: { product: { name: string; price: number }; quantity: number }) => ({
            name: item.product.name || "Product",
            quantity: item.quantity || 1,
            price: item.product.price, // RON
          })
        );

        const invoicePDF = await generateInvoicePDF({
          orderId: `FREE-${Date.now()}`,
          customerEmail: customerEmail.trim(),
          customerName: customerName?.trim() || undefined,
          items: invoiceItems,
          amountRON: 0,
          amountCurrency: 0,
          currency: selectedCurrency,
          date: new Date(),
          language: lang,
          discountPercentage: effectiveDiscountPercentage || undefined,
          discountCode: normalizedCode || undefined,
        });

        invoiceAttachment = {
          filename: `Invoice_FREE-${Date.now()}.pdf`,
          content: invoicePDF.toString("base64"),
        };
      } catch (pdfError: any) {
        console.error("❌ Error generating invoice PDF for free order:", pdfError);
      }
    }

    const emailPayload: any = {
      from: fromEmail,
      to: customerEmail,
      bcc: orderNotificationEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    };

    if (invoiceAttachment) {
      emailPayload.attachments = [invoiceAttachment];
    }

    // Send confirmation email to customer
    console.log("📤 Trimitere email la:", customerEmail);
    const { data, error } = await resend.emails.send(emailPayload);

    if (error) {
      console.error("❌ Error sending free order confirmation email:", error);
      console.error("❌ Error details:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: "Failed to send confirmation email" },
        { status: 500 }
      );
    }

    console.log("✅ Email de confirmare trimis cu succes!");
    console.log(`   Email ID: ${data?.id}`);
    console.log(`   Destinatar: ${customerEmail}`);
    console.log(`   Link-uri download incluse: ${digitalDownloads.length > 0 ? "✅ Da" : "❌ Nu"}`);

    // Salvează comanda în MongoDB
    try {
      await connectDB();
      
      const orderId = `free-${Date.now()}`;
      const formattedItems = items.map((item: { product: { name: string; price: number }; quantity: number }) => ({
        name: item.product.name || "Product",
        quantity: item.quantity || 1,
        price: item.product.price, // Prețul în RON
      }));

      await Order.create({
        orderId,
        provider: "free",
        customerEmail,
        customerName: customerName?.trim() || undefined,
        amountRON: 0,
        amountCurrency: 0,
        currency: selectedCurrency,
        status: "completed",
        items: formattedItems,
        discountPercentage: effectiveDiscountPercentage || undefined,
        discountCode: normalizedCode || undefined,
        metadata: {
          language: lang,
          originalCurrency: "RON",
          request_invoice: invoiceRequested,
        },
      });

      console.log(`✅ Free order ${orderId} saved to MongoDB`);

      return NextResponse.json({
        success: true,
        message: "Order confirmed and email sent",
        orderId,
      });
    } catch (dbError: any) {
      console.error("❌ Error saving free order to MongoDB:", dbError);
      // Return success anyway since email was sent
      return NextResponse.json({
        success: true,
        message: "Order confirmed and email sent (database save failed)",
        orderId: `free-${Date.now()}`,
      });
    }
  } catch (error: any) {
    console.error("❌ Error processing free order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process free order" },
      { status: 500 }
    );
  }
}
