// Mapping pentru produsele digitale și link-urile lor de download
// Actualizează aceste link-uri cu link-urile tale reale de pe Google Drive, Dropbox, etc.

export interface DigitalProduct {
  id: number;
  name: string;
  downloadUrl: string;
}

// Lista produselor digitale cu link-urile lor de download
export const digitalProducts: DigitalProduct[] = [
  {
    id: 3,
    name: "LUT Pack",
    downloadUrl: "https://drive.google.com/drive/folders/1PFWtLEmwgjVXgVfKKElmwiJJ_BEJAL_w?usp=drive_link",
  },
  {
    id: 4,
    name: "Preset Pack",
    downloadUrl: "https://drive.google.com/drive/folders/YOUR_PRESET_PACK_FOLDER_ID", // Înlocuiește cu link-ul tău real
  },
  {
    id: 5,
    name: "Cinematic Presets",
    downloadUrl: "https://drive.google.com/drive/folders/YOUR_CINEMATIC_PRESETS_FOLDER_ID", // Înlocuiește cu link-ul tău real
  },
  {
    id: 6,
    name: "Majestic Wallpaper Pack",
    downloadUrl: "https://drive.google.com/drive/folders/YOUR_WALLPAPER_PACK_FOLDER_ID", // Înlocuiește cu link-ul tău real
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
