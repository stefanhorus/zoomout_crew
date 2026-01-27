/**
 * Script pentru testarea webhook-ului Revolut
 * Simulează un webhook ORDER_COMPLETED pentru a testa:
 * 1. Calculul corect al prețului în email
 * 2. Generarea link-urilor de download pentru produse digitale
 * 
 * Usage: npx tsx scripts/test-revolut-webhook.ts
 */

import crypto from "crypto";

// Configurare
const WEBHOOK_URL = process.env.WEBHOOK_URL || "http://localhost:3000/api/webhooks/revolut";
const REVOLUT_WEBHOOK_SECRET = process.env.REVOLUT_WEBHOOK_SECRET || "test-secret";

// Simulează o comandă pentru Majestic Wallpaper Pack
const mockOrder = {
  event: "ORDER_COMPLETED",
  order_id: `test_${Date.now()}`,
};

// Simulează răspunsul de la Revolut API pentru order details
const mockOrderDetails = {
  id: mockOrder.order_id,
  public_id: `pub_${Date.now()}`,
  state: "COMPLETED",
  amount: 4999, // 49.99 RON în cenți
  currency: "RON",
  created_at: new Date().toISOString(),
  customer: {
    email: "test@example.com",
    full_name: "Test User",
  },
  items: [
    {
      name: "Majestic Wallpaper Pack",
      quantity: 1,
      unit_price: 4999, // 49.99 RON în cenți
    },
  ],
  metadata: {
    language: "ro",
    total_amount_ron: 49.99,
    request_invoice: false,
  },
  payments: [
    {
      id: `pay_${Date.now()}`,
      state: "COMPLETED",
      created_at: new Date().toISOString(),
      payment_method: {
        type: "CARD",
        card_brand: "VISA",
        card_last_four: "1234",
        card_country_code: "RO",
      },
      authorisation_code: "AUTH123",
    },
  ],
};

async function testWebhook() {
  console.log("🧪 Starting Revolut webhook test...\n");
  console.log("📋 Test Configuration:");
  console.log(`   Webhook URL: ${WEBHOOK_URL}`);
  console.log(`   Order ID: ${mockOrder.order_id}`);
  console.log(`   Product: ${mockOrderDetails.items[0].name}`);
  console.log(`   Amount: ${mockOrderDetails.amount / 100} ${mockOrderDetails.currency}\n`);

  try {
    // Simulează răspunsul de la Revolut API
    // În realitate, webhook-ul face un fetch la Revolut API pentru a obține order details
    // Pentru test, vom simula direct apelul la endpoint-ul webhook

    const body = JSON.stringify(mockOrder);
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signedPayload = `${timestamp}.${body}`;
    const signature = crypto
      .createHmac("sha256", REVOLUT_WEBHOOK_SECRET)
      .update(signedPayload)
      .digest("hex");

    console.log("📤 Sending webhook request...");
    console.log(`   Event: ${mockOrder.event}`);
    console.log(`   Signature: ${signature.substring(0, 20)}...\n`);

    // Simulează apelul webhook
    // NOTĂ: Acest script simulează doar structura webhook-ului
    // Pentru test real, trebuie să:
    // 1. Rulezi serverul local: npm run dev
    // 2. Folosești un tool ca Postman sau curl pentru a trimite request-ul
    // 3. SAU folosești ngrok pentru a expune localhost-ul și să configurezi webhook-ul în Revolut

    console.log("✅ Webhook payload prepared!");
    console.log("\n📝 Next steps:");
    console.log("   1. Start local server: npm run dev");
    console.log("   2. Use one of these methods to test:\n");
    
    console.log("   Method 1: Using curl");
    console.log(`   curl -X POST ${WEBHOOK_URL} \\`);
    console.log(`     -H "Content-Type: application/json" \\`);
    console.log(`     -H "revolut-signature: ${signature}" \\`);
    console.log(`     -H "revolut-request-timestamp: ${timestamp}" \\`);
    console.log(`     -d '${body}'\n`);

    console.log("   Method 2: Using Postman");
    console.log(`   - URL: ${WEBHOOK_URL}`);
    console.log(`   - Method: POST`);
    console.log(`   - Headers:`);
    console.log(`     * Content-Type: application/json`);
    console.log(`     * revolut-signature: ${signature}`);
    console.log(`     * revolut-request-timestamp: ${timestamp}`);
    console.log(`   - Body (raw JSON):`);
    console.log(`     ${JSON.stringify(mockOrder, null, 2)}\n`);

    console.log("   Method 3: Manual test with real order");
    console.log("   - Make a test purchase in your shop");
    console.log("   - Check the logs in your server console");
    console.log("   - Verify the email received has:");
    console.log("     * Correct price (not 0 lei)");
    console.log("     * Download link for wallpaper pack\n");

    // Test direct al funcțiilor helper
    console.log("🔍 Testing helper functions...\n");
    
    const { isDigitalProduct, getDownloadUrl } = await import("../lib/digital-products");
    
    const productName = "Majestic Wallpaper Pack";
    console.log(`   Testing: "${productName}"`);
    console.log(`   Is digital: ${isDigitalProduct(productName)}`);
    console.log(`   Download URL: ${getDownloadUrl(productName) || "NOT FOUND"}\n`);

    // Test cu variații de nume
    const variations = [
      "Majestic Wallpaper Pack",
      "Wallpaper Pack",
      "majestic wallpaper pack",
      "MAJESTIC WALLPAPER PACK",
    ];

    console.log("🔍 Testing name variations:");
    for (const variation of variations) {
      const isDigital = isDigitalProduct(variation);
      const url = getDownloadUrl(variation);
      console.log(`   "${variation}"`);
      console.log(`     → Is digital: ${isDigital}`);
      console.log(`     → URL: ${url ? "✅ Found" : "❌ Not found"}`);
    }

    console.log("\n✅ Test script completed!");
    console.log("\n💡 Tips:");
    console.log("   - Check server logs for detailed debugging info");
    console.log("   - Verify email content in your email inbox");
    console.log("   - Check MongoDB for saved order data");

  } catch (error: any) {
    console.error("❌ Test failed:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Rulează testul
testWebhook();
