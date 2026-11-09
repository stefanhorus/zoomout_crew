#!/bin/bash
# Bucla de 4 secunde afișată la hover pe cardurile de portofoliu pentru clipurile orizontale (components/site/ProjectCard.tsx).
# Animația de la Mux (animated.webp) are cel mult 640 px pe latură și nu decupează, așa că un clip 16:9 într-un card 9:16
# ajungea la vreo 114x202 pixeli reali, mult mai neclar decât clipurile verticale. Bucla se taie din cea mai mare rezoluție
# de pe Mux (HLS public), se decupează vertical și se codează la 540x960 în HEVC (.hevc.mp4) și H.264 (.mp4),
# ca buclele din mozaic. Clipul întreg rămâne pe Mux.
#
# Folosire: scripts/encode-hover-preview.sh <playbackId> <secunda de start> <nume> [poziția decupajului 0-1, implicit 0.5]
# Apoi în lib/projects.ts: { playbackId, thumbTime, landscape: true, preview: "<nume>" }.
# Dacă înlocuiești o buclă existentă, crește PREVIEWS_VERSION din lib/projects.ts (mp4-urile stau un an în cache).
set -euo pipefail
cd "$(dirname "$0")/.."

ID="$1"
START="$2"
NAME="$3"
X="${4:-0.5}"
OUT=public/assets/v2/previews
mkdir -p "$OUT"

# Varianta cu cea mai mare rezoluție (apoi cel mai mare bitrate) din playlist-ul HLS
VARIANT="$(curl -fsSL "https://stream.mux.com/$ID.m3u8" | awk '
  /^#EXT-X-STREAM-INF/ {
    match($0, /RESOLUTION=[0-9]+x[0-9]+/); split(substr($0, RSTART + 11, RLENGTH - 11), r, "x")
    match($0, /BANDWIDTH=[0-9]+/); bw = substr($0, RSTART + 10, RLENGTH - 10)
    getline url; print r[2], bw, url
  }' | sort -n -k1,1 -k2,2 | tail -1)"
HEIGHT="${VARIANT%% *}"
URL="${VARIANT##* }"

COMMON=(-an -g 300 -movflags +faststart -pix_fmt yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709)
# setsar=1: decupajul nu e fix 9:16, iar fără el pixelii ar ieși ușor dreptunghiulari (404:405);
# setpts: căutarea în HLS poate lăsa primul cadru la 2-3 s, iar Chrome ar porni bucla de acolo
FILTER="crop=trunc(ih*9/16/2)*2:ih:(iw-ow)*$X:0,scale=540:960:flags=lanczos,setsar=1,setpts=PTS-STARTPTS"

ffmpeg -v error -y -ss "$START" -t 4 -i "$URL" -vf "$FILTER" \
  -c:v libx264 -preset slower -profile:v high -crf 23 -maxrate 2M -bufsize 4M "${COMMON[@]}" "$OUT/$NAME.mp4"
ffmpeg -v error -y -ss "$START" -t 4 -i "$URL" -vf "$FILTER" \
  -c:v libx265 -preset slow -tag:v hvc1 -crf 25 -x265-params log-level=error:vbv-maxrate=1200:vbv-bufsize=2400 \
  "${COMMON[@]}" "$OUT/$NAME.hevc.mp4"

kb() { echo $(($(stat -f %z "$OUT/$1") / 1024)); }
echo "$NAME: sursă ${HEIGHT}p, H.264 $(kb "$NAME.mp4") KB, HEVC $(kb "$NAME.hevc.mp4") KB"
