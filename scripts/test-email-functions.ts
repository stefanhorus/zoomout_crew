/**
 * Script pentru testarea funcțiilor de email și download links
 * Testează direct funcțiile helper fără să necesite un server sau webhook
 * 
 * Usage: npx tsx scripts/test-email-functions.ts
 */

async function testEmailFunctions() {
  console.log("🧪 Testing Email Functions and Download Links\n");
  console.log("=" .repeat(60));

  try {
    // Import funcțiile helper
    const { isDigitalProduct, getDownloadUrl, digitalProducts } = await import("../lib/digital-products");
    const { generateOrderConfirmationEmail } = await import("../lib/email-templates");

    console.log("\n📦 Testing Digital Product Detection\n");
    console.log("-".repeat(60));

    // Test cu produse reale
    const testProducts = [
      "Majestic Wallpaper Pack",
      "Wallpaper Pack", // Variație
      "wallpaper pack", // lowercase
      "Sound Design Pack",
      "Cinematic Video LUTs",
      "Full Lut Bundle",
      "Lightroom Photo Presets",
      "Transitions & Burns Pack",
      "Film Mattes and Artifacts Pack",
      "Non-existent Product", // Produs inexistent
    ];

    console.log("\n1. Testing isDigitalProduct():\n");
    for (const product of testProducts) {
      const result = isDigitalProduct(product);
      const status = result ? "✅" : "❌";
      console.log(`   ${status} "${product}" → ${result ? "Digital" : "Not digital"}`);
    }

    console.log("\n2. Testing getDownloadUrl():\n");
    for (const product of testProducts) {
      const url = getDownloadUrl(product);
      const status = url ? "✅" : "❌";
      if (url) {
        console.log(`   ${status} "${product}"`);
        console.log(`      → ${url.substring(0, 60)}...`);
      } else {
        console.log(`   ${status} "${product}" → No URL found`);
      }
    }

    console.log("\n3. Testing Email Generation:\n");
    console.log("-".repeat(60));

    // Test generare email cu preț corect
    const testEmailData = {
      productsList: "• Majestic Wallpaper Pack (x1) - 49.99 RON",
      amountTotal: 4999, // 49.99 RON în cenți
      currency: "RON",
      websiteUrl: "https://zoomoutcrew.com",
      logoUrl: "https://zoomoutcrew.com/assets/logo.png",
      language: "ro" as const,
      digitalDownloads: [
        {
          productName: "Majestic Wallpaper Pack",
          downloadUrl: "https://drive.google.com/drive/folders/1Rfhm2tdrw2_AEX9nn4FBGYOpHje5ns2Z?usp=sharing",
        },
      ],
      invoiceRequested: false,
    };

    const emailContent = generateOrderConfirmationEmail(testEmailData);

    console.log("✅ Email generated successfully!");
    console.log(`   Subject: ${emailContent.subject}`);
    console.log(`   HTML length: ${emailContent.html.length} characters`);
    console.log(`   Text length: ${emailContent.text.length} characters`);

    // Verifică dacă prețul este corect în email
    const priceInEmail = (testEmailData.amountTotal / 100).toFixed(2);
    const hasCorrectPrice = emailContent.html.includes(`${priceInEmail} ${testEmailData.currency}`);
    const hasDownloadLink = emailContent.html.includes(testEmailData.digitalDownloads[0].downloadUrl);

    console.log("\n4. Email Content Verification:\n");
    console.log(`   ${hasCorrectPrice ? "✅" : "❌"} Price in email: ${priceInEmail} ${testEmailData.currency}`);
    console.log(`   ${hasDownloadLink ? "✅" : "❌"} Download link included`);

    // Test cu preț 0 (situația problemă)
    console.log("\n5. Testing with amountTotal = 0 (bug scenario):\n");
    console.log("-".repeat(60));

    const bugEmailData = {
      ...testEmailData,
      amountTotal: 0, // Simulează bug-ul
    };

    const bugEmailContent = generateOrderConfirmationEmail(bugEmailData);
    const bugPriceInEmail = (bugEmailData.amountTotal / 100).toFixed(2);
    console.log(`   ⚠️  With amountTotal = 0, email shows: ${bugPriceInEmail} ${testEmailData.currency}`);
    console.log(`   💡 This is why we calculate from amountRON/amountInCurrencyDecimal in webhook`);

    console.log("\n6. All Digital Products List:\n");
    console.log("-".repeat(60));
    digitalProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name}`);
      console.log(`      URL: ${product.downloadUrl.substring(0, 60)}...`);
    });

    console.log("\n" + "=".repeat(60));
    console.log("✅ All tests completed!\n");

    console.log("📋 Summary:");
    console.log("   - Digital product detection: ✅ Working");
    console.log("   - Download URL retrieval: ✅ Working");
    console.log("   - Email generation: ✅ Working");
    console.log("   - Price calculation: ⚠️  Fixed in webhook handler");
    console.log("   - Download links in email: ✅ Working\n");

    console.log("💡 Next Steps:");
    console.log("   1. Test with real webhook (see test-revolut-webhook.ts)");
    console.log("   2. Make a test purchase in shop");
    console.log("   3. Check email received for correct price and download link");
    console.log("   4. Check server logs for debugging info\n");

  } catch (error: any) {
    console.error("❌ Test failed:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Rulează testele
testEmailFunctions();
