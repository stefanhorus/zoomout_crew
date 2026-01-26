#!/usr/bin/env python3
"""
Script pentru actualizare metadata pentru toate fișierele din Lightroom Bundle
Adaugă metadata Zoomout_crew pentru toate tipurile de fișiere
"""

import os
import subprocess
import sys

PACK_FOLDER = "/Users/stefanhorus/Documents/Porducts/The-Full-Lightroom-Bundle-Zoomout_crew"
COPYRIGHT = "© 2026 Zoomout_crew. All rights reserved."
CREATOR = "Zoomout_crew"

def add_metadata_xattr(file_path, file_type):
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
        
        # Keywords bazate pe tipul de fișier
        if file_type == 'xmp':
            keywords = "Lightroom Preset, Photo Preset, Zoomout_crew, XMP"
            description = f"Lightroom Preset by {CREATOR}"
        elif file_type == 'dng':
            keywords = "Lightroom Preset, Mobile Preset, Zoomout_crew, DNG"
            description = f"Lightroom Mobile Preset by {CREATOR}"
        elif file_type == 'atn':
            keywords = "Photoshop Action, Photoshop, Zoomout_crew, ATN"
            description = f"Photoshop Action by {CREATOR}"
        elif file_type == 'pdf':
            keywords = "Documentation, Guide, Zoomout_crew, PDF"
            description = f"Documentation by {CREATOR}"
        else:
            keywords = f"Zoomout_crew, {file_type.upper()}"
            description = f"File by {CREATOR}"
        
        # Keywords
        subprocess.run(['xattr', '-w', 'com.apple.metadata:kMDItemKeywords', keywords, file_path], 
                      check=False, capture_output=True)
        
        # Description
        subprocess.run(['xattr', '-w', 'com.apple.metadata:kMDItemDescription', description, file_path], 
                      check=False, capture_output=True)
        
        return True
    except Exception as e:
        return False

def get_file_type(file_path):
    """Determină tipul de fișier pe baza extensiei"""
    ext = os.path.splitext(file_path)[1].lower()
    if ext == '.xmp':
        return 'xmp'
    elif ext == '.dng':
        return 'dng'
    elif ext == '.atn':
        return 'atn'
    elif ext == '.pdf':
        return 'pdf'
    else:
        return 'other'

def process_all_files():
    """
    Procesează toate fișierele din folder
    """
    if not os.path.exists(PACK_FOLDER):
        print(f"Eroare: Folderul nu există: {PACK_FOLDER}")
        return
    
    print(f"=== Actualizare metadata pentru toate fișierele ===")
    print(f"Folder: {PACK_FOLDER}")
    print(f"Creator: {CREATOR}")
    print(f"Copyright: {COPYRIGHT}")
    print("")
    
    # Colectăm toate fișierele
    all_files = []
    for root, dirs, files in os.walk(PACK_FOLDER):
        for file in files:
            all_files.append(os.path.join(root, file))
    
    if not all_files:
        print("Nu s-au găsit fișiere.")
        return
    
    print(f"Găsite {len(all_files)} fișiere.")
    print("")
    
    updated_count = 0
    error_count = 0
    
    # Procesăm fiecare fișier
    for file_path in sorted(all_files):
        try:
            file_type = get_file_type(file_path)
            relative_path = os.path.relpath(file_path, PACK_FOLDER)
            
            if add_metadata_xattr(file_path, file_type):
                updated_count += 1
                if updated_count % 20 == 0:
                    print(f"  Procesat: {updated_count} fișiere...")
            else:
                error_count += 1
        except Exception as e:
            error_count += 1
    
    print("")
    print(f"=== Finalizat ===")
    print(f"Fișiere actualizate: {updated_count}")
    if error_count > 0:
        print(f"Erori: {error_count}")

if __name__ == "__main__":
    process_all_files()
