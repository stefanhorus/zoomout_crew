# Optimizări pentru Performanță

## Problema Identificată
Site-ul se compilează foarte greu din cauza fișierelor media foarte mari.

## Fișiere Mari Identificate

### Video-uri (foarte mari):
- `public/kz-kg/kz-kg-video.mp4` - **234MB** ⚠️
- `public/drone-hero-landscape4k.mp4` - **56MB** ⚠️
- `public/Drone-hero-mobile-1080.mp4` - **17MB**
- `public/Drone-hero-mobile-tall-1080.mp4` - **17MB**

### Imagini (foarte mari):
- `public/background4.jpg` - **19MB** ⚠️
- `public/background6.jpg` - **16MB** ⚠️
- `public/background.jpg` - **16MB** ⚠️
- `public/background2.jpg` - **9.8MB**
- `public/kz-kg/2.jpg` - **13MB** ⚠️
- `public/kz-kg/4.jpg` - **5.3MB**

## Optimizări Aplicate

### 1. Next.js Config
- ✅ SWC minification activat
- ✅ Optimizare imagini (AVIF, WebP)
- ✅ Optimizare package imports
- ✅ Watch options optimizate pentru development

### 2. Video Loading
- ✅ `preload="metadata"` adăugat pentru video-uri
- ✅ Lazy loading pentru video-uri din modal

## Recomandări pentru Optimizare Media

### Video-uri
1. **Comprimare video-uri mari:**
   ```bash
   # Pentru kz-kg-video.mp4 (234MB -> target: <10MB)
   ffmpeg -i public/kz-kg/kz-kg-video.mp4 -vcodec libx264 -crf 28 -preset slow -acodec aac -b:a 128k public/kz-kg/kz-kg-video-optimized.mp4
   
   # Pentru drone-hero-landscape4k.mp4 (56MB -> target: <5MB)
   ffmpeg -i public/drone-hero-landscape4k.mp4 -vcodec libx264 -crf 28 -preset slow -acodec aac -b:a 128k public/drone-hero-landscape4k-optimized.mp4
   ```

2. **Creează versiuni multiple:**
   - Versiune 4K pentru desktop (max 10MB)
   - Versiune 1080p pentru tablet (max 5MB)
   - Versiune 720p pentru mobile (max 2MB)

3. **Folosește format modern:**
   - Convertă la H.264 sau H.265 pentru compresie mai bună
   - Consideră WebM pentru browser-e moderne

### Imagini
1. **Comprimare imagini:**
   ```bash
   # Folosește ImageMagick sau online tools
   # Target: imagini < 500KB pentru background
   # Target: imagini < 200KB pentru thumbnails
   ```

2. **Convertă la WebP/AVIF:**
   - Next.js Image component face asta automat
   - Dar poți pre-converta pentru build mai rapid

3. **Resize imagini:**
   - Background images: max 1920px width
   - Thumbnails: max 800px width
   - Gallery images: max 1200px width

## Pași Următori

1. **Optimizează fișierele media** folosind comenzile de mai sus
2. **Testează build-ul** după optimizare
3. **Monitorizează timpul de build** - ar trebui să fie mult mai rapid

## Note
- Fișierele mari afectează și timpul de deployment
- Consideră CDN pentru fișiere media statice
- Next.js Image component optimizează automat, dar build-ul este mai lent cu fișiere mari



