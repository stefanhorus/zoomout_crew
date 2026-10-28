// Rate-uri de schimb folosite atât pentru afișare (CurrencyContext), cât și pentru plată (rutele de checkout).
// Trebuie să existe o singură sursă, altfel clientul vede un preț și plătește altul.
export const CURRENCIES = ["RON", "EUR", "USD", "GBP"] as const;

export type Currency = (typeof CURRENCIES)[number];

// 1 RON = X în moneda respectivă (RON este moneda de bază)
export const EXCHANGE_RATES: Record<Currency, number> = {
  RON: 1,
  EUR: 0.2,  // 5 RON = 1 EUR
  USD: 0.22, // ~4.545 RON = 1 USD
  GBP: 0.18, // ~5.556 RON = 1 GBP
};

export function isCurrency(value: unknown): value is Currency {
  return typeof value === "string" && (CURRENCIES as readonly string[]).includes(value);
}
