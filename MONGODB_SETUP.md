# MongoDB Setup pentru Zoomout Crew

## Pași pentru configurare:

### 1. Creează un cont MongoDB Atlas (gratuit)
   - Mergi pe https://www.mongodb.com/cloud/atlas/register
   - Creează un cluster gratuit (M0 Free Tier)
   - Notează connection string-ul

### 2. Configurează Environment Variables
   Adaugă în `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zoomout_crew?retryWrites=true&w=majority
   ```

### 3. Structura bazei de date

**Collection: orders**

Fiecare document conține:
- `orderId` (string, unique) - ID din Stripe/Revolut sau free-{timestamp}
- `provider` (string) - "stripe" | "revolut" | "free"
- `customerEmail` (string)
- `amountRON` (number) - Prețul exact în RON la momentul checkout-ului
- `amountCurrency` (number) - Prețul în currency-ul selectat
- `currency` (string) - RON, EUR, USD, GBP
- `status` (string) - paid, COMPLETED, AUTHORISED, completed
- `paymentIntentId` (string, optional)
- `items` (array) - Lista de produse
- `discountPercentage` (number, optional)
- `discountCode` (string, optional)
- `metadata` (object) - Informații suplimentare
- `createdAt` (date) - Automat generat
- `updatedAt` (date) - Automat generat

## Beneficii:

✅ **Performanță**: Query-uri rapide din baza de date locală
✅ **Fiabilitate**: Nu depinde de API-uri externe pentru afișare
✅ **Istoric complet**: Toate comenzile sunt salvate permanent
✅ **Backup**: MongoDB Atlas oferă backup automat
✅ **Scalabilitate**: Ușor de extins cu funcționalități noi

## Index-uri create automat:

- `orderId` - pentru căutări rapide
- `createdAt` - pentru sortare
- `customerEmail + createdAt` - pentru query-uri pe client
- `status + createdAt` - pentru filtrare pe status

## Migrare comenzilor existente:

Comenzile noi vor fi salvate automat în MongoDB. Pentru comenzile vechi din Stripe/Revolut, ele vor fi sincronizate automat când webhook-urile se declanșează din nou sau poți crea un script de migrare dacă este necesar.
