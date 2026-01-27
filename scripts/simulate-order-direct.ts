/**
 * Script pentru simularea directă a unei comenzi (fără HTTP)
 * Simulează o comandă pentru Majestic Wallpaper Pack direct în cod
 * 
 * Usage: npx tsx scripts/simulate-order-direct.ts
 */

// Încarcă variabilele de mediu
import { config } from "dotenv";
import { resolve } from "path";

// Încearcă să încarce .env.local, apoi .env
config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

import { Resend } from "resend";
import { generateOrderConfirmationEmail } from "@/lib/email-templates";
import { getDownloadUrl, isDigitalProduct } from "@/lib/digital-products";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";

const CUSTOMER_EMAIL = "horus_nfs@yahoo.com";
const PRODUCT_NAME = "Majestic Wallpaper Pack";

// Datele produsului Majestic Wallpaper Pack
const mockCartItem = {
  product: {
    id: 7,
    name: "Majestic Wallpaper Pack",
    category: "other",
    image: "/assets/shop/MAJESTIC.jpg",
    price: 99.98,
    originalPrice: 129.96,
    discountPercentage: 23,
    description: "A stunning collection of majestic wallpapers...",
    descriptionRo: "O colecție uluitoare de wallpaper-uri majestuoase...",
    inStock: true,
    downloadUrl: "https://drive.google.com/drive/folders/1Rfhm2tdrw2_AEX9nn4FBGYOpHje5ns2Z?usp=sharing",
  },
  quantity: 1,
};

async function simulateOrderDirect() {
  console.log("🎬 Simulare directă comandă pentru Majestic Wallpaper Pack\n");
  console.log("=" .repeat(60));
  console.log(`📧 Email client: ${CUSTOMER_EMAIL}`);
  console.log(`📦 Produs: ${PRODUCT_NAME}`);
  console.log(`💰 Preț: ${mockCartItem.product.price} RON (procesat ca gratuit)\n`);

  try {
    // Verifică dacă RESEND_API_KEY este setat
    if (!process.env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY nu este setat în variabilele de mediu");
      console.log("💡 Setează RESEND_API_KEY în .env.local sau .env");
      return false;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Conectează la MongoDB (opțional)
    let mongoConnected = false;
    if (process.env.MONGODB_URI) {
      try {
        console.log("🔌 Conectare la MongoDB...");
        await connectDB();
        console.log("✅ Conectat la MongoDB\n");
        mongoConnected = true;
      } catch (mongoError: any) {
        console.warn("⚠️  Nu s-a putut conecta la MongoDB:", mongoError.message);
        console.log("   Continuăm fără salvare în MongoDB...\n");
      }
    } else {
      console.log("⚠️  MONGODB_URI nu este setat, comanda nu va fi salvată în MongoDB\n");
    }

    // Format products list and collect digital downloads
    const digitalDownloads: Array<{ productName: string; downloadUrl: string }> = [];
    const lang = "ro" as const;
    
    const productsList = [mockCartItem]
      .map((item) => {
        const productName = item.product.name || "Produs";
        const quantity = item.quantity || 1;
        const freeText = "Gratuit";
        
        // Verifică dacă produsul este digital și adaugă link-ul de download
        if (isDigitalProduct(productName)) {
          const downloadUrl = getDownloadUrl(productName);
          if (downloadUrl) {
            for (let i = 0; i < quantity; i++) {
              digitalDownloads.push({ productName, downloadUrl });
            }
            console.log(`✅ Link download găsit pentru: ${productName}`);
          } else {
            console.warn(`⚠️  Link download negăsit pentru: ${productName}`);
          }
        }
        
        return `• ${productName} (x${quantity}) - ${freeText}`;
      })
      .join("<br>");

    console.log(`📦 Produse digitale detectate: ${digitalDownloads.length}\n`);

    const websiteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://zoomoutcrew.com";
    const logoUrl = `${websiteUrl}/assets/logo.png`;
    const fromEmail = process.env.EMAIL_FROM || "Zoomout Crew <contact@zoomoutcrew.com>";
    const orderNotificationEmail =
      process.env.ORDER_NOTIFICATION_EMAIL || "stefanhorus@zoomoutcrew.com";

    // Generate email content
    console.log("📧 Generare email de confirmare...");
    const emailContent = generateOrderConfirmationEmail({
      productsList,
      amountTotal: 0, // Toate comenzile sunt gratuite
      currency: "RON",
      websiteUrl,
      logoUrl,
      language: lang,
      digitalDownloads: digitalDownloads.length > 0 ? digitalDownloads : undefined,
      invoiceRequested: false,
    });
    console.log("✅ Email generat\n");

    // Send email
    console.log("📤 Trimitere email...");
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: CUSTOMER_EMAIL,
      bcc: orderNotificationEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    if (error) {
      console.error("❌ Eroare la trimiterea email-ului:", error);
      return false;
    }

    console.log("✅ Email trimis cu succes!");
    console.log(`   Email ID: ${data?.id}\n`);

    // Salvează comanda în MongoDB (dacă este conectat)
    const orderId = `free-${Date.now()}`;
    if (mongoConnected) {
      try {
        console.log("💾 Salvare comandă în MongoDB...");
        const formattedItems = [mockCartItem].map((item) => ({
          name: item.product.name || "Product",
          quantity: item.quantity || 1,
          price: item.product.price,
        }));

        await Order.create({
          orderId,
          provider: "free",
          customerEmail: CUSTOMER_EMAIL,
          customerName: undefined,
          amountRON: 0,
          amountCurrency: 0,
          currency: "RON",
          status: "completed",
          items: formattedItems,
          metadata: {
            language: lang,
            originalCurrency: "RON",
            request_invoice: false,
          },
        });

        console.log(`✅ Comandă salvată în MongoDB: ${orderId}\n`);
      } catch (dbError: any) {
        console.warn("⚠️  Eroare la salvare în MongoDB:", dbError.message);
        console.log("   Comanda a fost procesată, dar nu a fost salvată în DB\n");
      }
    } else {
      console.log(`📝 Order ID generat: ${orderId} (nu salvat în DB)\n`);
    }

    console.log("=".repeat(60));
    console.log("✅ Comandă procesată cu succes!\n");
    console.log("📋 Rezumat:");
    console.log(`   1. ✅ Email trimis la: ${CUSTOMER_EMAIL}`);
    console.log(`   2. ✅ Link-uri download: ${digitalDownloads.length}`);
    console.log(`   3. ✅ Comandă salvată: ${orderId}`);
    console.log(`   4. ✅ Status: completed\n`);
    
    console.log("📧 Verifică inbox-ul pentru:", CUSTOMER_EMAIL);
    console.log("   (Verifică și folderul Spam/Junk)\n");
    
    if (digitalDownloads.length > 0) {
      console.log("🔗 Link-uri de download:");
      digitalDownloads.forEach((download, index) => {
        console.log(`   ${index + 1}. ${download.productName}`);
        console.log(`      ${download.downloadUrl}`);
      });
    }

    return true;
  } catch (error: any) {
    console.error("❌ Eroare la simularea comenzii:", error.message);
    console.error("\n📋 Stack trace:");
    console.error(error.stack);
    return false;
  }
}

// Rulează simularea
simulateOrderDirect()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("❌ Eroare fatală:", error);
    process.exit(1);
  });
