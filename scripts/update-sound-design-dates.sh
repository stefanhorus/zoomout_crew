#!/bin/bash

# Script pentru actualizarea datelor de creare și modificare
# pentru toate fișierele din folderul Sound Design
# Setează toate datele pe 22 ianuarie 2026

# Culoare pentru output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Data țintă: 22 ianuarie 2026, 00:00:00
TARGET_DATE="202601220000.00"

# Folderul Sound Design (ajustă calea dacă e necesar)
SOUND_DESIGN_FOLDER="${1:-$HOME/Documents/Porducts/Sound Design Pack V1}"

# Verifică dacă folderul există
if [ ! -d "$SOUND_DESIGN_FOLDER" ]; then
    echo -e "${RED}❌ Folderul nu există: $SOUND_DESIGN_FOLDER${NC}"
    echo ""
    echo "📝 Utilizare:"
    echo "  ./scripts/update-sound-design-dates.sh [PATH_TO_FOLDER]"
    echo ""
    echo "Exemplu:"
    echo "  ./scripts/update-sound-design-dates.sh \"$HOME/Documents/Porducts/Sound Design Pack V1\""
    exit 1
fi

echo -e "${BLUE}🔍 Actualizare date pentru fișierele din Sound Design...${NC}"
echo ""
echo -e "📁 Folder: ${GREEN}$SOUND_DESIGN_FOLDER${NC}"
echo -e "📅 Data țintă: ${GREEN}22 ianuarie 2026, 00:00:00${NC}"
echo ""

# Numără fișierele și folderele
TOTAL_FILES=$(find "$SOUND_DESIGN_FOLDER" -type f | wc -l | tr -d ' ')
TOTAL_DIRS=$(find "$SOUND_DESIGN_FOLDER" -type d | wc -l | tr -d ' ')
echo -e "📊 Găsite ${BLUE}$TOTAL_FILES${NC} fișiere și ${BLUE}$TOTAL_DIRS${NC} foldere (inclusiv folderul principal)"
echo ""

# Contoare pentru statistici (folosim fișiere temporare pentru a evita problemele cu subshell-uri)
TEMP_DIR=$(mktemp -d)
UPDATED_FILE="$TEMP_DIR/updated"
SKIPPED_FILE="$TEMP_DIR/skipped"
ERRORS_FILE="$TEMP_DIR/errors"

echo "0" > "$UPDATED_FILE"
echo "0" > "$SKIPPED_FILE"
echo "0" > "$ERRORS_FILE"

# Funcție pentru actualizarea datelor unui fișier sau folder
update_item_dates() {
    local item="$1"
    local itemname=$(basename "$item")
    
    # Verifică dacă item-ul există
    if [ ! -e "$item" ]; then
        return 1
    fi
    
    # Obține datele actuale (macOS)
    local current_created=""
    local current_modified=""
    local item_type=""
    
    if [ -d "$item" ]; then
        item_type="folder"
    elif [ -f "$item" ]; then
        item_type="file"
    else
        return 1
    fi
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS - folosește stat cu formatul BSD
        current_created=$(stat -f "%SB" -t "%Y%m%d%H%M.%S" "$item" 2>/dev/null)
        current_modified=$(stat -f "%Sm" -t "%Y%m%d%H%M.%S" "$item" 2>/dev/null)
    else
        # Linux - folosește stat cu formatul GNU
        current_created=$(stat -c "%y" "$item" 2>/dev/null | cut -d' ' -f1,2 | tr -d ':-' | cut -d'.' -f1)
        current_modified=$(stat -c "%y" "$item" 2>/dev/null | cut -d' ' -f1,2 | tr -d ':-' | cut -d'.' -f1)
    fi
    
    # Verifică dacă datele trebuie actualizate
    if [ "$current_created" = "$TARGET_DATE" ] && [ "$current_modified" = "$TARGET_DATE" ]; then
        echo -e "  ${GREEN}✅${NC} [$item_type] $itemname (deja actualizat)"
        echo $(( $(cat "$SKIPPED_FILE") + 1 )) > "$SKIPPED_FILE"
        return 0
    fi
    
    # Actualizează datele
    local success=0
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS - folosește SetFile pentru a modifica ambele date (funcționează pentru fișiere și foldere)
        if command -v SetFile &> /dev/null; then
            # SetFile -d date -m date item
            # Format date: MM/DD/YYYY HH:MM:SS
            # -d = creation date (data de creare)
            # -m = modification date (data de modificare)
            if SetFile -d "01/22/2026 00:00:00" -m "01/22/2026 00:00:00" "$item" 2>/dev/null; then
                success=1
            else
                # Dacă SetFile eșuează, încercă din nou cu verbose pentru debugging
                echo -e "     ${YELLOW}⚠️  SetFile a eșuat, încerc din nou...${NC}" >&2
                SetFile -d "01/22/2026 00:00:00" -m "01/22/2026 00:00:00" "$item"
                if [ $? -eq 0 ]; then
                    success=1
                fi
            fi
        fi
        
        # Fallback: folosește touch pentru a seta data de modificare
        # Apoi SetFile doar pentru data de creare (dacă e disponibil)
        if [ $success -eq 0 ]; then
            # Setează data de modificare cu touch (funcționează pentru fișiere și foldere)
            if touch -t "$TARGET_DATE" "$item" 2>/dev/null; then
                # Dacă SetFile e disponibil, setează și data de creare
                if command -v SetFile &> /dev/null; then
                    SetFile -d "01/22/2026 00:00:00" "$item" 2>/dev/null
                fi
                success=1
            fi
        fi
    else
        # Linux - folosește touch (modifică doar modified time)
        if touch -t "$TARGET_DATE" "$item" 2>/dev/null; then
            success=1
        fi
    fi
    
    if [ $success -eq 1 ]; then
        echo -e "  ${YELLOW}🔄${NC} [$item_type] $itemname"
        if [ -n "$current_created" ]; then
            echo -e "     ${BLUE}Created:${NC} $current_created → $TARGET_DATE"
        fi
        if [ -n "$current_modified" ]; then
            echo -e "     ${BLUE}Modified:${NC} $current_modified → $TARGET_DATE"
        fi
        echo $(( $(cat "$UPDATED_FILE") + 1 )) > "$UPDATED_FILE"
        return 0
    else
        echo -e "  ${RED}❌${NC} [$item_type] $itemname (eroare la actualizare)"
        echo $(( $(cat "$ERRORS_FILE") + 1 )) > "$ERRORS_FILE"
        return 1
    fi
}

# Procesează toate fișierele
echo -e "${YELLOW}🔄 Actualizare în progres...${NC}"
echo ""

# Verifică dacă SetFile este disponibil pe macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    if ! command -v SetFile &> /dev/null; then
        echo -e "${YELLOW}⚠️  SetFile nu este disponibil.${NC}"
        echo -e "${BLUE}💡 Pentru a modifica ambele date (creare și modificare), instalează Xcode Command Line Tools:${NC}"
        echo -e "   xcode-select --install"
        echo ""
        echo -e "${YELLOW}Continui cu touch (va modifica doar data de modificare)...${NC}"
        echo ""
    else
        echo -e "${GREEN}✅ SetFile este disponibil - voi modifica ambele date (creare și modificare)${NC}"
        echo ""
    fi
fi

# Procesează mai întâi folderul principal, apoi subfolderele, apoi fișierele

echo -e "${BLUE}📁 Procesare folder principal...${NC}"
update_item_dates "$SOUND_DESIGN_FOLDER"

echo ""
echo -e "${BLUE}📁 Procesare subfoldere...${NC}"
# Găsește toate subfolderele (exclude folderul principal) și le sortează invers (subfoldere înainte de părinte)
find "$SOUND_DESIGN_FOLDER" -mindepth 1 -type d | sort -r | while IFS= read -r dir; do
    update_item_dates "$dir"
done

echo ""
echo -e "${BLUE}📄 Procesare fișiere...${NC}"
# Procesează toate fișierele
find "$SOUND_DESIGN_FOLDER" -type f | while IFS= read -r file; do
    update_item_dates "$file"
done

echo ""
echo -e "${GREEN}✅ Actualizare completă!${NC}"
echo ""

# Citește contoarele din fișiere
UPDATED_COUNT=$(cat "$UPDATED_FILE")
SKIPPED_COUNT=$(cat "$SKIPPED_FILE")
ERRORS_COUNT=$(cat "$ERRORS_FILE")

echo -e "📈 Rezumat:"
echo -e "   ${GREEN}✅ Actualizate:${NC} $UPDATED_COUNT iteme (fișiere + foldere)"
echo -e "   ${BLUE}⏭️  Sărite:${NC} $SKIPPED_COUNT iteme (deja actualizate)"
if [ $ERRORS_COUNT -gt 0 ]; then
    echo -e "   ${RED}❌ Erori:${NC} $ERRORS_COUNT iteme"
fi
echo ""

# Curăță fișierele temporare
rm -rf "$TEMP_DIR"

# Verificare finală - arată câteva exemple
echo -e "${BLUE}🔍 Verificare finală:${NC}"
echo ""

# Verifică folderul principal
echo -e "${GREEN}📁 Folder principal:${NC}"
if [[ "$OSTYPE" == "darwin"* ]]; then
    created=$(stat -f "%SB" -t "%d %b %Y %H:%M:%S" "$SOUND_DESIGN_FOLDER" 2>/dev/null)
    modified=$(stat -f "%Sm" -t "%d %b %Y %H:%M:%S" "$SOUND_DESIGN_FOLDER" 2>/dev/null)
else
    created=$(stat -c "%y" "$SOUND_DESIGN_FOLDER" 2>/dev/null | cut -d'.' -f1)
    modified=$(stat -c "%y" "$SOUND_DESIGN_FOLDER" 2>/dev/null | cut -d'.' -f1)
fi
echo -e "   Created: $created"
echo -e "   Modified: $modified"
echo ""

# Verifică primele 3 subfoldere
echo -e "${GREEN}📁 Subfoldere (primele 3):${NC}"
find "$SOUND_DESIGN_FOLDER" -mindepth 1 -maxdepth 1 -type d | head -3 | while read -r dir; do
    if [ -d "$dir" ]; then
        dirname=$(basename "$dir")
        if [[ "$OSTYPE" == "darwin"* ]]; then
            created=$(stat -f "%SB" -t "%d %b %Y %H:%M:%S" "$dir" 2>/dev/null)
            modified=$(stat -f "%Sm" -t "%d %b %Y %H:%M:%S" "$dir" 2>/dev/null)
        else
            created=$(stat -c "%y" "$dir" 2>/dev/null | cut -d'.' -f1)
            modified=$(stat -c "%y" "$dir" 2>/dev/null | cut -d'.' -f1)
        fi
        echo -e "   ${BLUE}$dirname${NC}"
        if [ -n "$created" ]; then
            echo -e "      Created: $created"
        fi
        if [ -n "$modified" ]; then
            echo -e "      Modified: $modified"
        fi
    fi
done
echo ""

# Verifică primele 3 fișiere
echo -e "${GREEN}📄 Fișiere (primele 3):${NC}"
find "$SOUND_DESIGN_FOLDER" -type f | head -3 | while read -r file; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        if [[ "$OSTYPE" == "darwin"* ]]; then
            created=$(stat -f "%SB" -t "%d %b %Y %H:%M:%S" "$file" 2>/dev/null)
            modified=$(stat -f "%Sm" -t "%d %b %Y %H:%M:%S" "$file" 2>/dev/null)
        else
            created=$(stat -c "%y" "$file" 2>/dev/null | cut -d'.' -f1)
            modified=$(stat -c "%y" "$file" 2>/dev/null | cut -d'.' -f1)
        fi
        echo -e "   ${BLUE}$filename${NC}"
        if [ -n "$created" ]; then
            echo -e "      Created: $created"
        fi
        if [ -n "$modified" ]; then
            echo -e "      Modified: $modified"
        fi
    fi
done

echo ""
echo -e "${GREEN}✨ Gata! Toate fișierele au data setată pe 22 ianuarie 2026.${NC}"
