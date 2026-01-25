# 🔍 Script de verificare metadata Sound Design

Acest script verifică și actualizează metadata și copyright-urile pentru toate fișierele din folderul Sound Design de pe Google Drive.

## 📋 Ce face scriptul:

1. **Verifică metadata** pentru toate fișierele din folderul Sound Design
2. **Verifică copyright-urile** (setează "© 2026 Zoomout_crew. All rights reserved.")
3. **Setează data de creare/modificare** pe **22 ianuarie 2026**
4. **Raportează** toate fișierele care necesită actualizare

## 🚀 Setup

### 1. Instalează dependențele:

```bash
npm install
```

### 2. Configurează Google Drive API:

1. Creează un Service Account în Google Cloud Console
2. Descarcă JSON key-ul
3. Adaugă în `.env.local`:

```bash
GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
SOUND_DESIGN_FOLDER_ID="ID_FOLDER_GOOGLE_DRIVE"
```

### 3. Partajează folderul cu Service Account:

- Deschide folderul Sound Design pe Google Drive
- Click dreapta → "Share"
- Adaugă email-ul service account-ului (găsești în JSON: `client_email`)
- Dă-i permisiunea "Editor"

## 📝 Utilizare

### Opțiunea 1: Cu ID-ul folderului ca argument

```bash
npm run check-sound-design-metadata <FOLDER_ID>
```

Exemplu:
```bash
npm run check-sound-design-metadata 1ABC123XYZ456
```

### Opțiunea 2: Cu ID-ul setat în .env.local

```bash
# .env.local
SOUND_DESIGN_FOLDER_ID="1ABC123XYZ456"
```

Apoi rulează:
```bash
npm run check-sound-design-metadata
```

## 📊 Output

Scriptul va afișa:

- ✅ Fișiere care au deja metadata corectă
- ⚠️  Fișiere care necesită actualizare (cu detalii despre data actuală)
- 📈 Rezumat cu numărul de fișiere OK vs. necesită actualizare
- 🔄 Procesul de actualizare pentru fiecare fișier

## ⚠️ Note importante

1. **Google Drive API nu permite modificarea directă a `createdTime`**, dar scriptul va seta:
   - `modifiedTime` pe 22 ianuarie 2026
   - `description` cu copyright
   - `properties.copyright` cu copyright
   - `properties.createdDate` și `properties.modifiedDate` în metadata

2. **Rate Limiting**: Scriptul include un delay de 100ms între actualizări pentru a evita rate limiting-ul Google Drive API.

3. **Backup**: Recomandăm să faci backup al folderului înainte de a rula scriptul pentru prima dată.

## 🔍 Cum să obții ID-ul folderului

Din link-ul Google Drive:
```
https://drive.google.com/drive/folders/1ABC123XYZ456?usp=sharing
                                         ^^^^^^^^^^^^
                                         Acesta este ID-ul
```

## ❓ Probleme comune

### "GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY nu este setat"
- Verifică că ai creat `.env.local` în root-ul proiectului
- Verifică că JSON key-ul este corect formatat (trebuie să fie un string JSON valid)

### "Permission denied" sau "Insufficient permissions"
- Asigură-te că ai partajat folderul cu service account-ul
- Verifică că service account-ul are permisiunea "Editor"

### "Folder not found"
- Verifică că ID-ul folderului este corect
- Verifică că folderul nu este șters sau mutat
