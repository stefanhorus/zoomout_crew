#!/usr/bin/env python3
"""Face bucla video pentru o celulă din mozaicul de pe prima pagină (components/home/ZoomHero.tsx).

Ia o bucată fără tăieturi și fără text din SRC, între START și END (secunde), și o redă înainte și apoi înapoi,
încetinind spre capete ca o dronă care se oprește și se întoarce, așa că bucla se reia fără salt.
Cadrele intermediare sunt amestecate din cele vecine, ca mișcarea încetinită să rămână fluidă.
Scrie două variante, alese în pagină după orientarea ecranului (coperta .jpg = primul cadru al buclei):
  NAME.mp4, NAME.jpg                       orizontal 16:9 (desktop)
  NAME-portrait.mp4, NAME-portrait.jpg     vertical 9:16 (telefon), decupat din mijloc

Folosire: python3 -I scripts/make-mosaic-tile.py SRC START END NAME [--loop SECUNDE] [--fix-line] [--out FOLDER]
  --loop      durata buclei; implicit de 3 ori bucata (viteza medie 2/3 din cea reală, maximul ~1x)
  --fix-line  pentru montajul din hero (public/assets/videos/Drone-Hero-2-2k-clean.mp4): pe unele cadre are o linie
              subțire pe toată înălțimea, pe la 1/3 și 2/3 din lățime, pe care scriptul o găsește și o acoperă
  --out       implicit public/assets/v2/tiles
După ce înlocuiești fișierele, crește TILES_VERSION din ZoomHero.tsx.

Buclele de acum (HERO = public/assets/videos/Drone-Hero-2-2k-clean.mp4; clipurile Mux descărcate din proiecte):
  HERO 8.87 10.57 nyc --fix-line                  HERO 4.30 6.00 sardinia --fix-line
  HERO 6.133 7.64 hollywood --fix-line            Mux BaZoib... 3.63 4.62 casanumaa --loop 4
  Mux Xi5sUx... 6.45 7.40 rooftop --loop 4        Mux iQW9j3... 6.00 6.99 panoramic --loop 4
  Mux c5jDLr... 9.6 12.6 outdoor --loop 7         PromoLifeIsPink.mp4 20.62 22.62 lifeispink
Scoasă din mozaic (apare și în video-ul din centru): HERO 1.367 3.44 oxford --fix-line
"""
import os
import subprocess
import sys
import tempfile


def option(flag, default):
    if flag not in sys.argv:
        return default
    i = sys.argv.index(flag)
    value = sys.argv[i + 1]
    del sys.argv[i:i + 2]
    return value


out_dir = option("--out", os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "assets", "v2", "tiles"))
loop_seconds = option("--loop", None)
fix_line = "--fix-line" in sys.argv
if fix_line:
    sys.argv.remove("--fix-line")
src, start, end, name = sys.argv[1:5]

probe = dict(
    line.split("=", 1)
    for line in subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,r_frame_rate",
         "-of", "default=nw=1", src],
        capture_output=True, text=True, check=True,
    ).stdout.split()
)
FPS = probe["r_frame_rate"]
num, den = (int(x) for x in (FPS.split("/") + ["1"])[:2])
landscape = int(probe["width"]) >= int(probe["height"])
even = lambda value: int(value) // 2 * 2

# Cadrele de lucru: sursele orizontale la 720p (destul pentru ambele variante), cele verticale la rezoluția lor
if landscape:
    W, H = 1280, even(1280 * int(probe["height"]) / int(probe["width"]))
    LANDSCAPE_VF = "scale=960:540:flags=lanczos"
    PORTRAIT_VF = f"crop={even(H * 9 / 16)}:{H},scale=360:640:flags=lanczos"
else:
    W, H = int(probe["width"]), int(probe["height"])
    LANDSCAPE_VF = f"crop={W}:{even(W * 9 / 16)}"
    PORTRAIT_VF = "scale=360:640:flags=lanczos"
SIZE = W * H * 3

# -ss după -i: decodează de la început și taie exact la cadru
decoder = subprocess.Popen(
    ["ffmpeg", "-v", "error", "-i", src, "-ss", start, "-to", end, "-an",
     "-vf", f"scale={W}:{H}:flags=lanczos:in_color_matrix=bt709", "-pix_fmt", "rgb24", "-f", "rawvideo", "-"],
    stdout=subprocess.PIPE,
)
frames = []
while len(chunk := decoder.stdout.read(SIZE)) == SIZE:
    frames.append(bytearray(chunk))
if decoder.wait():
    sys.exit("ffmpeg nu a putut decoda sursa")


def luma(frame, x, y):
    i = (y * W + x) * 3
    return (2 * frame[i] + 5 * frame[i + 1] + frame[i + 2]) / 8


GAP = max(3, round(3 * W / 960))  # distanța până la coloanele curate de lângă linie
DRIFT = max(2, round(3 * W / 1280))  # cât se poate muta linia de la o treime la alta (uneori e ușor înclinată)
# Linia apare mereu în aceleași două zone (la 1280px: coloanele 420-465 și 814-861)
BANDS = [(int(W * 0.31), int(W * 0.38)), (int(W * 0.62), int(W * 0.69))]
THIRDS = [(0, H // 3), (H // 3, 2 * H // 3), (2 * H // 3, H)]


def find_line(frame, x0, x1):
    """Linia care începe sus în [x0, x1): în fiecare treime pe înălțime, coloana mai luminoasă decât AMBELE vecine
    (o muchie de clădire e luminoasă doar față de o parte), la cel mult DRIFT coloane de cea din treimea de deasupra.
    Întoarce coloana din fiecare treime sau None."""
    cache = {}

    def contrast(third, x):
        if (third, x) not in cache:
            y0, y1 = THIRDS[third]
            rows = range(y0 + 2, y1, 4)
            left = sum(luma(frame, x, y) - luma(frame, x - GAP, y) for y in rows)
            right = sum(luma(frame, x, y) - luma(frame, x + GAP, y) for y in rows)
            cache[third, x] = min(left, right) / len(rows)
        return cache[third, x]

    best = None
    for x in range(x0, x1):
        if contrast(0, x) < 6:
            continue
        path = [x]
        for third in (1, 2):
            path.append(max(range(path[-1] - DRIFT, path[-1] + DRIFT + 1), key=lambda c: contrast(third, c)))
            if contrast(third, path[-1]) < 6:
                break
        else:
            # Linia adevărată iese clar în evidență măcar pe o treime (30-170); detaliile clădirilor rămân sub ~20
            strengths = [contrast(third, c) for third, c in enumerate(path)]
            if max(strengths) >= 25 and (best is None or sum(strengths) > best[1]):
                best = (path, sum(strengths))
    return best[0] if best else None


def repair(frame, path):
    """Pe fiecare rând, înlocuiește coloanele din jurul liniei (poziția ei interpolată între mijloacele treimilor)
    cu o trecere lină între coloanele curate din stânga și din dreapta."""
    middles = [(y0 + y1) / 2 for y0, y1 in THIRDS]
    span = 2 * GAP
    for y in range(H):
        segment = 0 if y < middles[1] else 1
        t = (y - middles[segment]) / (middles[segment + 1] - middles[segment])
        x = round(path[segment] + (path[segment + 1] - path[segment]) * t)
        left = (y * W + x - GAP) * 3
        right = (y * W + x + GAP) * 3
        for k in range(1, span):
            mix = k / span
            i = left + k * 3
            for ch in range(3):
                frame[i + ch] = int(frame[left + ch] * (1 - mix) + frame[right + ch] * mix)


repaired = 0
for frame in frames if fix_line else []:
    for x0, x1 in BANDS:
        # Uneori sunt două linii apropiate: după reparare mai căutăm o dată în aceeași bandă
        for _ in range(3):
            if (path := find_line(frame, x0, x1)) is None:
                break
            repair(frame, path)
            repaired += 1

BT709 = ["-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709", "-color_range", "tv"]
count = len(frames)
loop = float(loop_seconds) if loop_seconds else 3 * count * den / num
# Câte cadre are drumul de la un capăt la celălalt (număr întreg, ca ultimul să fie exact capătul bucății)
half_frames = round(loop * num / den / 2)
half = half_frames * den / num
CRF = os.environ.get("CRF", "31")

with tempfile.TemporaryDirectory() as tmp:
    forward = os.path.join(tmp, "forward.mkv")
    # Drumul înainte, încetinit spre capete: cadrul N ajunge la momentul half*acos(1-2p)/π (p = N/ultimul cadru),
    # adică poziția în bucată urmează (1-cos)/2 în timp. `framerate` umple golurile amestecând cadrele vecine.
    # La final `framerate` mai repetă ultimul cadru cât a durat intervalul dinaintea lui; `trim` taie repetițiile.
    # Lucrează doar în YUV, așa că trecem explicit la BT.709 (altfel ffmpeg ar converti cu BT.601 și ar schimba culorile).
    encoder = subprocess.Popen(
        ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", FPS, "-i", "-",
         "-vf", f"scale=out_color_matrix=bt709:out_range=tv,format=yuv444p,setpts={half}*acos(1-2*N/{count - 1})/PI/TB,"
                f"framerate=fps={FPS}:interp_start=0:interp_end=255:scene=100,trim=end_frame={half_frames + 1}",
         "-c:v", "ffv1", *BT709, forward],
        stdin=subprocess.PIPE,
    )
    for frame in frames:
        encoder.stdin.write(frame)
    encoder.stdin.close()
    if encoder.wait():
        sys.exit("ffmpeg nu a putut face drumul înainte")
    steps = int(subprocess.run(
        ["ffprobe", "-v", "error", "-count_frames", "-select_streams", "v:0", "-show_entries", "stream=nb_read_frames",
         "-of", "csv=p=0", forward],
        capture_output=True, text=True, check=True,
    ).stdout.strip())

    # Bucla: înainte, apoi înapoi fără primul și ultimul cadru (altfel s-ar repeta la întoarcere și la reluare)
    os.makedirs(out_dir, exist_ok=True)
    x264 = ["-c:v", "libx264", "-preset", "slower", "-profile:v", "high", "-crf", CRF, "-g", str(2 * steps),
            "-pix_fmt", "yuv420p", *BT709, "-movflags", "+faststart", "-an"]
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-i", forward, "-filter_complex",
         f"[0:v]split[a][b];[b]reverse,trim=start_frame=1:end_frame={steps - 1}[back];"
         f"[a][back]concat=n=2:v=1:a=0,setpts=N*{den}/({num}*TB),split[l][p];"
         f"[l]{LANDSCAPE_VF},format=yuv420p[land];[p]{PORTRAIT_VF},format=yuv420p[port]",
         "-map", "[land]", *x264, os.path.join(out_dir, f"{name}.mp4"),
         "-map", "[port]", *x264, os.path.join(out_dir, f"{name}-portrait.mp4")],
        check=True,
    )
    for suffix, vf in (("", LANDSCAPE_VF), ("-portrait", PORTRAIT_VF)):
        subprocess.run(
            ["ffmpeg", "-v", "error", "-y", "-i", forward, "-vf", f"{vf},scale=in_color_matrix=bt709:in_range=tv,format=rgb24",
             "-frames:v", "1", "-q:v", "3",
             os.path.join(out_dir, f"{name}{suffix}.jpg")],
            check=True,
        )

sizes = ", ".join(
    f"{file} {os.path.getsize(os.path.join(out_dir, file)) // 1024} KB"
    for file in (f"{name}.mp4", f"{name}-portrait.mp4")
)
print(f"{name}: {count} cadre ({count * den / num:.2f}s), {repaired} linii acoperite, "
      f"buclă {(2 * steps - 2) * den / num:.1f}s; {sizes}")
