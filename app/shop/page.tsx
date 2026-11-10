"use client";

import { useState, useEffect } from "react";
import { Typewriter } from "react-simple-typewriter";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import ImageSkeleton from "@/components/ImageSkeleton";

// Tipuri de produse pentru filtrare
type ProductCategory = "all" | "luts" | "lightroom-presets" | "sound-design" | "transitions" | "bundle" | "other";

interface Product {
  id: number;
  name: string;
  category: ProductCategory;
  image: string;
  price: number; // Prețul actual (după reducere)
  originalPrice?: number; // Prețul inițial (înainte de reducere)
  discountPercentage?: number; // Procentul de reducere
  description: string;
  descriptionRo?: string; // Descriere în română (opțional)
  inStock: boolean;
  downloadUrl?: string; // Link de download pentru produsele digitale
}

// Produse digitale - LUTs, Wallpapers, Sound Design
const baseProducts: Product[] = [
  {
    id: 1,
    name: "Cinematic Video LUTs",
    category: "luts",
    image: "/assets/shop/cinematic fin.jpg",
    price: 99.99,
    originalPrice: 124.98,
    discountPercentage: 20,
    description: "The Cinematic LUT pack is a carefully crafted collection of cinematic color presets designed to give your footage an instantly polished and emotional visual tone. Inspired by the rich aesthetics of analog film, these LUTs are ideal for filmmakers, content creators, and editors who want to add style, depth, and mood to their visuals with just a few clicks. Whether you're working on music videos, short films, branded content, or reels—these LUTs bring your footage to life perfectly.\n\n📦 What's Included:\n\n• 10 Professional Cinematic LUTs (.cube format)\n• Mist Powergrade for DaVinci Resolve",
    descriptionRo: "Pachetul Cinematic LUTs este o colecție atent realizată de preseturi de culoare cinematice, concepute pentru a oferi materialelor tale un ton vizual instantaneu polizat și emoțional. Inspirate de estetica bogată a filmului analog, aceste LUT-uri sunt ideale pentru regizori, creatori de conținut și editori care doresc să adauge stil, profunzime și atmosferă vizualelor lor cu doar câteva click-uri. Fie că lucrezi la videoclipuri muzicale, scurtmetraje, conținut de brand sau reels—aceste LUT-uri aduc materialele tale la viață perfect.\n\n📦 Ce este inclus:\n\n• 10 LUT-uri Cinematic profesionale (format .cube)\n• Mist Powergrade pentru DaVinci Resolve",
    inStock: true,
    downloadUrl: "https://drive.google.com/drive/folders/1rMMYI6uDFgkiZSLB-QXb5L_TIGg15rkR?usp=sharing",
  },
  {
    id: 2,
    name: "Movie Looks LUTs",
    category: "luts",
    image: "/assets/shop/MOVIE LOOKS.jpg",
    price: 124.99,
    originalPrice: 159.98,
    discountPercentage: 22,
    description: "The Movie Looks LUT pack is your ticket to the big screen. Inspired by the color palettes of iconic modern cinema, these presets are designed to give your footage that distinct \"Blockbuster\" atmosphere. From the gritty greens of sci-fi thrillers to the rich teal-and-orange of action movies, this collection allows you to tell a stronger visual story. Whether you are grading a narrative short, a music video, or a dramatic sequence, these LUTs provide the heavy-hitting, stylized look of a high-budget production.\n\n📦 What's Included:\n\n• 20 Professional Movie LUTs (.cube format)\n• Mist Powergrade for DaVinci Resolve",
    descriptionRo: "Pachetul Movie Looks LUTs este biletul tău către marele ecran. Inspirat de paletele de culori ale cinematografiei moderne iconice, aceste preseturi sunt concepute pentru a oferi materialelor tale acea atmosferă distinctă \"Blockbuster\". De la verzile aspre ale thrillerelor SF până la teal-ul și portocaliul bogat al filmelor de acțiune, această colecție îți permite să spui o poveste vizuală mai puternică. Fie că faci color grading pentru un scurtmetraj narativ, un videoclip muzical sau o secvență dramatică, aceste LUT-uri oferă aspectul stilizat și puternic al unei producții cu buget mare.\n\n📦 Ce este inclus:\n\n• 20 LUT-uri Movie profesionale (format .cube)\n• Mist Powergrade pentru DaVinci Resolve",
    inStock: true,
    downloadUrl: "https://drive.google.com/drive/folders/1P0DGPEVJWIaBAxoYvUQYSpWzni7OfBe-?usp=sharing",
  },
  {
    id: 3,
    name: "Film LUTs",
    category: "luts",
    image: "/assets/shop/FILM EMULATION LUTS.jpg",
    price: 99.99,
    originalPrice: 129.98,
    discountPercentage: 23,
    description: "The Film LUT pack is a tribute to the golden age of analog cinema. Designed to break the \"digital sharpness\" of modern cameras, these presets infuse your footage with organic texture, rich skin tones, and the timeless character of celluloid. Inspired by classic Kodak and Fujifilm stocks, these LUTs are perfect for storytellers who want to evoke nostalgia. Whether you are creating a documentary, a music video, or a moody travel piece, this collection brings the soul of 35mm film to your digital timeline perfectly.\n\n📦 What's Included:\n\n• 10 Professional Film LUTs (.cube format)\n• Mist Powergrade for DaVinci Resolve",
    descriptionRo: "Pachetul Film LUTs este un omagiu adus epocii de aur a cinematografiei analoge. Conceput pentru a sparge \"claritatea digitală\" a camerelor moderne, aceste preseturi îmbogățesc materialele tale cu textură organică, tonuri de piele bogate și caracterul atemporal al celuloidului. Inspirate de stock-urile clasice Kodak și Fujifilm, aceste LUT-uri sunt perfecte pentru povestitori care doresc să evoce nostalgia. Fie că creezi un documentar, un videoclip muzical sau o piesă de călătorie cu atmosferă, această colecție aduce sufletul filmului de 35mm pe timeline-ul tău digital perfect.\n\n📦 Ce este inclus:\n\n• 10 LUT-uri Film profesionale (format .cube)\n• Mist Powergrade pentru DaVinci Resolve",
    inStock: true,
    downloadUrl: "https://drive.google.com/drive/folders/1pe_0pkGAOpMPiPGCgCJX9NEjjQBNxPN1?usp=sharing",
  },
  {
    id: 4,
    name: "Vintage Film LUTs",
    category: "luts",
    image: "/assets/shop/VINTAGE FILM.jpg",
    price: 99.99,
    originalPrice: 134.98,
    discountPercentage: 26,
    description: "The Vintage Film LUT pack is your time machine. Designed to replicate the charm and imperfections of old home movies, these presets bring the nostalgic aesthetic of Super 8 and 16mm film straight to your digital footage. Perfect for travel memories, music videos, or dreamlike sequences, this collection embraces faded shadows, warm highlights, and that distinct \"retro\" vibe that makes footage feel timeless and personal.\n\n📦 What's Included:\n\n• 14 Professional Vintage Film LUTs (.cube format)\n• Mist Powergrade for DaVinci Resolve",
    descriptionRo: "Pachetul Vintage Film LUTs este mașina ta de timp. Conceput pentru a replica farmecul și imperfecțiunile filmelor de casă vechi, aceste preseturi aduc estetica nostalgică a filmului Super 8 și 16mm direct pe materialele tale digitale. Perfect pentru amintiri de călătorie, videoclipuri muzicale sau secvențe onirice, această colecție îmbrățișează umbrele estompate, highlight-urile calde și acel vibe distinct \"retro\" care face materialele să pară atemporale și personale.\n\n📦 Ce este inclus:\n\n• 14 LUT-uri Vintage Film profesionale (format .cube)\n• Mist Powergrade pentru DaVinci Resolve",
    inStock: true,
    downloadUrl: "https://drive.google.com/drive/folders/1a3prlQ-ajT_pFmsnJ9IeMWGJ23ERTvYE?usp=sharing",
  },
  {
    id: 5,
    name: "Iphone Looks LUTs",
    category: "luts",
    image: "/assets/shop/IPHONE.jpg",
    price: 99.99,
    originalPrice: 139.98,
    discountPercentage: 29,
    description: "The iPhone Looks LUT pack is designed to turn your smartphone footage into high-quality content that stops the scroll. Optimized specifically for mobile sensors, these presets tame the harsh \"digital sharpness\" of modern phones and deliver a cohesive, professional aesthetic. Whether you are shooting Reels, TikToks, daily vlogs, or travel memories on the go, this collection ensures your mobile clips look cinematic and professional, matching the quality of a dedicated camera.\n\n📦 What's Included:\n\n• 10 Professional iPhone LUTs (.cube format)\n• Mist Powergrade for DaVinci Resolve",
    descriptionRo: "Pachetul iPhone Looks LUTs este conceput pentru a transforma materialele tale de pe smartphone în conținut de înaltă calitate care oprește scroll-ul. Optimizate specific pentru senzorii mobili, aceste preseturi domolesc \"claritatea digitală\" dură a telefoanelor moderne și oferă o estetică coezivă și profesională. Fie că filmezi Reels, TikToks, vlog-uri zilnice sau amintiri de călătorie în mișcare, această colecție asigură că clipurile tale mobile arată cinematice și profesionale, echivalând calitatea unei camere dedicate.\n\n📦 Ce este inclus:\n\n• 10 LUT-uri iPhone profesionale (format .cube)\n• Mist Powergrade pentru DaVinci Resolve",
    inStock: true,
    downloadUrl: "https://drive.google.com/drive/folders/1-hNQNjNiYMRCgf-WIe-C36b7SU5y8o8v?usp=sharing",
  },
  {
    id: 6,
    name: "Sound Design Pack",
    category: "sound-design",
    image: "/assets/shop/SOUND DESIGN.jpg",
    price: 99.99,
    originalPrice: 149.98,
    discountPercentage: 33,
    description: "Professional sound design library featuring cinematic sound effects, ambient textures, and audio elements perfect for video production and filmmaking.\n\n📦 What's Included:\n\n• Air Sound Effects\n• Ambience Sound Effects\n• Campaign Sound Effects\n• City Sound Effects\n• Film Burn Sound Effects\n• Flash Sound Effects\n• Forest Sound Effects\n• Glitches Sound Effects\n• Impacts Sound Effects\n• Reverse Sound Effects\n• Scratch Sound Effects\n• Swoosh Sound Effects\n• Woosh Sound Effects\n\nTotal: 134 High-Quality Sound Effects (WAV format)",
    descriptionRo: "Bibliotecă profesională de sound design cu efecte sonore cinematice, texturi ambientale și elemente audio perfecte pentru producție video și filmmaking.\n\n📦 Ce este inclus:\n\n• Efecte sonore Air\n• Efecte sonore Ambience\n• Efecte sonore Campaign\n• Efecte sonore City\n• Efecte sonore Film Burn\n• Efecte sonore Flash\n• Efecte sonore Forest\n• Efecte sonore Glitches\n• Efecte sonore Impacts\n• Efecte sonore Reverse\n• Efecte sonore Scratch\n• Efecte sonore Swoosh\n• Efecte sonore Woosh\n\nTotal: 134 Efecte sonore de înaltă calitate (format WAV)",
    inStock: true,
    downloadUrl: "https://drive.google.com/drive/folders/1Xi393MvpvojRydJCkJa4zRfAQqYIWJA8?usp=sharing",
  },
  {
    id: 7,
    name: "Majestic Wallpaper Pack",
    category: "other",
    image: "/assets/shop/MAJESTIC.jpg",
    price: 49.99,
    originalPrice: 64.98,
    discountPercentage: 23,
    description: "A stunning collection of majestic wallpapers featuring breathtaking aerial landscapes and cinematic scenes captured from 3 continents. Perfect for desktop, mobile, and tablet backgrounds.\n\n📦 What's Included:\n\n• High-resolution Desktop Wallpapers\n• High-resolution Mobile Wallpapers\n• High-resolution Tablet Wallpapers\n\nTotal: 33 high-resolution wallpapers from 3 continents in multiple formats, optimized for desktop, mobile, and tablet displays",
    descriptionRo: "O colecție uluitoare de wallpaper-uri majestuoase cu peisaje aeriene uimitoare și scene cinematice capturate de pe 3 continente. Perfecte pentru fundaluri desktop, mobile și tabletă.\n\n📦 Ce este inclus:\n\n• Wallpaper-uri Desktop de înaltă rezoluție\n• Wallpaper-uri Mobile de înaltă rezoluție\n• Wallpaper-uri Tabletă de înaltă rezoluție\n\nTotal: 33 wallpaper-uri de înaltă rezoluție de pe 3 continente în multiple formate, optimizate pentru display-uri desktop, mobile și tabletă",
    inStock: true,
    downloadUrl: "https://drive.google.com/drive/folders/1Rfhm2tdrw2_AEX9nn4FBGYOpHje5ns2Z?usp=sharing",
  },
  {
    id: 8,
    name: "Lightroom Photo Presets",
    category: "lightroom-presets",
    image: "/assets/shop/LIGHTROOM.jpg",
    price: 99.99,
    originalPrice: 124.98,
    discountPercentage: 20,
    description: "The Lightroom Presets Bundle is a masterfully curated collection of professional photo presets designed to give your images an instantly polished and distinct visual identity. Inspired by the diverse aesthetics of modern photography and vintage cinema, this all-in-one toolkit is ideal for photographers, influencers, and content creators who need versatility without compromising on quality.\n\nWhether you're capturing moody urban shots, timeless portraits, nostalgic moments, or daily social media updates—this collection ensures you always have the perfect grade to bring your vision to life with just a few clicks.\n\n📦 What's Included:\n\n• 10 Black Looks Presets (Dark & Moody aesthetics)\n• 10 Cinematic Looks Presets (Film-inspired tones)\n• 10 Classic Looks Presets (Clean, timeless style)\n• 10 iPhone Looks Presets (Optimized for mobile photography)\n• 10 Retro Looks Presets (Vintage & Nostalgic vibes)\n• Mist Effect\n\nTotal: 50 Professional Presets (.XMP & .DNG format for Desktop & Mobile) + Mist Effect",
    descriptionRo: "Bundle-ul Lightroom Presets este o colecție atent curată de preseturi foto profesionale, concepute pentru a oferi imaginilor tale o identitate vizuală instantaneu polizată și distinctă. Inspirat de estetica diversă a fotografiei moderne și a cinematografiei vintage, acest toolkit all-in-one este ideal pentru fotografi, influențatori și creatori de conținut care au nevoie de versatilitate fără a compromite calitatea.\n\nFie că capturezi cadre urbane cu atmosferă, portrete atemporale, momente nostalgice sau actualizări zilnice pe social media—această colecție asigură că ai întotdeauna gradul perfect pentru a-ți aduce viziunea la viață cu doar câteva click-uri.\n\n📦 Ce este inclus:\n\n• 10 Preseturi Black Looks (Estetică Dark & Moody)\n• 10 Preseturi Cinematic Looks (Tonuri inspirate din film)\n• 10 Preseturi Classic Looks (Stil curat, atemporal)\n• 10 Preseturi iPhone Looks (Optimizate pentru fotografie mobilă)\n• 10 Preseturi Retro Looks (Vibe-uri Vintage & Nostalgice)\n• Efect Mist\n\nTotal: 50 Preseturi profesionale (format .XMP & .DNG pentru Desktop & Mobile) + Efect Mist",
    inStock: true,
    downloadUrl: "https://drive.google.com/drive/folders/1qRS_o8Z2JbR1VR7sEz4EAcnRv-IV-6n6?usp=sharing",
  },
  {
    id: 9,
    name: "Transitions & Burns Pack",
    category: "transitions",
    image: "/assets/shop/TRANSITION.jpg",
    price: 79.99,
    originalPrice: 124.98,
    discountPercentage: 36,
    description: "The Transitions & Burns pack by Dopamine is crafted to bring raw, analog-style energy to your edits. Inspired by real film burns, light leaks, and in-camera transitions, this pack adds warmth, texture, and movement to your footage—perfect for music videos, reels, fashion films, or any project that needs that organic, imperfect feel. Whether you're aiming for subtle vintage motion or explosive transitions, these overlays offer you endless creative possibilities.\n\n📦 What's Included:\n\n• 50 Video Film Burn Overlays\n• 64 Static Film Burn Overlays\n\nTotal: 114 Professional Film Burn & Transition Overlays",
    descriptionRo: "Pachetul Transitions & Burns de la Dopamine este creat pentru a aduce energie brută, în stil analog, editărilor tale. Inspirat de arderile reale de film, scurgerile de lumină și tranzițiile în cameră, acest pachet adaugă căldură, textură și mișcare materialelor tale—perfect pentru videoclipuri muzicale, reels, filme de modă sau orice proiect care are nevoie de acel sentiment organic, imperfect. Fie că vizezi mișcare vintage subtilă sau tranziții explozive, aceste overlay-uri îți oferă posibilități creative nelimitate.\n\n📦 Ce este inclus:\n\n• 50 Overlay-uri Video Film Burn\n• 64 Overlay-uri Static Film Burn\n\nTotal: 114 Overlay-uri profesionale Film Burn & Transition",
    inStock: true,
    downloadUrl: "https://drive.google.com/drive/folders/1V3Cheu6wVcLx3_dtm2SB3xFyyV_5M8ha?usp=sharing",
  },
  {
    id: 10,
    name: "Film Mattes and Artifacts Pack",
    category: "other",
    image: "/assets/shop/Film mattes.jpg",
    price: 89.99,
    originalPrice: 129.98,
    discountPercentage: 31,
    description: "The Film Artifacts Pack brings the authentic character of analog cinema to your digital footage. This collection features meticulously crafted film artifacts including scratches, dust particles, grain textures, light leaks, and vintage imperfections that add depth, nostalgia, and cinematic authenticity to your projects. Perfect for filmmakers and content creators who want to break away from the sterile digital look and infuse their work with the organic, imperfect beauty of classic film. Whether you're creating music videos, short films, documentaries, or social media content, these artifacts will transform your footage into something truly timeless.\n\n📦 What's Included:\n\n• Film Scratches & Dust Particles\n• Vintage Grain Textures\n• Light Leaks & Flares\n• Film Burn Effects\n\nTotal: 165 Professional Film Artifact Overlays\n\nCompatible with all major editing software (Premiere Pro, Final Cut Pro, DaVinci Resolve, After Effects)",
    descriptionRo: "Pachetul Film Artifacts aduce caracterul autentic al cinematografiei analoge pe materialele tale digitale. Această colecție include artifacte de film atent realizate, inclusiv zgârieturi, particule de praf, texturi de grain, scurgeri de lumină și imperfecțiuni vintage care adaugă profunzime, nostalgie și autenticitate cinematică proiectelor tale. Perfect pentru regizori și creatori de conținut care doresc să se îndepărteze de aspectul digital steril și să-și insufleze munca cu frumusețea organică, imperfectă a filmului clasic. Fie că creezi videoclipuri muzicale, scurtmetraje, documentare sau conținut pentru social media, aceste artifacte vor transforma materialele tale în ceva cu adevărat atemporal.\n\n📦 Ce este inclus:\n\n• Zgârieturi Film & Particule de Praf\n• Texturi Vintage Grain\n• Scurgeri de Lumină & Flares\n• Efecte Film Burn\n\nTotal: 165 Overlay-uri profesionale Film Artifact\n\nCompatibil cu toate software-urile majore de editare (Premiere Pro, Final Cut Pro, DaVinci Resolve, After Effects)",
    inStock: true,
    downloadUrl: "https://mega.nz/folder/KNtRAKaT#aOLGxvtiIWDozvC7mhCgHw",
  },
  {
    id: 11,
    name: "Signature Bundle",
    category: "bundle",
    image: "/assets/shop/SIGNATURE.jpg",
    price: 394.995,
    originalPrice: 894.995,
    discountPercentage: 20,
    description: "Unlock your full potential. The Signature Bundle is the definitive all-in-one toolkit for modern filmmakers, photographers, and content creators. We have combined our entire library into one powerful collection, giving you every asset you need to take your storytelling from \"average\" to \"cinematic mastery.\" Whether you are color grading a documentary, editing a high-energy Reel, or designing the soundscape for a short film, this bundle is your unfair advantage.\n\n📦 What's Included:\n\n• 64 Professional Video LUTs (Cinematic, Movie, Film, Vintage, iPhone)\n• Mist Powergrade for DaVinci Resolve\n• 134 High-Quality Sound Effects (WAV format)\n• 50 Professional Lightroom Presets\n• 114 Film Burn & Transition Overlays\n• 165 Film Artifact Overlays\n\nTotal: Complete library of all our digital assets in one bundle",
    descriptionRo: "Deblochează-ți potențialul complet. Signature Bundle este toolkit-ul definitiv all-in-one pentru regizori, fotografi și creatori de conținut moderni. Am combinat întreaga noastră bibliotecă într-o colecție puternică, oferindu-ți fiecare asset de care ai nevoie pentru a-ți duce storytelling-ul de la \"mediu\" la \"măiestrie cinematică\". Fie că faci color grading pentru un documentar, editezi un Reel cu energie mare sau creezi soundscape-ul pentru un scurtmetraj, acest bundle este avantajul tău nedrept.\n\n📦 Ce este inclus:\n\n• 64 LUT-uri Video profesionale (Cinematic, Movie, Film, Vintage, iPhone)\n• Mist Powergrade pentru DaVinci Resolve\n• 134 Efecte sonore de înaltă calitate (format WAV)\n• 50 Preseturi Lightroom profesionale\n• 114 Overlay-uri Film Burn & Transition\n• 165 Overlay-uri Film Artifact\n\nTotal: Biblioteca completă a tuturor asset-urilor noastre digitale într-un singur bundle",
    inStock: true,
    downloadUrl: "https://drive.google.com/drive/folders/YOUR_SIGNATURE_BUNDLE_FOLDER_ID",
  },
  {
    id: 12,
    name: "Full Lut Bundle",
    category: "bundle",
    image: "/assets/shop/fulllutfin.jpg",
    price: 299.99,
    originalPrice: 399.98,
    discountPercentage: 25,
    description: "The Full LUT Bundle is the ultimate collection of professional color grading presets. This comprehensive bundle includes all our LUT packs, giving you access to every cinematic look, film emulation, and color style in our library. Perfect for filmmakers, content creators, and editors who want the complete color grading toolkit.\n\n📦 What's Included:\n\n• Cinematic Video LUTs (10 LUTs)\n• Movie Looks LUTs (20 LUTs)\n• Film LUTs (10 LUTs)\n• Vintage Film LUTs (14 LUTs)\n• Iphone Looks LUTs (10 LUTs)\n• Mist Powergrade for DaVinci Resolve\n\nTotal: 64 Professional Video LUTs (.cube format) + Mist Powergrade",
    descriptionRo: "Full LUTs Bundle este colecția ultimă de preseturi profesionale de color grading. Acest bundle cuprinzător include toate pachetele noastre de LUT-uri, oferindu-ți acces la fiecare look cinematic, emulare de film și stil de culoare din biblioteca noastră. Perfect pentru regizori, creatori de conținut și editori care doresc toolkit-ul complet de color grading.\n\n📦 Ce este inclus:\n\n• Cinematic Video LUTs (10 LUT-uri)\n• Movie Looks LUTs (20 LUT-uri)\n• Film LUTs (10 LUT-uri)\n• Vintage Film LUTs (14 LUT-uri)\n• Iphone Looks LUTs (10 LUT-uri)\n• Mist Powergrade pentru DaVinci Resolve\n\nTotal: 64 LUT-uri Video profesionale (format .cube) + Mist Powergrade",
    inStock: true,
    downloadUrl: "https://drive.google.com/drive/folders/1Bf1lBXJ5WbajNTRck2qE6SXESa7hSwq6?usp=sharing",
  },
];

// Dublează toate prețurile (price + originalPrice) pentru toate produsele
const products: Product[] = baseProducts.map((p) => ({
  ...p,
  price: p.price * 2,
  originalPrice: typeof p.originalPrice === "number" ? p.originalPrice * 2 : undefined,
}));

export default function Shop() {
  const { t, language } = useLanguage();
  const { formatPrice } = useCurrency();
  const [promoCopied, setPromoCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showNewsletterPopup, setShowNewsletterPopup] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const { addToCart } = useCart();

  // Update page title when language changes
  useEffect(() => {
    document.title = `${t("shop.title")} - Zoomout_crew`;
  }, [language, t]);

  // Blochează scroll-ul pe pagină când modalul produsului este deschis
  useEffect(() => {
    if (selectedProduct) {
      // Salvează starea curentă și blochează scroll-ul
      document.body.style.overflow = "hidden";
    } else {
      // Restaurează scroll-ul
      document.body.style.overflow = "";
    }

    // Cleanup: restaurează scroll-ul când componenta se demontează
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProduct]);

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

  const handleCopyPromoCode = async () => {
    try {
      await navigator.clipboard.writeText("JOINTHECREW");
      setPromoCopied(true);
      window.setTimeout(() => setPromoCopied(false), 1400);
    } catch {
      // ignore
    }
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
    { value: "luts", label: "LUTs", labelKey: "shop.luts" },
    { value: "lightroom-presets", label: "Lightroom Presets", labelKey: "shop.lightroomPresets" },
    { value: "sound-design", label: "Sound Design", labelKey: "shop.soundDesign" },
    { value: "transitions", label: "Transitions", labelKey: "shop.transitions" },
    { value: "bundle", label: "Bundles", labelKey: "shop.bundle" },
    { value: "other", label: "Other", labelKey: "shop.other" },
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

      {/* Promo sticker (Shop only) - Desktop: positioned absolute, Mobile: above title */}
      <div className="hidden md:block absolute right-4 top-24 mt-2 z-20 max-w-[calc(100vw-2rem)]">
        <button
          type="button"
          onClick={handleCopyPromoCode}
          className="max-w-full liquid-glass-button text-white px-3 py-2 rounded-xl border border-white/15 backdrop-blur-md shadow-xl hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          aria-label="Promo code JOINTHECREW"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm font-semibold" style={{ fontFamily: "var(--font-roboto)" }}>
              {promoCopied ? t("promo.copied") : t("promo.jointhecrew")}
            </span>
            <span className="text-xs font-bold px-2 py-1 rounded-lg bg-white/10 border border-white/15 whitespace-nowrap">
              {t("promo.copy")}
            </span>
          </div>
        </button>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12">
          {/* Promo sticker - Mobile: above title */}
          <div className="md:hidden mb-4 flex justify-center">
            <button
              type="button"
              onClick={handleCopyPromoCode}
              className="w-full max-w-sm liquid-glass-button text-white px-4 py-3 rounded-xl border border-white/15 backdrop-blur-md shadow-xl hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              aria-label="Promo code JOINTHECREW"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-roboto)" }}>
                  {promoCopied ? t("promo.copied") : t("promo.jointhecrew")}
                </span>
                <span className="text-xs font-bold px-2 py-1 rounded-lg bg-white/10 border border-white/15 whitespace-nowrap">
                  JOINTHECREW
                </span>
              </div>
            </button>
          </div>

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
          <p className="text-gray-300 text-base sm:text-lg md:text-xl px-2 sm:px-4 max-w-2xl mx-auto">
            {t("shop.subtitle")}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-12 px-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value as ProductCategory)}
              className={`px-4 py-2 sm:px-5 sm:py-2 md:px-6 md:py-2.5 rounded-xl font-semibold transition-all duration-300 text-xs sm:text-sm md:text-base ${selectedCategory === category.value
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
                {!loadedImages.has(product.id) && (
                  <ImageSkeleton className="absolute inset-0" aspectRatio="square" />
                )}
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className={`object-cover transition-all duration-500 group-hover:scale-110 ${
                    loadedImages.has(product.id) ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setLoadedImages(prev => new Set(prev).add(product.id))}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10 group-hover:from-black/40 group-hover:via-black/20 group-hover:to-black/5 transition-all duration-300" />

                {/* Discount Badge */}
                {product.discountPercentage && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 liquid-glass-button bg-red-500/30 text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold border-red-500/50 z-10">
                    -{product.discountPercentage}%
                  </div>
                )}
                {/* Save Badge for Bundles */}
                {product.category === "bundle" && product.originalPrice && (
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 liquid-glass-button bg-yellow-500/30 text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold border-yellow-500/50">
                    {product.id === 11 
                      ? `${t("shop.save")} ${formatPrice(1000)}` 
                      : product.id === 12 
                      ? `${t("shop.save")} ${formatPrice(450)}` 
                      : `${t("shop.save")} ${formatPrice(product.originalPrice - product.price)}`}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3 sm:p-4 md:p-5 relative">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-1 sm:mb-1.5 group-hover:text-white transition-colors" style={{ fontFamily: "var(--font-playfair)" }}>
                  {product.name}
                </h3>
                <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm mb-2 sm:mb-3 group-hover:text-gray-300 transition-colors line-clamp-2">{language === "ro" && product.descriptionRo ? product.descriptionRo : product.description}</p>
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
                    className={`w-full sm:w-auto px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 text-[10px] sm:text-xs md:text-sm ${product.inStock
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
              <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 leading-relaxed whitespace-pre-line">{language === "ro" && selectedProduct.descriptionRo ? selectedProduct.descriptionRo : selectedProduct.description}</p>
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
                  className={`w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base md:text-lg ${selectedProduct.inStock
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
