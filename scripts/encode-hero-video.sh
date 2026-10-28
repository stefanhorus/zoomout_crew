#!/bin/bash
# Codează video-ul din hero (pagina principală) în toate variantele folosite de components/home/HeroVideo.tsx
# și scoate copertele din primul cadru. Setările sunt alese prin măsurători VMAF: cele mai mici fișiere
# care arată la fel ca originalul (VMAF ~97 pe desktop, ~99 pe telefon).
#
# Folosire: scripts/encode-hero-video.sh <video desktop 16:9, ideal 2560x1440> <video mobil 9:16>
# Filtre opționale aplicate înainte de codare: DESKTOP_VF și MOBILE_VF. Varianta actuală a fost făcută cu
#   DESKTOP_VF="trim=start_frame=39,setpts=PTS-STARTPTS"  (scoate scena de deschidere cu chenarul de tracking)
#   MOBILE_VF="crop=956:1700"                             (taie rama neagră a video-ului de pe Bunny)
# După rulare, crește VERSION din HeroVideo.tsx.
set -euo pipefail
cd "$(dirname "$0")/.."

DESKTOP_SRC="$1"
MOBILE_SRC="$2"
DESKTOP_VF="${DESKTOP_VF:-null}"
MOBILE_VF="${MOBILE_VF:-null}"
OUT=public/assets/v2/video
mkdir -p "$OUT"

COMMON=(-an -movflags +faststart -color_primaries bt709 -color_trc bt709 -colorspace bt709)
AV1=(-c:v libsvtav1 -preset 3 -g 60 -svtav1-params tune=0 -pix_fmt yuv420p10le)
HEVC=(-c:v libx265 -preset slow -tag:v hvc1 -x265-params keyint=60:aq-mode=3:log-level=error -pix_fmt yuv420p)
H264=(-c:v libx264 -preset slower -profile:v high -level:v 4.0 -g 60 -pix_fmt yuv420p)

encode() { # sursă, filtre, fișier, setări...
  local src="$1" vf="$2" name="$3"
  shift 3
  ffmpeg -v error -y -i "$src" -vf "$vf" "$@" "${COMMON[@]}" "$OUT/$name"
  echo "$name: $(($(stat -f %z "$OUT/$name") / 1024)) KB"
}

encode "$MOBILE_SRC" "$MOBILE_VF" hero-mobile.hevc.mp4 "${HEVC[@]}" -crf 28
encode "$MOBILE_SRC" "$MOBILE_VF" hero-mobile.h264.mp4 "${H264[@]}" -crf 26
encode "$DESKTOP_SRC" "$DESKTOP_VF,scale=1920:1080:flags=lanczos" hero-1080.av1.mp4 "${AV1[@]}" -crf 38
encode "$DESKTOP_SRC" "$DESKTOP_VF,scale=1920:1080:flags=lanczos" hero-1080.hevc.mp4 "${HEVC[@]}" -crf 27
encode "$DESKTOP_SRC" "$DESKTOP_VF,scale=1920:1080:flags=lanczos" hero-1080.h264.mp4 "${H264[@]}" -crf 25
encode "$DESKTOP_SRC" "$DESKTOP_VF,scale=2560:1440:flags=lanczos" hero-1440.av1.mp4 "${AV1[@]}" -crf 39
encode "$DESKTOP_SRC" "$DESKTOP_VF,scale=2560:1440:flags=lanczos" hero-1440.hevc.mp4 "${HEVC[@]}" -crf 28

# Copertele = primul cadru exact al fiecărui video (se văd până pornește video-ul)
ffmpeg -v error -y -i "$DESKTOP_SRC" -vf "$DESKTOP_VF,scale=2560:1440:flags=lanczos,format=rgb24" -frames:v 1 -q:v 3 public/assets/v2/hero-poster.jpg
ffmpeg -v error -y -i "$MOBILE_SRC" -vf "$MOBILE_VF,format=rgb24" -frames:v 1 -q:v 3 public/assets/v2/hero-poster-mobile.jpg

# macOS creează fișiere "._*" pe SSD-uri exFAT - nu trebuie publicate
rm -f "$OUT"/._* public/assets/v2/._hero-poster*
