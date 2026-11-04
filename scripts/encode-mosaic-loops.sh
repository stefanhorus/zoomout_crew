#!/bin/bash
# Codează buclele montate în DaVinci pentru mozaicul de pe prima pagină (components/home/ZoomHero.tsx).
# Exportul din DaVinci: presetul „Zoomout - Loop mozaic” (ProRes 422 LT, fără audio), câte un fișier pe poziție,
# numerotat de la stânga la dreapta, rând cu rând, fără centru: 1.mov … 8.mov.
#
# Folosire: scripts/encode-mosaic-loops.sh <folder desktop 16:9> [folder telefon 9:16]
# Pentru telefon se folosește exportul vertical cu același număr; dacă lipsește, se decupează mijlocul celui orizontal.
# Scrie în public/assets/v2/tiles, pentru fiecare buclă N: loop-N.mp4 (960x540) și loop-N-portrait.mp4 (360x640) în
# HEVC (.hevc.mp4, cam 40% mai mici la aceeași calitate, decodate hardware pe Mac, iPhone și majoritatea telefoanelor)
# și în H.264 (.mp4, pentru browserele fără HEVC), plus copertele .jpg (primul cadru).
# După rulare, crește TILES_VERSION din ZoomHero.tsx.
set -euo pipefail
cd "$(dirname "$0")/.."

DESKTOP="$1"
PHONE="${2:-}"
OUT=public/assets/v2/tiles
mkdir -p "$OUT"

COMMON=(-an -g 300 -movflags +faststart -pix_fmt yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709)
X264=(-c:v libx264 -preset slower -profile:v high "${COMMON[@]}")
X265=(-c:v libx265 -preset slow -tag:v hvc1 -x265-params log-level=error "${COMMON[@]}")

# Aceeași imagine în ambele formate (CRF-urile HEVC dau aceeași calitate VMAF ca H.264)
encode() { # sursă, filtre, nume, CRF H.264, CRF HEVC
  ffmpeg -v error -y -i "$1" -vf "$2" -crf "$4" "${X264[@]}" "$OUT/$3.mp4"
  ffmpeg -v error -y -i "$1" -vf "$2" -crf "$5" "${X265[@]}" "$OUT/$3.hevc.mp4"
}

for i in 1 2 3 4 5 6 7 8; do
  src="$(ls "$DESKTOP"/$i.* | head -1)"
  encode "$src" "scale=960:540:flags=lanczos" "loop-$i" 31 33
  phone_src="$(ls "$PHONE"/$i.* 2>/dev/null | head -1 || true)"
  if [ -n "$phone_src" ]; then
    encode "$phone_src" "scale=360:640:force_original_aspect_ratio=increase:flags=lanczos,crop=360:640" "loop-$i-portrait" 30 32
  else
    # până vine exportul vertical: felia din mijloc a celui orizontal
    encode "$src" "crop=ih*9/16:ih,scale=360:640:flags=lanczos" "loop-$i-portrait" 30 32
  fi
  for name in "loop-$i" "loop-$i-portrait"; do
    ffmpeg -v error -y -i "$OUT/$name.mp4" -frames:v 1 -q:v 3 "$OUT/$name.jpg"
  done
  kb() { echo $(($(stat -f %z "$OUT/$1") / 1024)); }
  echo "loop-$i: H.264 $(kb loop-$i.mp4) KB, HEVC $(kb loop-$i.hevc.mp4) KB; portrait $(kb loop-$i-portrait.mp4) / $(kb loop-$i-portrait.hevc.mp4) KB"
done
