# Opțiuni pentru Video Instant (Alternativă la Mux)

## 🚀 Opțiunea 1: Cloudflare Stream (Recomandat)

### Avantaje:
- ✅ CDN global ultra-rapid
- ✅ Adaptive bitrate streaming (HLS/DASH)
- ✅ Preload și autoplay optimizat
- ✅ Similar cu Mux dar poate fi mai rapid
- ✅ Preț: ~$1/1000 minute vizionate

### Implementare:
```tsx
// În app/page.tsx
<iframe
  src="https://iframe.videodelivery.net/{VIDEO_ID}?autoplay=true&muted=true&loop=true&preload=auto"
  loading="eager"
  preload="auto"
/>
```

### Setup:
1. Upload video pe Cloudflare Stream
2. Obține Video ID
3. Înlocuiește Mux iframe cu Cloudflare iframe

---

## 💰 Opțiunea 2: Bunny.net (Cel mai ieftin)

### Avantaje:
- ✅ Foarte ieftin (~$0.01/GB)
- ✅ CDN rapid global
- ✅ Video streaming optimizat
- ✅ Preload și preconnect

### Implementare:
```tsx
// Bunny.net Video Library
<video
  src="https://vz-{zone}.b-cdn.net/{video-id}/play_720p.mp4"
  autoPlay
  muted
  loop
  playsInline
  preload="auto"
/>
```

### Setup:
1. Creează cont Bunny.net
2. Upload video în Video Library
3. Obține URL-ul optimizat
4. Folosește direct `<video>` tag

---

## ⚡ Opțiunea 3: Optimizări Tehnice (Fără servicii externe)

### A. Preload agresiv în layout.tsx:
```tsx
// app/layout.tsx
<head>
  <link rel="preload" href="/videos/bg.mp4" as="video" type="video/mp4" />
  <link rel="preconnect" href="https://cdn.example.com" />
</head>
```

### B. Video optimizat local:
```tsx
// app/page.tsx
<video
  ref={videoRef}
  autoPlay
  muted
  loop
  playsInline
  preload="auto" // CRITIC pentru instant
  className="w-full h-full object-cover"
>
  <source src="/videos/bg-optimized.webm" type="video/webm" />
  <source src="/videos/bg-optimized.mp4" type="video/mp4" />
</video>
```

### C. Optimizare video file:
```bash
# Compresie agresivă cu FFmpeg
ffmpeg -i input.mp4 \
  -c:v libx264 -preset slow -crf 28 \
  -c:a aac -b:a 64k \
  -movflags +faststart \
  -vf "scale=1920:1080" \
  output-optimized.mp4

# WebM pentru browser-uri moderne
ffmpeg -i input.mp4 \
  -c:v libvpx-vp9 -crf 30 \
  -c:a libopus -b:a 64k \
  output-optimized.webm
```

### D. Poster image pentru instant feedback:
```tsx
<video
  poster="/assets/video-poster.jpg" // Apare instant
  preload="auto"
  // ... rest
/>
```

---

## 🎯 Opțiunea 4: Vercel Blob Storage (Dacă ești pe Vercel)

### Avantaje:
- ✅ Integrare perfectă cu Vercel
- ✅ CDN global automat
- ✅ Optimizare automată
- ✅ Preț: ~$0.15/GB storage

### Implementare:
```tsx
import { put } from '@vercel/blob';

// Upload video
const blob = await put('video.mp4', file, {
  access: 'public',
  addRandomSuffix: false,
});

// Folosește URL-ul
<video src={blob.url} autoPlay muted loop preload="auto" />
```

---

## 📊 Comparație Rapidă

| Serviciu | Viteză | Preț | Setup | Recomandare |
|---------|--------|------|-------|-------------|
| **Cloudflare Stream** | ⭐⭐⭐⭐⭐ | $$ | Mediu | ✅ Cel mai bun |
| **Bunny.net** | ⭐⭐⭐⭐ | $ | Ușor | ✅ Cel mai ieftin |
| **Vercel Blob** | ⭐⭐⭐⭐ | $$ | Foarte ușor | ✅ Dacă ești pe Vercel |
| **Optimizări locale** | ⭐⭐⭐ | Gratis | Mediu | ✅ Dacă video-ul e mic |

---

## 🔧 Optimizări Universale (Aplică la orice variantă)

### 1. Preconnect în layout.tsx:
```tsx
<link rel="preconnect" href="https://cdn.example.com" crossOrigin="anonymous" />
<link rel="dns-prefetch" href="https://cdn.example.com" />
```

### 2. Video encoding optimizat:
- **Codec**: H.264 (compatibilitate) sau H.265/VP9 (calitate)
- **Bitrate**: 2-5 Mbps pentru 1080p
- **Keyframe interval**: 2 secunde
- **Fast start**: `-movflags +faststart` (moov atom la început)

### 3. Multiple formats:
```tsx
<video preload="auto">
  <source src="video.webm" type="video/webm" /> {/* Modern browsers */}
  <source src="video.mp4" type="video/mp4" />    {/* Fallback */}
</video>
```

### 4. Lazy loading inteligent:
```tsx
// Doar dacă video-ul nu e hero
<video preload="metadata" loading="lazy" />
```

---

## 💡 Recomandare Finală

Pentru **instant loading**:
1. **Cloudflare Stream** - dacă bugetul permite
2. **Bunny.net** - dacă vrei cel mai ieftin
3. **Optimizări locale** - dacă video-ul e < 10MB

**Combină**: Cloudflare/Bunny + optimizări tehnice = **cel mai rapid rezultat**
