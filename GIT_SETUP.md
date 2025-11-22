# Cum să creezi și să conectezi repository-ul Git cu GitHub

## 📋 Pași pentru a pune site-ul pe GitHub

### Pasul 1: Adaugă toate fișierele proiectului

```bash
# Asigură-te că ești în folderul proiectului
cd /Users/stefanhorus/Documents/zoomout_crew

# Adaugă toate fișierele (exceptând cele din .gitignore)
git add .

# Verifică ce fișiere vor fi adăugate
git status
```

### Pasul 2: Fă primul commit

```bash
git commit -m "Initial commit: Zoomout_crew website"
```

### Pasul 3: Creează repository-ul pe GitHub

1. **Mergi pe:** https://github.com
2. **Loghează-te** sau **creează cont** (dacă nu ai)
3. **Click pe butonul "+"** (sus dreapta) → **"New repository"**
4. **Completează:**
   - **Repository name:** `zoomout_crew` (sau alt nume)
   - **Description:** "Professional aerial footage website"
   - **Visibility:** Public sau Private (alege ce preferi)
   - **NU bifa** "Add a README file" (avem deja cod)
   - **NU bifa** "Add .gitignore" (avem deja)
   - **NU bifa** "Choose a license"
5. **Click "Create repository"**

### Pasul 4: Conectează repository-ul local cu GitHub

GitHub îți va arăta instrucțiuni după ce creezi repository-ul. Rulează:

```bash
# Înlocuiește TU_USERNAME cu username-ul tău de GitHub
git remote add origin https://github.com/TU_USERNAME/zoomout_crew.git

# Verifică că s-a adăugat corect
git remote -v
```

### Pasul 5: Push codul pe GitHub

```bash
# Trimite codul pe GitHub
git branch -M main
git push -u origin main
```

**Dacă te cere autentificare:**
- Folosește un **Personal Access Token** (nu parola)
- Sau instalează **GitHub CLI** pentru autentificare mai ușoară

---

## 🔐 Cum să obții Personal Access Token (dacă e necesar)

1. **Mergi pe:** https://github.com/settings/tokens
2. **Click "Generate new token"** → **"Generate new token (classic)"**
3. **Note:** "Zoomout Crew Deploy"
4. **Expiration:** Alege perioada (ex: 90 zile)
5. **Selectează scope:** `repo` (toate opțiunile sub repo)
6. **Click "Generate token"**
7. **COPIAZĂ TOKEN-UL** (nu vei mai putea să-l vezi!)
8. **Folosește token-ul ca parolă** când Git te întreabă de parolă

---

## 🚀 Comenzi complete (copy-paste)

```bash
# 1. Navighează la proiect
cd /Users/stefanhorus/Documents/zoomout_crew

# 2. Adaugă fișierele
git add .

# 3. Fă commit
git commit -m "Initial commit: Zoomout_crew website"

# 4. Conectează cu GitHub (înlocuiește TU_USERNAME)
git remote add origin https://github.com/TU_USERNAME/zoomout_crew.git

# 5. Push pe GitHub
git branch -M main
git push -u origin main
```

---

## ✅ Verificare

După ce ai făcut push, mergi pe:
`https://github.com/TU_USERNAME/zoomout_crew`

Ar trebui să vezi toate fișierele tale acolo! 🎉

---

## 🔄 Pentru următoarele modificări

După ce ai făcut modificări în cod:

```bash
# 1. Vezi ce s-a schimbat
git status

# 2. Adaugă modificările
git add .

# 3. Fă commit cu mesaj descriptiv
git commit -m "Descriere modificări: ex. 'Improved header styling'"

# 4. Trimite pe GitHub
git push
```

---

## 🛠️ Troubleshooting

### Eroare: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/TU_USERNAME/zoomout_crew.git
```

### Eroare: "Authentication failed"
- Folosește Personal Access Token în loc de parolă
- Sau instalează GitHub CLI: `brew install gh` apoi `gh auth login`

### Vrei să vezi ce fișiere sunt track-uite?
```bash
git ls-files
```

### Vrei să vezi istoricul commit-urilor?
```bash
git log --oneline
```

