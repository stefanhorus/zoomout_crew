# 🧪 Ghid de Testare - Fix-uri Email și Download Links

Acest ghid explică cum să testezi fix-urile pentru:
1. ✅ Prețul corect în email (nu mai apare 0 lei)
2. ✅ Link-urile de download pentru produse digitale (wallpaper pack, etc.)

## 📋 Metode de Testare

### Metoda 1: Test Rapid (Fără Server) ⚡

Testează direct funcțiile helper fără să pornești serverul:

```bash
npm run test:email
```

Acest script testează:
- ✅ Detectarea produselor digitale
- ✅ Găsirea link-urilor de download
- ✅ Generarea email-ului
- ✅ Verificarea prețului în email

**Rezultat așteptat:**
- Toate testele trebuie să treacă cu ✅
- Prețul în email trebuie să fie corect (nu 0.00)
- Link-urile de download trebuie să fie găsite

---

### Metoda 2: Test Local cu Server 🖥️

1. **Pornește serverul local:**
   ```bash
   npm run dev
   ```

2. **În alt terminal, rulează scriptul de test webhook:**
   ```bash
   npm run test:webhook
   ```

3. **Folosește curl pentru a simula webhook-ul:**
   ```bash
   # Copiază comanda din output-ul scriptului și rulează-o
   curl -X POST http://localhost:3000/api/webhooks/revolut \
     -H "Content-Type: application/json" \
     -H "revolut-signature: [signature]" \
     -H "revolut-request-timestamp: [timestamp]" \
     -d '{"event":"ORDER_COMPLETED","order_id":"test_123"}'
   ```

**Verifică:**
- Console logs pentru debugging info
- Verifică dacă email-ul este generat corect
- Verifică dacă prețul este calculat corect

---

### Metoda 3: Test Real cu Comandă 🛒 (RECOMANDAT)

Cea mai bună metodă pentru a testa fix-urile este să faci o comandă reală:

1. **Pornește serverul:**
   ```bash
   npm run dev
   ```

2. **Deschide shop-ul în browser:**
   ```
   http://localhost:3000/shop
   ```

3. **Adaugă "Majestic Wallpaper Pack" în coș**

4. **Finalizează comanda** (folosește Revolut test mode dacă e posibil)

5. **Verifică:**
   - ✅ **Console logs** - ar trebui să vezi:
     ```
     💰 Email amount calculation: { originalAmountTotal: 4999, calculatedEmailAmount: 4999, ... }
     🔍 Checking product for download: { productName: "Majestic Wallpaper Pack", isDigital: true }
     ✅ Added download link for: Majestic Wallpaper Pack
     📦 Digital downloads collected: { count: 1, ... }
     ```
   
   - ✅ **Email primit** - ar trebui să conțină:
     - Preț corect (ex: 49.99 RON, nu 0.00 RON)
     - Link de download pentru wallpaper pack
     - Secțiunea "Descarcă Produsele Tale Digitale"
   
   - ✅ **MongoDB** - verifică dacă comanda este salvată cu prețul corect

---

### Metoda 4: Test în Producție 🌐

După deploy pe Vercel/producție:

1. **Fă o comandă de test** (folosește un produs ieftin sau test mode)

2. **Verifică logs în Vercel:**
   - Mergi la Dashboard → Project → Functions → Logs
   - Caută log-urile webhook-ului
   - Verifică dacă vezi mesajele de debugging

3. **Verifică email-ul primit:**
   - Preț corect
   - Link-uri de download prezente

---

## 🔍 Ce să Verifici

### ✅ Prețul în Email

**Înainte de fix:**
- Email arăta: `Total: 0.00 RON`

**După fix:**
- Email ar trebui să arate: `Total: 49.99 RON` (sau prețul real)

**Cum verifici:**
1. Deschide email-ul primit
2. Caută secțiunea "Detalii Comandă"
3. Verifică dacă prețul este corect

### ✅ Link-uri de Download

**Înainte de fix:**
- Email nu conținea link-uri de download
- Sau link-urile lipseau pentru anumite produse

**După fix:**
- Email conține secțiunea "Descarcă Produsele Tale Digitale"
- Fiecare produs digital are un buton "Descarcă Acum"
- Link-urile funcționează

**Cum verifici:**
1. Deschide email-ul primit
2. Caută secțiunea cu download links
3. Click pe butonul "Descarcă Acum"
4. Verifică dacă link-ul te duce la Google Drive/MEGA

---

## 🐛 Debugging

### Dacă prețul este încă 0 lei:

1. **Verifică console logs:**
   ```bash
   # Caută în logs:
   💰 Email amount calculation
   ```

2. **Verifică dacă `amountTotal` este 0:**
   - Dacă da, verifică dacă `amountRON` sau `amountInCurrencyDecimal` sunt calculate corect
   - Verifică dacă metadata din Revolut conține `total_amount_ron`

3. **Verifică variabilele de mediu:**
   - `REVOLUT_SECRET_KEY` - trebuie să fie setat
   - `RESEND_API_KEY` - pentru trimiterea email-urilor

### Dacă link-urile de download lipsesc:

1. **Verifică console logs:**
   ```bash
   # Caută în logs:
   🔍 Checking product for download
   ⚠️ Product not recognized as digital
   ⚠️ No download URL found for product
   ```

2. **Verifică numele produsului:**
   - Numele din Revolut trebuie să se potrivească cu numele din `digital-products.ts`
   - Potrivirea este case-insensitive și suportă variații

3. **Testează manual:**
   ```bash
   npm run test:email
   ```
   - Verifică dacă produsul tău este detectat ca digital
   - Verifică dacă link-ul este găsit

---

## 📝 Logs Utile

Când rulezi testele sau procesezi o comandă, caută aceste mesaje în console:

### ✅ Logs de Succes:
```
✅ Order saved to MongoDB successfully
✅ Purchase confirmation email sent successfully!
✅ Added download link for: [Product Name]
💰 Email amount calculation: { calculatedEmailAmount: 4999, ... }
```

### ⚠️ Logs de Avertizare:
```
⚠️ Product not recognized as digital: [Product Name]
⚠️ No download URL found for product: [Product Name]
⚠️ REVOLUT_WEBHOOK_SECRET not set
```

### ❌ Logs de Eroare:
```
❌ Error processing Revolut order
❌ Error sending purchase confirmation email
❌ No customer email found in order
```

---

## 🎯 Checklist de Testare

Înainte de a considera fix-urile complete, verifică:

- [ ] Test rapid (`npm run test:email`) trece cu succes
- [ ] Prețul în email este corect (nu 0.00)
- [ ] Link-urile de download sunt prezente în email
- [ ] Link-urile de download funcționează (du-te la Google Drive/MEGA)
- [ ] Toate produsele digitale au link-uri (LUTs, Wallpapers, Sound Design, etc.)
- [ ] Logs-urile arată calculul corect al prețului
- [ ] Logs-urile arată detectarea corectă a produselor digitale
- [ ] Comanda este salvată corect în MongoDB cu prețul corect

---

## 💡 Tips

1. **Folosește email-ul tău de test** pentru a primi email-urile rapid
2. **Verifică spam folder** dacă nu primești email-uri
3. **Folosește Revolut test mode** dacă e posibil pentru testări fără costuri reale
4. **Verifică logs în timp real** când procesezi o comandă
5. **Testează cu diferite produse** pentru a verifica că toate funcționează

---

## 🆘 Dacă Ceva Nu Funcționează

1. **Verifică logs** - sunt foarte detaliate acum
2. **Rulează test rapid** - `npm run test:email`
3. **Verifică variabilele de mediu** - toate sunt setate corect?
4. **Verifică numele produselor** - se potrivesc exact cu cele din `digital-products.ts`?
5. **Contactează support** - dacă problema persistă, trimite logs-urile

---

**Ultima actualizare:** 2026-01-27
**Fix-uri testate:** Preț email + Download links
