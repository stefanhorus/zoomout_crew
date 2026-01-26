#!/bin/bash

# Script pentru adăugarea metadata la toate fișierele din Film Mattes and Artifacts Pack
# Adaugă copyright, creator, keywords și alte metadata relevante

# Culori pentru output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Metadata values
COPYRIGHT="© 2026 Zoomout_crew. All rights reserved."
CREATOR="Zoomout_crew"
CREATOR_URL="https://zoomout-crew.com"
KEYWORDS="film matte,film overlay,cinematic,video editing,premiere pro,davinci resolve,film artifacts"
DESCRIPTION_BASE="Professional film matte overlay for video editing"

# Folderul Film Mattes and Artifacts Pack
PACK_FOLDER="${1:-$HOME/Documents/Porducts/Film Mattes and Artifacts Pack}"

# Verifică dacă folderul există
if [ ! -d "$PACK_FOLDER" ]; then
    echo -e "${RED}❌ Folderul nu există: $PACK_FOLDER${NC}"
    exit 1
fi

# Verifică dacă exiftool este instalat
if ! command -v exiftool &> /dev/null; then
    echo -e "${RED}❌ exiftool nu este instalat!${NC}"
    echo -e "${YELLOW}💡 Instalează exiftool:${NC}"
    echo -e "   brew install exiftool"
    exit 1
fi

echo -e "${BLUE}🔧 Adăugare metadata pentru Film Mattes and Artifacts Pack...${NC}"
echo ""
echo -e "📁 Folder: ${GREEN}$PACK_FOLDER${NC}"
echo -e "©  Copyright: ${GREEN}$COPYRIGHT${NC}"
echo -e "👤 Creator: ${GREEN}$CREATOR${NC}"
echo ""

# Funcție pentru adăugarea metadata la fișiere PNG
add_png_metadata() {
    local file="$1"
    local folder_name="$2"
    local filename=$(basename "$file")
    
    # Extrage numărul din nume pentru descriere
    local number=$(echo "$filename" | grep -oE '[0-9]+' | head -1)
    local description="$DESCRIPTION_BASE"
    
    if [[ "$folder_name" == *"STATIC FILM MATTE"* ]]; then
        description="Professional static film matte overlay $number for video editing"
    elif [[ "$folder_name" == *"STATIC FILM ARTIFAC"* ]]; then
        description="Professional film artifact overlay $number (scratches, dust, grain)"
    fi
    
    # Adaugă metadata folosind exiftool
    exiftool -overwrite_original \
        -Copyright="$COPYRIGHT" \
        -Artist="$CREATOR" \
        -Creator="$CREATOR" \
        -XMP:Creator="$CREATOR" \
        -XMP:Copyright="$COPYRIGHT" \
        -XMP:CreatorURL="$CREATOR_URL" \
        -Keywords="$KEYWORDS" \
        -XMP:Subject="$KEYWORDS" \
        -Description="$description" \
        -XMP:Description="$description" \
        -Software="Zoomout_crew Film Mattes Pack" \
        -XMP:Software="Zoomout_crew Film Mattes Pack" \
        "$file" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "  ${GREEN}✅${NC} $filename"
        return 0
    else
        echo -e "  ${RED}❌${NC} $filename (eroare)"
        return 1
    fi
}

# Funcție pentru adăugarea metadata la fișiere MOV
add_mov_metadata() {
    local file="$1"
    local folder_name="$2"
    local filename=$(basename "$file")
    
    # Extrage numărul din nume pentru descriere
    local number=$(echo "$filename" | grep -oE '[0-9]+' | head -1)
    local description="$DESCRIPTION_BASE"
    
    if [[ "$folder_name" == *"VIDEO FILM MATTE"* ]]; then
        description="Professional animated film matte overlay $number for video editing"
    elif [[ "$folder_name" == *"VIDEO FILM ARTIFAC"* ]]; then
        description="Professional animated film artifact overlay $number (scratches, dust, grain)"
    fi
    
    # Adaugă metadata folosind exiftool
    exiftool -overwrite_original \
        -Copyright="$COPYRIGHT" \
        -Artist="$CREATOR" \
        -Creator="$CREATOR" \
        -XMP:Creator="$CREATOR" \
        -XMP:Copyright="$COPYRIGHT" \
        -XMP:CreatorURL="$CREATOR_URL" \
        -Keywords="$KEYWORDS" \
        -XMP:Subject="$KEYWORDS" \
        -Description="$description" \
        -XMP:Description="$description" \
        -Software="Zoomout_crew Film Mattes Pack" \
        -XMP:Software="Zoomout_crew Film Mattes Pack" \
        "$file" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "  ${GREEN}✅${NC} $filename"
        return 0
    else
        echo -e "  ${RED}❌${NC} $filename (eroare)"
        return 1
    fi
}

# Contoare pentru statistici
TOTAL_FILES=0
SUCCESS_COUNT=0
ERROR_COUNT=0

# Procesează toate fișierele PNG
echo -e "${BLUE}📄 Procesare fișiere PNG...${NC}"
find "$PACK_FOLDER" -type f \( -name "*.png" -o -name "*.PNG" \) | while IFS= read -r file; do
    folder_name=$(dirname "$file")
    if add_png_metadata "$file" "$folder_name"; then
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
        ERROR_COUNT=$((ERROR_COUNT + 1))
    fi
    TOTAL_FILES=$((TOTAL_FILES + 1))
done

# Procesează toate fișierele MOV
echo ""
echo -e "${BLUE}🎬 Procesare fișiere MOV...${NC}"
find "$PACK_FOLDER" -type f \( -name "*.mov" -o -name "*.MOV" -o -name "*.mp4" -o -name "*.MP4" \) | while IFS= read -r file; do
    folder_name=$(dirname "$file")
    if add_mov_metadata "$file" "$folder_name"; then
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
        ERROR_COUNT=$((ERROR_COUNT + 1))
    fi
    TOTAL_FILES=$((TOTAL_FILES + 1))
done

echo ""
echo -e "${GREEN}✅ Gata! Metadata a fost adăugată pentru toate fișierele.${NC}"
echo ""
echo -e "📈 Rezumat:"
echo -e "   ${GREEN}✅ Succes:${NC} $SUCCESS_COUNT fișiere"
if [ $ERROR_COUNT -gt 0 ]; then
    echo -e "   ${RED}❌ Erori:${NC} $ERROR_COUNT fișiere"
fi
echo ""

# Verificare finală - arată metadata pentru un fișier exemplu
echo -e "${BLUE}🔍 Verificare metadata (exemplu):${NC}"
FIRST_PNG=$(find "$PACK_FOLDER" -type f \( -name "*.png" -o -name "*.PNG" \) | head -1)
if [ -n "$FIRST_PNG" ]; then
    echo -e "${GREEN}📄 $(basename "$FIRST_PNG"):${NC}"
    exiftool -Copyright -Creator -Keywords -Description "$FIRST_PNG" 2>/dev/null | head -5
fi

FIRST_MOV=$(find "$PACK_FOLDER" -type f \( -name "*.mov" -o -name "*.MOV" \) | head -1)
if [ -n "$FIRST_MOV" ]; then
    echo ""
    echo -e "${GREEN}🎬 $(basename "$FIRST_MOV"):${NC}"
    exiftool -Copyright -Creator -Keywords -Description "$FIRST_MOV" 2>/dev/null | head -5
fi
