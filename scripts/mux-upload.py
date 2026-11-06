#!/usr/bin/env python3
"""Urcă un video în contul Mux al site-ului și afișează Playback ID-ul de pus în lib/projects.ts.

Folosire: python3 -I scripts/mux-upload.py <fișier video> [nume în Mux]
Cheia de acces (MUX_TOKEN_ID / MUX_TOKEN_SECRET) e citită din .env.local și nu se afișează.
Setările sunt ca la celelalte clipuri din portofoliu: calitate premium, până la 4K, redare publică.
Numele apare în panoul Mux la „Passthrough”, ca să știi ce clip e.
"""
import base64
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request

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
subprocess.run(["curl", "--fail", "-sS", "-X", "PUT", "-T", path, "-H", "Content-Type: application/octet-stream", upload["url"]],
               check=True)

# După ce primește fișierul, Mux creează clipul și îl procesează (câteva minute pentru 4K)
while not (asset_id := api("GET", f"uploads/{upload['id']}").get("asset_id")):
    time.sleep(3)
while (asset := api("GET", f"assets/{asset_id}"))["status"] == "preparing":
    time.sleep(5)
if asset["status"] != "ready":
    sys.exit(f"Mux nu a putut procesa clipul: {asset.get('errors')}")
print(f"gata: {round(asset['duration'])}s, {asset.get('aspect_ratio')}, asset {asset_id}")
print(f"playbackId: {asset['playback_ids'][0]['id']}")
