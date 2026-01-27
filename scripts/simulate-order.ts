/**
 * Script pentru simularea unei comenzi
 * Simulează o comandă pentru Majestic Wallpaper Pack
 * 
 * Usage: npx tsx scripts/simulate-order.ts
 */

// Folosește URL-ul de producție dacă este setat, altfel localhost
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || "https://zoomoutcrew.com";
const CUSTOMER_EMAIL = "horus_nfs@yahoo.com";
const PRODUCT_NAME = "Majestic Wallpaper Pack";

// Datele produsului Majestic Wallpaper Pack din shop
const mockCartItem = {
  product: {
    id: 7,
    name: "Majestic Wallpaper Pack",
    category: "other",
    image: "/assets/shop/MAJESTIC.jpg",
    price: 99.98, // Prețul după dublare (49.99 * 2)
    originalPrice: 129.96, // Prețul original după dublare (64.98 * 2)
    discountPercentage: 23,
    description: "A stunning collection of majestic wallpapers...",
    descriptionRo: "O colecție uluitoare de wallpaper-uri majestuoase...",
    inStock: true,
    downloadUrl: "https://drive.google.com/drive/folders/1Rfhm2tdrw2_AEX9nn4FBGYOpHje5ns2Z?usp=sharing",
  },
  quantity: 1,
};

async function simulateOrder() {
  console.log("🎬 Simulare comandă pentru Majestic Wallpaper Pack\n");
  console.log("=" .repeat(60));
  console.log(`📧 Email client: ${CUSTOMER_EMAIL}`);
  console.log(`📦 Produs: ${PRODUCT_NAME}`);
  console.log(`💰 Preț: ${mockCartItem.product.price} RON`);
  console.log(`🌐 URL: ${BASE_URL}/api/checkout/free\n`);

  try {
    console.log("📤 Trimitere cerere la endpoint-ul de checkout gratuit...\n");

    const response = await fetch(`${BASE_URL}/api/checkout/free`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [mockCartItem],
        customerEmail: CUSTOMER_EMAIL,
        customerName: undefined, // Nu se cere factură
        discountPercentage: undefined,
        discountCode: undefined,
        requestInvoice: false,
        language: "ro",
        currency: "RON",
      }),
    });

    const data = await response.json();

    console.log("📥 Răspuns primit:");
    console.log(`   Status: ${response.status} ${response.ok ? "✅" : "❌"}`);
    console.log(`   Success: ${data.success ? "✅" : "❌"}`);
    
    if (data.orderId) {
      console.log(`   Order ID: ${data.orderId}`);
    }
    
    if (data.message) {
      console.log(`   Message: ${data.message}`);
    }

    if (data.error) {
      console.log(`   ❌ Error: ${data.error}`);
    }

    console.log("\n" + "=".repeat(60));

    if (response.ok && data.success) {
      console.log("✅ Comandă procesată cu succes!\n");
      console.log("📋 Ce s-a întâmplat:");
      console.log("   1. ✅ Comanda a fost procesată");
      console.log("   2. ✅ Email de confirmare trimis la:", CUSTOMER_EMAIL);
      console.log("   3. ✅ Link-urile de download incluse în email");
      console.log("   4. ✅ Comanda salvată în MongoDB\n");
      
      console.log("📧 Verifică inbox-ul pentru:", CUSTOMER_EMAIL);
      console.log("   (Verifică și folderul Spam/Junk)\n");
      
      console.log("🔗 Link-ul de download pentru Majestic Wallpaper Pack:");
      console.log(`   ${mockCartItem.product.downloadUrl}\n`);
      
      return true;
    } else {
      console.log("❌ Eroare la procesarea comenzii!\n");
      console.log("📋 Detalii eroare:");
      console.log(JSON.stringify(data, null, 2));
      return false;
    }
  } catch (error: any) {
    console.error("❌ Eroare la simularea comenzii:", error.message);
    console.error("\n📋 Stack trace:");
    console.error(error.stack);
    
    if (error.message.includes("fetch failed") || error.message.includes("ECONNREFUSED")) {
      console.log("\n💡 Sfaturi:");
      console.log("   1. Asigură-te că serverul rulează: npm run dev");
      console.log("   2. Verifică că BASE_URL este corect:", BASE_URL);
      console.log("   3. Dacă folosești producția, setează NEXT_PUBLIC_BASE_URL în .env");
    }
    
    return false;
  }
}

// Rulează simularea
simulateOrder()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("❌ Eroare fatală:", error);
    process.exit(1);
  });
