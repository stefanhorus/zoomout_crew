# Ghid de Optimizare a Imaginilor

## Ce s-a făcut

Toate tag-urile `<img>` au fost înlocuite cu componenta Next.js `Image` pentru optimizare automată. Acest lucru oferă următoarele beneficii:

### Beneficii Next.js Image Component

1. **Optimizare automată**: Next.js convertește automat imaginile în formate moderne (AVIF, WebP) când browserul le suportă
2. **Lazy loading**: Imaginile se încarcă doar când sunt aproape de viewport
3. **Responsive images**: Se generează automat dimensiuni diferite pentru diferite ecrane
4. **Reducere dimensiune**: Imaginile sunt comprimate automat pentru performanță optimă
5. **Prevenire Layout Shift**: Dimensiunile imaginilor sunt cunoscute înainte de încărcare

## Configurație Actuală

În `next.config.ts` sunt configurate:
- **Formate**: AVIF și WebP (formate moderne, mai mici)
- **Device Sizes**: 640, 750, 828, 1080, 1200, 1920, 2048, 3840px
- **Image Sizes**: 16, 32, 48, 64, 96, 128, 256, 384px
- **Cache TTL**: 60 secunde

## Optimizări Suplimentare Recomandate

### 1. Comprimare Imaginile Existente

Pentru a reduce dimensiunea fișierelor originale, poți folosi:

#### Opțiunea 1: Online Tools
- [TinyPNG](https://tinypng.com/) - pentru PNG și JPEG
- [Squoosh](https://squoosh.app/) - pentru toate formatele
- [ImageOptim](https://imageoptim.com/) - pentru Mac

#### Opțiunea 2: CLI Tools
```bash
# Instalează sharp-cli
npm install -g sharp-cli

# Comprimă toate imaginile din public/
sharp -i public/**/*.{jpg,jpeg,png} -o public/ --quality 80
```

#### Opțiunea 3: Script Node.js
Poți crea un script pentru comprimare automată:
```javascript
// scripts/optimize-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImages(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      await optimizeImages(filePath);
    } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
      await sharp(filePath)
        .jpeg({ quality: 80 })
        .webp({ quality: 80 })
        .toFile(filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
    }
  }
}

optimizeImages('./public');
```

### 2. Folosirea WebP/AVIF pentru Imagini Noi

Când adaugi imagini noi:
- Folosește formatul WebP sau AVIF dacă este posibil
- Aceste formate sunt cu 25-35% mai mici decât JPEG/PNG

### 3. Optimizare Quality Settings

În cod, am setat `quality={75}` pentru background images. Poți ajusta:
- **Background images**: `quality={75}` (echilibrat)
- **Thumbnails**: `quality={70}` (mai mic, mai rapid)
- **Hero images**: `quality={85}` (mai mare, mai clar)

### 4. Sizes Attribute

Am adăugat atributul `sizes` pentru fiecare imagine:
- **Grid items**: `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`
- **Full width**: `sizes="100vw"`
- **Modal images**: `sizes="(max-width: 768px) 100vw, 80vw"`

Acest lucru ajută Next.js să genereze dimensiunile corecte.

### 5. Lazy Loading

Toate imaginile (exceptând cele cu `priority`) sunt lazy-loaded automat. Imagini importante (hero, backgrounds) au `priority` pentru încărcare imediată.

## Verificare Performanță

După optimizări, verifică:
1. **Lighthouse Score**: Rulează Lighthouse în Chrome DevTools
2. **Network Tab**: Verifică dimensiunile reale ale imaginilor încărcate
3. **PageSpeed Insights**: [https://pagespeed.web.dev/](https://pagespeed.web.dev/)

## Rezultate Așteptate

După optimizări, ar trebui să vezi:
- ✅ Reducere cu 30-50% în dimensiunea totală a imaginilor
- ✅ Timp de încărcare mai rapid
- ✅ Scor mai bun la Lighthouse (90+ pentru Performance)
- ✅ Experiență mai bună pe dispozitive mobile

## Note Importante

1. **Next.js Image** funcționează doar cu imagini din folderul `public/` sau cu URL-uri externe configurate
2. **Fill prop** necesită un container cu `position: relative`
3. **Width/Height** sunt necesare când nu folosești `fill`
4. **Priority** ar trebui folosit doar pentru imagini deasupra fold-ului (above the fold)

## Resurse

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Web.dev Image Optimization](https://web.dev/fast/#optimize-your-images)
- [Image Formats Comparison](https://web.dev/avif/)




