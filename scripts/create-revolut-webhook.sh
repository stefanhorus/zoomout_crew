#!/bin/bash

# Script pentru a crea webhook în Revolut
# Folosește REVOLUT_SECRET_KEY din .env.local

# Verifică dacă există .env.local
if [ ! -f .env.local ]; then
    echo "❌ Fișierul .env.local nu există!"
    echo "Creează .env.local și adaugă REVOLUT_SECRET_KEY=your_key_here"
    exit 1
fi

# Încarcă variabilele de mediu
export $(cat .env.local | grep -v '^#' | xargs)

# Verifică dacă REVOLUT_SECRET_KEY este setat
if [ -z "$REVOLUT_SECRET_KEY" ]; then
    echo "❌ REVOLUT_SECRET_KEY nu este setat în .env.local!"
    exit 1
fi

echo "🔧 Creând webhook în Revolut..."
echo "📡 URL: https://zoomoutcrew.com/api/webhooks/revolut"
echo ""

# Creează webhook-ul
response=$(curl -s -w "\n%{http_code}" -L -X POST 'https://merchant.revolut.com/api/1.0/webhooks' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $REVOLUT_SECRET_KEY" \
  --data-raw '{
    "url": "https://zoomoutcrew.com/api/webhooks/revolut",
    "events": [
      "ORDER_COMPLETED",
      "ORDER_AUTHORISED"
    ]
  }')

# Extrage status code și body
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

echo "📊 Status Code: $http_code"
echo "📋 Response:"
echo "$body" | jq '.' 2>/dev/null || echo "$body"

if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
    echo ""
    echo "✅ Webhook creat cu succes!"
    echo ""
    echo "📝 IMPORTANT: Copiază 'signing_secret' din răspunsul de mai sus"
    echo "   și adaugă-l în Vercel ca variabilă de mediu: REVOLUT_WEBHOOK_SECRET"
else
    echo ""
    echo "❌ Eroare la crearea webhook-ului"
    echo "Verifică dacă:"
    echo "  - REVOLUT_SECRET_KEY este corect"
    echo "  - Nu ai deja 10 webhook-uri create (limita Revolut)"
    echo "  - URL-ul este accesibil public"
fi
