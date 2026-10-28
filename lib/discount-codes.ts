// IMPORTANT: Acest fișier se folosește DOAR pe server (rutele API).
// Nu-l importa în componente "use client" - codurile ar ajunge în JavaScript-ul din browser.
// Pagina de checkout validează codurile prin /api/discount/validate.

export const DISCOUNT_CODES: Record<string, number> = {
  "350039": 100,
  MRMITZY: 90,
  JOINTHECREW: 50,
  LAINALTIME: 30,
  FIRST25: 25,
  VISUALDELIGHTS25: 25,
  NAIM25: 25,
  SAVE20: 20,
  ALIS20: 20,
  ZOOMOUT15: 15,
  WELCOME10: 10,
};

// Singurul cod care se poate combina cu un alt cod
export const STACKABLE_CODE = "JOINTHECREW";
export const MAX_CODES = 2;

export function normalizeDiscountCode(code: string): string {
  return code.trim().toUpperCase();
}

export function getDiscountPercentageForCode(code?: string): number {
  if (!code) return 0;
  const normalized = normalizeDiscountCode(code);
  return DISCOUNT_CODES[normalized] ?? 0;
}

/**
 * Parsează un string cu coduri separate prin virgulă sau spațiu (ex: "JOINTHECREW, MRMITZY")
 */
export function parseDiscountCodes(codesString: unknown): string[] {
  if (typeof codesString !== "string") return [];
  return codesString
    .split(/[,\s]+/)
    .map((code) => normalizeDiscountCode(code))
    .filter((code) => code.length > 0);
}

export type DiscountValidationError = "invalid" | "duplicate" | "max" | "combination";

export type DiscountValidationResult =
  | { ok: true; codes: Array<{ code: string; percentage: number }> }
  | { ok: false; error: DiscountValidationError; code?: string };

/**
 * Verifică o listă de coduri după regulile shop-ului:
 * - fiecare cod trebuie să existe
 * - fără duplicate
 * - maxim 2 coduri, iar dacă sunt 2, unul trebuie să fie JOINTHECREW
 */
export function validateDiscountCodes(codes: string[]): DiscountValidationResult {
  const normalized = codes.map(normalizeDiscountCode).filter((code) => code.length > 0);

  for (const code of normalized) {
    if (getDiscountPercentageForCode(code) <= 0) {
      return { ok: false, error: "invalid", code };
    }
  }

  if (new Set(normalized).size !== normalized.length) {
    return { ok: false, error: "duplicate" };
  }

  if (normalized.length > MAX_CODES) {
    return { ok: false, error: "max" };
  }

  if (normalized.length > 1 && !normalized.includes(STACKABLE_CODE)) {
    return { ok: false, error: "combination" };
  }

  return {
    ok: true,
    codes: normalized.map((code) => ({ code, percentage: getDiscountPercentageForCode(code) })),
  };
}

/**
 * Aplică discount-urile secvențial (fiecare pe prețul rămas după reducerea anterioară)
 * @returns discount-ul total și procentajul efectiv față de subtotal
 */
export function applyDiscountCodes(
  codes: string[],
  subtotal: number
): { totalDiscount: number; effectivePercentage: number } {
  if (codes.length === 0 || subtotal <= 0) {
    return { totalDiscount: 0, effectivePercentage: 0 };
  }

  let remainingPrice = subtotal;
  let totalDiscount = 0;

  for (const code of codes) {
    const codePercentage = getDiscountPercentageForCode(code);
    if (codePercentage > 0) {
      const codeDiscount = remainingPrice * (codePercentage / 100);
      totalDiscount += codeDiscount;
      remainingPrice -= codeDiscount;
    }
  }

  return {
    totalDiscount,
    effectivePercentage: (totalDiscount / subtotal) * 100,
  };
}
