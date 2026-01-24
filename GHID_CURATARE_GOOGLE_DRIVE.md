# 🧹 Ghid: Curățare fișiere sistem din Google Drive

## ❌ Fișiere care NU ar trebui să fie în folderul pentru clienți

### 1. `.DS_Store` (macOS)

- **Ce este:** Fișier sistem creat automat de macOS
- **De ce apare:** Când accesezi un folder pe Mac, sistemul creează automat acest fișier
- **Soluție:** Șterge-l din Google Drive și previne crearea lui

### 2. `~$...` (Microsoft Office)

- **Ce este:** Fișier temporar creat de Word/Excel/PowerPoint
- **De ce apare:** Când deschizi un document Office, se creează un fișier temporar
- **Soluție:** Șterge-l din Google Drive și asigură-te că închizi documentele corect

---

## 🗑️ Cum să ștergi aceste fișiere din Google Drive

### Metoda 1: Manual

1. **Deschide folderul** pe Google Drive
2. **Selectează fișierele** `.DS_Store` și `~$...`
3. **Click dreapta** → **"Remove"** sau **"Delete"**
4. **Confirmă ștergerea**

### Metoda 2: Folosind Google Drive Desktop

1. **Instalează Google Drive Desktop** (dacă nu ai deja)
2. **Deschide folderul** în Finder (Mac) sau File Explorer (Windows)
3. **Șterge fișierele** `.DS_Store` și `~$...`
4. **Sincronizarea** va șterge automat fișierele și din Google Drive

---

## 🛡️ Cum să previi crearea acestor fișiere

### Pentru `.DS_Store` (macOS):

#### Opțiunea 1: Dezactivează crearea `.DS_Store` pe Google Drive

```bash
# Rulează în Terminal (Mac)
defaults write com.apple.desktopservices DSDontWriteNetworkStores true
```

#### Opțiunea 2: Creează un script de curățare automată

Creează un script care șterge automat `.DS_Store` din folderul Google Drive:

```bash
#!/bin/bash
# Salvează ca: cleanup_ds_store.sh

# Calea către folderul Google Drive
DRIVE_FOLDER="$HOME/Google Drive/Cinematic Video LUTs"

# Șterge .DS_Store
find "$DRIVE_FOLDER" -name ".DS_Store" -delete

echo "✅ .DS_Store files deleted from Google Drive folder"
```

#### Opțiunea 3: Folosește `.gitignore` (dacă folosești Git)

Creează un `.gitignore` în folderul local:

```
.DS_Store
~$*
```

### Pentru `~$...` (Microsoft Office):

#### Prevenire:

1. **Închide documentele corect** înainte de a închide Word/Excel
2. **Nu lăsa documentele deschise** când sincronizezi cu Google Drive
3. **Verifică folderul** înainte de a partaja link-ul cu clienții

#### Curățare automată:

Creează un script care șterge fișierele `~$*`:

```bash
#!/bin/bash
# Salvează ca: cleanup_temp_files.sh

# Calea către folderul Google Drive
DRIVE_FOLDER="$HOME/Google Drive/Cinematic Video LUTs"

# Șterge fișierele temporare Office
find "$DRIVE_FOLDER" -name "~$*" -delete

echo "✅ Temporary Office files deleted from Google Drive folder"
```

---

## ✅ Checklist pentru folderul Google Drive

Înainte de a partaja link-ul cu clienții, verifică:

- [ ] Nu există fișiere `.DS_Store`
- [ ] Nu există fișiere `~$...`
- [ ] Nu există fișiere `.git` sau `.gitignore`
- [ ] Nu există fișiere `.env` sau config files
- [ ] Doar fișierele necesare pentru clienți (LUT-uri, PDF-uri, etc.)

---

## 🔍 Cum să verifici rapid

### În Google Drive:

1. **Deschide folderul**
2. **Sortează după nume** (click pe coloana "Nume")
3. **Caută** fișiere care încep cu `.` sau `~$`
4. **Șterge-le** dacă le găsești

### În Terminal (Mac):

```bash
# Navighează la folderul Google Drive
cd ~/Google\ Drive/Cinematic\ Video\ LUTs

# Listează toate fișierele .DS_Store
find . -name ".DS_Store"

# Listează toate fișierele ~$*
find . -name "~$*"
```

---

## 📝 Note importante

- **`.DS_Store`** nu afectează funcționalitatea, dar arată neprofesionist pentru clienți
- **`~$...`** poate indica că documentul este deschis în altă parte
- **Ambele** ocupă spațiu inutil în Google Drive
- **Recomandare:** Curăță folderul înainte de fiecare upload nou

---

## 🚀 Automatizare (Opțional)

Poți crea un script care rulează automat la fiecare sincronizare:

```bash
#!/bin/bash
# cleanup_google_drive.sh

DRIVE_FOLDER="$HOME/Google Drive/Cinematic Video LUTs"

# Șterge .DS_Store
find "$DRIVE_FOLDER" -name ".DS_Store" -delete

# Șterge fișierele temporare Office
find "$DRIVE_FOLDER" -name "~$*" -delete

echo "✅ Google Drive folder cleaned"
```

Adaugă scriptul în cron sau rulează-l manual înainte de a partaja link-urile.
