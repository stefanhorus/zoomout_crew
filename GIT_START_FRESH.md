# 🚀 Ghid complet: Git de la zero pentru Zoomout_crew

## ✅ Ce am făcut

- ✓ Șters complet repository-ul Git vechi
- ✓ Șters toate configurațiile Git locale
- ✓ Proiectul este acum "curat" și gata pentru Git nou

---

## 📋 Pași pentru a inițializa Git de la zero

### Pasul 1: Configurează identitatea ta Git (o singură dată)

**Opțiunea A: Configurare globală (pentru toate proiectele)**

```bash
git config --global user.name "Numele Tău"
git config --global user.email "email-ul-tau@example.com"
```

**Opțiunea B: Configurare doar pentru acest proiect**

```bash
cd /Users/stefanhorus/Documents/zoomout_crew
git config user.name "Numele Tău"
git config user.email "email-ul-tau@example.com"
```

> 💡 **Folosește email-ul asociat cu contul tău GitHub!**

---

### Pasul 2: Inițializează repository-ul Git

```bash
cd /Users/stefanhorus/Documents/zoomout_crew
git init
```

---

### Pasul 3: Adaugă toate fișierele

```bash
git add .
```

**Verifică ce fișiere vor fi adăugate:**

```bash
git status
```

---

### Pasul 4: Fă primul commit

```bash
git commit -m "Initial commit: Zoomout_crew website"
```

---

### Pasul 5: Creează repository-ul pe GitHub

1. **Mergi pe:** https://github.com
2. **Loghează-te** în contul tău
3. **Click pe butonul "+"** (sus dreapta) → **"New repository"**
4. **Completează:**
   - **Repository name:** `zoomout_crew` (sau alt nume)
   - **Description:** "Professional aerial footage website"
   - **Visibility:**
     - ✅ **Public** - oricine poate vedea codul
     - 🔒 **Private** - doar tu poți vedea
   - **NU bifa** "Add a README file" (avem deja cod)
   - **NU bifa** "Add .gitignore" (avem deja)
   - **NU bifa** "Choose a license"
5. **Click "Create repository"**

---

### Pasul 6: Conectează repository-ul local cu GitHub

După ce creezi repository-ul, GitHub îți va arăta instrucțiuni. **Înlocuiește `TU_USERNAME` cu username-ul tău de GitHub:**

```bash
# Adaugă remote-ul GitHub
git remote add origin https://github.com/TU_USERNAME/zoomout_crew.git

# Verifică că s-a adăugat corect
git remote -v
```

Ar trebui să vezi:

```
origin  https://github.com/TU_USERNAME/zoomout_crew.git (fetch)
origin  https://github.com/TU_USERNAME/zoomout_crew.git (push)
```

---

### Pasul 7: Trimite codul pe GitHub

```bash
# Setează branch-ul principal ca "main"
git branch -M main

# Trimite codul pe GitHub
git push -u origin main
```

---

## 🔐 Autentificare GitHub

### Dacă te cere username și parolă:

**GitHub nu mai acceptă parola!** Trebuie să folosești un **Personal Access Token**.

#### Cum să obții Personal Access Token:

1. **Mergi pe:** https://github.com/settings/tokens
2. **Click "Generate new token"** → **"Generate new token (classic)"**
3. **Note:** "Zoomout Crew Deploy"
4. **Expiration:** Alege perioada (ex: 90 zile sau No expiration)
5. **Selectează scope:** Bifează `repo` (toate opțiunile sub repo)
6. **Click "Generate token"** (jos pagină)
7. **⚠️ COPIAZĂ TOKEN-UL IMEDIAT!** (nu vei mai putea să-l vezi!)
8. **Când Git te întreabă de parolă:** folosește token-ul în loc de parolă

#### Alternativă: GitHub CLI (mai ușor)

```bash
# Instalează GitHub CLI
brew install gh

# Autentifică-te
gh auth login

# Apoi poți face push normal
git push -u origin main
```

---

## 📝 Comenzi complete (copy-paste)

**Înlocuiește:**

- `Numele Tău` - cu numele tău real
- `email-ul-tau@example.com` - cu email-ul tău GitHub
- `TU_USERNAME` - cu username-ul tău de GitHub

```bash
# 1. Navighează la proiect
cd /Users/stefanhorus/Documents/zoomout_crew

# 2. Configurează Git (o singură dată)
git config --global user.name "Numele Tău"
git config --global user.email "email-ul-tau@example.com"

# 3. Inițializează Git
git init

# 4. Adaugă fișierele
git add .

# 5. Fă primul commit
git commit -m "Initial commit: Zoomout_crew website"

# 6. Conectează cu GitHub (după ce ai creat repo-ul pe GitHub)
git remote add origin https://github.com/TU_USERNAME/zoomout_crew.git

# 7. Trimite pe GitHub
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

După ce faci modificări în cod:

```bash
# 1. Vezi ce s-a schimbat
git status

# 2. Adaugă modificările
git add .

# 3. Fă commit cu mesaj descriptiv
git commit -m "Descriere: ex. 'Improved header styling'"

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

### Vrei să vezi configurația Git?

```bash
git config --list
```

### Vrei să vezi istoricul commit-urilor?

```bash
git log --oneline
```

---

## 🎯 Gata!

Acum ai un repository Git curat, gata să fie conectat cu contul tău GitHub! 🚀
