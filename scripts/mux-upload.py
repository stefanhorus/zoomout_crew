#!/usr/bin/env python3
"""Urcă un video în contul Mux al site-ului și afișează Playback ID-ul de pus în lib/projects.ts.

Folosire: python3 -I scripts/mux-upload.py <fișier video> [nume în Mux]
Cheia de acces (MUX_TOKEN_ID / MUX_TOKEN_SECRET) e citită din .env.local și nu se afișează.
Setările sunt ca la celelalte clipuri din portofoliu: calitate premium, până la 4K, redare publică.
Numele apare în panoul Mux la „Passthrough”, ca să știi ce clip e.
Fișierul se trimite în bucăți de 64 MB, fiecare reîncercată de câteva ori: un set de o oră (3+ GB) urcat dintr-o bucată
a căzut la jumătate când s-a întrerupt conexiunea.
"""
import base64
import http.client
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

CHUNK = 64 * 2**20  # multiplu de 256 KB, cum cere Mux pentru urcarea pe bucăți

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
env = {}
with open(os.path.join(ROOT, ".env.local"), encoding="utf-8") as file:
    for line in file:
        if line.startswith(("MUX_TOKEN_ID=", "MUX_TOKEN_SECRET=")):
            key, value = line.strip().split("=", 1)
            env[key] = value.strip().strip('"').strip("'")
AUTH = "Basic " + base64.b64encode(f"{env['MUX_TOKEN_ID']}:{env['MUX_TOKEN_SECRET']}".encode()).decode()


def api(method, path, body=None):
    request = urllib.request.Request(
        f"https://api.mux.com/video/v1/{path}",
        method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"Authorization": AUTH, "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        return json.load(response)["data"]


def send_in_chunks(path, url):
    """PUT pe bucăți cu Content-Range (ca UpChunk): Mux răspunde 308 până la ultima bucată, apoi 200/201."""
    size = os.path.getsize(path)
    target = urllib.parse.urlsplit(url)
    resource = target.path + (f"?{target.query}" if target.query else "")
    start = 0
    with open(path, "rb") as file:
        while start < size:
            file.seek(start)
            data = file.read(CHUNK)
            end = start + len(data) - 1
            for attempt in range(1, 9):
                try:
                    connection = http.client.HTTPSConnection(target.netloc, timeout=300)
                    connection.request("PUT", resource, body=data, headers={
                        "Content-Type": "application/octet-stream",
                        "Content-Length": str(len(data)),
                        "Content-Range": f"bytes {start}-{end}/{size}",
                    })
                    response = connection.getresponse()
                    response.read()
                    received = response.getheader("Range")
                    connection.close()
                    if response.status in (200, 201, 308):
                        break
                    raise RuntimeError(f"HTTP {response.status}")
                except (OSError, http.client.HTTPException, RuntimeError) as error:
                    if attempt == 8:
                        raise
                    print(f"  bucata de la {start // 2**20} MB: {error}; reîncerc ({attempt})", flush=True)
                    time.sleep(min(60, 5 * attempt))
            # Mux poate confirma doar o parte din bucată (Range: bytes=0-N); continuăm de unde a rămas
            start = int(received.rsplit("-", 1)[1]) + 1 if response.status == 308 and received else end + 1
            print(f"  {start * 100 // size}% ({start // 2**20} / {size // 2**20} MB)", flush=True)


path = sys.argv[1]
name = sys.argv[2] if len(sys.argv) > 2 else os.path.basename(path)
try:
    upload = api("POST", "uploads", {
        "cors_origin": "*",
        "new_asset_settings": {
            "playback_policy": ["public"],
            "video_quality": "premium",
            "max_resolution_tier": "2160p",
            "passthrough": name,
        },
    })
except urllib.error.HTTPError as error:
    if error.code in (401, 403):
        sys.exit("Cheia Mux din .env.local nu are voie să urce clipuri. În panoul Mux (Settings > Access Tokens) fă o cheie "
                 "pentru același environment cu Mux Video: Read and Write și pune-o la MUX_TOKEN_ID / MUX_TOKEN_SECRET.")
    raise
print(f"urc {os.path.getsize(path) // 2**20} MB în Mux ({name})...", flush=True)
send_in_chunks(path, upload["url"])

# După ce primește fișierul, Mux creează clipul și îl procesează (câteva minute pentru 4K)
while not (asset_id := api("GET", f"uploads/{upload['id']}").get("asset_id")):
    time.sleep(3)
while (asset := api("GET", f"assets/{asset_id}"))["status"] == "preparing":
    time.sleep(5)
if asset["status"] != "ready":
    sys.exit(f"Mux nu a putut procesa clipul: {asset.get('errors')}")
print(f"gata: {round(asset['duration'])}s, {asset.get('aspect_ratio')}, asset {asset_id}")
print(f"playbackId: {asset['playback_ids'][0]['id']}")
