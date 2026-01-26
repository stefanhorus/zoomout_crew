#!/bin/bash

# Script pentru redenumirea și actualizarea datelor pentru Transitions & Burns Overlays
# Redenumește fișierele conform cerințelor și setează data pe 22 ianuarie 2026

# Culori pentru output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Data țintă: 22 ianuarie 2026, 00:00:00
TARGET_DATE="202601220000.00"

# Folderul Transitions & Burns Overlays
PACK_FOLDER="${1:-$HOME/Documents/Porducts/Transitions & Burns Overlays}"

# Verifică dacă folderul există
if [ ! -d "$PACK_FOLDER" ]; then
    echo -e "${RED}❌ Folderul nu există: $PACK_FOLDER${NC}"
    exit 1
fi

echo -e "${BLUE}🔧 Redenumire și actualizare date pentru Transitions & Burns Overlays...${NC}"
echo ""
echo -e "📁 Folder: ${GREEN}$PACK_FOLDER${NC}"
echo -e "📅 Data țintă: ${GREEN}22 ianuarie 2026, 00:00:00${NC}"
echo ""

# Funcție pentru actualizarea datelor unui fișier sau folder
update_item_dates() {
    local item="$1"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS - folosește SetFile pentru a modifica ambele date
        if command -v SetFile &> /dev/null; then
            # Încearcă SetFile pentru ambele date
            if SetFile -d "01/22/2026 00:00:00" -m "01/22/2026 00:00:00" "$item" 2>/dev/null; then
                return 0
            else
                # Dacă SetFile eșuează, folosește touch pentru modified date
                if touch -t "$TARGET_DATE" "$item" 2>/dev/null; then
                    # Apoi încearcă SetFile doar pentru creation date
                    SetFile -d "01/22/2026 00:00:00" "$item" 2>/dev/null
                    return 0
                fi
            fi
        else
            # Fallback la touch
            touch -t "$TARGET_DATE" "$item" 2>/dev/null
            return $?
        fi
    else
        # Linux - folosește touch
        touch -t "$TARGET_DATE" "$item" 2>/dev/null
        return $?
    fi
    return 1
}

# Funcție pentru redenumirea fișierelor din STATIC FILM BURN
rename_static_film_burn() {
    local folder="$PACK_FOLDER/STATIC FILM BURN"
    if [ ! -d "$folder" ]; then
        echo -e "${YELLOW}⚠️  Folderul STATIC FILM BURN nu există${NC}"
        return
    fi
    
    echo -e "${BLUE}📁 Redenumire fișiere în STATIC FILM BURN...${NC}"
    local count=1
    
    while IFS= read -r file; do
        local dir=$(dirname "$file")
        local ext="${file##*.}"
        local new_name=$(printf "Film_burn Zoomout_crew_%02d.%s" "$count" "$ext")
        local new_path="$dir/$new_name"
        
        if [ "$file" != "$new_path" ]; then
            if mv "$file" "$new_path" 2>&1; then
                echo -e "  ${GREEN}✅${NC} $(basename "$file") → $new_name"
                update_item_dates "$new_path"
            else
                echo -e "  ${RED}❌${NC} Eroare la redenumire: $(basename "$file")"
            fi
        else
            update_item_dates "$file"
        fi
        count=$((count + 1))
    done < <(find "$folder" -type f \( -name "*.png" -o -name "*.PNG" \) | sort -V)
}

# Funcție pentru redenumirea fișierelor din VIDEO FILM BURN
rename_video_film_burn() {
    local folder="$PACK_FOLDER/VIDEO FILM BURN"
    if [ ! -d "$folder" ]; then
        echo -e "${YELLOW}⚠️  Folderul VIDEO FILM BURN nu există${NC}"
        return
    fi
    
    echo -e "${BLUE}📁 Redenumire fișiere în VIDEO FILM BURN...${NC}"
    local count=1
    
    while IFS= read -r file; do
        local dir=$(dirname "$file")
        local ext="${file##*.}"
        local new_name=$(printf "Film_burn_by_Zoomout_crew_%02d.%s" "$count" "$ext")
        local new_path="$dir/$new_name"
        
        if [ "$file" != "$new_path" ]; then
            if mv "$file" "$new_path" 2>&1; then
                echo -e "  ${GREEN}✅${NC} $(basename "$file") → $new_name"
                update_item_dates "$new_path"
            else
                echo -e "  ${RED}❌${NC} Eroare la redenumire: $(basename "$file")"
            fi
        else
            update_item_dates "$file"
        fi
        count=$((count + 1))
    done < <(find "$folder" -type f \( -name "*.mov" -o -name "*.MOV" -o -name "*.mp4" -o -name "*.MP4" \) | sort -V)
}

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

# Redenumește fișierele în fiecare folder
rename_static_film_burn
echo ""
rename_video_film_burn
echo ""

# Actualizează datele pentru toate subfolderele
echo -e "${BLUE}📅 Actualizare date pentru foldere...${NC}"
# Procesează folderele în ordine inversă (subfoldere înainte de părinte)
find "$PACK_FOLDER" -type d | sort -r | while IFS= read -r dir; do
    if update_item_dates "$dir" 2>/dev/null; then
        echo -e "  ${GREEN}✅${NC} $(basename "$dir")"
    fi
done

# Încearcă să actualizeze folderul principal (poate eșua din cauza permisiunilor)
if update_item_dates "$PACK_FOLDER" 2>/dev/null; then
    echo -e "  ${GREEN}✅${NC} Folder principal"
else
    echo -e "  ${YELLOW}⚠️${NC} Folder principal (nu poate fi actualizat - restricții permisiuni)"
fi

# Actualizează datele pentru toate fișierele (inclusiv PDF-urile din root)
echo -e "${BLUE}📅 Actualizare date pentru toate fișierele (inclusiv PDF-uri)...${NC}"
find "$PACK_FOLDER" -type f | while IFS= read -r file; do
    update_item_dates "$file"
done

# Forțează actualizarea pentru PDF-urile din root (dacă există)
echo -e "${BLUE}📄 Actualizare date pentru PDF-uri...${NC}"
find "$PACK_FOLDER" -maxdepth 1 -type f \( -name "*.pdf" -o -name "*.PDF" \) | while IFS= read -r pdf; do
    if update_item_dates "$pdf" 2>/dev/null; then
        echo -e "  ${GREEN}✅${NC} $(basename "$pdf")"
    fi
done

echo ""
echo -e "${GREEN}✅ Gata! Toate fișierele au fost redenumite și datele au fost setate pe 22 ianuarie 2026.${NC}"
echo ""

# Verificare finală
echo -e "${BLUE}🔍 Verificare finală:${NC}"
if [[ "$OSTYPE" == "darwin"* ]]; then
    created=$(stat -f "%SB" -t "%d %b %Y %H:%M:%S" "$PACK_FOLDER" 2>/dev/null)
    modified=$(stat -f "%Sm" -t "%d %b %Y %H:%M:%S" "$PACK_FOLDER" 2>/dev/null)
    echo -e "   Folder principal - Created: $created"
    echo -e "   Folder principal - Modified: $modified"
fi
