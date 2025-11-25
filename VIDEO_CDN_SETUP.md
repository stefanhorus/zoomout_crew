# 🎥 Setup CDN pentru Video-uri

## Problema
Video-urile mari (56MB, 234MB) track-uite prin Git LFS nu se încarcă corect pe Vercel.

## ✅ Soluția: Cloudinary (GRATUIT și RECOMANDAT)

### De ce Cloudinary?
- ✅ Plan gratuit generos (25GB storage, 25GB bandwidth/lună)
- ✅ Optimizare automată video
- ✅ Streaming adaptiv
- ✅ CDN global rapid
- ✅ Ușor de integrat

---

## 📋 Pași pentru Cloudinary

### Pasul 1: Creează cont Cloudinary
1. Mergi pe: **https://cloudinary.com/users/register/free**
2. Sign up gratuit
3. După înregistrare, primești:
   - **Cloud Name** (ex: `dxyz12345`)
   - **API Key**
   - **API Secret**

### Pasul 2: Upload video-urile
1. Mergi pe **Dashboard** → **Media Library**
2. Click **"Upload"**
3. Upload video-urile:
   - `drone-hero-landscape4k.mp4`
   - `Drone-hero-mobile-1080.mp4`
   - `Drone-hero-mobile-tall-1080.mp4`
   - `kz-kg-video.mp4`

4. **După upload**, click pe fiecare video și copiază **URL-ul public**

### Pasul 3: Actualizează codul

Înlocuiește path-urile video în cod cu URL-urile Cloudinary.

---

## 🔄 Alternativă: Netlify (Alt host)

Netlify are suport mai bun pentru Git LFS.

### Deploy pe Netlify:
1. Mergi pe: **https://netlify.com**
2. Sign up cu GitHub
3. **Add new site** → **Import from Git**
4. Selectează `zoomout_crew`
5. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`
6. **Environment variables:**
   - Adaugă `GIT_LFS_ENABLED=true` (dacă există)
7. Deploy!

---

## 🚂 Alternativă: Railway

Railway are suport excelent pentru fișiere mari.

### Deploy pe Railway:
1. Mergi pe: **https://railway.app**
2. Sign up cu GitHub
3. **New Project** → **Deploy from GitHub repo**
4. Selectează `zoomout_crew`
5. Railway detectează automat Next.js
6. Deploy!

---

## 📊 Comparație

| Platformă | Git LFS Support | Video Support | Dificultate |
|-----------|----------------|---------------|-------------|
| **Vercel** | ⚠️ Limitări | ⚠️ Probleme cu LFS | ⭐⭐⭐ |
| **Netlify** | ✅ Mai bun | ✅ Bun | ⭐⭐ |
| **Railway** | ✅ Excelent | ✅ Excelent | ⭐⭐ |
| **Cloudinary CDN** | ✅ N/A | ✅⭐⭐⭐⭐⭐ | ⭐ |

---

## 🎯 Recomandare

**Cea mai bună soluție:** **Cloudinary CDN**
- Video-urile se încarcă rapid
- Optimizare automată
- Nu mai ai probleme cu Git LFS
- Plan gratuit generos

**Alternativă rapidă:** **Railway**
- Suport excelent pentru fișiere mari
- Deploy simplu
- Fără probleme cu LFS

---

## 🔧 Quick Fix: Folosește Railway acum

Dacă vrei să testezi rapid alt host:

1. Mergi pe: **https://railway.app**
2. Sign up cu GitHub
3. **New Project** → **Deploy from GitHub**
4. Selectează `zoomout_crew`
5. Deploy!

Railway ar trebui să funcționeze mult mai bine cu video-urile tale! 🚀



