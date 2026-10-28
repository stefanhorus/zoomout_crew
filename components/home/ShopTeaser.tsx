"use client";

import Image from "next/image";
import Link from "next/link";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getProductById, type Product } from "@/lib/products";
import { Reveal } from "../motion/Reveal";
import { SplitReveal } from "../motion/SplitReveal";

// Signature Bundle, Full LUT Bundle, Lightroom Presets
const FEATURED_IDS = [11, 12, 8];

export function ShopTeaser() {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const products = FEATURED_IDS.map((id) => getProductById(id)).filter((product): product is Product => Boolean(product));

  return (
    <section className="container-site py-28 md:py-40">
      <div className="mb-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <p className="kicker">{t("shopTeaser.kicker")}</p>
          <h2 className="display-lg mt-4 max-w-[13ch]">
            <SplitReveal text={t("shopTeaser.title")} />
          </h2>
        </div>
        <Reveal className="max-w-sm md:pb-2">
          <p className="text-paper-dim">{t("shopTeaser.text")}</p>
          <Link href="/shop" className="btn-ghost mt-6">
            {t("shopTeaser.cta")} →
          </Link>
        </Reveal>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {products.map((product, index) => (
          <Reveal key={product.id} delay={index * 0.1}>
            <Link href="/shop" className="group block" data-cursor={t("cursor.view")}>
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-ink-2">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-105"
                />
                {product.discountPercentage && (
                  <span className="absolute left-4 top-4 rounded-full bg-rec px-3 py-1.5 text-xs font-bold text-ink">
                    -{product.discountPercentage}%
                  </span>
                )}
              </div>
              <div className="mt-5 flex items-start justify-between gap-4">
                <h3 className="text-xl font-semibold tracking-tight">{product.name}</h3>
                <div className="shrink-0 text-right">
                  <p className="font-semibold">{formatPrice(product.price)}</p>
                  {product.originalPrice && <p className="text-sm text-mute line-through">{formatPrice(product.originalPrice)}</p>}
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
