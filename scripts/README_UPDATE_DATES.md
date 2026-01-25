# 📅 Script de actualizare date fișiere Sound Design

Acest script modifică data de creare și data de modificare pentru toate fișierele din folderul Sound Design, setându-le pe **22 ianuarie 2026, 00:00:00**.

## 🎯 Ce face scriptul:

1. **Găsește toate fișierele** din folderul Sound Design (recursiv)
2. **Verifică datele actuale** pentru fiecare fișier
3. **Actualizează data de creare** (Created Date) pe 22 ianuarie 2026
4. **Actualizează data de modificare** (Modified Date) pe 22 ianuarie 2026
5. **Raportează progresul** și statisticile finale

## 🚀 Utilizare

### Opțiunea 1: Cu calea implicită

Scriptul folosește implicit calea:
```
~/Documents/Porducts/Sound Design Pack V1
```

Rulează:
```bash
npm run update-sound-design-dates
```

SAU direct:
```bash
./scripts/update-sound-design-dates.sh
```

### Opțiunea 2: Cu calea specificată

```bash
./scripts/update-sound-design-dates.sh "/path/to/Sound Design Pack V1"
```

Exemplu:
```bash
./scripts/update-sound-design-dates.sh "$HOME/Documents/Porducts/Sound Design Pack V1"
```

## 📋 Cerințe

### macOS:
- **SetFile** (din Xcode Command Line Tools) - pentru modificarea datei de creare
  - Dacă nu este instalat: `xcode-select --install`
- **touch** - disponibil implicit pe macOS

### Linux:
- **touch** - disponibil implicit
- ⚠️ **Notă**: Pe Linux, `touch` modifică doar data de modificare, nu și data de creare

## 📊 Output

Scriptul va afișa:

- ✅ Fișiere care au deja datele corecte (sărite)
- 🔄 Fișiere care sunt actualizate (cu datele vechi → noi)
- ❌ Fișiere cu erori (dacă există)
- 📈 Rezumat final cu statistici
- 🔍 Verificare finală (primele 5 fișiere)

## ⚠️ Note importante

1. **Backup**: Recomandăm să faci backup al folderului înainte de a rula scriptul pentru prima dată.

2. **Permisiuni**: Asigură-te că ai permisiuni de scriere pentru toate fișierele din folder.

3. **SetFile pe macOS**: 
   - Dacă `SetFile` nu este disponibil, scriptul va modifica doar data de modificare
   - Pentru a modifica și data de creare, instalează Xcode Command Line Tools:
     ```bash
     xcode-select --install
     ```

4. **Data țintă**: Toate fișierele vor avea data setată pe **22 ianuarie 2026, 00:00:00**

## 🔍 Verificare după rulare

După ce rulezi scriptul, poți verifica datele folosind:

```bash
# Pe macOS
stat -f "%SB" -t "%d %b %Y %H:%M:%S" "path/to/file"
stat -f "%Sm" -t "%d %b %Y %H:%M:%S" "path/to/file"

# Sau folosind Get Info în Finder
# Click dreapta pe fișier → Get Info
```

## ❓ Probleme comune

### "SetFile: command not found"
- Instalează Xcode Command Line Tools: `xcode-select --install`
- Sau rulează scriptul fără SetFile (va modifica doar data de modificare)

### "Permission denied"
- Verifică permisiunile folderului: `ls -la "path/to/folder"`
- Rulează cu `sudo` dacă e necesar (nu recomandat pentru fișiere personale)

### "Folderul nu există"
- Verifică calea către folder
- Folosește calea completă sau path relativ corect
- Asigură-te că folderul nu este șters sau mutat

## 📝 Exemplu de output

```
🔍 Actualizare date pentru fișierele din Sound Design...

📁 Folder: /Users/stefanhorus/Documents/Porducts/Sound Design Pack V1
📅 Data țintă: 22 ianuarie 2026, 00:00:00

📊 Găsite 150 fișiere

🔄 Actualizare în progres...

  🔄 Air_Effect_01.wav
     Created: 20250228 → 202601220000.00
     Modified: 20260116 → 202601220000.00
  🔄 Ambience_Effect_01.wav
     Created: 20250228 → 202601220000.00
     Modified: 20260116 → 202601220000.00
  ...

✅ Actualizare completă!

📈 Rezumat:
   ✅ Actualizate: 150 fișiere
   ⏭️  Sărite: 0 fișiere (deja actualizate)
   ❌ Erori: 0 fișiere
```
