export const DISCOUNT_CODES: Record<string, number> = {
  "350039": 100,
  MRMITZY: 90,
  JOINTHECREW: 50,
  FIRST25: 25,
  VISUALDELIGHTS25: 25,
  NAIM25: 25,
  SAVE20: 20,
  ALIS20: 20,
  ZOOMOUT15: 15,
  WELCOME10: 10,
};

export function normalizeDiscountCode(code: string): string {
  return code.trim().toUpperCase();
}

export function getDiscountPercentageForCode(code?: string): number {
  if (!code) return 0;
  const normalized = normalizeDiscountCode(code);
  return DISCOUNT_CODES[normalized] ?? 0;
}

/**
 * Procesează multiple coduri de discount și calculează discount-ul total secvențial
 * @param codesString - String cu coduri separate prin virgulă sau spațiu (ex: "JOINTHECREW, MRMITZY")
 * @param subtotal - Prețul inițial înainte de discount-uri
 * @returns Object cu discount-ul total și procentajul efectiv
 */
export function processMultipleDiscountCodes(
  codesString: string | undefined,
  subtotal: number
): { totalDiscount: number; effectivePercentage: number; codes: string[] } {
  if (!codesString || subtotal <= 0) {
    return { totalDiscount: 0, effectivePercentage: 0, codes: [] };
  }

  // Parsează codurile (pot fi separate prin virgulă, spațiu sau ambele)
  const codes = codesString
    .split(/[,\s]+/)
    .map(code => normalizeDiscountCode(code))
    .filter(code => code.length > 0);

  if (codes.length === 0) {
    return { totalDiscount: 0, effectivePercentage: 0, codes: [] };
  }

  // Aplică discount-urile secvențial (fiecare pe prețul rămas după reducerea anterioară)
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

  const effectivePercentage = subtotal > 0 ? (totalDiscount / subtotal) * 100 : 0;

  return {
    totalDiscount,
    effectivePercentage,
    codes: codes.filter(code => getDiscountPercentageForCode(code) > 0),
  };
}

