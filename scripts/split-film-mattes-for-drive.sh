#!/bin/bash

# Script pentru împărțirea Film Mattes and Artifacts Pack în părți pentru Google Drive
# Fiecare parte < 15GB pentru a putea fi încărcată pe Google Drive

PACK_FOLDER="/Users/stefanhorus/Documents/Porducts/Film Mattes and Artifacts Pack"
OUTPUT_FOLDER="/Users/stefanhorus/Documents/Porducts/Film_Mattes_Split"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== Împărțire Film Mattes and Artifacts Pack pentru Google Drive ===${NC}"
echo "Folder sursă: $PACK_FOLDER"
echo "Folder destinație: $OUTPUT_FOLDER"
echo ""
echo "📦 Părțile vor fi:"
echo "  Part 1: VIDEO FILM ARTIFACT & FX (9.1GB) + PDF-uri"
echo "  Part 2: VIDEO FILM MATTE (6.7GB)"
echo "  Part 3: STATIC FILM MATTE (213MB) + STATIC FILM ARTIFACT & FX (208MB)"
echo ""

# Creează folderul de output
mkdir -p "$OUTPUT_FOLDER"

# Part 1: VIDEO FILM ARTIFACT & FX + PDF-uri
echo -e "${GREEN}--- Creare Part 1 ---${NC}"
mkdir -p "$OUTPUT_FOLDER/Part_1"
if [ -d "$PACK_FOLDER/VIDEO FILM ARTIFACT & FX" ]; then
    cp -R "$PACK_FOLDER/VIDEO FILM ARTIFACT & FX" "$OUTPUT_FOLDER/Part_1/"
    echo "✓ Copiat: VIDEO FILM ARTIFACT & FX"
fi
# Copiază PDF-urile
find "$PACK_FOLDER" -maxdepth 1 -name "*.pdf" -exec cp {} "$OUTPUT_FOLDER/Part_1/" \;
echo "✓ Copiate: PDF-uri"
echo ""

# Part 2: VIDEO FILM MATTE
echo -e "${GREEN}--- Creare Part 2 ---${NC}"
mkdir -p "$OUTPUT_FOLDER/Part_2"
if [ -d "$PACK_FOLDER/VIDEO FILM MATTE" ]; then
    cp -R "$PACK_FOLDER/VIDEO FILM MATTE" "$OUTPUT_FOLDER/Part_2/"
    echo "✓ Copiat: VIDEO FILM MATTE"
fi
echo ""

# Part 3: STATIC FILM MATTE + STATIC FILM ARTIFACT & FX
echo -e "${GREEN}--- Creare Part 3 ---${NC}"
mkdir -p "$OUTPUT_FOLDER/Part_3"
if [ -d "$PACK_FOLDER/STATIC FILM MATTE" ]; then
    cp -R "$PACK_FOLDER/STATIC FILM MATTE" "$OUTPUT_FOLDER/Part_3/"
    echo "✓ Copiat: STATIC FILM MATTE"
fi
if [ -d "$PACK_FOLDER/STATIC FILM ARTIFACT & FX" ]; then
    cp -R "$PACK_FOLDER/STATIC FILM ARTIFACT & FX" "$OUTPUT_FOLDER/Part_3/"
    echo "✓ Copiat: STATIC FILM ARTIFACT & FX"
fi
echo ""

# Verifică dimensiunile
echo -e "${GREEN}=== Dimensiuni părți ===${NC}"
for part in Part_1 Part_2 Part_3; do
    if [ -d "$OUTPUT_FOLDER/$part" ]; then
        size=$(du -sh "$OUTPUT_FOLDER/$part" | cut -f1)
        echo "$part: $size"
    fi
done

echo ""
echo -e "${GREEN}=== Finalizat ===${NC}"
echo "Părțile sunt în: $OUTPUT_FOLDER"
echo ""
echo "📝 Pași următori:"
echo "  1. Încarcă fiecare parte pe Google Drive în foldere separate"
echo "  2. Obține link-urile pentru fiecare parte"
echo "  3. Actualizează link-urile în cod sau trimite toate link-urile clienților"
