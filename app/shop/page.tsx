"use client";

import { useState, useEffect } from "react";
import { Typewriter } from "react-simple-typewriter";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";

// Tipuri de produse pentru filtrare
type ProductCategory = "all" | "physical" | "digital";

interface Product {
  id: number;
  name: string;
  category: ProductCategory;
  image: string;
  price: number; // Prețul actual (după reducere)
  originalPrice?: number; // Prețul inițial (înainte de reducere)
  discountPercentage?: number; // Procentul de reducere
  description: string;
  inStock: boolean;
  downloadUrl?: string; // Link de download pentru produsele digitale
}

// Produse digitale - LUTs, Wallpapers, Sound Design
const products: Product[] = [
  {
    id: 1,
    name: "Cinematic Video LUTs",
    category: "digital",
    image: "/assets/shop/CINEMATICLUT.jpg",
    price: 99.99,
    originalPrice: 124.99,
    discountPercentage: 20,
    description: "The Cinematic LUT pack is is a carefully crafted collection of cinematic color presets designed to give your footage an instantly polished and emotional visual tone. Inspired by the rich aesthetics of analog film, these LUTs are ideal for filmmakers, content creators, and editors who want to add style, depth, and mood to their visuals with just a few clicks. Whether you're working on music videos, short films, branded content, or reels—these LUTs bring your footage to life perfectly if you follow the Golden Rule.",
    inStock: true,
    downloadUrl: "https://drive.google.com/drive/folders/YOUR_CINEMATIC_LUT_FOLDER_ID",
  },
  {
    id: 2,
    name: "Movie LUTs",
    category: "digital",
    image: "/assets/shop/MOVIELUT.jpg",
    price: 124.99,
    originalPrice: 159.99,
    discountPercentage: 22,
    description: "The Movie Looks LUT pack is your ticket to the big screen. Inspired by the color palettes of iconic modern cinema, these presets are designed to give your footage that distinct \"Blockbuster\" atmosphere. From the gritty greens of sci-fi thrillers to the rich teal-and-orange of action movies, this collection allows you to tell a stronger visual story. Whether you are grading a narrative short, a music video, or a dramatic sequence, these LUTs provide the heavy-hitting, stylized look of a high-budget production if you follow the Golden Rule.",
    inStock: true,
    downloadUrl: "https://drive.google.com/drive/folders/YOUR_MOVIE_LUT_FOLDER_ID",
  },
  {
    id: 3,
    name: "Film LUTs",
    category: "digital",
    image: "/assets/shop/FILMLUT.jpg",
    price: 99.99,
    originalPrice: 129.99,
    discountPercentage: 23,
    description: "The Film Looks LUT pack is a tribute to the golden age of analog cinema. Designed to break the \"digital sharpness\" of modern cameras, these presets infuse your footage with organic texture, rich skin tones, and the timeless character of celluloid. Inspired by classic Kodak and Fujifilm stocks, these LUTs are perfect for storytellers who want to evoke nostalgia. Whether you are creating a documentary, a music video, or a moody travel piece, this collection brings the soul of 35mm film to your digital timeline perfectly if you follow the Golden Rule.",
    inStock: true,
    downloadUrl: "https://drive.google.com/drive/folders/YOUR_FILM_LUT_FOLDER_ID",
  },
  {
    id: 4,
    name: "Vintage LUTs",
    category: "digital",
    image: "/assets/shop/VINTAGELUT.jpg",
    price: 99.99,
    originalPrice: 134.99,
    discountPercentage: 26,
    description: "The Vintage Film LUT pack is your time machine. Designed to replicate the charm and imperfections of old home movies, these presets bring the nostalgic aesthetic of Super 8 and 16mm film straight to your digital footage. Perfect for travel memories, music videos, or dreamlike sequences, this collection embraces faded shadows, warm highlights, and that distinct \"retro\" vibe that makes footage feel timeless and personal if you follow the Golden Rule.",
    inStock: true,
    downloadUrl: "https://drive.google.com/drive/folders/YOUR_VINTAGE_LUT_FOLDER_ID",
  },
  {
    id: 5,
    name: "iPhone Video LUTs",
    category: "digital",
    image: "/assets/shop/IPHONE.jpg",
    price: 99.99,
    originalPrice: 139.99,
    discountPercentage: 29,
    description: "Specialized LUTs optimized for iPhone footage. Enhance your mobile videos with professional color grading designed specifically for iPhone cameras.",
    inStock: true,
    downloadUrl: "https://drive.google.com/drive/folders/YOUR_IPHONE_LUT_FOLDER_ID",
  },
  {
    id: 6,
    name: "Sound Design Pack",
    category: "digital",
    image: "/assets/shop/SOUNDDESIGN.jpg",
    price: 99.99,
    originalPrice: 149.99,
    discountPercentage: 33,
    description: "Professional sound design library featuring cinematic sound effects, ambient textures, and audio elements perfect for video production and filmmaking.",
    inStock: true,
    downloadUrl: "https://drive.google.com/drive/folders/YOUR_SOUND_DESIGN_FOLDER_ID",
  },
  {
    id: 7,
    name: "Majestic Wallpaper Pack",
    category: "digital",
    image: "/assets/shop/Wallpaper.jpg",
    price: 49.99,
    originalPrice: 64.99,
    discountPercentage: 23,
    description: "A stunning collection of majestic wallpapers featuring breathtaking aerial landscapes and cinematic scenes. Perfect for desktop, mobile, and tablet backgrounds.",
    inStock: true,
    downloadUrl: "https://drive.google.com/drive/folders/YOUR_WALLPAPER_PACK_FOLDER_ID",
  },
  {
    id: 8,
    name: "Signature Bundle",
    category: "digital",
    image: "/assets/shop/SIGNATURE.jpg",
    price: 399.99,
    originalPrice: undefined,
    discountPercentage: undefined,
    description: "Unlock your full potential. The Signature Bundle is the definitive all-in-one toolkit for modern filmmakers, photographers, and content creators. We have combined our entire library into one powerful collection, giving you every asset you need to take your storytelling from \"average\" to \"cinematic mastery.\" Whether you are color grading a documentary, editing a high-energy Reel, or designing the soundscape for a short film, this bundle is your unfair advantage.",
    inStock: true,
    downloadUrl: "https://drive.google.com/drive/folders/YOUR_SIGNATURE_BUNDLE_FOLDER_ID",
  },
];

export default function Shop() {
  const { t, language } = useLanguage();
  const { formatPrice } = useCurrency();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showNewsletterPopup, setShowNewsletterPopup] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const { addToCart } = useCart();

  // Update page title when language changes
  useEffect(() => {
    document.title = `${t("shop.title")} - Zoomout_crew`;
  }, [language, t]);

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

  const animateToCart = (buttonElement: HTMLElement) => {
    // Găsește card-ul de produs (părintele care conține butonul)
    const productCard = buttonElement.closest('.group.relative') as HTMLElement;
    if (!productCard) return;

    // Găsește poziția card-ului (getBoundingClientRect este relativ la viewport, perfect pentru fixed)
    const cardRect = productCard.getBoundingClientRect();
    const startX = cardRect.left;
    const startY = cardRect.top;
    const cardWidth = cardRect.width;
    const cardHeight = cardRect.height;

    // Găsește iconița coșului din header (găsește butonul vizibil)
    const allCartButtons = document.querySelectorAll('button[aria-label="Open shopping cart"]') as NodeListOf<HTMLElement>;
    let cartIcon: HTMLElement | null = null;
    
    // Găsește butonul care este vizibil în viewport
    for (const btn of Array.from(allCartButtons)) {
      const rect = btn.getBoundingClientRect();
      const isVisible = rect.width > 0 && rect.height > 0 && 
                       rect.top >= 0 && rect.left >= 0 &&
                       rect.bottom <= window.innerHeight && 
                       rect.right <= window.innerWidth;
      
      // Verifică și dacă elementul nu este ascuns prin CSS
      const style = window.getComputedStyle(btn);
      const isNotHidden = style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
      
      if (isVisible && isNotHidden) {
        cartIcon = btn;
        break;
      }
    }
    
    // Dacă nu găsește unul vizibil, folosește primul disponibil
    if (!cartIcon && allCartButtons.length > 0) {
      cartIcon = allCartButtons[0];
    }
    
    if (!cartIcon) return;

    const cartRect = cartIcon.getBoundingClientRect();
    const endX = cartRect.left + cartRect.width / 2;
    const endY = cartRect.top + cartRect.height / 2;

    // Creează o copie a card-ului de produs
    const flyingCard = productCard.cloneNode(true) as HTMLElement;
    
    // Setează stilurile pentru animație
    flyingCard.style.cssText = `
      position: fixed;
      left: ${startX}px;
      top: ${startY}px;
      width: ${cardWidth}px;
      height: ${cardHeight}px;
      pointer-events: none;
      z-index: 9999;
      opacity: 0.95;
      transform-origin: center center;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    `;

    // Elimină event listeners și butoanele din copie
    const buttons = flyingCard.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.style.pointerEvents = 'none';
      btn.style.opacity = '0.8';
    });

    // Adaugă card-ul zburător în body
    document.body.appendChild(flyingCard);

    // Face card-ul original invizibil temporar
    productCard.style.opacity = '0.3';
    productCard.style.transition = 'opacity 0.3s';

    // Forțează reflow pentru a începe animația
    flyingCard.offsetHeight;

    // Calculează distanța
    const deltaX = endX - (startX + cardWidth / 2);
    const deltaY = endY - (startY + cardHeight / 2);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const duration = Math.min(1000, distance * 1.2); // Durată bazată pe distanță, max 1000ms

    // Aplică animația
    flyingCard.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity ${duration}ms ease-out`;
    flyingCard.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.2)`;
    flyingCard.style.opacity = '0';

    // Restaurează opacitatea card-ului original și șterge elementul după animație
    setTimeout(() => {
      productCard.style.opacity = '1';
      if (flyingCard.parentNode) {
        flyingCard.parentNode.removeChild(flyingCard);
      }
    }, duration);
  };

  const handleAddToCart = (product: Product, event?: React.MouseEvent<HTMLButtonElement>) => {
    // Animație dacă există event (butonul a fost apăsat)
    if (event && event.currentTarget) {
      animateToCart(event.currentTarget);
    }
    
    // Adaugă produsul în coș după un mic delay pentru a sincroniza cu animația
    setTimeout(() => {
      addToCart(product);
    }, 50);
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
              key={language}
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
              onClick={() => setSelectedProduct(product)}
              className="group relative overflow-visible rounded-xl sm:rounded-2xl liquid-glass liquid-glass-hover backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 cursor-pointer"
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
                
                {/* Discount Badge */}
                {product.discountPercentage && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 liquid-glass-button bg-red-500/30 text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold border-red-500/50 z-10">
                    -{product.discountPercentage}%
                  </div>
                )}
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
                  <div className="flex flex-col items-start">
                    {product.originalPrice && (
                      <span className="text-[10px] sm:text-xs text-gray-500 line-through mb-0.5">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg md:text-xl font-bold text-white">
                        {formatPrice(product.price)}
                      </span>
                      {product.discountPercentage && (
                        <span className="text-[10px] sm:text-xs font-semibold text-green-400 bg-green-500/20 px-1.5 py-0.5 rounded">
                          -{product.discountPercentage}%
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product, e);
                    }}
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
            <div className="flex-shrink-0 bg-black overflow-hidden">
              <div className="relative w-full bg-black overflow-hidden flex items-center justify-center h-[45vh] md:h-[50vh]">
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 50vw"
                  className="object-contain"
                />
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white rounded-full p-2.5 transition-colors z-10 backdrop-blur-sm"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-5 md:p-6 lg:p-8 overflow-y-auto flex-1">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                {selectedProduct.name}
              </h2>
              <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 leading-relaxed">{selectedProduct.description}</p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex flex-col items-start">
                  {selectedProduct.originalPrice && (
                    <span className="text-base sm:text-lg md:text-xl text-gray-500 line-through mb-1">
                      {formatPrice(selectedProduct.originalPrice)}
                    </span>
                  )}
                  <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                      {formatPrice(selectedProduct.price)}
                    </span>
                    {selectedProduct.discountPercentage && (
                      <span className="text-sm sm:text-base font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded">
                        -{selectedProduct.discountPercentage}%
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    handleAddToCart(selectedProduct, e);
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
