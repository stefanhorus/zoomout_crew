#!/bin/bash

# Script pentru redenumire wallpaper-uri cu nume descriptive + _tara
# Format: Nume_Descriptiv_Tara.ext

WALLPAPER_FOLDER="/Users/stefanhorus/Documents/Porducts/Wallpaper Pack"

# Culori pentru output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Redenumire wallpaper-uri cu nume descriptive + țară ===${NC}"
echo "Folder: $WALLPAPER_FOLDER"
echo ""

# Funcție pentru redenumire
rename_file() {
    local file="$1"
    local dir=$(dirname "$file")
    local filename=$(basename "$file")
    local ext="${filename##*.}"
    local base_name="${filename%.*}"
    
    # Mapare nume -> [Nume Nou, Țară]
    case "$base_name" in
        "Edinburgh")
            new_name="Edinburgh_Castle_UK"
            ;;
        "HOLLYWOOD"|"HOLLYWOOD BW")
            new_name="Hollywood_Sign_USA"
            ;;
        "HOLLYWOOD 2"|"HOLLYWOOD 2 BW")
            new_name="Hollywood_Sign_USA"
            ;;
        "OXFORD")
            new_name="Oxford_University_UK"
            ;;
        "Sardinia")
            new_name="Sardinia_Coast_Italy"
            ;;
        "Sardinia2_1")
            new_name="Sardinia_Coast_Italy_2"
            ;;
        "Sardinia3")
            new_name="Sardinia_Coast_Italy_3"
            ;;
        "Sardinia4")
            new_name="Sardinia_Coast_Italy_4"
            ;;
        "WTC")
            new_name="World_Trade_Center_USA"
            ;;
        "brooklyn")
            new_name="Brooklyn_Bridge_USA"
            ;;
        "central park")
            new_name="Central_Park_USA"
            ;;
        "central park skyline")
            new_name="Central_Park_Skyline_USA"
            ;;
        "central park 2")
            new_name="Central_Park_USA_2"
            ;;
        "LITTLE ISLAND")
            new_name="Little_Island_NYC_USA"
            ;;
        "LITTLE ISLAND 2")
            new_name="Little_Island_NYC_USA_2"
            ;;
        "atlNTIC SHORE")
            new_name="Atlantic_Shore_USA"
            ;;
        "ocean city")
            new_name="Ocean_City_USA"
            ;;
        "GOLDEN GATE")
            new_name="Golden_Gate_Bridge_USA"
            ;;
        "CANYON")
            new_name="Grand_Canyon_USA"
            ;;
        "SNOWY LAKE")
            new_name="Snowy_Lake_Canada"
            ;;
        "SNOWY LAKE 2")
            new_name="Snowy_Lake_Canada_2"
            ;;
        "FULL PARK")
            new_name="Full_Park_View_USA"
            ;;
        "PEACEFULLNESS")
            new_name="Peaceful_Landscape_Unknown"
            ;;
        "TERRAIN")
            new_name="Mountain_Terrain_Unknown"
            ;;
        "above the sky")
            new_name="Above_The_Sky_Aerial_Unknown"
            ;;
        "green"|"green2")
            new_name="Green_Landscape_Unknown"
            ;;
        "dji_export_"*)
            # Pentru fișierele DJI, păstrăm un nume generic
            new_name="Aerial_View_Unknown"
            ;;
        "photo2")
            new_name="Landscape_Photo_Unknown"
            ;;
        *)
            # Pentru nume necunoscute, folosim numele original cu _Unknown
            new_name=$(echo "$base_name" | tr ' ' '_' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9_]//g')
            new_name="${new_name}_Unknown"
            ;;
    esac
    
    # Adaugă BW pentru black and white (doar dacă nu a fost deja procesat)
    if [[ "$base_name" == *"BW"* ]] && [[ "$new_name" != *"_BW"* ]]; then
        new_name="${new_name}_BW"
    fi
    
    local new_path="$dir/${new_name}.${ext}"
    
    # Verifică dacă fișierul deja are numele corect
    if [ "$file" = "$new_path" ]; then
        echo -e "${YELLOW}- Deja redenumit: $filename${NC}"
        return 0
    fi
    
    # Verifică dacă există deja un fișier cu numele nou
    if [ -e "$new_path" ]; then
        echo -e "${YELLOW}Fișier deja există, sarim: ${new_name}.${ext}${NC}"
        return 1
    fi
    
    # Redenumește fișierul
    if mv "$file" "$new_path" 2>/dev/null; then
        echo -e "${GREEN}✓ Redenumit: $filename → ${new_name}.${ext}${NC}"
        return 0
    else
        echo -e "${RED}✗ Eroare la redenumire: $filename${NC}"
        return 1
    fi
}

# Verificare dacă folderul există
if [ ! -d "$WALLPAPER_FOLDER" ]; then
    echo -e "${RED}Eroare: Folderul nu există: $WALLPAPER_FOLDER${NC}"
    exit 1
fi

# Contoare
renamed_count=0

echo -e "${GREEN}--- Procesare fișiere Horizontal ---${NC}"
find "$WALLPAPER_FOLDER/Horizontal" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | while IFS= read -r file; do
    if rename_file "$file"; then
        renamed_count=$((renamed_count + 1))
    fi
done

echo ""
echo -e "${GREEN}--- Procesare fișiere Vertical ---${NC}"
find "$WALLPAPER_FOLDER/Vertical" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | while IFS= read -r file; do
    if rename_file "$file"; then
        renamed_count=$((renamed_count + 1))
    fi
done

echo ""
echo -e "${GREEN}=== Finalizat ===${NC}"
echo "Fișiere procesate"
