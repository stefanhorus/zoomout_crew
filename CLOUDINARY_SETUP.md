# 🎥 Setup Cloudinary pentru Video Hero

## De ce Cloudinary?
- ✅ Plan gratuit generos (25GB storage, 25GB bandwidth/lună)
- ✅ Optimizare automată video
- ✅ CDN global rapid
- ✅ Streaming adaptiv
- ✅ Fără probleme cu Git LFS
- ✅ Transformări video on-the-fly

---

## 📋 Pași pentru setup

### Pasul 1: Creează cont Cloudinary
1. Mergi pe: **https://cloudinary.com/users/register/free**
2. Sign up gratuit cu email
3. După înregistrare, primești:
   - **Cloud Name** (ex: `dxyz12345`)
   - **API Key**
   - **API Secret**

### Pasul 2: Upload video-ul
1. Mergi pe **Dashboard** → **Media Library**
2. Click **"Upload"**
3. Upload `Drone-Hero-2-2k-clean.mp4`
4. **După upload**, click pe video
5. **Copiază URL-ul public** (ex: `https://res.cloudinary.com/your-cloud/video/upload/v1234567/Drone-Hero-2-2k-clean.mp4`)

### Pasul 3: Optimizare video (opțional)
Cloudinary poate optimiza automat video-ul:
- Adaugă `q_auto` pentru calitate optimă
- Adaugă `f_auto` pentru format optim
- Adaugă `w_1920` pentru lățime fixă

**URL optimizat:**
```
https://res.cloudinary.com/your-cloud/video/upload/q_auto,f_auto,w_1920/v1234567/Drone-Hero-2-2k-clean.mp4
```

### Pasul 4: Actualizează codul
Înlocuiește path-ul local cu URL-ul Cloudinary:

```tsx
// Înainte:
<source src="/Drone-Hero-2-2k-clean.mp4" type="video/mp4" />

// După:
<source src="https://res.cloudinary.com/your-cloud/video/upload/q_auto,f_auto,w_1920/v1234567/Drone-Hero-2-2k-clean.mp4" type="video/mp4" />
```

---

## 🔧 Variabile de mediu (recomandat)

Pentru a nu hardcode URL-urile, folosește variabile de mediu:

### 1. Creează `.env.local`:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_VIDEO_ID=Drone-Hero-2-2k-clean
```

### 2. Actualizează codul:
```tsx
const cloudinaryUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/q_auto,f_auto,w_1920/${process.env.NEXT_PUBLIC_CLOUDINARY_VIDEO_ID}.mp4`;

<source src={cloudinaryUrl} type="video/mp4" />
```

---

## 📊 Avantaje

| Aspect | Git LFS | Cloudinary |
|--------|---------|------------|
| **Build time** | ⚠️ Slow (descarcă LFS) | ✅ Fast (nu afectează build) |
| **CDN** | ❌ Nu | ✅ Global CDN |
| **Optimizare** | ❌ Manual | ✅ Automată |
| **Fiabilitate** | ⚠️ Probleme pe Vercel | ✅ 99.9% uptime |
| **Cost** | ✅ Gratuit | ✅ Gratuit (plan free) |

---

## 🎯 Quick Start

1. **Creează cont:** https://cloudinary.com/users/register/free
2. **Upload video:** Media Library → Upload → Selectează `Drone-Hero-2-2k-clean.mp4`
3. **Copiază URL:** Click pe video → Copy URL
4. **Actualizează cod:** Înlocuiește path-ul local cu URL-ul Cloudinary
5. **Deploy:** Push pe GitHub → Vercel face deploy automat

---

## 💡 Tips

- **Optimizare automată:** Folosește `q_auto` și `f_auto` în URL
- **Multiple calități:** Poți crea versiuni diferite (1080p, 2K, 4K)
- **Streaming:** Cloudinary suportă HLS/DASH pentru streaming adaptiv
- **Analytics:** Vezi câte vizualizări are video-ul în dashboard

---

## ✅ Gata!

După setup, video-ul se va încărca mult mai rapid și fără probleme pe Vercel! 🚀



