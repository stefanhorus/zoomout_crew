// Mapping pentru produsele digitale și link-urile lor de download
// Actualizează aceste link-uri cu link-urile tale reale de pe Google Drive, Dropbox, etc.
// 
// IMPORTANT: Numele produselor trebuie să se potrivească EXACT cu numele din Stripe/Revolut metadata
// 
// Cum să obții link-uri Google Drive:
// 1. Upload fișierele pe Google Drive într-un folder
// 2. Click dreapta pe folder → "Get link" sau "Share"
// 3. Setează permisiunile la "Anyone with the link" (Viewer)
// 4. Copiază link-ul și înlocuiește placeholder-urile de mai jos

export interface DigitalProduct {
  id: number;
  name: string;
  downloadUrl: string;
}

// Lista produselor digitale cu link-urile lor de download
// Toate produsele din shop trebuie să fie aici pentru ca link-urile să fie trimise în email
export const digitalProducts: DigitalProduct[] = [
  {
    id: 1,
    name: "Cinematic Video LUTs",
    downloadUrl: "https://drive.google.com/drive/folders/1rMMYI6uDFgkiZSLB-QXb5L_TIGg15rkR?usp=sharing",
  },
  {
    id: 2,
    name: "Movie Looks LUTs",
    downloadUrl: "https://drive.google.com/drive/folders/1P0DGPEVJWIaBAxoYvUQYSpWzni7OfBe-?usp=sharing",
  },
  {
    id: 3,
    name: "Film LUTs",
    downloadUrl: "https://drive.google.com/drive/folders/1pe_0pkGAOpMPiPGCgCJX9NEjjQBNxPN1?usp=sharing",
  },
  {
    id: 4,
    name: "Vintage Film LUTs",
    downloadUrl: "https://drive.google.com/drive/folders/1a3prlQ-ajT_pFmsnJ9IeMWGJ23ERTvYE?usp=sharing",
  },
  {
    id: 5,
    name: "Iphone Looks LUTs",
    downloadUrl: "https://drive.google.com/drive/folders/1-hNQNjNiYMRCgf-WIe-C36b7SU5y8o8v?usp=sharing",
  },
  {
    id: 6,
    name: "Sound Design Pack",
    downloadUrl: "https://drive.google.com/drive/folders/1Xi393MvpvojRydJCkJa4zRfAQqYIWJA8?usp=sharing",
  },
  {
    id: 7,
    name: "Majestic Wallpaper Pack",
    downloadUrl: "https://drive.google.com/drive/folders/1Rfhm2tdrw2_AEX9nn4FBGYOpHje5ns2Z?usp=sharing",
  },
  {
    id: 8,
    name: "Lightroom Photo Presets",
    downloadUrl: "https://drive.google.com/drive/folders/1qRS_o8Z2JbR1VR7sEz4EAcnRv-IV-6n6?usp=sharing",
  },
  {
    id: 9,
    name: "Transitions & Burns Pack",
    downloadUrl: "https://drive.google.com/drive/folders/1V3Cheu6wVcLx3_dtm2SB3xFyyV_5M8ha?usp=sharing",
  },
  {
    id: 10,
    name: "Film Mattes and Artifacts Pack",
    downloadUrl: "https://mega.nz/folder/KNtRAKaT#aOLGxvtiIWDozvC7mhCgHw",
  },
  {
    id: 11,
    name: "Signature Bundle",
    downloadUrl: "https://drive.google.com/drive/folders/YOUR_SIGNATURE_BUNDLE_FOLDER_ID?usp=drive_link",
  },
  {
    id: 12,
    name: "Full Lut Bundle",
    downloadUrl: "https://drive.google.com/drive/folders/1Bf1lBXJ5WbajNTRck2qE6SXESa7hSwq6?usp=sharing",
  },
];

// Funcție helper pentru a găsi link-ul de download pentru un produs digital
export function getDownloadUrl(productName: string): string | null {
  const normalizedName = productName.toLowerCase().trim();
  
  // First try exact match (case-insensitive)
  let product = digitalProducts.find(
    (p) => p.name.toLowerCase() === normalizedName
  );
  
  // If no exact match, try partial matching for common variations
  if (!product) {
    // Handle "Wallpaper Pack" matching "Majestic Wallpaper Pack" (specific case)
    if (normalizedName.includes("wallpaper") && normalizedName.includes("pack")) {
      product = digitalProducts.find(
        (p) => p.name.toLowerCase().includes("wallpaper") && p.name.toLowerCase().includes("pack")
      );
    }
    // Handle "Sound Design" matching "Sound Design Pack"
    else if (normalizedName.includes("sound design")) {
      product = digitalProducts.find(
        (p) => p.name.toLowerCase().includes("sound design")
      );
    }
    // Handle "Lightroom" matching "Lightroom Photo Presets"
    else if (normalizedName.includes("lightroom")) {
      product = digitalProducts.find(
        (p) => p.name.toLowerCase().includes("lightroom")
      );
    }
    // Handle "Transitions" or "Burns" matching "Transitions & Burns Pack"
    else if (normalizedName.includes("transition") || normalizedName.includes("burn")) {
      product = digitalProducts.find(
        (p) => p.name.toLowerCase().includes("transition") || p.name.toLowerCase().includes("burn")
      );
    }
    // Handle "Film Mattes" or "Artifacts" matching "Film Mattes and Artifacts Pack"
    else if (normalizedName.includes("film matte") || normalizedName.includes("artifact")) {
      product = digitalProducts.find(
        (p) => p.name.toLowerCase().includes("matte") || p.name.toLowerCase().includes("artifact")
      );
    }
    // Handle "Full LUT" or "Full Lut" matching "Full Lut Bundle"
    else if (normalizedName.includes("full") && normalizedName.includes("lut")) {
      product = digitalProducts.find(
        (p) => p.name.toLowerCase().includes("full") && p.name.toLowerCase().includes("lut")
      );
    }
  }
  
  return product?.downloadUrl || null;
}

// Funcție helper pentru a obține toate link-urile pentru Signature Bundle
export function getSignatureBundleDownloads(): Array<{ productName: string; downloadUrl: string }> {
  // Produsele incluse în Signature Bundle (fără pack-urile individuale de LUTs și wallpaper-uri)
  const includedProductIds = [
    12, // Full Lut Bundle
    8,  // Lightroom Photo Presets
    6,  // Sound Design Pack
    9,  // Transitions & Burns Pack
    10, // Film Mattes and Artifacts Pack
  ];
  
  return digitalProducts
    .filter((p) => includedProductIds.includes(p.id))
    .map((p) => ({
      productName: p.name,
      downloadUrl: p.downloadUrl,
    }));
}

// Funcție helper pentru a verifica dacă un produs este digital
export function isDigitalProduct(productName: string): boolean {
  const normalizedName = productName.toLowerCase().trim();
  
  // First try exact match (case-insensitive)
  const exactMatch = digitalProducts.some(
    (p) => p.name.toLowerCase() === normalizedName
  );
  
  if (exactMatch) return true;
  
  // If no exact match, try partial matching for common variations
  // Handle "Wallpaper Pack" matching "Majestic Wallpaper Pack" (specific case)
  if (normalizedName.includes("wallpaper") && normalizedName.includes("pack")) {
    return digitalProducts.some(
      (p) => p.name.toLowerCase().includes("wallpaper") && p.name.toLowerCase().includes("pack")
    );
  }
  
  // Handle "Sound Design" matching "Sound Design Pack"
  if (normalizedName.includes("sound design")) {
    return digitalProducts.some(
      (p) => p.name.toLowerCase().includes("sound design")
    );
  }
  
  // Handle "Lightroom" matching "Lightroom Photo Presets"
  if (normalizedName.includes("lightroom")) {
    return digitalProducts.some(
      (p) => p.name.toLowerCase().includes("lightroom")
    );
  }
  
  // Handle "Transitions" or "Burns" matching "Transitions & Burns Pack"
  if (normalizedName.includes("transition") || normalizedName.includes("burn")) {
    return digitalProducts.some(
      (p) => p.name.toLowerCase().includes("transition") || p.name.toLowerCase().includes("burn")
    );
  }
  
  // Handle "Film Mattes" or "Artifacts" matching "Film Mattes and Artifacts Pack"
  if (normalizedName.includes("film matte") || normalizedName.includes("artifact")) {
    return digitalProducts.some(
      (p) => p.name.toLowerCase().includes("matte") || p.name.toLowerCase().includes("artifact")
    );
  }
  
  // Handle "Full LUT" or "Full Lut" matching "Full Lut Bundle"
  if (normalizedName.includes("full") && normalizedName.includes("lut")) {
    return digitalProducts.some(
      (p) => p.name.toLowerCase().includes("full") && p.name.toLowerCase().includes("lut")
    );
  }
  
  // Handle LUT variations (but be more specific to avoid false matches)
  if (normalizedName.includes("cinematic") && normalizedName.includes("lut")) {
    return digitalProducts.some(
      (p) => p.name.toLowerCase().includes("cinematic") && p.name.toLowerCase().includes("lut")
    );
  }
  if (normalizedName.includes("movie") && normalizedName.includes("lut")) {
    return digitalProducts.some(
      (p) => p.name.toLowerCase().includes("movie") && p.name.toLowerCase().includes("lut")
    );
  }
  if (normalizedName.includes("film") && normalizedName.includes("lut") && !normalizedName.includes("matte")) {
    return digitalProducts.some(
      (p) => p.name.toLowerCase().includes("film") && p.name.toLowerCase().includes("lut") && !p.name.toLowerCase().includes("matte")
    );
  }
  if (normalizedName.includes("vintage") && normalizedName.includes("lut")) {
    return digitalProducts.some(
      (p) => p.name.toLowerCase().includes("vintage") && p.name.toLowerCase().includes("lut")
    );
  }
  if (normalizedName.includes("iphone") && normalizedName.includes("lut")) {
    return digitalProducts.some(
      (p) => p.name.toLowerCase().includes("iphone") && p.name.toLowerCase().includes("lut")
    );
  }
  
  return false;
}
