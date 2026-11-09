#!/bin/bash
# Bucla de 4 secunde afișată la hover pe cardurile de portofoliu pentru clipurile orizontale (components/site/ProjectCard.tsx).
# Animația de la Mux (animated.webp) are cel mult 640 px pe latură și nu decupează, așa că un clip 16:9 într-un card 9:16
# ajungea la vreo 114x202 pixeli reali, mult mai neclar decât clipurile verticale. Bucla se taie din cea mai mare rezoluție
# de pe Mux (HLS public), se decupează vertical și se codează la 540x960 în HEVC (.hevc.mp4) și H.264 (.mp4),
# ca buclele din mozaic. Clipul întreg rămâne pe Mux. Clipurile de pe YouTube n-au altă previzualizare, așa că primesc
# și ele o buclă, tăiată dintr-un fișier (exportul propriu sau bucata descărcată de pe YouTube).
#
# Folosire: scripts/encode-hover-preview.sh <playbackId Mux | fișier video> <secunda de start> <nume> \
#             [poziția decupajului 0-1, implicit 0.5] [durata în secunde, implicit 4]
# Sursa poate fi și un fișier (ex. un export vertical sau o bucată descărcată de pe YouTube pentru clipurile de acolo).
# Apoi în lib/projects.ts: { ..., preview: "<nume>" } pe video (Mux sau YouTube).
# Dacă înlocuiești o buclă existentă, crește PREVIEWS_VERSION din lib/projects.ts (mp4-urile stau un an în cache).
set -euo pipefail

SOURCE="$1"
START="$2"
NAME="$3"
X="${4:-0.5}"
DURATION="${5:-4}"
# calea fișierului se ia înainte de cd, ca să meargă și căile relative
if [ -f "$SOURCE" ]; then SOURCE="$(cd "$(dirname "$SOURCE")" && pwd)/$(basename "$SOURCE")"; fi
cd "$(dirname "$0")/.."
OUT=public/assets/v2/previews
mkdir -p "$OUT"

if [ -f "$SOURCE" ]; then
  URL="$SOURCE"
  HEIGHT="$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$SOURCE")"
else
  # Varianta cu cea mai mare rezoluție (apoi cel mai mare bitrate) din playlist-ul HLS de pe Mux
  VARIANT="$(curl -fsSL "https://stream.mux.com/$SOURCE.m3u8" | awk '
    /^#EXT-X-STREAM-INF/ {
      match($0, /RESOLUTION=[0-9]+x[0-9]+/); split(substr($0, RSTART + 11, RLENGTH - 11), r, "x")
      match($0, /BANDWIDTH=[0-9]+/); bw = substr($0, RSTART + 10, RLENGTH - 10)
      getline url; print r[2], bw, url
    }' | sort -n -k1,1 -k2,2 | tail -1)"
  HEIGHT="${VARIANT%% *}"
  URL="${VARIANT##* }"
fi

# -fpsmax 30: sursele de 60 fps (ex. short-urile) ies la 30, cât au și celelalte bucle
COMMON=(-an -g 300 -fpsmax 30 -movflags +faststart -pix_fmt yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709)
# setsar=1: decupajul nu e fix 9:16, iar fără el pixelii ar ieși ușor dreptunghiulari (404:405);
# setpts: căutarea în HLS poate lăsa primul cadru la 2-3 s, iar Chrome ar porni bucla de acolo
FILTER="crop=trunc(ih*9/16/2)*2:ih:(iw-ow)*$X:0,scale=540:960:flags=lanczos,setsar=1,setpts=PTS-STARTPTS"

ffmpeg -v error -y -ss "$START" -t "$DURATION" -i "$URL" -vf "$FILTER" \
  -c:v libx264 -preset slower -profile:v high -crf 23 -maxrate 2M -bufsize 4M "${COMMON[@]}" "$OUT/$NAME.mp4"
ffmpeg -v error -y -ss "$START" -t "$DURATION" -i "$URL" -vf "$FILTER" \
  -c:v libx265 -preset slow -tag:v hvc1 -crf 25 -x265-params log-level=error:vbv-maxrate=1200:vbv-bufsize=2400 \
  "${COMMON[@]}" "$OUT/$NAME.hevc.mp4"

kb() { echo $(($(stat -f %z "$OUT/$1") / 1024)); }
echo "$NAME: sursă ${HEIGHT}p, H.264 $(kb "$NAME.mp4") KB, HEVC $(kb "$NAME.hevc.mp4") KB"
