# Configurare Stripe pentru Plăți cu Cardul

Acest ghid te va ajuta să configurezi Stripe pentru procesarea plăților cu cardul pe site-ul tău.

## Pași de Configurare

### 1. Creează un cont Stripe

1. Mergi pe [https://stripe.com](https://stripe.com)
2. Creează un cont nou sau conectează-te la contul existent
3. Completează informațiile despre PFA-ul tău

### 2. Obține Cheile API

1. După ce te-ai conectat, mergi la [Dashboard > Developers > API keys](https://dashboard.stripe.com/test/apikeys)
2. Găsește secțiunea "Secret key" și copiază cheia
3. Pentru testare, folosește cheile din modul "Test mode"
4. Pentru producție, activează "Live mode" și copiază cheile live

### 3. Configurează Variabilele de Mediu

Creează un fișier `.env.local` în root-ul proiectului (dacă nu există deja) și adaugă:

```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_...  # Pentru testare
# STRIPE_SECRET_KEY=sk_live_...  # Pentru producție (decomentează când ești gata)

# URL-ul de bază al site-ului (pentru redirect-uri după plată)
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # Pentru development
# NEXT_PUBLIC_BASE_URL=https://domeniul-tau.ro  # Pentru producție
```

**IMPORTANT:**
- Nu comite niciodată fișierul `.env.local` în Git (ar trebui să fie deja în `.gitignore`)
- Folosește cheile de test pentru development
- Activează cheile live doar când site-ul este gata pentru producție

### 4. Testează Integrarea

1. Pornește serverul de development:
   ```bash
   npm run dev
   ```

2. Mergi pe pagina shop și adaugă produse în coș
3. Apasă "Finalizează comanda"
4. Folosește cardurile de test Stripe:
   - **Card valid:** `4242 4242 4242 4242`
   - **Data expirare:** orice dată viitoare (ex: `12/34`)
   - **CVC:** orice 3 cifre (ex: `123`)
   - **ZIP:** orice 5 cifre (ex: `12345`)

### 5. Carduri de Test Stripe

Stripe oferă mai multe carduri de test pentru diferite scenarii:

- **Plată reușită:** `4242 4242 4242 4242`
- **Plată refuzată:** `4000 0000 0000 0002`
- **Necesită autentificare 3D Secure:** `4000 0025 0000 3155`

Vezi [documentația completă](https://stripe.com/docs/testing) pentru mai multe opțiuni.

### 6. Configurează Webhook-uri pentru Email-uri de Confirmare

Pentru a trimite automat email-uri de confirmare după fiecare plată:

1. **Pentru Development (folosind Stripe CLI):**
   ```bash
   # Instalează Stripe CLI: https://stripe.com/docs/stripe-cli
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   - Stripe CLI va afișa un "Signing secret" (începe cu `whsec_...`)
   - Adaugă-l în `.env.local`:
     ```env
     STRIPE_WEBHOOK_SECRET=whsec_...
     ```

2. **Pentru Producție:**
   - Mergi la [Dashboard > Developers > Webhooks](https://dashboard.stripe.com/webhooks)
   - Click "Add endpoint"
   - **Endpoint URL:** `https://domeniul-tau.ro/api/webhooks/stripe`
   - **Events to send:** Selectează `checkout.session.completed`
   - Click "Add endpoint"
   - Copiază "Signing secret" și adaugă-l în `.env.local`:
     ```env
     STRIPE_WEBHOOK_SECRET=whsec_...
     ```

3. **Verifică că Resend este configurat:**
   - Asigură-te că `RESEND_API_KEY` este setat în `.env.local`
   - Asigură-te că `EMAIL_FROM` este setat (ex: `Zoomout Crew <contact@zoomoutcrew.com>`)

## Structura Implementării

### API Routes

- `/app/api/checkout/route.ts` - Creează sesiunea de checkout Stripe
- `/app/api/checkout/session/route.ts` - Returnează detaliile unei sesiuni
- `/app/api/webhooks/stripe/route.ts` - Webhook pentru procesarea evenimentelor Stripe și trimiterea email-urilor de confirmare

### Pagini

- `/app/checkout/success/page.tsx` - Pagina de succes după plată
- `/app/checkout/cancel/page.tsx` - Pagina de anulare

### Componente

- `/components/Cart.tsx` - Actualizat cu funcționalitate de checkout

## Monedă

Sistemul este configurat pentru **Lei românești (RON)**. Dacă vrei să schimbi moneda, modifică:

1. În `/app/api/checkout/route.ts`: `currency: "ron"`
2. În funcțiile `formatPrice`: `currency: "RON"`

## Securitate

- ✅ Cheile Stripe sunt stocate în variabile de mediu (nu în cod)
- ✅ Validarea se face pe server (API routes)
- ✅ Stripe procesează direct cardurile (nu trec prin serverul tău)
- ✅ Folosește HTTPS în producție

## Suport

Dacă întâmpini probleme:

1. Verifică că variabilele de mediu sunt setate corect
2. Verifică console-ul browser-ului pentru erori
3. Verifică logs-urile serverului
4. Consultă [documentația Stripe](https://stripe.com/docs)

## Gata pentru Producție

Când ești gata să activezi plățile reale:

1. Activează "Live mode" în Stripe Dashboard
2. Copiază cheile live în `.env.local`
3. Actualizează `NEXT_PUBLIC_BASE_URL` cu domeniul tău real
4. Testează cu un card real cu o sumă mică
5. Configurează webhook-urile pentru notificări

