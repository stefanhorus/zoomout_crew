# 📦 Ghid: Cum să pui produsele pe Google Drive și să trimiți link-uri clienților

## 🎯 Scop

După ce un client plătește, vrei să primească automat un email cu link-uri de download pentru produsele digitale (LUT-uri, preset-uri, etc.).

---

## 📋 Metoda 1: Manual (Simplu și Rapid) ⭐⭐⭐

### Pasul 1: Pregătește fișierele

1. Organizează produsele în foldere separate:
   ```
   Google Drive/
   ├── Cinematic Video LUTs/
   │   ├── LUTs/
   │   │   ├── Commercial_pop.cube
   │   │   ├── Deep_dusk.cube
   │   │   └── ...
   │   └── Mist_powergrade/
   ├── Movie LUTs/
   ├── Film LUTs/
   └── ...
   ```

### Pasul 2: Upload pe Google Drive

1. **Mergi pe:** https://drive.google.com
2. **Creează un folder nou** pentru fiecare produs (ex: "Cinematic Video LUTs")
3. **Upload toate fișierele** în folderul respectiv
4. **Click dreapta pe folder** → **"Get link"** sau **"Share"**
5. **Setează permisiunile:**
   - **"Anyone with the link"** (Oricine cu link-ul)
   - **"Viewer"** (doar vizualizare, nu editare)
6. **Copiază link-ul** (va arăta așa: `https://drive.google.com/drive/folders/1PFWtLEmwgjVXgVfKKElmwiJJ_BEJAL_w?usp=drive_link`)

### Pasul 3: Actualizează link-urile în cod

1. **Deschide:** `lib/digital-products.ts`
2. **Înlocuiește** link-urile placeholder cu link-urile tale reale:

```typescript
export const digitalProducts: DigitalProduct[] = [
  {
    id: 1,
    name: "Cinematic Video LUTs",
    downloadUrl:
      "https://drive.google.com/drive/folders/TU_FOLDER_ID_AICI?usp=drive_link",
  },
  {
    id: 2,
    name: "Movie LUTs",
    downloadUrl:
      "https://drive.google.com/drive/folders/TU_FOLDER_ID_AICI?usp=drive_link",
  },
  // ... etc
];
```

### Pasul 4: Verifică mapping-ul produselor

Asigură-te că numele produselor din `digital-products.ts` se potrivesc **exact** cu numele din:

- Stripe/Revolut (metadata produselor)
- `app/shop/page.tsx` (lista de produse)

**Exemplu:**

- Dacă în Stripe produsul se numește `"Cinematic Video LUTs"`, trebuie să fie exact același nume în `digital-products.ts`

---

## 🤖 Metoda 2: Automatizat cu Google Drive API (Avansat)

### Setup Google Drive API

1. **Creează un proiect Google Cloud:**
   - Mergi pe: https://console.cloud.google.com
   - Creează un proiect nou sau selectează unul existent

2. **Activează Google Drive API:**
   - Mergi la "APIs & Services" → "Library"
   - Caută "Google Drive API"
   - Click "Enable"

3. **Creează Service Account:**
   - Mergi la "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "Service Account"
   - Dă-i un nume (ex: "zoomout-drive-uploader")
   - Click "Create and Continue"
   - Skip role assignment (sau dă-i "Editor")
   - Click "Done"

4. **Generează JSON Key:**
   - Click pe service account-ul creat
   - Tab "Keys" → "Add Key" → "Create new key"
   - Alege "JSON"
   - Descarcă fișierul JSON (păstrează-l sigur!)

5. **Partajează folderul Google Drive cu Service Account:**
   - Deschide folderul tău de Google Drive
   - Click dreapta → "Share"
   - Adaugă email-ul service account-ului (găsești în JSON: `client_email`)
   - Dă-i permisiunea "Editor"

6. **Adaugă variabile de mediu:**
   - Creează `.env.local` (dacă nu există):
   ```bash
   GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}'
   GOOGLE_DRIVE_FOLDER_ID="1PFWtLEmwgjVXgVfKKElmwiJJ_BEJAL_w" # ID-ul folderului unde vrei să uploadezi
   ```

### Folosește API endpoint-ul pentru upload

Am creat un endpoint la `/api/admin/upload-to-drive` care poate fi folosit pentru upload automat.

---

## 📧 Cum funcționează trimiterea email-urilor

Când un client plătește:

1. **Webhook-ul primește notificarea** (Stripe/Revolut)
2. **Verifică produsele** din comandă
3. **Caută link-urile** în `digital-products.ts` folosind `getDownloadUrl()`
4. **Generează email-ul** cu link-urile de download
5. **Trimite email-ul** clientului prin Resend

**Email-ul va conține:**

- Lista produselor cumpărate
- Butoane "Download Now" pentru fiecare produs digital
- Link-uri directe către Google Drive

---

## ✅ Checklist pentru setup

- [ ] Am creat foldere pe Google Drive pentru fiecare produs
- [ ] Am setat permisiunile la "Anyone with the link" (Viewer)
- [ ] Am copiat link-urile Google Drive
- [ ] Am actualizat `lib/digital-products.ts` cu link-urile reale
- [ ] Am verificat că numele produselor se potrivesc exact
- [ ] Am testat o comandă de test pentru a verifica email-ul

---

## 🔍 Testare

1. **Testează manual:**

   ```bash
   # Verifică că link-urile funcționează
   curl "https://drive.google.com/drive/folders/TU_FOLDER_ID?usp=drive_link"
   ```

2. **Testează email-ul:**
   - Fă o comandă de test (free sau cu plată)
   - Verifică că primești email-ul cu link-urile corecte
   - Click pe link-uri și verifică că se deschid corect

---

## 🆘 Probleme comune

### Link-ul nu funcționează

- Verifică că permisiunile sunt setate la "Anyone with the link"
- Verifică că link-ul este complet (include `?usp=drive_link`)

### Email-ul nu conține link-uri

- Verifică că numele produsului din comandă se potrivește exact cu cel din `digital-products.ts`
- Verifică console logs în webhook pentru erori

### Clientul nu poate descărca

- Verifică că permisiunile Google Drive sunt "Viewer" (nu "Commenter" sau "Editor")
- Verifică că folderul nu este șters sau mutat

---

## 📝 Note importante

- **Link-urile Google Drive sunt permanente** dacă nu ștergi/muți folderul
- **Nu schimba permisiunile** după ce ai trimis link-urile (clienții nu vor mai putea accesa)
- **Backup-ul fișierelor** este recomandat (Google Drive are storage limitat în planul gratuit)
- **Pentru volume mari**, consideră Google Drive Business sau alternativă (Dropbox, AWS S3, etc.)

---

## 🚀 Alternativă: Dropbox sau AWS S3

Dacă preferi alte servicii, poți folosi același sistem:

- Înlocuiește link-urile Google Drive cu link-uri Dropbox/S3
- Actualizează `digital-products.ts` cu noile link-uri
- Funcționează identic!
