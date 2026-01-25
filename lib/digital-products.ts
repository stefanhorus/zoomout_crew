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
    downloadUrl: "https://drive.google.com/drive/folders/YOUR_WALLPAPER_PACK_FOLDER_ID?usp=drive_link",
  },
  {
    id: 8,
    name: "Lightroom Photo Presets",
    downloadUrl: "https://drive.google.com/drive/folders/YOUR_LIGHTROOM_PRESETS_FOLDER_ID?usp=drive_link",
  },
  {
    id: 9,
    name: "Transitions & Burns Pack",
    downloadUrl: "https://drive.google.com/drive/folders/YOUR_TRANSITIONS_BURNS_FOLDER_ID?usp=drive_link",
  },
  {
    id: 10,
    name: "Film Mattes and Artifacts Pack",
    downloadUrl: "https://drive.google.com/drive/folders/YOUR_FILM_ARTIFACTS_FOLDER_ID?usp=drive_link",
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
  const product = digitalProducts.find(
    (p) => p.name.toLowerCase() === productName.toLowerCase()
  );
  return product?.downloadUrl || null;
}

// Funcție helper pentru a verifica dacă un produs este digital
export function isDigitalProduct(productName: string): boolean {
  return digitalProducts.some(
    (p) => p.name.toLowerCase() === productName.toLowerCase()
  );
}
