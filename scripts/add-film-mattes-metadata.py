#!/usr/bin/env python3
"""
Script pentru adăugarea metadata la toate fișierele din Film Mattes and Artifacts Pack
Adaugă copyright, creator, keywords și alte metadata relevante

NOTĂ IMPORTANTĂ:
- Metadata adăugată prin xattr este metadata macOS Spotlight (pentru căutare)
- Pentru ca metadata să apară în "Get Info" sau în aplicațiile de editare,
  trebuie instalat exiftool și folosit pentru a adăuga EXIF/IPTC/QuickTime metadata
- Pentru a instala exiftool: brew install exiftool
"""

import os
import sys
from pathlib import Path
from datetime import datetime

# Metadata values
COPYRIGHT = "© 2026 Zoomout_crew. All rights reserved."
CREATOR = "Zoomout_crew"
CREATOR_URL = "https://zoomout-crew.com"
KEYWORDS = ["film matte", "film overlay", "cinematic", "video editing", "premiere pro", "davinci resolve", "film artifacts"]
DESCRIPTION_BASE = "Professional film matte overlay for video editing"

def add_png_metadata_pillow(file_path, folder_name):
    """Adaugă metadata la fișiere PNG folosind Pillow"""
    try:
        from PIL import Image
        from PIL.ExifTags import TAGS
        
        img = Image.open(file_path)
        
        # Extrage numărul din nume pentru descriere
        filename = os.path.basename(file_path)
        number = ''.join(filter(str.isdigit, filename))[:2]
        
        description = DESCRIPTION_BASE
        if "STATIC FILM MATTE" in folder_name:
            description = f"Professional static film matte overlay {number} for video editing"
        elif "STATIC FILM ARTIFAC" in folder_name:
            description = f"Professional film artifact overlay {number} (scratches, dust, grain)"
        
        # Creează metadata dict
        exif_dict = {}
        
        # Adaugă metadata în format EXIF
        # Notă: Pillow are limitări pentru metadata complexă, dar putem adăuga câmpuri de bază
        try:
            # Salvează cu metadata
            img.save(file_path, exif=img.getexif() if hasattr(img, 'getexif') else None)
        except Exception as e:
            print(f"  ⚠️  {filename}: Nu s-a putut adăuga metadata EXIF ({e})")
            return False
        
        return True
    except ImportError:
        print("  ❌ Pillow nu este instalat. Instalează: pip3 install Pillow")
        return False
    except Exception as e:
        print(f"  ❌ Eroare: {e}")
        return False

def add_metadata_xattr(file_path, folder_name):
    """Adaugă metadata folosind xattr (macOS native)"""
    try:
        import subprocess
        
        filename = os.path.basename(file_path)
        number = ''.join(filter(str.isdigit, filename))[:2]
        
        description = DESCRIPTION_BASE
        if "STATIC FILM MATTE" in folder_name:
            description = f"Professional static film matte overlay {number} for video editing"
        elif "VIDEO FILM MATTE" in folder_name:
            description = f"Professional animated film matte overlay {number} for video editing"
        elif "STATIC FILM ARTIFAC" in folder_name:
            description = f"Professional film artifact overlay {number} (scratches, dust, grain)"
        elif "VIDEO FILM ARTIFAC" in folder_name:
            description = f"Professional animated film artifact overlay {number} (scratches, dust, grain)"
        
        # Adaugă metadata folosind xattr
        keywords_str = ",".join(KEYWORDS)
        
        # Adaugă extended attributes
        subprocess.run(['xattr', '-w', 'com.apple.metadata:kMDItemCopyright', COPYRIGHT, file_path], 
                      check=False, capture_output=True)
        subprocess.run(['xattr', '-w', 'com.apple.metadata:kMDItemCreator', CREATOR, file_path], 
                      check=False, capture_output=True)
        subprocess.run(['xattr', '-w', 'com.apple.metadata:kMDItemKeywords', keywords_str, file_path], 
                      check=False, capture_output=True)
        subprocess.run(['xattr', '-w', 'com.apple.metadata:kMDItemDescription', description, file_path], 
                      check=False, capture_output=True)
        
        return True
    except Exception as e:
        print(f"  ❌ Eroare xattr: {e}")
        return False

def add_mov_metadata(file_path, folder_name):
    """Adaugă metadata la fișiere MOV folosind xattr"""
    return add_metadata_xattr(file_path, folder_name)

def main():
    # Folderul Film Mattes and Artifacts Pack
    if len(sys.argv) > 1:
        pack_folder = sys.argv[1]
    else:
        pack_folder = os.path.expanduser("~/Documents/Porducts/Film Mattes and Artifacts Pack")
    
    if not os.path.isdir(pack_folder):
        print(f"❌ Folderul nu există: {pack_folder}")
        sys.exit(1)
    
    print("🔧 Adăugare metadata pentru Film Mattes and Artifacts Pack...")
    print(f"📁 Folder: {pack_folder}")
    print(f"©  Copyright: {COPYRIGHT}")
    print(f"👤 Creator: {CREATOR}")
    print()
    
    total_files = 0
    success_count = 0
    error_count = 0
    
    # Procesează toate fișierele PNG
    print("📄 Procesare fișiere PNG...")
    for root, dirs, files in os.walk(pack_folder):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                file_path = os.path.join(root, file)
                folder_name = root
                
                # Încearcă cu xattr (funcționează pentru toate tipurile de fișiere)
                if add_metadata_xattr(file_path, folder_name):
                    print(f"  ✅ {file}")
                    success_count += 1
                else:
                    print(f"  ❌ {file} (eroare)")
                    error_count += 1
                total_files += 1
    
    # Procesează toate fișierele MOV/MP4
    print()
    print("🎬 Procesare fișiere MOV/MP4...")
    for root, dirs, files in os.walk(pack_folder):
        for file in files:
            if file.lower().endswith(('.mov', '.mp4')):
                file_path = os.path.join(root, file)
                folder_name = root
                
                if add_mov_metadata(file_path, folder_name):
                    print(f"  ✅ {file}")
                    success_count += 1
                else:
                    print(f"  ❌ {file} (eroare)")
                    error_count += 1
                total_files += 1
    
    print()
    print("✅ Gata! Metadata a fost adăugată pentru toate fișierele.")
    print()
    print("📈 Rezumat:")
    print(f"   ✅ Succes: {success_count} fișiere")
    if error_count > 0:
        print(f"   ❌ Erori: {error_count} fișiere")
    print()
    
    # Verificare finală
    print("🔍 Verificare metadata (exemplu):")
    for root, dirs, files in os.walk(pack_folder):
        for file in files:
            if file.lower().endswith(('.png', '.mov')):
                file_path = os.path.join(root, file)
                print(f"📄 {file}:")
                try:
                    import subprocess
                    result = subprocess.run(['xattr', '-l', file_path], 
                                          capture_output=True, text=True, check=False)
                    if result.stdout:
                        lines = result.stdout.strip().split('\n')[:5]
                        for line in lines:
                            if 'kMDItem' in line:
                                print(f"   {line}")
                    break
                except:
                    pass
                break
        break

if __name__ == "__main__":
    main()
