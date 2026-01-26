#!/usr/bin/env python3
"""
Script pentru actualizare metadata în fișierele XMP Lightroom
Actualizează: Copyright, ContactInfo, și Name (dacă e gol)
"""

import os
import sys
import re
import xml.etree.ElementTree as ET
from pathlib import Path

# Metadata values
COPYRIGHT = "© 2026 Zoomout_crew. All rights reserved."
CONTACT_INFO = "Zoomout_crew"
NAMESPACE_MAP = {
    'x': 'adobe:ns:meta/',
    'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    'crs': 'http://ns.adobe.com/camera-raw-settings/1.0/'
}

PACK_FOLDER = "/Users/stefanhorus/Documents/Porducts/The-Full-Lightroom-Bundle-Zoomout_crew"

def register_namespaces():
    """Înregistrează namespace-urile pentru XML"""
    for prefix, uri in NAMESPACE_MAP.items():
        ET.register_namespace(prefix, uri)

def update_xmp_metadata(file_path):
    """
    Actualizează metadata în fișierul XMP
    """
    try:
        # Citim fișierul ca text pentru a păstra formatarea
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Actualizăm crs:Copyright dacă e gol sau inexistent
        # Pattern pentru crs:Copyright=""
        copyright_pattern = r'(crs:Copyright=")[^"]*(")'
        if re.search(copyright_pattern, content):
            content = re.sub(copyright_pattern, r'\1' + COPYRIGHT + r'\2', content)
        else:
            # Dacă nu există, adăugăm după crs:ContactInfo
            contact_pattern = r'(crs:ContactInfo="[^"]*")'
            if re.search(contact_pattern, content):
                content = re.sub(contact_pattern, r'\1\n   crs:Copyright="' + COPYRIGHT + '"', content)
        
        # Actualizăm crs:ContactInfo dacă e gol
        contact_pattern = r'(crs:ContactInfo=")[^"]*(")'
        if re.search(contact_pattern, content):
            content = re.sub(contact_pattern, r'\1' + CONTACT_INFO + r'\2', content)
        
        # Dacă nu s-a făcut nicio modificare, nu scriem fișierul
        if content == original_content:
            return False
        
        # Scriem fișierul actualizat
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return True
        
    except Exception as e:
        print(f"Eroare la procesarea {file_path}: {e}")
        return False

def process_xmp_files():
    """
    Procesează toate fișierele XMP din folder
    """
    if not os.path.exists(PACK_FOLDER):
        print(f"Eroare: Folderul nu există: {PACK_FOLDER}")
        return
    
    print(f"=== Actualizare metadata fișiere XMP ===")
    print(f"Folder: {PACK_FOLDER}")
    print(f"Copyright: {COPYRIGHT}")
    print(f"Contact Info: {CONTACT_INFO}")
    print("")
    
    xmp_files = []
    for root, dirs, files in os.walk(PACK_FOLDER):
        for file in files:
            if file.lower().endswith('.xmp'):
                xmp_files.append(os.path.join(root, file))
    
    if not xmp_files:
        print("Nu s-au găsit fișiere XMP.")
        return
    
    print(f"Găsite {len(xmp_files)} fișiere XMP.")
    print("")
    
    updated_count = 0
    error_count = 0
    
    for xmp_file in sorted(xmp_files):
        try:
            if update_xmp_metadata(xmp_file):
                print(f"✓ Actualizat: {os.path.basename(xmp_file)}")
                updated_count += 1
            else:
                print(f"- Fără modificări: {os.path.basename(xmp_file)}")
        except Exception as e:
            print(f"✗ Eroare la {os.path.basename(xmp_file)}: {e}")
            error_count += 1
    
    print("")
    print(f"=== Finalizat ===")
    print(f"Fișiere actualizate: {updated_count}")
    print(f"Fișiere fără modificări: {len(xmp_files) - updated_count - error_count}")
    if error_count > 0:
        print(f"Erori: {error_count}")

if __name__ == "__main__":
    register_namespaces()
    process_xmp_files()
