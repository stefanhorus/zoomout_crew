#!/bin/bash
# Face varianta albă, pe transparent, a unui logo, pentru cardurile din portofoliu: logo-ul stă peste coperta blurată
# până la hover (components/site/ProjectCard.tsx, câmpul overlayLogo din lib/projects.ts). Logo-urile clienților vin
# în culori și pe fundaluri diferite (pătrat alb, negru, portocaliu), așa că toate se aduc la alb, ca să arate unitar.
#
# Folosire: scripts/make-white-logo.sh <logo sursă> <mod> <nume> [<mod jos> <împărțire 0-1>]
#   ->   public/assets/brands/white/<nume>.png
# Moduri (ce păstrează din logo; restul devine transparent):
#   light     părțile luminoase sau colorate pe fundal negru (ex. Multiverse, AER)
#   dark      părțile închise pe fundal alb sau colorat (ex. Casa Numaa, Lepas)
#   nonwhite  tot ce nu e alb (logo cu text negru și culori pe fundal alb, ex. Panoramic360)
#   white     doar părțile albe (text alb pe o pată colorată)
#   shape     forma logo-ului pe fundal transparent, oricare i-ar fi culoarea (ex. Big Belly, Rotaract)
# Cu <mod jos> și <împărțire>, rândurile de sub acea fracție din înălțime folosesc alt mod: pentru logo-uri cu un desen
# deasupra și textul dedesubt (ex. Bacademia: dark white 0.59 = liniile desenului, apoi doar literele albe, fără pata albastră).
set -euo pipefail

SOURCE="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
MODE="$2"
NAME="$3"
MODE_BELOW="${4:-}"
SPLIT="${5:-}"
cd "$(dirname "$0")/.."
OUT=public/assets/brands/white
mkdir -p "$OUT"

MAX='max(max(r(X,Y),g(X,Y)),b(X,Y))'
MIN='min(min(r(X,Y),g(X,Y)),b(X,Y))'
alpha_for() {
  case "$1" in
    light) echo "clip(($MAX-40)*255/215,0,255)*alpha(X,Y)/255" ;;
    dark) echo "clip((200-$MAX)*255/200,0,255)*alpha(X,Y)/255" ;;
    nonwhite) echo "clip((235-$MIN)*255/235,0,255)*alpha(X,Y)/255" ;;
    # doar pixelii aproape opaci: marginea petei colorate, după mărire, ar lăsa un contur alb abia vizibil
    white) echo "clip(($MIN-150)*255/90,0,255)*clip((alpha(X,Y)-96)*255/159,0,255)/255" ;;
    shape) echo "alpha(X,Y)" ;;
    *) echo "mod necunoscut: $1" >&2; return 1 ;;
  esac
}
ALPHA="$(alpha_for "$MODE")"
if [ -n "$MODE_BELOW" ]; then
  [ -n "$SPLIT" ] || { echo "lipsește împărțirea (0-1) pentru modul de jos" >&2; exit 1; }
  ALPHA="if(lt(Y,H*$SPLIT),$ALPHA,$(alpha_for "$MODE_BELOW"))"
fi

TMP="$(mktemp -t white-logo).png"
trap 'rm -f "$TMP"' EXIT
ffmpeg -v error -y -i "$SOURCE" \
  -vf "format=rgba,premultiply=inplace=1,scale=640:640:force_original_aspect_ratio=decrease:flags=lanczos,unpremultiply=inplace=1,format=rgba,geq=r=255:g=255:b=255:a='$ALPHA'" \
  -frames:v 1 "$TMP"

# Taie marginile goale (cutia în care logo-ul are alfa > 16), cu 4 px de aer
CROP="$(ffmpeg -v info -i "$TMP" -vf "alphaextract,bbox=min_val=16" -f null - 2>&1 | grep -o 'crop=[0-9:]*' | tail -1 | cut -d= -f2)"
IFS=: read -r W H X Y <<< "$CROP"
IFS=x read -r IW IH <<< "$(ffprobe -v error -show_entries stream=width,height -of csv=s=x:p=0 "$TMP")"
X0=$((X > 4 ? X - 4 : 0)); Y0=$((Y > 4 ? Y - 4 : 0))
X1=$((X + W + 4 < IW ? X + W + 4 : IW)); Y1=$((Y + H + 4 < IH ? Y + H + 4 : IH))
ffmpeg -v error -y -i "$TMP" -vf "crop=$((X1 - X0)):$((Y1 - Y0)):$X0:$Y0" -frames:v 1 "$OUT/$NAME.png"
echo "$NAME: $(ffprobe -v error -show_entries stream=width,height -of csv=s=x:p=0 "$OUT/$NAME.png"), $(($(stat -f %z "$OUT/$NAME.png") / 1024)) KB"
