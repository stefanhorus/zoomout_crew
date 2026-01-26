#!/usr/bin/env python3
"""
Script pentru actualizare metadata pentru toate fișierele din Full LUT Bundle
"""

import os
import subprocess

PACK_FOLDER = "/Users/stefanhorus/Documents/Porducts/The-Full-LUT-Bundle-Zoomout_crew"
COPYRIGHT = "© 2026 Zoomout_crew. All rights reserved."
CREATOR = "Zoomout_crew"

def add_metadata_xattr(file_path, file_type):
    """Adaugă metadata folosind xattr"""
    try:
        subprocess.run(['xattr', '-w', 'com.apple.metadata:kMDItemCopyright', COPYRIGHT, file_path], 
                      check=False, capture_output=True)
        subprocess.run(['xattr', '-w', 'com.apple.metadata:kMDItemCreator', CREATOR, file_path], 
                      check=False, capture_output=True)
        
        if file_type == 'cube':
            keywords = "LUT, Color Grading, Video LUT, Zoomout_crew, CUBE"
            description = f"Video LUT by {CREATOR}"
        elif file_type == 'pdf':
            keywords = "Documentation, Guide, Zoomout_crew, PDF"
            description = f"Documentation by {CREATOR}"
        else:
            keywords = f"Zoomout_crew, {file_type.upper()}"
            description = f"File by {CREATOR}"
        
        subprocess.run(['xattr', '-w', 'com.apple.metadata:kMDItemKeywords', keywords, file_path], 
                      check=False, capture_output=True)
        subprocess.run(['xattr', '-w', 'com.apple.metadata:kMDItemDescription', description, file_path], 
                      check=False, capture_output=True)
        return True
    except:
        return False

def get_file_type(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    if ext == '.cube':
        return 'cube'
    elif ext == '.pdf':
        return 'pdf'
    else:
        return 'other'

def process_all_files():
    if not os.path.exists(PACK_FOLDER):
        print(f"Folderul nu există: {PACK_FOLDER}")
        return
    
    print(f"=== Actualizare metadata Full LUT Bundle ===")
    print(f"Folder: {PACK_FOLDER}")
    print("")
    
    all_files = []
    for root, dirs, files in os.walk(PACK_FOLDER):
        for file in files:
            all_files.append(os.path.join(root, file))
    
    print(f"Găsite {len(all_files)} fișiere.")
    print("")
    
    updated = 0
    for file_path in sorted(all_files):
        file_type = get_file_type(file_path)
        if add_metadata_xattr(file_path, file_type):
            updated += 1
            if updated % 20 == 0:
                print(f"  Procesat: {updated} fișiere...")
    
    print("")
    print(f"=== Finalizat ===")
    print(f"Fișiere actualizate: {updated}")

if __name__ == "__main__":
    process_all_files()
