#!/bin/bash

# Script rapid pentru a fixa doar data de modificare pentru folderul Sound Design
# Setează data de modificare pe 22 ianuarie 2026

# Culoare pentru output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Data țintă: 22 ianuarie 2026, 00:00:00
TARGET_DATE="202601220000.00"

# Folderul Sound Design
SOUND_DESIGN_FOLDER="${1:-$HOME/Documents/Porducts/Sound Design Pack V1}"

if [ ! -d "$SOUND_DESIGN_FOLDER" ]; then
    echo "❌ Folderul nu există: $SOUND_DESIGN_FOLDER"
    exit 1
fi

echo -e "${BLUE}🔧 Fixare data de modificare pentru folderul Sound Design...${NC}"
echo ""
echo -e "📁 Folder: ${GREEN}$SOUND_DESIGN_FOLDER${NC}"
echo -e "📅 Data țintă: ${GREEN}22 ianuarie 2026, 00:00:00${NC}"
echo ""

# Funcție pentru fixarea datei de modificare
fix_modified_date() {
    local item="$1"
    local itemname=$(basename "$item")
    local item_type=""
    
    if [ -d "$item" ]; then
        item_type="folder"
    elif [ -f "$item" ]; then
        item_type="file"
    else
        return 1
    fi
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS - folosește SetFile pentru a seta data de modificare
        if command -v SetFile &> /dev/null; then
            # Setează doar data de modificare (-m)
            if SetFile -m "01/22/2026 00:00:00" "$item" 2>/dev/null; then
                echo -e "  ${GREEN}✅${NC} [$item_type] $itemname"
                return 0
            fi
        fi
        
        # Fallback la touch
        if touch -t "$TARGET_DATE" "$item" 2>/dev/null; then
            echo -e "  ${GREEN}✅${NC} [$item_type] $itemname"
            return 0
        fi
    else
        # Linux - folosește touch
        if touch -t "$TARGET_DATE" "$item" 2>/dev/null; then
            echo -e "  ${GREEN}✅${NC} [$item_type] $itemname"
            return 0
        fi
    fi
    
    echo -e "  ${YELLOW}⚠️${NC} [$item_type] $itemname (eroare)"
    return 1
}

echo -e "${YELLOW}🔄 Actualizare data de modificare...${NC}"
echo ""

# Fixează folderul principal
echo -e "${BLUE}📁 Folder principal:${NC}"
fix_modified_date "$SOUND_DESIGN_FOLDER"

# Fixează toate subfolderele
echo ""
echo -e "${BLUE}📁 Subfoldere:${NC}"
find "$SOUND_DESIGN_FOLDER" -mindepth 1 -type d | sort | while IFS= read -r dir; do
    fix_modified_date "$dir"
done

# Fixează toate fișierele
echo ""
echo -e "${BLUE}📄 Fișiere:${NC}"
find "$SOUND_DESIGN_FOLDER" -type f | while IFS= read -r file; do
    fix_modified_date "$file"
done

echo ""
echo -e "${GREEN}✅ Gata! Data de modificare a fost setată pe 22 ianuarie 2026 pentru toate itemele.${NC}"
echo ""

# Verificare finală
echo -e "${BLUE}🔍 Verificare folder principal:${NC}"
if [[ "$OSTYPE" == "darwin"* ]]; then
    created=$(stat -f "%SB" -t "%d %b %Y %H:%M:%S" "$SOUND_DESIGN_FOLDER" 2>/dev/null)
    modified=$(stat -f "%Sm" -t "%d %b %Y %H:%M:%S" "$SOUND_DESIGN_FOLDER" 2>/dev/null)
    echo -e "   Created: $created"
    echo -e "   Modified: $modified"
fi
