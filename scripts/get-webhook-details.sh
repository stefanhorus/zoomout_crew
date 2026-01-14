#!/bin/bash

# Script pentru a obține detaliile unui webhook și signing secret-ul

REVOLUT_SECRET_KEY="sk_X0UMHgvDOfQX_301CGnsBVLXq02KDVe-BPqflVYR1EZICHXPByl2T_dWeHMJPtA5"
WEBHOOK_ID="1896c6d4-8167-413b-a0a1-4fef698a601c"

echo "🔍 Obținând detaliile webhook-ului..."
echo "📋 Webhook ID: $WEBHOOK_ID"
echo ""

# Obține detaliile webhook-ului
response=$(curl -s -w "\n%{http_code}" -L -X GET "https://merchant.revolut.com/api/1.0/webhooks/$WEBHOOK_ID" \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $REVOLUT_SECRET_KEY")

# Extrage status code și body
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

echo "📊 Status Code: $http_code"
echo ""

if [ "$http_code" -eq 200 ]; then
    echo "✅ Detalii webhook:"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
    echo ""
    
    # Extrage signing_secret dacă există
    signing_secret=$(echo "$body" | jq -r '.signing_secret // empty' 2>/dev/null)
    
    if [ -n "$signing_secret" ] && [ "$signing_secret" != "null" ]; then
        echo "🎉 SIGNING SECRET GĂSIT:"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "$signing_secret"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "📝 Adaugă acest signing secret în Vercel:"
        echo "   1. Mergi în Vercel Dashboard → Project → Settings → Environment Variables"
        echo "   2. Adaugă: REVOLUT_WEBHOOK_SECRET = $signing_secret"
        echo "   3. Redeploy aplicația"
    else
        echo "⚠️  signing_secret nu apare în răspuns"
        echo "   Poate trebuie să folosești 'Rotate webhook signing secret' pentru a-l genera"
    fi
else
    echo "❌ Eroare: $http_code"
    echo "$body"
fi
