"use client";

import { useState, useEffect } from "react";
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
  const [showNewsletterPopup, setShowNewsletterPopup] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const { addToCart } = useCart();

  // Verifică dacă popup-ul a fost deja afișat
  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("newsletter_popup_seen");
    if (!hasSeenPopup) {
      // Afișează popup după 1 secundă
      const timer = setTimeout(() => {
        setShowNewsletterPopup(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNewsletterClose = () => {
    setShowNewsletterPopup(false);
    localStorage.setItem("newsletter_popup_seen", "true");
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Curăță și validează email-ul
    const cleanedEmail = newsletterEmail.trim().toLowerCase();
    
    if (!cleanedEmail || !cleanedEmail.includes("@") || !cleanedEmail.includes(".")) {
      setNewsletterStatus("error");
      return;
    }

    setNewsletterStatus("sending");
    console.log("📧 Submitting newsletter subscription for:", cleanedEmail);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email: cleanedEmail }),
      });

      // Verifică dacă răspunsul este JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("❌ Non-JSON response:", text);
        setNewsletterStatus("error");
        return;
      }

      const data = await response.json();
      console.log("📬 Newsletter API response:", data);

      if (response.ok && data.success) {
        console.log("✅ Newsletter subscription successful");
        setNewsletterStatus("success");
        setTimeout(() => {
          handleNewsletterClose();
        }, 2000);
      } else {
        console.error("❌ Newsletter subscription error:", data.error || data);
        console.error("Response status:", response.status);
        setNewsletterStatus("error");
      }
    } catch (error: any) {
      console.error("❌ Newsletter subscription network error:", error);
      console.error("Error details:", error.message, error.stack);
      setNewsletterStatus("error");
    }
  };

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
          src="/assets/backgrounds/2.jpg"
          alt="Shop background"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12 pt-4 sm:pt-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-2 sm:mb-3 md:mb-4 px-2" style={{ fontFamily: "var(--font-playfair)" }}>
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
          <p className="text-gray-300 text-xs sm:text-sm md:text-base lg:text-lg px-2 sm:px-4 max-w-2xl mx-auto">
            {t("shop.subtitle")}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-12 px-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value as ProductCategory)}
              className={`px-4 py-2 sm:px-5 sm:py-2 md:px-6 md:py-2.5 rounded-xl font-semibold transition-all duration-300 text-xs sm:text-sm md:text-base ${
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-8 sm:mb-12 px-2 sm:px-0">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-visible rounded-xl sm:rounded-2xl liquid-glass liquid-glass-hover transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20"
            >
              {/* Product Image */}
              <div className="aspect-square relative overflow-hidden rounded-t-xl sm:rounded-t-2xl">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10 group-hover:from-black/40 group-hover:via-black/20 group-hover:to-black/5 transition-all duration-300" />
                
                {/* Stock Badge */}
                {product.inStock ? (
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 liquid-glass-button bg-green-500/30 text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold border-green-500/50">
                    {t("shop.inStock")}
                  </div>
                ) : (
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 liquid-glass-button bg-red-500/30 text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold border-red-500/50">
                    {t("shop.outOfStock")}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3 sm:p-4 md:p-5 relative">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-1 sm:mb-1.5 group-hover:text-white transition-colors" style={{ fontFamily: "var(--font-playfair)" }}>
                  {product.name}
                </h3>
                <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm mb-2 sm:mb-3 group-hover:text-gray-300 transition-colors line-clamp-2">{product.description}</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                  <span className="text-base sm:text-lg md:text-xl font-bold text-white">
                    {formatPrice(product.price)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                    className={`w-full sm:w-auto px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 text-[10px] sm:text-xs md:text-sm ${
                      product.inStock
                        ? "liquid-glass-button text-white hover:scale-105"
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
          <div className="text-center py-12 sm:py-16 md:py-20">
            <p className="text-lg sm:text-xl md:text-2xl text-gray-400">{t("shop.noProducts")}</p>
          </div>
        )}
      </div>

      {/* Newsletter Popup */}
      {showNewsletterPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-6 animate-fade-in">
          <div
            className="max-w-md w-full liquid-glass-strong rounded-2xl overflow-hidden relative mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleNewsletterClose}
              className="absolute top-3 right-3 md:top-4 md:right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors z-10"
              aria-label="Close newsletter popup"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="p-6 md:p-8 text-center">
              <div className="mb-5 md:mb-6">
                <svg
                  className="w-12 h-12 md:w-16 md:h-16 mx-auto text-white mb-3 md:mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <h2
                  className="text-2xl md:text-3xl font-bold mb-2 md:mb-3 text-white"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Subscribe to Our Newsletter
                </h2>
                <p className="text-gray-300 text-xs md:text-sm px-2">
                  Stay updated with our latest products, exclusive offers, and aerial photography tips!
                </p>
              </div>

              {newsletterStatus === "success" ? (
                <div className="py-6 md:py-8">
                  <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-7 h-7 md:w-8 md:h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-green-400 font-semibold text-sm md:text-base">Thank you for subscribing!</p>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-3 md:space-y-4">
                  <div>
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      onBlur={(e) => setNewsletterEmail(e.target.value.trim())}
                      placeholder="Enter your email address"
                      required
                      autoComplete="email"
                      inputMode="email"
                      className="w-full px-4 py-2.5 md:py-3 rounded-xl liquid-glass-input text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 text-sm md:text-base"
                      disabled={newsletterStatus === "sending"}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={newsletterStatus === "sending" || !newsletterEmail.trim()}
                    className="w-full liquid-glass-button text-white py-2.5 md:py-3 rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                  >
                    {newsletterStatus === "sending" ? "Subscribing..." : "Subscribe"}
                  </button>
                  {newsletterStatus === "error" && (
                    <p className="text-red-400 text-xs md:text-sm">Something went wrong. Please try again.</p>
                  )}
                </form>
              )}

              <button
                onClick={handleNewsletterClose}
                className="mt-3 md:mt-4 text-gray-400 hover:text-white text-xs md:text-sm transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal pentru produs selectat */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/95 backdrop-blur-sm p-0 md:p-4 lg:p-6 overflow-y-auto animate-fade-in"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="max-w-2xl lg:max-w-3xl w-full liquid-glass-strong rounded-none md:rounded-2xl overflow-hidden my-0 md:my-4 min-h-screen md:min-h-0 max-h-screen md:max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-square max-h-[40vh] sm:max-h-[50vh] md:max-h-none md:aspect-video flex-shrink-0">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 50vw"
                className="object-cover"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors z-10"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 sm:p-5 md:p-6 lg:p-8 overflow-y-auto flex-1">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                {selectedProduct.name}
              </h2>
              <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 leading-relaxed">{selectedProduct.description}</p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                  {formatPrice(selectedProduct.price)}
                </span>
                <button
                  onClick={() => {
                    handleAddToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  disabled={!selectedProduct.inStock}
                  className={`w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base md:text-lg ${
                    selectedProduct.inStock
                      ? "liquid-glass-button text-white hover:scale-105"
                      : "bg-gray-700/50 text-gray-400 cursor-not-allowed opacity-50"
                  }`}
                  style={{ fontFamily: "var(--font-roboto)" }}
                >
                  {t("shop.addToCart")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
