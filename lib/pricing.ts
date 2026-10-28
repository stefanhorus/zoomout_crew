// Calculul prețurilor pentru checkout - se face EXCLUSIV pe server.
// Browserul trimite doar ID-urile produselor și codurile de reducere; prețurile vin din catalog (lib/products.ts),
// iar procentul de reducere din lib/discount-codes.ts. Orice preț sau procent trimis de client este ignorat.
import { getProductById } from "./products";
import { applyDiscountCodes, parseDiscountCodes, validateDiscountCodes, type DiscountValidationError } from "./discount-codes";
import { EXCHANGE_RATES, isCurrency, type Currency } from "./currency";

export interface PricedLine {
  id: number;
  name: string;
  description: string;
  quantity: number; // Produsele sunt digitale, deci mereu 1
  unitPriceRON: number; // Prețul din catalog
  discountedUnitPriceRON: number; // Prețul după reducerile aplicate
}

export interface PricedCart {
  lines: PricedLine[];
  subtotalRON: number;
  discountCodes: string[];
  discountPercentage: number; // Procentul efectiv, după aplicarea secvențială a codurilor
  totalRON: number;
  currency: Currency;
  exchangeRate: number;
  totalInCurrency: number;
  isFree: boolean;
}

export type PricingError = "empty_cart" | "unknown_product" | DiscountValidationError;

export type PricingResult = { ok: true; cart: PricedCart } | { ok: false; error: PricingError; message: string };

const ERROR_MESSAGES: Record<PricingError, string> = {
  empty_cart: "Cart items are required",
  unknown_product: "Unknown product in cart",
  invalid: "Invalid discount code(s)",
  duplicate: "Duplicate discount code",
  max: "Too many discount codes",
  combination: "Only JOINTHECREW can be combined with another code",
};

function fail(error: PricingError): PricingResult {
  return { ok: false, error, message: ERROR_MESSAGES[error] };
}

// Acceptă atât { id } cât și forma veche { product: { id } } trimisă de coș
function extractProductId(item: unknown): number | null {
  if (!item || typeof item !== "object") return null;
  const raw = (item as { id?: unknown; product?: { id?: unknown } }).id ?? (item as { product?: { id?: unknown } }).product?.id;
  const id = typeof raw === "string" ? Number(raw) : raw;
  return typeof id === "number" && Number.isInteger(id) ? id : null;
}

export function priceCart(rawItems: unknown, rawDiscountCodes: unknown, rawCurrency: unknown): PricingResult {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return fail("empty_cart");
  }

  const ids: number[] = [];
  for (const item of rawItems) {
    const id = extractProductId(item);
    if (id === null || !getProductById(id)) {
      return fail("unknown_product");
    }
    if (!ids.includes(id)) ids.push(id);
  }

  const codes = parseDiscountCodes(rawDiscountCodes);
  const validation = validateDiscountCodes(codes);
  if (!validation.ok) {
    return fail(validation.error);
  }
  const discountCodes = validation.codes.map((c) => c.code);

  const products = ids.map((id) => getProductById(id)!);
  const subtotalRON = products.reduce((sum, p) => sum + p.price, 0);
  const { totalDiscount, effectivePercentage } = applyDiscountCodes(discountCodes, subtotalRON);

  // Evită artefacte de virgulă mobilă (ex: 1e-13 în loc de 0)
  const totalRON = Math.max(0, Math.round((subtotalRON - totalDiscount) * 100) / 100);

  const currency: Currency = isCurrency(rawCurrency) ? rawCurrency : "RON";
  const exchangeRate = EXCHANGE_RATES[currency];

  return {
    ok: true,
    cart: {
      lines: products.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        quantity: 1,
        unitPriceRON: p.price,
        discountedUnitPriceRON: p.price * (1 - effectivePercentage / 100),
      })),
      subtotalRON,
      discountCodes,
      discountPercentage: effectivePercentage,
      totalRON,
      currency,
      exchangeRate,
      totalInCurrency: totalRON * exchangeRate,
      isFree: totalRON <= 0,
    },
  };
}
