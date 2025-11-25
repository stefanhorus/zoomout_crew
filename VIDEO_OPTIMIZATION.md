# 🎥 Optimizare Video pentru Web

## Problema actuală
Video-urile MP4 sunt mari (17-56MB) și pot avea probleme pe Vercel cu Git LFS.

## ✅ Soluții de optimizare

### 1. Format WebM (RECOMANDAT) ⭐⭐⭐

**WebM este mult mai eficient pentru web:**
- ✅ 30-50% mai mic decât MP4
- ✅ Calitate similară
- ✅ Suport excelent în browsere moderne
- ✅ Streaming mai rapid

**Cum să convertești:**

```bash
# Instalează FFmpeg (dacă nu ai)
brew install ffmpeg

# Convertește la WebM (VP9 codec - cel mai eficient)
ffmpeg -i public/drone-hero-landscape2k.mp4 \
  -c:v libvpx-vp9 -crf 30 -b:v 0 \
  -c:a libopus -b:a 128k \
  -movflags +faststart \
  public/drone-hero-landscape2k.webm

# Pentru mobile
ffmpeg -i public/Drone-hero-mobile-1080.mp4 \
  -c:v libvpx-vp9 -crf 30 -b:v 0 \
  -c:a libopus -b:a 128k \
  -movflags +faststart \
  public/Drone-hero-mobile-1080.webm
```

**Apoi actualizează codul să folosească WebM cu fallback MP4:**

```tsx
<video>
  <source src="/drone-hero-landscape2k.webm" type="video/webm" />
  <source src="/drone-hero-landscape2k.mp4" type="video/mp4" />
</video>
```

---

### 2. Comprimare MP4 mai agresivă

**Redu mărimea video-urilor existente:**

```bash
# Comprimare H.264 cu calitate bună dar mărime mică
ffmpeg -i public/drone-hero-landscape2k.mp4 \
  -c:v libx264 -preset slow -crf 28 \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  public/drone-hero-landscape2k-compressed.mp4
```

**Rezultat:** Video-ul va fi 40-60% mai mic cu calitate similară.

---

### 3. Video-uri multiple calități (Adaptive)

**Creează versiuni la diferite rezoluții:**

```bash
# 1080p pentru desktop
ffmpeg -i public/drone-hero-landscape2k.mp4 \
  -vf scale=1920:1080 -c:v libx264 -crf 28 \
  public/drone-hero-1080p.mp4

# 720p pentru tablet
ffmpeg -i public/drone-hero-landscape2k.mp4 \
  -vf scale=1280:720 -c:v libx264 -crf 28 \
  public/drone-hero-720p.mp4

# 480p pentru mobile
ffmpeg -i public/drone-hero-landscape2k.mp4 \
  -vf scale=854:480 -c:v libx264 -crf 28 \
  public/drone-hero-480p.mp4
```

**Apoi folosește în cod:**

```tsx
<video>
  <source src="/drone-hero-1080p.mp4" media="(min-width: 1920px)" />
  <source src="/drone-hero-720p.mp4" media="(min-width: 768px)" />
  <source src="/drone-hero-480p.mp4" />
</video>
```

---

### 4. Folosește poster image

**Adaugă o poză de preview înainte de video:**

```tsx
<video
  poster="/drone-hero-poster.jpg"
  ...
>
```

**Avantaje:**
- Se încarcă instant
- Arată ceva înainte ca video-ul să se încarce
- Mai bun pentru SEO

---

## 📊 Comparație mărimi

| Format | Mărime originală | Mărime optimizată | Reducere |
|--------|------------------|-------------------|----------|
| MP4 2K | 40MB | 15-20MB (compressed) | 50-60% |
| WebM 2K | - | 12-18MB | 55-70% |
| MP4 1080p | 17MB | 8-12MB | 30-50% |
| WebM 1080p | - | 6-10MB | 40-60% |

---

## 🎯 Recomandare

**Cea mai bună soluție:**
1. **Convertește la WebM** (cel mai eficient)
2. **Păstrează MP4 ca fallback** (compatibilitate)
3. **Adaugă poster image** (UX mai bun)
4. **Folosește multiple surse** (adaptive loading)

**Rezultat:** Video-uri 50-70% mai mici, se încarcă mult mai rapid! 🚀

---

## 🔧 Quick Start

Dacă vrei să optimizezi acum:

```bash
# 1. Instalează FFmpeg
brew install ffmpeg

# 2. Convertește la WebM
ffmpeg -i public/drone-hero-landscape2k.mp4 \
  -c:v libvpx-vp9 -crf 30 -b:v 0 \
  -c:a libopus -b:a 128k \
  public/drone-hero-landscape2k.webm

# 3. Adaugă la Git (fără LFS - WebM e mai mic)
git add public/drone-hero-landscape2k.webm
git commit -m "Add optimized WebM video"
git push
```

Apoi actualizează codul să folosească WebM cu fallback MP4!



