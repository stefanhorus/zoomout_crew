#!/bin/bash

# Script pentru actualizare date și metadata pentru Full LUT Bundle
# Data țintă: 22 ianuarie 2026, 00:00:00

PACK_FOLDER="/Users/stefanhorus/Documents/Porducts/The-Full-LUT-Bundle-Zoomout_crew"
TARGET_DATE="202601220000.00"
TARGET_DATE_SETFILE="01/22/2026 00:00:00"

GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}=== Actualizare date pentru Full LUT Bundle ===${NC}"
echo "Folder: $PACK_FOLDER"
echo ""

if [ ! -d "$PACK_FOLDER" ]; then
    echo "Folderul nu există: $PACK_FOLDER"
    exit 1
fi

# Actualizare date pentru toate folderele
echo -e "${GREEN}--- Actualizare date foldere ---${NC}"
find "$PACK_FOLDER" -type d -exec touch -t "$TARGET_DATE" {} \; 2>/dev/null
find "$PACK_FOLDER" -type d -exec sh -c 'if command -v SetFile >/dev/null 2>&1; then SetFile -d "$1" "$2" && SetFile -m "$1" "$2"; fi' _ "$TARGET_DATE_SETFILE" {} \; 2>/dev/null

# Actualizare date pentru toate fișierele
echo -e "${GREEN}--- Actualizare date fișiere ---${NC}"
find "$PACK_FOLDER" -type f -exec touch -t "$TARGET_DATE" {} \; 2>/dev/null
find "$PACK_FOLDER" -type f -exec sh -c 'if command -v SetFile >/dev/null 2>&1; then SetFile -d "$1" "$2" && SetFile -m "$1" "$2"; fi' _ "$TARGET_DATE_SETFILE" {} \; 2>/dev/null

# Actualizare folder principal
touch -t "$TARGET_DATE" "$PACK_FOLDER" 2>/dev/null
if command -v SetFile >/dev/null 2>&1; then
    SetFile -d "$TARGET_DATE_SETFILE" "$PACK_FOLDER" 2>/dev/null
    SetFile -m "$TARGET_DATE_SETFILE" "$PACK_FOLDER" 2>/dev/null
fi

echo -e "${GREEN}✓ Finalizat${NC}"
