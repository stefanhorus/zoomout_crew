# 🎯 CHEAT SHEET RAPID - INTERVIU BETFAIR

## 📋 STRUCTURA PROIECTULUI (30 SECUNDE)

```
app/          → Pagini (Home, Shop, Portfolio, etc.)
components/   → Piese reutilizabile (Header, Footer, Cart)
contexts/     → Date globale (Coș, Limbă, Monedă)
public/       → Imagini, video-uri, logo-uri
lib/          → Funcții utilitare (MongoDB, email)
```

---

## 🎨 UI/DESIGN - PUNCTE CHEIE

### 1. **Design System:**
- **Tailwind CSS** pentru stiluri
- **Efect "Liquid Glass"** (sticlă mată iOS-style)
- **Fonturi:** Playfair Display (titluri), Roboto (text)

### 2. **Responsive:**
- **Mobile-first** approach
- Breakpoints: `md:` (768px+), `lg:` (1024px+)
- Hamburger menu pe mobile, meniu orizontal pe desktop

### 3. **Componente Principale:**
- **Header** - Navigare + logo + coș
- **Footer** - Informații contact
- **Cart** - Coș de cumpărături (sidebar)
- **Home Page** - Video hero + branduri scroll

---

## 🔧 TEHNOLOGII (PENTRU ÎNTREBĂRI)

| Tehnologie | Scop |
|------------|------|
| **Next.js 16** | Framework React (SSR, routing, API) |
| **React 19** | Biblioteca UI (componente) |
| **TypeScript** | JavaScript cu tipuri (siguranță) |
| **Tailwind CSS** | Stiluri prin clase |
| **MongoDB** | Baza de date (comenzi, utilizatori) |
| **Stripe/Revolut** | Procesare plăți |
| **Vercel** | Hosting |

---

## 💡 CONCEPTE IMPORTANTE

### **Component-Based Architecture**
- Fiecare parte UI = component reutilizabil
- Ex: `<Header />`, `<Button />`, `<Card />`

### **State Management**
- **Context API** pentru date globale (coș, limbă)
- **useState** pentru date locale (meniu deschis/închis)

### **Server-Side Rendering (SSR)**
- Next.js generează HTML pe server
- Mai rapid, SEO mai bun

### **API Routes**
- Funcții în `app/api/`
- Procesează: plăți, email-uri, webhook-uri

---

## 🔄 FLUXURI PRINCIPALE

### **Adăugare în Coș:**
```
Shop Page → Click "Add to Cart" → 
CartContext.addToCart() → 
localStorage salvează → 
Header badge se actualizează
```

### **Checkout:**
```
Cart → Checkout Page → 
Selectare metodă plată → 
API Route creează sesiune → 
Redirecționare Stripe/Revolut → 
Webhook confirmă → 
Success Page
```

### **Schimbare Limbă:**
```
Click buton EN/RO → 
LanguageContext.setLanguage() → 
Toate componentele se re-render → 
Textul se actualizează
```

---

## 📱 RESPONSIVE DESIGN

### **Mobile (< 768px):**
- Hamburger menu
- Video vertical
- Butoane mari (touch-friendly)
- Scroll manual + auto pentru branduri

### **Desktop (≥ 768px):**
- Meniu orizontal
- Video orizontal
- Hover effects
- Auto-scroll pentru branduri

---

## ⚡ OPTIMIZĂRI PERFORMANȚĂ

1. **Video CDN (Mux)** - încărcare rapidă
2. **Lazy loading** - imagini se încarcă când sunt vizibile
3. **Preload** - resurse critice încărcate anticipat
4. **SSR** - HTML generat pe server
5. **Code splitting** - automat prin Next.js

---

## 🎯 RĂSPUNSURI RAPIDE

### "Cum ai organizat proiectul?"
→ **Component-based architecture** cu separare clară: Pages, Components, Contexts, API Routes

### "Cum ai făcut responsive?"
→ **Mobile-first** cu Tailwind breakpoints. Adaptări pentru meniu, layout, dimensiuni text

### "Cum funcționează plățile?"
→ **Stripe + Revolut** integrare. Flux: Checkout → API Route → Gateway → Webhook → Success

### "Ce optimizări ai făcut?"
→ Video CDN, lazy loading, preload, SSR, code splitting

### "Cum funcționează multi-language?"
→ **Context API** cu obiect de traduceri. Funcția `t()` returnează text în limba curentă

---

## 📂 FIȘIERE CHEIE (SĂ LE ȘTII)

| Fișier | Ce face |
|--------|---------|
| `app/page.tsx` | Pagina principală (Home) |
| `app/layout.tsx` | Structura de bază (Header + Footer) |
| `components/Header.tsx` | Bara de navigare |
| `contexts/CartContext.tsx` | Gestionare coș |
| `contexts/LanguageContext.tsx` | Gestionare limbi |
| `app/api/checkout/route.ts` | Procesare checkout |
| `app/globals.css` | Stiluri globale + liquid-glass |

---

## 🎨 DESIGN PATTERNS

1. **Liquid Glass Effect:**
   ```css
   background: rgba(255, 255, 255, 0.08);
   backdrop-filter: blur(40px);
   border: 1px solid rgba(255, 255, 255, 0.18);
   ```

2. **Context Pattern:**
   ```tsx
   const { cart, addToCart } = useCart();
   ```

3. **Responsive Classes:**
   ```tsx
   className="text-sm md:text-lg lg:text-xl"
   ```

---

## ✅ CHECKLIST PRE-INTERVIU

- [ ] Știu să explic ce este Next.js
- [ ] Știu să explic un component React
- [ ] Știu diferența SSR vs Client-side
- [ ] Știu să explic responsive design
- [ ] Știu ce este Tailwind CSS
- [ ] Știu să explic Context API
- [ ] Știu să explic API Routes
- [ ] Știu optimizările făcute
- [ ] Știu fluxul de checkout
- [ ] Știu structura proiectului

---

## 🚀 DEMO RAPID (DACĂ TE ÎNTREABĂ)

1. **Arată Header.tsx** - explică component structure
2. **Arată page.tsx** - explică pagina principală
3. **Arată CartContext.tsx** - explică state management
4. **Arată globals.css** - explică liquid-glass effect
5. **Arată un API route** - explică backend logic

---

**SUCCES LA INTERVIU!** 🎉
