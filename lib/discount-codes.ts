export const DISCOUNT_CODES: Record<string, number> = {
  FREE: 100,
  MRMITZY: 90,
  JOINTHECREW: 50,
  FIRST25: 25,
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

