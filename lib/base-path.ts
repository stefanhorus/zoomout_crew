// Site-ul v2 rulează sub zoomoutcrew.com/2 (basePath din next.config.ts).
// <Link> și router-ul adaugă singure prefixul; fișierele din public/ (imagini, video) și cererile către /api nu.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const withBasePath = (path: string) => `${BASE_PATH}${path}`;
