#!/bin/bash
# Face varianta albă, pe transparent, a unui logo, pentru cardurile din portofoliu: logo-ul stă peste coperta blurată
# până la hover (components/site/ProjectCard.tsx, câmpul overlayLogo din lib/projects.ts). Logo-urile clienților vin
# în culori și pe fundaluri diferite (pătrat alb, negru, portocaliu), așa că toate se aduc la alb, ca să arate unitar.
#
# Folosire: scripts/make-white-logo.sh <logo sursă> <mod> <nume>   ->   public/assets/brands/white/<nume>.png
# Moduri (ce păstrează din logo; restul devine transparent):
#   light     părțile luminoase sau colorate pe fundal negru (ex. Multiverse, AER)
#   dark      părțile închise pe fundal alb sau colorat (ex. Casa Numaa, Lepas)
#   nonwhite  tot ce nu e alb (logo cu text negru și culori pe fundal alb, ex. Panoramic360)
#   shape     forma logo-ului pe fundal transparent, oricare i-ar fi culoarea (ex. Big Belly, Rotaract)
set -euo pipefail

SOURCE="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
MODE="$2"
NAME="$3"
cd "$(dirname "$0")/.."
OUT=public/assets/brands/white
mkdir -p "$OUT"

MAX='max(max(r(X,Y),g(X,Y)),b(X,Y))'
MIN='min(min(r(X,Y),g(X,Y)),b(X,Y))'
case "$MODE" in
  light) ALPHA="clip(($MAX-40)*255/215,0,255)*alpha(X,Y)/255" ;;
  dark) ALPHA="clip((200-$MAX)*255/200,0,255)*alpha(X,Y)/255" ;;
  nonwhite) ALPHA="clip((235-$MIN)*255/235,0,255)*alpha(X,Y)/255" ;;
  shape) ALPHA="alpha(X,Y)" ;;
  *) echo "mod necunoscut: $MODE" >&2; exit 1 ;;
esac

TMP="$(mktemp -t white-logo).png"
trap 'rm -f "$TMP"' EXIT
ffmpeg -v error -y -i "$SOURCE" \
  -vf "scale=640:640:force_original_aspect_ratio=decrease:flags=lanczos,format=rgba,geq=r=255:g=255:b=255:a='$ALPHA'" \
  -frames:v 1 "$TMP"

# Taie marginile goale (cutia în care logo-ul are alfa > 16), cu 4 px de aer
CROP="$(ffmpeg -v info -i "$TMP" -vf "alphaextract,bbox=min_val=16" -f null - 2>&1 | grep -o 'crop=[0-9:]*' | tail -1 | cut -d= -f2)"
IFS=: read -r W H X Y <<< "$CROP"
IFS=x read -r IW IH <<< "$(ffprobe -v error -show_entries stream=width,height -of csv=s=x:p=0 "$TMP")"
X0=$((X > 4 ? X - 4 : 0)); Y0=$((Y > 4 ? Y - 4 : 0))
X1=$((X + W + 4 < IW ? X + W + 4 : IW)); Y1=$((Y + H + 4 < IH ? Y + H + 4 : IH))
ffmpeg -v error -y -i "$TMP" -vf "crop=$((X1 - X0)):$((Y1 - Y0)):$X0:$Y0" -frames:v 1 "$OUT/$NAME.png"
echo "$NAME: $(ffprobe -v error -show_entries stream=width,height -of csv=s=x:p=0 "$OUT/$NAME.png"), $(($(stat -f %z "$OUT/$NAME.png") / 1024)) KB"
