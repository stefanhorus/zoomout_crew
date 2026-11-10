// Prefixul site-ului (basePath din next.config.ts): gol de când noul design e la zoomoutcrew.com; a fost /2 până atunci.
// <Link> și router-ul adaugă singure prefixul; fișierele din public/ (imagini, video) și cererile către /api nu.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const withBasePath = (path: string) => `${BASE_PATH}${path}`;
