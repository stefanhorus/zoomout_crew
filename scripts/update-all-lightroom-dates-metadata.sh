#!/bin/bash

# Script pentru actualizare date și metadata pentru toate fișierele și folderele
# Data țintă: 22 ianuarie 2026, 00:00:00

PACK_FOLDER="/Users/stefanhorus/Documents/Porducts/The-Full-Lightroom-Bundle-Zoomout_crew"
TARGET_DATE="202601220000.00"  # Format: YYYYMMDDhhmm.ss pentru touch
TARGET_DATE_SETFILE="01/22/2026 00:00:00"  # Format pentru SetFile

# Culori pentru output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Actualizare date pentru toate fișierele și folderele ===${NC}"
echo "Folder: $PACK_FOLDER"
echo "Data țintă: 22 ianuarie 2026, 00:00:00"
echo ""

# Funcție pentru actualizare date
update_item_dates() {
    local item="$1"
    
    if [ ! -e "$item" ]; then
        return 1
    fi
    
    # Actualizare modificare date cu touch
    if touch -t "$TARGET_DATE" "$item" 2>/dev/null; then
        # Actualizare creare date cu SetFile (doar pe macOS)
        if command -v SetFile >/dev/null 2>&1; then
            SetFile -d "$TARGET_DATE_SETFILE" "$item" 2>/dev/null || true
            SetFile -m "$TARGET_DATE_SETFILE" "$item" 2>/dev/null || true
        fi
        return 0
    else
        return 1
    fi
}

# Verificare dacă folderul există
if [ ! -d "$PACK_FOLDER" ]; then
    echo -e "${RED}Eroare: Folderul nu există: $PACK_FOLDER${NC}"
    exit 1
fi

# Contoare
files_updated=0
folders_updated=0

echo -e "${GREEN}--- Actualizare date foldere ---${NC}"
# Procesăm folderele de la cel mai adânc nivel către rădăcină
find "$PACK_FOLDER" -type d -depth | while IFS= read -r folder; do
    if update_item_dates "$folder"; then
        folders_updated=$((folders_updated + 1))
    fi
done

echo ""
echo -e "${GREEN}--- Actualizare date fișiere ---${NC}"
# Procesăm toate fișierele
find "$PACK_FOLDER" -type f | while IFS= read -r file; do
    if update_item_dates "$file"; then
        files_updated=$((files_updated + 1))
        if [ $((files_updated % 10)) -eq 0 ]; then
            echo -e "${GREEN}  Procesat: $files_updated fișiere...${NC}"
        fi
    fi
done

# Actualizăm și data folderului principal
echo ""
echo -e "${GREEN}--- Actualizare data folder principal ---${NC}"
update_item_dates "$PACK_FOLDER"

echo ""
echo -e "${GREEN}=== Finalizat ===${NC}"
echo "Fișiere procesate: $files_updated"
echo "Foldere procesate: $folders_updated"
