# Mux Setup pentru next-video

## 1. Configurează token-urile Mux

Creează un fișier `.env.local` în root-ul proiectului și adaugă token-urile tale Mux:

```env
MUX_TOKEN_ID=f46f2f44-3d7d-4138-a069-6b68a9f26ef4
MUX_TOKEN_SECRET=hCdxC7pDfVAEyX9F7Z2FMzTfQ4DFqlw0COHbYw4M.
```

**IMPORTANT:** Nu commit-ui `.env.local` în git! Este deja în `.gitignore`.

## 2. Sincronizează video-ul cu Mux

După ce ai adăugat token-urile, rulează:

```bash
npx next-video sync
```

Această comandă va încărca video-ul din `/videos/bg.mp4` pe Mux și va crea fișierul `bg.mp4.json` cu metadata.

## 3. Deploy pe Vercel

Pentru producție, adaugă variabilele de mediu în Vercel:
1. Mergi la **Settings** → **Environment Variables**
2. Adaugă:
   - `MUX_TOKEN_ID` = `f46f2f44-3d7d-4138-a069-6b68a9f26ef4`
   - `MUX_TOKEN_SECRET` = `hCdxC7pDfVAEyX9F7Z2FMzTfQ4DFqlw0COHbYw4M.`

## 4. Testează

După deploy, video-ul ar trebui să se încarce automat de pe Mux folosind `next-video`.





