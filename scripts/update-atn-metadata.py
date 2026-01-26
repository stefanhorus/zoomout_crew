#!/usr/bin/env python3
"""
Script pentru actualizare metadata fișiere .atn (Photoshop Actions)
Adaugă metadata Zoomout_crew pentru fișierele Mist.atn
"""

import os
import subprocess
import sys

PACK_FOLDER = "/Users/stefanhorus/Documents/Porducts/The-Full-Lightroom-Bundle-Zoomout_crew"
COPYRIGHT = "© 2026 Zoomout_crew. All rights reserved."
CREATOR = "Zoomout_crew"
KEYWORDS = "Photoshop Action, Mist, Zoomout_crew, Photo Preset"

def add_metadata_xattr(file_path):
    """
    Adaugă metadata folosind xattr (macOS extended attributes)
    """
    try:
        # Copyright
        subprocess.run(['xattr', '-w', 'com.apple.metadata:kMDItemCopyright', COPYRIGHT, file_path], 
                      check=False, capture_output=True)
        
        # Creator
        subprocess.run(['xattr', '-w', 'com.apple.metadata:kMDItemCreator', CREATOR, file_path], 
                      check=False, capture_output=True)
        
        # Keywords
        subprocess.run(['xattr', '-w', 'com.apple.metadata:kMDItemKeywords', KEYWORDS, file_path], 
                      check=False, capture_output=True)
        
        # Description
        description = f"Photoshop Action - Mist effect by {CREATOR}"
        subprocess.run(['xattr', '-w', 'com.apple.metadata:kMDItemDescription', description, file_path], 
                      check=False, capture_output=True)
        
        return True
    except Exception as e:
        print(f"Eroare la adăugare metadata pentru {file_path}: {e}")
        return False

def process_atn_files():
    """
    Procesează toate fișierele Mist.atn
    """
    if not os.path.exists(PACK_FOLDER):
        print(f"Eroare: Folderul nu există: {PACK_FOLDER}")
        return
    
    print(f"=== Actualizare metadata fișiere Mist.atn ===")
    print(f"Folder: {PACK_FOLDER}")
    print(f"Creator: {CREATOR}")
    print(f"Copyright: {COPYRIGHT}")
    print("")
    
    atn_files = []
    for root, dirs, files in os.walk(PACK_FOLDER):
        for file in files:
            if file == "Mist.atn":
                atn_files.append(os.path.join(root, file))
    
    if not atn_files:
        print("Nu s-au găsit fișiere Mist.atn.")
        return
    
    print(f"Găsite {len(atn_files)} fișiere Mist.atn.")
    print("")
    
    updated_count = 0
    error_count = 0
    
    for atn_file in sorted(atn_files):
        try:
            if add_metadata_xattr(atn_file):
                print(f"✓ Metadata actualizată: {os.path.basename(os.path.dirname(atn_file))}/Mist.atn")
                updated_count += 1
            else:
                print(f"✗ Eroare la {os.path.basename(os.path.dirname(atn_file))}/Mist.atn")
                error_count += 1
        except Exception as e:
            print(f"✗ Eroare la {os.path.basename(os.path.dirname(atn_file))}/Mist.atn: {e}")
            error_count += 1
    
    print("")
    print(f"=== Finalizat ===")
    print(f"Fișiere actualizate: {updated_count}")
    if error_count > 0:
        print(f"Erori: {error_count}")

if __name__ == "__main__":
    process_atn_files()
