# 🛒 EXPLICAȚIE COMPLETĂ: Cart.tsx

## 📋 CE ESTE Cart.tsx?

**Cart.tsx** este componenta care afișează **coșul de cumpărături** (shopping cart). Este un panou lateral (sidebar) care se deschide când utilizatorul vrea să vadă ce produse a adăugat în coș.

**Simplificat:** Este ca un coș de cumpărături real - vezi ce ai pus în el, poți șterge produse, poți schimba cantitatea, și apoi mergi la checkout.

---

## 🎯 FUNCȚIONALITĂȚI PRINCIPALE

1. ✅ **Afișează produsele** din coș
2. ✅ **Permite schimbarea cantității** (+ și -)
3. ✅ **Permite ștergerea produselor** (icon coș de gunoi)
4. ✅ **Calculează totalul** prețului
5. ✅ **Buton "Checkout"** pentru a continua cu plata
6. ✅ **Buton "Clear Cart"** pentru a goli tot coșul

---

## 📖 EXPLICAȚIE LINIE CU LINIE

### **Liniile 1-8: Importuri**

```tsx
"use client";
```
**Ce înseamnă?** Spune că acest component rulează pe **client** (în browser), nu pe server. Este necesar pentru componente care folosesc interactivitate (butoane, click-uri).

```tsx
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import Image from "next/image";
import { useState } from "react";
```
**Ce înseamnă?** Importă funcții și componente necesare:
- `useCart` - pentru a accesa coșul (produse, funcții de adăugare/ștergere)
- `useLanguage` - pentru traduceri (RO/EN)
- `useCurrency` - pentru formatarea prețurilor (RON/EUR/USD/GBP)
- `Image` - componentă Next.js pentru imagini optimizate
- `useState` - pentru stocarea datelor în componentă

---

### **Liniile 9-18: Definirea Componentei**

```tsx
export default function Cart({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
```
**Ce înseamnă?** 
- `Cart` este numele componentei
- `isOpen` = parametru care spune dacă coșul este deschis (true) sau închis (false)
- `onClose` = funcție care se apelează când vrem să închidem coșul
- `boolean` = tipul pentru `isOpen` (true/false)
- `() => void` = tipul pentru `onClose` (funcție care nu returnează nimic)

**Exemplu de utilizare:**
```tsx
<Cart isOpen={true} onClose={() => setIsCartOpen(false)} />
```

```tsx
const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
```
**Ce înseamnă?** Extrage din `CartContext`:
- `cart` - array-ul cu produsele din coș
- `removeFromCart` - funcție pentru a șterge un produs
- `updateQuantity` - funcție pentru a schimba cantitatea
- `getTotalPrice` - funcție care calculează prețul total
- `clearCart` - funcție pentru a goli tot coșul

```tsx
const { t } = useLanguage();
const { formatPrice } = useCurrency();
```
**Ce înseamnă?**
- `t` - funcție pentru traduceri (ex: `t("cart.title")` = "Coș" sau "Cart")
- `formatPrice` - funcție care formatează prețul cu moneda corectă (ex: "50 RON" sau "10 EUR")

```tsx
const handleCheckout = () => {
  if (cart.length === 0) return;
  window.location.href = "/checkout";
};
```
**Ce înseamnă?** 
- Funcție care se apelează când utilizatorul apasă "Checkout"
- Verifică dacă coșul nu este gol (`cart.length === 0`)
- Dacă este gol, nu face nimic (`return`)
- Dacă nu este gol, redirecționează utilizatorul la pagina `/checkout`

```tsx
if (!isOpen) return null;
```
**Ce înseamnă?** 
- Dacă coșul nu este deschis (`!isOpen` = `isOpen` este false), componenta nu afișează nimic (`return null`)
- Este o optimizare - nu se renderizează dacă nu este vizibil

---

### **Liniile 22-28: Overlay (Fundal Întunecat)**

```tsx
<div
  className="fixed inset-0 bg-black/50 z-50"
  onClick={onClose}
/>
```
**Ce înseamnă?**
- `fixed inset-0` = ocupă tot ecranul (poziție fixă, toate marginile la 0)
- `bg-black/50` = fundal negru cu 50% opacitate (semi-transparent)
- `z-50` = este deasupra altor elemente (z-index 50)
- `onClick={onClose}` = când dai click pe fundal, coșul se închide

**Efect vizual:** Când coșul se deschide, restul paginii devine întunecată (ca un overlay).

---

### **Liniile 30-46: Header-ul Coșului**

```tsx
<div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-gray-900 z-50 shadow-2xl flex flex-col">
```
**Ce înseamnă?**
- `fixed right-0 top-0` = poziționat fix în partea dreaptă sus
- `h-full` = înălțime completă (100% din ecran)
- `w-full sm:w-96` = lățime completă pe mobile, 384px pe desktop (`sm:` = breakpoint pentru ecrane mici)
- `bg-gray-900` = fundal gri închis
- `z-50` = deasupra altor elemente
- `flex flex-col` = layout flexbox vertical (elementele stau unul sub altul)

```tsx
<h2 className="text-xl md:text-2xl font-bold">
  {t("cart.title")}
</h2>
```
**Ce înseamnă?**
- Titlul coșului ("Coș" sau "Cart" în funcție de limbă)
- `text-xl md:text-2xl` = text mic pe mobile, mai mare pe desktop

```tsx
<button onClick={onClose}>
  <svg>...</svg> {/* Icon X pentru închidere */}
</button>
```
**Ce înseamnă?** Buton cu icon X care închide coșul când este apăsat.

---

### **Liniile 48-129: Lista de Produse**

```tsx
{cart.length === 0 ? (
  // Coș gol - afișează mesaj
) : (
  // Coș cu produse - afișează lista
)}
```
**Ce înseamnă?** 
- **Operator ternar** (if-else simplificat)
- Dacă `cart.length === 0` (coșul este gol), afișează mesajul "Coșul este gol"
- Dacă nu, afișează lista de produse

#### **Când coșul este gol (liniile 50-66):**
```tsx
<div className="text-center py-12">
  <svg>...</svg> {/* Icon coș de cumpărături mare */}
  <p>{t("cart.empty")}</p> {/* "Coșul este gol" sau "Cart is empty" */}
</div>
```

#### **Când coșul are produse (liniile 68-127):**
```tsx
{cart.map((item) => (
  <div key={item.product.id}>
    {/* Card pentru fiecare produs */}
  </div>
))}
```
**Ce înseamnă?**
- `cart.map()` = parcurge fiecare produs din coș și creează un card pentru fiecare
- `key={item.product.id}` = identificator unic pentru React (necesar pentru performanță)

**Structura card-ului pentru fiecare produs:**

1. **Imagine produs (liniile 75-81):**
```tsx
<div className="relative w-20 h-20">
  <img src={item.product.image} alt={item.product.name} />
</div>
```
- Afișează imaginea produsului (80x80px)

2. **Informații produs (liniile 84-113):**
```tsx
<h3>{item.product.name}</h3> {/* Numele produsului */}
<p>{formatPrice(item.product.price)}</p> {/* Prețul formatat */}
```
- Numele și prețul produsului

3. **Controale cantitate (liniile 93-113):**
```tsx
<button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
  - {/* Buton minus */}
</button>
<span>{item.quantity}</span> {/* Cantitatea curentă */}
<button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
  + {/* Buton plus */}
</button>
```
**Ce înseamnă?**
- Buton `-` = scade cantitatea cu 1
- `{item.quantity}` = afișează cantitatea curentă
- Buton `+` = crește cantitatea cu 1
- `updateQuantity()` = funcție care actualizează cantitatea în coș

4. **Buton ștergere (liniile 117-124):**
```tsx
<button onClick={() => removeFromCart(item.product.id)}>
  <svg>...</svg> {/* Icon coș de gunoi */}
</button>
```
**Ce înseamnă?** Buton care șterge produsul din coș când este apăsat.

---

### **Liniile 131-155: Footer cu Total și Butoane**

```tsx
{cart.length > 0 && (
  <div>
    {/* Total și butoane */}
  </div>
)}
```
**Ce înseamnă?** 
- `&&` = operator logic "și"
- Dacă `cart.length > 0` (coșul nu este gol), afișează footer-ul
- Dacă este gol, nu afișează nimic

#### **Total (liniile 134-139):**
```tsx
<div className="flex justify-between">
  <span>{t("cart.total")}</span> {/* "Total" sau "Total" */}
  <span>{formatPrice(getTotalPrice())}</span> {/* Prețul total formatat */}
</div>
```
**Ce înseamnă?** 
- Afișează "Total" în stânga
- Afișează prețul total calculat în dreapta
- `getTotalPrice()` = calculează suma tuturor produselor × cantitățile lor

#### **Buton Checkout (liniile 140-146):**
```tsx
<button onClick={handleCheckout}>
  {t("cart.checkout")} {/* "Finalizează comanda" sau "Checkout" */}
</button>
```
**Ce înseamnă?** 
- Buton mare, alb, care duce la pagina de checkout
- Apelează `handleCheckout()` care redirecționează la `/checkout`

#### **Buton Clear Cart (liniile 147-153):**
```tsx
<button onClick={clearCart}>
  {t("cart.clear")} {/* "Golește coșul" sau "Clear cart" */}
</button>
```
**Ce înseamnă?** 
- Buton gri care golește tot coșul
- Apelează `clearCart()` care șterge toate produsele

---

## 🔄 FLUXUL COMPLET (CUM FUNCȚIONEAZĂ)

### **1. Deschidere Coș:**
```
Utilizator apasă icon coș din Header →
Header setează isCartOpen = true →
<Cart isOpen={true} onClose={...} /> se renderizează →
Coșul apare pe ecran (sidebar din dreapta)
```

### **2. Adăugare Produs:**
```
Utilizator apasă "Add to Cart" în Shop →
CartContext.addToCart(product) →
Produsul se adaugă în cart array →
Coșul se actualizează automat (React re-render)
```

### **3. Schimbare Cantitate:**
```
Utilizator apasă + sau - în Cart →
updateQuantity(productId, newQuantity) →
CartContext actualizează cantitatea →
Prețul total se recalculează automat
```

### **4. Ștergere Produs:**
```
Utilizator apasă icon coș de gunoi →
removeFromCart(productId) →
Produsul se șterge din cart array →
Coșul se actualizează (produsul dispare)
```

### **5. Checkout:**
```
Utilizator apasă "Checkout" →
handleCheckout() se apelează →
Verifică dacă coșul nu este gol →
Redirecționează la /checkout →
Utilizatorul continuă cu plata
```

---

## 🎨 DESIGN ȘI STILURI

### **Layout:**
- **Sidebar** (panou lateral) care se deschide din dreapta
- **Overlay** întunecat în spate (pentru focus)
- **Responsive:** Full width pe mobile, 384px pe desktop

### **Culori:**
- Fundal: `bg-gray-900` (gri foarte închis)
- Text: `text-white` (alb)
- Butoane: `bg-white` (alb) pentru checkout, `bg-gray-700` (gri) pentru clear

### **Animații:**
- `transition-colors` = tranziție lină la schimbarea culorilor (hover)
- `hover:bg-gray-200` = fundal gri deschis când treci mouse-ul peste

---

## 🔗 INTEGRARE CU RESTUL APLICAȚIEI

### **CartContext (lib/contexts/CartContext.tsx):**
- Stochează produsele în coș
- Oferă funcții: `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`
- Salvează în `localStorage` (persistență - coșul rămâne și după refresh)

### **Header.tsx:**
- Afișează icon coș cu badge (număr de produse)
- Deschide coșul când se apasă icon-ul
- Pasează `isOpen` și `onClose` către componenta Cart

### **Shop Page:**
- Afișează produsele disponibile
- Buton "Add to Cart" care apelează `addToCart()`
- Coșul se actualizează automat când se adaugă produse

---

## 💡 CONCEPTE IMPORTANTE

### **1. Conditional Rendering:**
```tsx
{cart.length === 0 ? <EmptyState /> : <ProductList />}
```
- Afișează diferit în funcție de starea coșului

### **2. Map Function:**
```tsx
{cart.map((item) => <ProductCard key={item.id} />)}
```
- Creează un card pentru fiecare produs din coș

### **3. Event Handlers:**
```tsx
onClick={() => removeFromCart(item.id)}
```
- Funcții care se apelează când utilizatorul face o acțiune (click)

### **4. Props:**
```tsx
<Cart isOpen={true} onClose={handleClose} />
```
- Date care se transmit componentei de la părinte

---

## ✅ REZUMAT

**Cart.tsx este:**
- ✅ Un component React care afișează coșul de cumpărături
- ✅ Un sidebar care se deschide din dreapta
- ✅ Conectat la CartContext pentru date
- ✅ Conectat la LanguageContext pentru traduceri
- ✅ Conectat la CurrencyContext pentru formatarea prețurilor
- ✅ Permite modificarea cantității, ștergerea produselor, și checkout

**Funcționalități:**
1. Afișează produsele din coș
2. Permite schimbarea cantității (+/-)
3. Permite ștergerea produselor
4. Calculează și afișează totalul
5. Buton pentru checkout
6. Buton pentru a goli coșul

---

**Acum știi tot despre Cart.tsx!** 🎉
