import { withBasePath } from "@/lib/base-path";

// Catalogul produselor din shop - folosit atât de pagina /shop (client), cât și de rutele de checkout (server).
// IMPORTANT: Nu adăuga aici link-uri de download sau alte date secrete - acest fișier ajunge în browser.
// Link-urile de download sunt doar în lib/digital-products.ts (folosit numai pe server).

// Tipuri de produse pentru filtrare
export type ProductCategory = "all" | "luts" | "lightroom-presets" | "sound-design" | "transitions" | "bundle" | "other";

export interface Product {
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
}

// Produse digitale - LUTs, Wallpapers, Sound Design
const baseProducts: Product[] = [
  {
    id: 1,
    name: "Cinematic Video LUTs",
    category: "luts",
    image: withBasePath("/assets/shop/cinematic fin.jpg"),
    price: 99.99,
    originalPrice: 124.98,
    discountPercentage: 20,
    description: "The Cinematic LUT pack is a carefully crafted collection of cinematic color presets designed to give your footage an instantly polished and emotional visual tone. Inspired by the rich aesthetics of analog film, these LUTs are ideal for filmmakers, content creators, and editors who want to add style, depth, and mood to their visuals with just a few clicks. Whether you're working on music videos, short films, branded content, or reels—these LUTs bring your footage to life perfectly.\n\n📦 What's Included:\n\n• 10 Professional Cinematic LUTs (.cube format)\n• Mist Powergrade for DaVinci Resolve",
    descriptionRo: "Pachetul Cinematic LUTs este o colecție atent realizată de preseturi de culoare cinematice, concepute pentru a oferi materialelor tale un ton vizual instantaneu polizat și emoțional. Inspirate de estetica bogată a filmului analog, aceste LUT-uri sunt ideale pentru regizori, creatori de conținut și editori care doresc să adauge stil, profunzime și atmosferă vizualelor lor cu doar câteva click-uri. Fie că lucrezi la videoclipuri muzicale, scurtmetraje, conținut de brand sau reels—aceste LUT-uri aduc materialele tale la viață perfect.\n\n📦 Ce este inclus:\n\n• 10 LUT-uri Cinematic profesionale (format .cube)\n• Mist Powergrade pentru DaVinci Resolve",
    inStock: true,
  },
  {
    id: 2,
    name: "Movie Looks LUTs",
    category: "luts",
    image: withBasePath("/assets/shop/MOVIE LOOKS.jpg"),
    price: 124.99,
    originalPrice: 159.98,
    discountPercentage: 22,
    description: "The Movie Looks LUT pack is your ticket to the big screen. Inspired by the color palettes of iconic modern cinema, these presets are designed to give your footage that distinct \"Blockbuster\" atmosphere. From the gritty greens of sci-fi thrillers to the rich teal-and-orange of action movies, this collection allows you to tell a stronger visual story. Whether you are grading a narrative short, a music video, or a dramatic sequence, these LUTs provide the heavy-hitting, stylized look of a high-budget production.\n\n📦 What's Included:\n\n• 20 Professional Movie LUTs (.cube format)\n• Mist Powergrade for DaVinci Resolve",
    descriptionRo: "Pachetul Movie Looks LUTs este biletul tău către marele ecran. Inspirat de paletele de culori ale cinematografiei moderne iconice, aceste preseturi sunt concepute pentru a oferi materialelor tale acea atmosferă distinctă \"Blockbuster\". De la verzile aspre ale thrillerelor SF până la teal-ul și portocaliul bogat al filmelor de acțiune, această colecție îți permite să spui o poveste vizuală mai puternică. Fie că faci color grading pentru un scurtmetraj narativ, un videoclip muzical sau o secvență dramatică, aceste LUT-uri oferă aspectul stilizat și puternic al unei producții cu buget mare.\n\n📦 Ce este inclus:\n\n• 20 LUT-uri Movie profesionale (format .cube)\n• Mist Powergrade pentru DaVinci Resolve",
    inStock: true,
  },
  {
    id: 3,
    name: "Film LUTs",
    category: "luts",
    image: withBasePath("/assets/shop/FILM EMULATION LUTS.jpg"),
    price: 99.99,
    originalPrice: 129.98,
    discountPercentage: 23,
    description: "The Film LUT pack is a tribute to the golden age of analog cinema. Designed to break the \"digital sharpness\" of modern cameras, these presets infuse your footage with organic texture, rich skin tones, and the timeless character of celluloid. Inspired by classic Kodak and Fujifilm stocks, these LUTs are perfect for storytellers who want to evoke nostalgia. Whether you are creating a documentary, a music video, or a moody travel piece, this collection brings the soul of 35mm film to your digital timeline perfectly.\n\n📦 What's Included:\n\n• 10 Professional Film LUTs (.cube format)\n• Mist Powergrade for DaVinci Resolve",
    descriptionRo: "Pachetul Film LUTs este un omagiu adus epocii de aur a cinematografiei analoge. Conceput pentru a sparge \"claritatea digitală\" a camerelor moderne, aceste preseturi îmbogățesc materialele tale cu textură organică, tonuri de piele bogate și caracterul atemporal al celuloidului. Inspirate de stock-urile clasice Kodak și Fujifilm, aceste LUT-uri sunt perfecte pentru povestitori care doresc să evoce nostalgia. Fie că creezi un documentar, un videoclip muzical sau o piesă de călătorie cu atmosferă, această colecție aduce sufletul filmului de 35mm pe timeline-ul tău digital perfect.\n\n📦 Ce este inclus:\n\n• 10 LUT-uri Film profesionale (format .cube)\n• Mist Powergrade pentru DaVinci Resolve",
    inStock: true,
  },
  {
    id: 4,
    name: "Vintage Film LUTs",
    category: "luts",
    image: withBasePath("/assets/shop/VINTAGE FILM.jpg"),
    price: 99.99,
    originalPrice: 134.98,
    discountPercentage: 26,
    description: "The Vintage Film LUT pack is your time machine. Designed to replicate the charm and imperfections of old home movies, these presets bring the nostalgic aesthetic of Super 8 and 16mm film straight to your digital footage. Perfect for travel memories, music videos, or dreamlike sequences, this collection embraces faded shadows, warm highlights, and that distinct \"retro\" vibe that makes footage feel timeless and personal.\n\n📦 What's Included:\n\n• 14 Professional Vintage Film LUTs (.cube format)\n• Mist Powergrade for DaVinci Resolve",
    descriptionRo: "Pachetul Vintage Film LUTs este mașina ta de timp. Conceput pentru a replica farmecul și imperfecțiunile filmelor de casă vechi, aceste preseturi aduc estetica nostalgică a filmului Super 8 și 16mm direct pe materialele tale digitale. Perfect pentru amintiri de călătorie, videoclipuri muzicale sau secvențe onirice, această colecție îmbrățișează umbrele estompate, highlight-urile calde și acel vibe distinct \"retro\" care face materialele să pară atemporale și personale.\n\n📦 Ce este inclus:\n\n• 14 LUT-uri Vintage Film profesionale (format .cube)\n• Mist Powergrade pentru DaVinci Resolve",
    inStock: true,
  },
  {
    id: 5,
    name: "Iphone Looks LUTs",
    category: "luts",
    image: withBasePath("/assets/shop/IPHONE.jpg"),
    price: 99.99,
    originalPrice: 139.98,
    discountPercentage: 29,
    description: "The iPhone Looks LUT pack is designed to turn your smartphone footage into high-quality content that stops the scroll. Optimized specifically for mobile sensors, these presets tame the harsh \"digital sharpness\" of modern phones and deliver a cohesive, professional aesthetic. Whether you are shooting Reels, TikToks, daily vlogs, or travel memories on the go, this collection ensures your mobile clips look cinematic and professional, matching the quality of a dedicated camera.\n\n📦 What's Included:\n\n• 10 Professional iPhone LUTs (.cube format)\n• Mist Powergrade for DaVinci Resolve",
    descriptionRo: "Pachetul iPhone Looks LUTs este conceput pentru a transforma materialele tale de pe smartphone în conținut de înaltă calitate care oprește scroll-ul. Optimizate specific pentru senzorii mobili, aceste preseturi domolesc \"claritatea digitală\" dură a telefoanelor moderne și oferă o estetică coezivă și profesională. Fie că filmezi Reels, TikToks, vlog-uri zilnice sau amintiri de călătorie în mișcare, această colecție asigură că clipurile tale mobile arată cinematice și profesionale, echivalând calitatea unei camere dedicate.\n\n📦 Ce este inclus:\n\n• 10 LUT-uri iPhone profesionale (format .cube)\n• Mist Powergrade pentru DaVinci Resolve",
    inStock: true,
  },
  {
    id: 6,
    name: "Sound Design Pack",
    category: "sound-design",
    image: withBasePath("/assets/shop/SOUND DESIGN.jpg"),
    price: 99.99,
    originalPrice: 149.98,
    discountPercentage: 33,
    description: "Professional sound design library featuring cinematic sound effects, ambient textures, and audio elements perfect for video production and filmmaking.\n\n📦 What's Included:\n\n• Air Sound Effects\n• Ambience Sound Effects\n• Campaign Sound Effects\n• City Sound Effects\n• Film Burn Sound Effects\n• Flash Sound Effects\n• Forest Sound Effects\n• Glitches Sound Effects\n• Impacts Sound Effects\n• Reverse Sound Effects\n• Scratch Sound Effects\n• Swoosh Sound Effects\n• Woosh Sound Effects\n\nTotal: 134 High-Quality Sound Effects (WAV format)",
    descriptionRo: "Bibliotecă profesională de sound design cu efecte sonore cinematice, texturi ambientale și elemente audio perfecte pentru producție video și filmmaking.\n\n📦 Ce este inclus:\n\n• Efecte sonore Air\n• Efecte sonore Ambience\n• Efecte sonore Campaign\n• Efecte sonore City\n• Efecte sonore Film Burn\n• Efecte sonore Flash\n• Efecte sonore Forest\n• Efecte sonore Glitches\n• Efecte sonore Impacts\n• Efecte sonore Reverse\n• Efecte sonore Scratch\n• Efecte sonore Swoosh\n• Efecte sonore Woosh\n\nTotal: 134 Efecte sonore de înaltă calitate (format WAV)",
    inStock: true,
  },
  {
    id: 7,
    name: "Majestic Wallpaper Pack",
    category: "other",
    image: withBasePath("/assets/shop/MAJESTIC.jpg"),
    price: 49.99,
    originalPrice: 64.98,
    discountPercentage: 23,
    description: "A stunning collection of majestic wallpapers featuring breathtaking aerial landscapes and cinematic scenes captured from 3 continents. Perfect for desktop, mobile, and tablet backgrounds.\n\n📦 What's Included:\n\n• High-resolution Desktop Wallpapers\n• High-resolution Mobile Wallpapers\n• High-resolution Tablet Wallpapers\n\nTotal: 33 high-resolution wallpapers from 3 continents in multiple formats, optimized for desktop, mobile, and tablet displays",
    descriptionRo: "O colecție uluitoare de wallpaper-uri majestuoase cu peisaje aeriene uimitoare și scene cinematice capturate de pe 3 continente. Perfecte pentru fundaluri desktop, mobile și tabletă.\n\n📦 Ce este inclus:\n\n• Wallpaper-uri Desktop de înaltă rezoluție\n• Wallpaper-uri Mobile de înaltă rezoluție\n• Wallpaper-uri Tabletă de înaltă rezoluție\n\nTotal: 33 wallpaper-uri de înaltă rezoluție de pe 3 continente în multiple formate, optimizate pentru display-uri desktop, mobile și tabletă",
    inStock: true,
  },
  {
    id: 8,
    name: "Lightroom Photo Presets",
    category: "lightroom-presets",
    image: withBasePath("/assets/shop/LIGHTROOM.jpg"),
    price: 99.99,
    originalPrice: 124.98,
    discountPercentage: 20,
    description: "The Lightroom Presets Bundle is a masterfully curated collection of professional photo presets designed to give your images an instantly polished and distinct visual identity. Inspired by the diverse aesthetics of modern photography and vintage cinema, this all-in-one toolkit is ideal for photographers, influencers, and content creators who need versatility without compromising on quality.\n\nWhether you're capturing moody urban shots, timeless portraits, nostalgic moments, or daily social media updates—this collection ensures you always have the perfect grade to bring your vision to life with just a few clicks.\n\n📦 What's Included:\n\n• 10 Black Looks Presets (Dark & Moody aesthetics)\n• 10 Cinematic Looks Presets (Film-inspired tones)\n• 10 Classic Looks Presets (Clean, timeless style)\n• 10 iPhone Looks Presets (Optimized for mobile photography)\n• 10 Retro Looks Presets (Vintage & Nostalgic vibes)\n• Mist Effect\n\nTotal: 50 Professional Presets (.XMP & .DNG format for Desktop & Mobile) + Mist Effect",
    descriptionRo: "Bundle-ul Lightroom Presets este o colecție atent curată de preseturi foto profesionale, concepute pentru a oferi imaginilor tale o identitate vizuală instantaneu polizată și distinctă. Inspirat de estetica diversă a fotografiei moderne și a cinematografiei vintage, acest toolkit all-in-one este ideal pentru fotografi, influențatori și creatori de conținut care au nevoie de versatilitate fără a compromite calitatea.\n\nFie că capturezi cadre urbane cu atmosferă, portrete atemporale, momente nostalgice sau actualizări zilnice pe social media—această colecție asigură că ai întotdeauna gradul perfect pentru a-ți aduce viziunea la viață cu doar câteva click-uri.\n\n📦 Ce este inclus:\n\n• 10 Preseturi Black Looks (Estetică Dark & Moody)\n• 10 Preseturi Cinematic Looks (Tonuri inspirate din film)\n• 10 Preseturi Classic Looks (Stil curat, atemporal)\n• 10 Preseturi iPhone Looks (Optimizate pentru fotografie mobilă)\n• 10 Preseturi Retro Looks (Vibe-uri Vintage & Nostalgice)\n• Efect Mist\n\nTotal: 50 Preseturi profesionale (format .XMP & .DNG pentru Desktop & Mobile) + Efect Mist",
    inStock: true,
  },
  {
    id: 9,
    name: "Transitions & Burns Pack",
    category: "transitions",
    image: withBasePath("/assets/shop/TRANSITION.jpg"),
    price: 79.99,
    originalPrice: 124.98,
    discountPercentage: 36,
    description: "The Transitions & Burns pack by Dopamine is crafted to bring raw, analog-style energy to your edits. Inspired by real film burns, light leaks, and in-camera transitions, this pack adds warmth, texture, and movement to your footage—perfect for music videos, reels, fashion films, or any project that needs that organic, imperfect feel. Whether you're aiming for subtle vintage motion or explosive transitions, these overlays offer you endless creative possibilities.\n\n📦 What's Included:\n\n• 50 Video Film Burn Overlays\n• 64 Static Film Burn Overlays\n\nTotal: 114 Professional Film Burn & Transition Overlays",
    descriptionRo: "Pachetul Transitions & Burns de la Dopamine este creat pentru a aduce energie brută, în stil analog, editărilor tale. Inspirat de arderile reale de film, scurgerile de lumină și tranzițiile în cameră, acest pachet adaugă căldură, textură și mișcare materialelor tale—perfect pentru videoclipuri muzicale, reels, filme de modă sau orice proiect care are nevoie de acel sentiment organic, imperfect. Fie că vizezi mișcare vintage subtilă sau tranziții explozive, aceste overlay-uri îți oferă posibilități creative nelimitate.\n\n📦 Ce este inclus:\n\n• 50 Overlay-uri Video Film Burn\n• 64 Overlay-uri Static Film Burn\n\nTotal: 114 Overlay-uri profesionale Film Burn & Transition",
    inStock: true,
  },
  {
    id: 10,
    name: "Film Mattes and Artifacts Pack",
    category: "other",
    image: withBasePath("/assets/shop/Film mattes.jpg"),
    price: 89.99,
    originalPrice: 129.98,
    discountPercentage: 31,
    description: "The Film Artifacts Pack brings the authentic character of analog cinema to your digital footage. This collection features meticulously crafted film artifacts including scratches, dust particles, grain textures, light leaks, and vintage imperfections that add depth, nostalgia, and cinematic authenticity to your projects. Perfect for filmmakers and content creators who want to break away from the sterile digital look and infuse their work with the organic, imperfect beauty of classic film. Whether you're creating music videos, short films, documentaries, or social media content, these artifacts will transform your footage into something truly timeless.\n\n📦 What's Included:\n\n• Film Scratches & Dust Particles\n• Vintage Grain Textures\n• Light Leaks & Flares\n• Film Burn Effects\n\nTotal: 165 Professional Film Artifact Overlays\n\nCompatible with all major editing software (Premiere Pro, Final Cut Pro, DaVinci Resolve, After Effects)",
    descriptionRo: "Pachetul Film Artifacts aduce caracterul autentic al cinematografiei analoge pe materialele tale digitale. Această colecție include artifacte de film atent realizate, inclusiv zgârieturi, particule de praf, texturi de grain, scurgeri de lumină și imperfecțiuni vintage care adaugă profunzime, nostalgie și autenticitate cinematică proiectelor tale. Perfect pentru regizori și creatori de conținut care doresc să se îndepărteze de aspectul digital steril și să-și insufleze munca cu frumusețea organică, imperfectă a filmului clasic. Fie că creezi videoclipuri muzicale, scurtmetraje, documentare sau conținut pentru social media, aceste artifacte vor transforma materialele tale în ceva cu adevărat atemporal.\n\n📦 Ce este inclus:\n\n• Zgârieturi Film & Particule de Praf\n• Texturi Vintage Grain\n• Scurgeri de Lumină & Flares\n• Efecte Film Burn\n\nTotal: 165 Overlay-uri profesionale Film Artifact\n\nCompatibil cu toate software-urile majore de editare (Premiere Pro, Final Cut Pro, DaVinci Resolve, After Effects)",
    inStock: true,
  },
  {
    id: 11,
    name: "Signature Bundle",
    category: "bundle",
    image: withBasePath("/assets/shop/SIGNATURE.jpg"),
    price: 394.995,
    originalPrice: 894.995,
    discountPercentage: 20,
    description: "Unlock your full potential. The Signature Bundle is the definitive all-in-one toolkit for modern filmmakers, photographers, and content creators. We have combined our entire library into one powerful collection, giving you every asset you need to take your storytelling from \"average\" to \"cinematic mastery.\" Whether you are color grading a documentary, editing a high-energy Reel, or designing the soundscape for a short film, this bundle is your unfair advantage.\n\n📦 What's Included:\n\n• 64 Professional Video LUTs (Cinematic, Movie, Film, Vintage, iPhone)\n• Mist Powergrade for DaVinci Resolve\n• 134 High-Quality Sound Effects (WAV format)\n• 50 Professional Lightroom Presets\n• 114 Film Burn & Transition Overlays\n• 165 Film Artifact Overlays\n\nTotal: Complete library of all our digital assets in one bundle",
    descriptionRo: "Deblochează-ți potențialul complet. Signature Bundle este toolkit-ul definitiv all-in-one pentru regizori, fotografi și creatori de conținut moderni. Am combinat întreaga noastră bibliotecă într-o colecție puternică, oferindu-ți fiecare asset de care ai nevoie pentru a-ți duce storytelling-ul de la \"mediu\" la \"măiestrie cinematică\". Fie că faci color grading pentru un documentar, editezi un Reel cu energie mare sau creezi soundscape-ul pentru un scurtmetraj, acest bundle este avantajul tău nedrept.\n\n📦 Ce este inclus:\n\n• 64 LUT-uri Video profesionale (Cinematic, Movie, Film, Vintage, iPhone)\n• Mist Powergrade pentru DaVinci Resolve\n• 134 Efecte sonore de înaltă calitate (format WAV)\n• 50 Preseturi Lightroom profesionale\n• 114 Overlay-uri Film Burn & Transition\n• 165 Overlay-uri Film Artifact\n\nTotal: Biblioteca completă a tuturor asset-urilor noastre digitale într-un singur bundle",
    inStock: true,
  },
  {
    id: 12,
    name: "Full Lut Bundle",
    category: "bundle",
    image: withBasePath("/assets/shop/fulllutfin.jpg"),
    price: 299.99,
    originalPrice: 399.98,
    discountPercentage: 25,
    description: "The Full LUT Bundle is the ultimate collection of professional color grading presets. This comprehensive bundle includes all our LUT packs, giving you access to every cinematic look, film emulation, and color style in our library. Perfect for filmmakers, content creators, and editors who want the complete color grading toolkit.\n\n📦 What's Included:\n\n• Cinematic Video LUTs (10 LUTs)\n• Movie Looks LUTs (20 LUTs)\n• Film LUTs (10 LUTs)\n• Vintage Film LUTs (14 LUTs)\n• Iphone Looks LUTs (10 LUTs)\n• Mist Powergrade for DaVinci Resolve\n\nTotal: 64 Professional Video LUTs (.cube format) + Mist Powergrade",
    descriptionRo: "Full LUTs Bundle este colecția ultimă de preseturi profesionale de color grading. Acest bundle cuprinzător include toate pachetele noastre de LUT-uri, oferindu-ți acces la fiecare look cinematic, emulare de film și stil de culoare din biblioteca noastră. Perfect pentru regizori, creatori de conținut și editori care doresc toolkit-ul complet de color grading.\n\n📦 Ce este inclus:\n\n• Cinematic Video LUTs (10 LUT-uri)\n• Movie Looks LUTs (20 LUT-uri)\n• Film LUTs (10 LUT-uri)\n• Vintage Film LUTs (14 LUT-uri)\n• Iphone Looks LUTs (10 LUT-uri)\n• Mist Powergrade pentru DaVinci Resolve\n\nTotal: 64 LUT-uri Video profesionale (format .cube) + Mist Powergrade",
    inStock: true,
  },
];

// Dublează toate prețurile (price + originalPrice) pentru toate produsele
export const products: Product[] = baseProducts.map((p) => ({
  ...p,
  price: p.price * 2,
  originalPrice: typeof p.originalPrice === "number" ? p.originalPrice * 2 : undefined,
}));

export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}
