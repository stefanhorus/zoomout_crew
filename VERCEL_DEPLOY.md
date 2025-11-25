# 🚀 Deploy pe Vercel - Ghid rapid

## ✅ Pre-requisite

- ✓ Repository-ul este deja pe GitHub: `https://github.com/stefanhorus/zoomout_crew`
- ✓ Codul este push-at pe GitHub

---

## 📋 Metoda 1: Via Website (RECOMANDAT - 2 minute) ⭐

### Pasul 1: Mergi pe Vercel

1. Deschide: **https://vercel.com**
2. Click pe **"Sign Up"** (sau "Log In" dacă ai deja cont)

### Pasul 2: Conectează GitHub

1. Click **"Continue with GitHub"**
2. Autorizează Vercel să acceseze repository-urile tale
3. Selectează ce repository-uri să aibă acces:
   - ✅ **All repositories** (recomandat)
   - Sau doar `zoomout_crew`

### Pasul 3: Deploy proiectul

1. Click pe **"Add New Project"** (sau "Import Project")
2. **Selectează repository-ul:** `stefanhorus/zoomout_crew`
3. Click **"Import"**

### Pasul 4: Configurează (Vercel detectează automat Next.js!)

Vercel va detecta automat că ești proiect Next.js și va seta:

- **Framework Preset:** Next.js ✅
- **Build Command:** `npm run build` ✅
- **Output Directory:** `.next` ✅
- **Install Command:** `npm install` ✅

**Nu trebuie să schimbi nimic!** Doar:

- **Project Name:** `zoomout-crew` (sau lasă default)
- **Root Directory:** `./` (lasă default)

### Pasul 5: Deploy!

1. Click **"Deploy"**
2. Așteaptă ~1-2 minute
3. **Gata!** 🎉 Primești link-ul: `https://zoomout-crew.vercel.app`

---

## 🔄 Deploy automat

**De acum înainte:**

- La fiecare `git push` pe GitHub, Vercel face deploy automat!
- Fiecare Pull Request primește un link de preview
- Toate deploy-urile sunt în istoric pe Vercel dashboard

---

## 🖥️ Metoda 2: Via CLI (Alternativă)

### Instalează Vercel CLI:

```bash
npm install -g vercel
```

### Deploy:

```bash
cd /Users/stefanhorus/Documents/zoomout_crew
vercel
```

**Prima dată:**

- Te va întreba să te loghezi (deschide browser-ul)
- Alege opțiunile default
- Primești link: `https://zoomout-crew-xxx.vercel.app`

### Deploy în producție:

```bash
vercel --prod
```

---

## ⚙️ Configurare avansată (opțional)

### Dacă vrei să configurezi variabile de mediu:

1. Mergi pe **Vercel Dashboard** → **Project Settings** → **Environment Variables**
2. Adaugă variabile (ex: API keys, secrets)
3. Vercel va face redeploy automat

### Dacă vrei să configurezi domeniu custom:

1. Mergi pe **Project Settings** → **Domains**
2. Adaugă domeniul tău
3. Urmează instrucțiunile pentru DNS

---

## 📊 Verificare

După deploy, verifică:

- ✅ Site-ul se încarcă: `https://zoomout-crew.vercel.app`
- ✅ Toate paginile funcționează
- ✅ Video-urile se încarcă (Git LFS nu afectează Vercel)
- ✅ Header și Footer arată bine

---

## 🐛 Troubleshooting

### Build failed?

- Verifică logs în Vercel Dashboard
- Asigură-te că `package.json` are toate dependențele
- Verifică că nu există erori de TypeScript/ESLint

### Video-urile nu se încarcă?

- Vercel servește fișierele din `public/` automat
- Verifică că path-urile sunt corecte: `/drone-hero-landscape4k.mp4`

### Vrei să vezi build logs?

- Mergi pe Vercel Dashboard → **Deployments** → Click pe deployment → **Build Logs**

---

## 🎯 Quick Commands

```bash
# Deploy via CLI
vercel

# Deploy în producție
vercel --prod

# Vezi toate proiectele
vercel ls

# Vezi info despre proiect
vercel inspect
```

---

## ✅ Gata!

Site-ul tău este live pe Vercel! 🚀

**Link-ul tău:** `https://zoomout-crew.vercel.app` (sau cum ai numit proiectul)

**De acum înainte:** Doar fă `git push` și Vercel face deploy automat! 🎉
