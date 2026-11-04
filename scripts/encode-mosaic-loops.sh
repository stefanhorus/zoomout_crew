#!/bin/bash
# Codează buclele montate în DaVinci pentru mozaicul de pe prima pagină (components/home/ZoomHero.tsx).
# Exportul din DaVinci: presetul „Zoomout - Loop mozaic” (ProRes 422 LT, fără audio), câte un fișier pe poziție,
# numerotat de la stânga la dreapta, rând cu rând, fără centru: 1.mov … 8.mov.
#
# Folosire: scripts/encode-mosaic-loops.sh <folder desktop 16:9> [folder telefon 9:16]
# Pentru telefon se folosește exportul vertical cu același număr; dacă lipsește, se decupează mijlocul celui orizontal.
# Scrie public/assets/v2/tiles/loop-N.mp4 (960x540), loop-N-portrait.mp4 (360x640) și copertele .jpg (primul cadru).
# După rulare, crește TILES_VERSION din ZoomHero.tsx.
set -euo pipefail
cd "$(dirname "$0")/.."

DESKTOP="$1"
PHONE="${2:-}"
OUT=public/assets/v2/tiles
mkdir -p "$OUT"

X264=(-an -c:v libx264 -preset slower -profile:v high -g 300 -movflags +faststart -pix_fmt yuv420p
      -color_primaries bt709 -color_trc bt709 -colorspace bt709)

for i in 1 2 3 4 5 6 7 8; do
  src="$(ls "$DESKTOP"/$i.* | head -1)"
  ffmpeg -v error -y -i "$src" -vf "scale=960:540:flags=lanczos" -crf 31 "${X264[@]}" "$OUT/loop-$i.mp4"
  phone_src="$(ls "$PHONE"/$i.* 2>/dev/null | head -1 || true)"
  if [ -n "$phone_src" ]; then
    ffmpeg -v error -y -i "$phone_src" -vf "scale=360:640:force_original_aspect_ratio=increase:flags=lanczos,crop=360:640" \
      -crf 30 "${X264[@]}" "$OUT/loop-$i-portrait.mp4"
  else
    # până vine exportul vertical: felia din mijloc a celui orizontal
    ffmpeg -v error -y -i "$src" -vf "crop=ih*9/16:ih,scale=360:640:flags=lanczos" -crf 30 "${X264[@]}" "$OUT/loop-$i-portrait.mp4"
  fi
  for name in "loop-$i" "loop-$i-portrait"; do
    ffmpeg -v error -y -i "$OUT/$name.mp4" -frames:v 1 -q:v 3 "$OUT/$name.jpg"
  done
  echo "loop-$i: $(($(stat -f %z "$OUT/loop-$i.mp4") / 1024)) KB, portrait $(($(stat -f %z "$OUT/loop-$i-portrait.mp4") / 1024)) KB"
done
