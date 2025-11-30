"use client";

import { useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";

// Tipuri de produse pentru filtrare
type ProductCategory = "all" | "physical" | "digital";

interface Product {
  id: number;
  name: string;
  category: ProductCategory;
  image: string;
  price: number;
  description: string;
  inStock: boolean;
}

// Date de exemplu - poți înlocui cu produsele tale reale
const products: Product[] = [
  {
    id: 1,
    name: "Men's T-Shirt",
    category: "physical",
    image: "/assets/logo.png",
    price: 29,
    description: "Premium quality T-shirt for men.",
    inStock: true,
  },
  {
    id: 2,
    name: "Women's T-Shirt",
    category: "physical",
    image: "/assets/logo.png",
    price: 29,
    description: "High quality and comfortable T-shirt for women.",
    inStock: true,
  },
  {
    id: 3,
    name: "LUT Pack",
    category: "digital",
    image: "/assets/logo.png",
    price: 15,
    description: "A collection of professional LUTs for video color grading.",
    inStock: true,
  },
  {
    id: 4,
    name: "Preset Pack",
    category: "digital",
    image: "/assets/logo.png",
    price: 12,
    description: "Lightroom preset pack for clean and cinematic looks.",
    inStock: true,
  },
  {
    id: 5,
    name: "Cinematic Presets",
    category: "digital",
    image: "/assets/shop/Cinematic.jpg",
    price: 20,
    description: "Professional cinematic color grading presets for video editing. Transform your footage with our carefully crafted presets designed to give your videos that cinematic look.",
    inStock: true,
  },
  {
    id: 6,
    name: "Majestic Wallpaper Pack",
    category: "digital",
    image: "/assets/shop/Wallpaper.jpg",
    price: 15,
    description: "A stunning collection of majestic wallpapers featuring breathtaking aerial landscapes and cinematic scenes. Perfect for desktop, mobile, and tablet backgrounds.",
    inStock: true,
  },
];

export default function Shop() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();

  const categories = [
    { value: "all", label: "All Products", labelKey: "shop.allProducts" },
    { value: "physical", label: "Physical", labelKey: "shop.physical" },
    { value: "digital", label: "Digital", labelKey: "shop.digital" },
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <main className="min-h-screen text-white pt-24 pb-16 relative">
      {/* Background Image */}
      <div className="fixed inset-0 w-full h-full z-0">
        <Image
          src="/assets/backgrounds/background6tiny.png"
          alt="Shop background"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            <Typewriter
              words={[t("shop.title")]}
              loop={false}
              cursor
              cursorStyle="|"
              typeSpeed={90}
              deleteSpeed={0}
              delaySpeed={999999}
            />
          </h1>
          <p className="text-gray-300">
            {t("shop.subtitle")}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-12 px-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value as ProductCategory)}
              className={`px-4 py-1.5 md:px-6 md:py-2 rounded-xl font-semibold transition-all duration-300 text-sm md:text-base ${
                selectedCategory === category.value
                  ? "liquid-glass-button text-white scale-105"
                  : "liquid-glass liquid-glass-hover text-white"
              }`}
              style={{ fontFamily: "var(--font-roboto)" }}
            >
              {t(category.labelKey)}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden rounded-2xl liquid-glass liquid-glass-hover"
            >
              {/* Product Image */}
              <div className="aspect-square relative overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10 group-hover:from-black/40 group-hover:via-black/20 group-hover:to-black/5 transition-all duration-300" />
                
                {/* Stock Badge */}
                {product.inStock ? (
                  <div className="absolute top-4 left-4 liquid-glass-button bg-green-500/30 text-white px-3 py-1 rounded-full text-xs font-semibold border-green-500/50">
                    {t("shop.inStock")}
                  </div>
                ) : (
                  <div className="absolute top-4 left-4 liquid-glass-button bg-red-500/30 text-white px-3 py-1 rounded-full text-xs font-semibold border-red-500/50">
                    {t("shop.outOfStock")}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-5 relative">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-white transition-colors" style={{ fontFamily: "var(--font-playfair)" }}>
                  {product.name}
                </h3>
                <p className="text-gray-400 text-sm mb-3 group-hover:text-gray-300 transition-colors">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">
                    {formatPrice(product.price)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                      product.inStock
                        ? "liquid-glass-button text-white"
                        : "bg-gray-700/50 text-gray-400 cursor-not-allowed opacity-50"
                    }`}
                    style={{ fontFamily: "var(--font-roboto)" }}
                  >
                    {t("shop.addToCart")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-400">{t("shop.noProducts")}</p>
          </div>
        )}
      </div>

      {/* Modal pentru produs selectat */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-6 overflow-y-auto animate-fade-in"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="max-w-2xl w-full liquid-glass-strong rounded-2xl overflow-hidden my-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-square">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                {selectedProduct.name}
              </h2>
              <p className="text-gray-300 mb-4">{selectedProduct.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-white">
                  {formatPrice(selectedProduct.price)}
                </span>
                <button
                  onClick={() => {
                    handleAddToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  disabled={!selectedProduct.inStock}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    selectedProduct.inStock
                      ? "liquid-glass-button text-white"
                      : "bg-gray-700/50 text-gray-400 cursor-not-allowed opacity-50"
                  }`}
                  style={{ fontFamily: "var(--font-roboto)" }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

