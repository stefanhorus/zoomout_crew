#!/bin/bash

# Script pentru a obține lista de webhook-uri și signing secret-ul

REVOLUT_SECRET_KEY="sk_X0UMHgvDOfQX_301CGnsBVLXq02KDVe-BPqflVYR1EZICHXPByl2T_dWeHMJPtA5"

echo "🔍 Obținând lista de webhook-uri din Revolut..."
echo ""

# Obține lista de webhook-uri
response=$(curl -s -w "\n%{http_code}" -L -X GET 'https://merchant.revolut.com/api/1.0/webhooks' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $REVOLUT_SECRET_KEY")

# Extrage status code și body
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

echo "📊 Status Code: $http_code"
echo ""

if [ "$http_code" -eq 200 ]; then
    echo "✅ Webhook-uri găsite:"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
    echo ""
    echo "📝 Caută 'signing_secret' în răspunsul de mai sus"
    echo "   și copiază-l pentru a-l adăuga în Vercel ca REVOLUT_WEBHOOK_SECRET"
else
    echo "❌ Eroare: $http_code"
    echo "$body"
fi
