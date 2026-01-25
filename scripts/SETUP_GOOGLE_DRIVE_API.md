# 🔧 Setup Google Drive API pentru verificare copyright

Acest ghid te ajută să configurezi Google Drive API pentru a putea verifica și actualiza copyright-urile fișierelor de pe Google Drive.

## 📋 Pași de configurare

### 1. Creează un proiect Google Cloud

1. Mergi pe: https://console.cloud.google.com
2. Click pe selectorul de proiect (sus, lângă "Google Cloud")
3. Click "New Project"
4. Dă-i un nume (ex: "zoomout-drive-api")
5. Click "Create"

### 2. Activează Google Drive API

1. În Google Cloud Console, mergi la "APIs & Services" → "Library"
2. Caută "Google Drive API"
3. Click pe "Google Drive API"
4. Click "Enable"

### 3. Creează Service Account

1. Mergi la "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Completează:
   - **Service account name**: `zoomout-drive-checker` (sau alt nume)
   - **Service account ID**: se generează automat
4. Click "Create and Continue"
5. **Skip** role assignment (sau dă-i "Editor" dacă vrei)
6. Click "Done"

### 4. Generează JSON Key

1. Click pe service account-ul creat (în lista de service accounts)
2. Mergi la tab-ul "Keys"
3. Click "Add Key" → "Create new key"
4. Alege formatul **JSON**
5. Click "Create"
6. **JSON-ul se va descărca automat** - păstrează-l sigur! ⚠️

### 5. Partajează folderul cu Service Account

1. Deschide folderul Sound Design pe Google Drive:
   ```
   https://drive.google.com/drive/folders/1Xi393MvpvojRydJCkJa4zRfAQqYIWJA8
   ```
2. Click dreapta pe folder → "Share" sau click pe butonul "Share"
3. În câmpul de email, adaugă email-ul service account-ului
   - Găsești email-ul în JSON-ul descărcat: câmpul `client_email`
   - Va arăta așa: `zoomout-drive-checker@your-project.iam.gserviceaccount.com`
4. Setează permisiunea la **"Editor"**
5. Click "Send" (nu trebuie să trimită email, doar să adauge permisiunea)

### 6. Adaugă în .env.local

1. Deschide fișierul `.env.local` din root-ul proiectului
2. Dacă nu există, creează-l
3. Adaugă următoarea linie:

```bash
GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"zoomout-drive-checker@your-project.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}'
```

**IMPORTANT:**
- Copiază **tot conținutul** din JSON-ul descărcat
- Păstrează formatul JSON valid
- Dacă JSON-ul conține linii noi în `private_key`, păstrează-le ca `\n`

### 7. Verifică configurarea

Rulează:
```bash
npm run check-copyright
```

Dacă totul este configurat corect, vei vedea lista cu toate itemele și statusul copyright-urilor lor.

## ❓ Probleme comune

### "GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY nu este setat"
- Verifică că ai creat `.env.local` în root-ul proiectului
- Verifică că JSON-ul este corect formatat (trebuie să fie un string JSON valid)
- Verifică că nu ai ghilimele duble în interiorul JSON-ului

### "Permission denied" sau "403 Forbidden"
- Verifică că ai partajat folderul cu service account-ul
- Verifică că service account-ul are permisiunea "Editor" (nu "Viewer")
- Verifică că ai folosit email-ul corect din JSON (`client_email`)

### "Invalid credentials"
- Verifică că JSON-ul este complet și corect
- Verifică că nu ai șters caractere din JSON
- Încearcă să generezi un nou JSON key dacă problema persistă

## 🔒 Securitate

⚠️ **IMPORTANT:**
- `.env.local` este deja în `.gitignore` - nu va fi commitat pe Git
- Nu partaja niciodată JSON key-ul public
- Dacă ai commitat accidental JSON-ul, revocă-l imediat din Google Cloud Console:
  1. Mergi la Service Account → Keys
  2. Șterge key-ul compromis
  3. Generează unul nou

## ✅ Verificare finală

După configurare, rulează:
```bash
npm run check-copyright
```

Ar trebui să vezi:
- ✅ Lista cu toate itemele din folder
- ✅ Statusul copyright-urilor pentru fiecare item
- ✅ Rezumat cu statistici

## 📝 Next Steps

După ce ai verificat copyright-urile, dacă găsești iteme fără copyright, poți actualiza-le rulând:

```bash
npm run check-sound-design-metadata 1Xi393MvpvojRydJCkJa4zRfAQqYIWJA8
```

Acest script va actualiza automat copyright-urile pentru toate itemele care le lipsesc.
