#!/bin/bash

# Script pentru redenumire preseturi Lightroom (spații → _) și actualizare date
# Data țintă: 22 ianuarie 2026, 00:00:00

PACK_FOLDER="/Users/stefanhorus/Documents/Porducts/The-Full-Lightroom-Bundle-Zoomout_crew"
TARGET_DATE="202601220000.00"  # Format: YYYYMMDDhhmm.ss pentru touch
TARGET_DATE_SETFILE="01/22/2026 00:00:00"  # Format pentru SetFile

# Culori pentru output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Redenumire preseturi Lightroom și actualizare date ===${NC}"
echo "Folder: $PACK_FOLDER"
echo "Data țintă: 22 ianuarie 2026, 00:00:00"
echo ""

# Funcție pentru actualizare date (creare și modificare)
update_item_dates() {
    local item="$1"
    
    if [ ! -e "$item" ]; then
        echo -e "${RED}Eroare: Fișier/folder nu există: $item${NC}"
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
        echo -e "${YELLOW}Atenție: Nu s-a putut actualiza data pentru: $item${NC}"
        return 1
    fi
}

# Funcție pentru redenumire fișier (spații → _)
rename_file() {
    local file="$1"
    local dir=$(dirname "$file")
    local filename=$(basename "$file")
    local new_filename=$(echo "$filename" | tr ' ' '_')
    
    if [ "$filename" != "$new_filename" ]; then
        local new_path="$dir/$new_filename"
        if [ -e "$new_path" ] && [ "$file" != "$new_path" ]; then
            echo -e "${YELLOW}Fișier deja există, sarim: $new_path${NC}"
            return 1
        fi
        
        if mv "$file" "$new_path" 2>/dev/null; then
            echo -e "${GREEN}✓ Redenumit: $filename → $new_filename${NC}"
            update_item_dates "$new_path"
            return 0
        else
            echo -e "${RED}✗ Eroare la redenumire: $file${NC}"
            return 1
        fi
    else
        # Fișierul nu are spații, doar actualizăm data
        update_item_dates "$file"
        return 0
    fi
}

# Funcție pentru redenumire folder (spații → _)
rename_folder() {
    local folder="$1"
    local parent_dir=$(dirname "$folder")
    local folder_name=$(basename "$folder")
    local new_folder_name=$(echo "$folder_name" | tr ' ' '_')
    
    if [ "$folder_name" != "$new_folder_name" ]; then
        local new_path="$parent_dir/$new_folder_name"
        if [ -e "$new_path" ] && [ "$folder" != "$new_path" ]; then
            echo -e "${YELLOW}Folder deja există, sarim: $new_path${NC}"
            return 1
        fi
        
        if mv "$folder" "$new_path" 2>/dev/null; then
            echo -e "${GREEN}✓ Folder redenumit: $folder_name → $new_folder_name${NC}"
            update_item_dates "$new_path"
            return 0
        else
            echo -e "${RED}✗ Eroare la redenumire folder: $folder${NC}"
            return 1
        fi
    else
        update_item_dates "$folder"
        return 0
    fi
}

# Verificare dacă folderul există
if [ ! -d "$PACK_FOLDER" ]; then
    echo -e "${RED}Eroare: Folderul nu există: $PACK_FOLDER${NC}"
    exit 1
fi

# Contoare
renamed_files=0
renamed_folders=0
updated_dates=0

echo -e "${GREEN}--- Procesare foldere (spații → _) ---${NC}"
# Procesăm folderele de la cel mai adânc nivel către rădăcină
find "$PACK_FOLDER" -type d -depth | while IFS= read -r folder; do
    if [ "$folder" != "$PACK_FOLDER" ]; then
        if rename_folder "$folder"; then
            renamed_folders=$((renamed_folders + 1))
        fi
    fi
done

echo ""
echo -e "${GREEN}--- Procesare fișiere XMP și DNG (spații → _) ---${NC}"
# Procesăm fișierele XMP și DNG
find "$PACK_FOLDER" -type f \( -name "*.xmp" -o -name "*.XMP" -o -name "*.dng" -o -name "*.DNG" \) | while IFS= read -r file; do
    if rename_file "$file"; then
        renamed_files=$((renamed_files + 1))
        updated_dates=$((updated_dates + 1))
    fi
done

# Actualizăm și data folderului principal
echo ""
echo -e "${GREEN}--- Actualizare data folder principal ---${NC}"
update_item_dates "$PACK_FOLDER"

echo ""
echo -e "${GREEN}=== Finalizat ===${NC}"
echo "Fișiere redenumite: $renamed_files"
echo "Foldere redenumite: $renamed_folders"
echo "Date actualizate pentru toate fișierele și folderele"
