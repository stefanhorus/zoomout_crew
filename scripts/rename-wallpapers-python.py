#!/usr/bin/env python3
"""
Script Python pentru redenumire wallpaper-uri cu nume descriptive + țară
Format: Nume_Descriptiv_Tara.ext
"""

import os
import shutil

WALLPAPER_FOLDER = "/Users/stefanhorus/Documents/Porducts/Wallpaper Pack"

def get_new_name(base_name):
    """Returnează numele nou bazat pe numele vechi"""
    base_upper = base_name.upper()
    
    # Mapare nume -> [Nume Nou, Țară]
    if "EDINBURGH" in base_upper:
        return "Edinburgh_Castle_UK"
    elif "HOLLYWOOD" in base_upper:
        if "BW" in base_upper or "BLACK" in base_upper:
            if "2" in base_name:
                return "Hollywood_Sign_USA_2_BW"
            return "Hollywood_Sign_USA_BW"
        elif "2" in base_name:
            return "Hollywood_Sign_USA_2"
        return "Hollywood_Sign_USA"
    elif "OXFORD" in base_upper:
        return "Oxford_University_UK"
    elif "SARDINIA" in base_upper:
        if "2_1" in base_name or "2" in base_name and "_1" in base_name:
            return "Sardinia_Coast_Italy_2"
        elif "3" in base_name:
            return "Sardinia_Coast_Italy_3"
        elif "4" in base_name:
            return "Sardinia_Coast_Italy_4"
        return "Sardinia_Coast_Italy"
    elif "WTC" in base_upper:
        return "World_Trade_Center_USA"
    elif "BROOKLYN" in base_upper:
        return "Brooklyn_Bridge_USA"
    elif "CENTRAL PARK" in base_upper:
        if "SKYLINE" in base_upper:
            return "Central_Park_Skyline_USA"
        elif "2" in base_name:
            return "Central_Park_USA_2"
        return "Central_Park_USA"
    elif "LITTLE ISLAND" in base_upper:
        if "2" in base_name:
            return "Little_Island_NYC_USA_2"
        return "Little_Island_NYC_USA"
    elif "ATLANTIC" in base_upper or "ATLNTIC" in base_upper:
        return "Atlantic_Shore_USA"
    elif "OCEAN CITY" in base_upper:
        return "Ocean_City_USA"
    elif "GOLDEN GATE" in base_upper:
        return "Golden_Gate_Bridge_USA"
    elif "CANYON" in base_upper:
        return "Grand_Canyon_USA"
    elif "SNOWY LAKE" in base_upper:
        if "2" in base_name:
            return "Snowy_Lake_Canada_2"
        return "Snowy_Lake_Canada"
    elif "FULL PARK" in base_upper:
        return "Full_Park_View_USA"
    elif "PEACEFUL" in base_upper:
        return "Peaceful_Landscape_Unknown"
    elif "TERRAIN" in base_upper:
        return "Mountain_Terrain_Unknown"
    elif "ABOVE THE SKY" in base_upper or "ABOVE THE SKY" in base_upper:
        return "Above_The_Sky_Aerial_Unknown"
    elif "GREEN" in base_upper:
        if "2" in base_name:
            return "Green_Landscape_Unknown_2"
        return "Green_Landscape_Unknown"
    elif "DJI_EXPORT" in base_upper or base_name.startswith("dji_export"):
        return "Aerial_View_Unknown"
    elif "PHOTO2" in base_upper or base_name.lower() == "photo2":
        return "Landscape_Photo_Unknown"
    else:
        # Pentru nume necunoscute, folosim numele original cu _Unknown
        clean_name = base_name.replace(" ", "_").replace("-", "_")
        clean_name = ''.join(c for c in clean_name if c.isalnum() or c == '_')
        return f"{clean_name}_Unknown"

def rename_wallpapers():
    """Redenumește toate wallpaper-urile"""
    if not os.path.exists(WALLPAPER_FOLDER):
        print(f"Eroare: Folderul nu există: {WALLPAPER_FOLDER}")
        return
    
    print(f"=== Redenumire wallpaper-uri cu nume descriptive + țară ===")
    print(f"Folder: {WALLPAPER_FOLDER}")
    print("")
    
    renamed_count = 0
    error_count = 0
    
    # Procesează folderele Horizontal și Vertical
    for subfolder in ["Horizontal", "Vertical"]:
        folder_path = os.path.join(WALLPAPER_FOLDER, subfolder)
        if not os.path.exists(folder_path):
            continue
        
        print(f"--- Procesare fișiere {subfolder} ---")
        
        for filename in os.listdir(folder_path):
            file_path = os.path.join(folder_path, filename)
            
            if not os.path.isfile(file_path):
                continue
            
            # Verifică dacă este o imagine
            ext = os.path.splitext(filename)[1].lower()
            if ext not in ['.jpg', '.jpeg', '.png']:
                continue
            
            base_name = os.path.splitext(filename)[0]
            new_name = get_new_name(base_name)
            new_filename = f"{new_name}{ext}"
            new_path = os.path.join(folder_path, new_filename)
            
            # Verifică dacă fișierul deja are numele corect
            if filename == new_filename:
                print(f"- Deja redenumit: {filename}")
                continue
            
            # Verifică dacă există deja un fișier cu numele nou
            if os.path.exists(new_path):
                print(f"⚠ Fișier deja există, sarim: {new_filename}")
                continue
            
            try:
                os.rename(file_path, new_path)
                print(f"✓ Redenumit: {filename} → {new_filename}")
                renamed_count += 1
            except Exception as e:
                print(f"✗ Eroare la redenumire {filename}: {e}")
                error_count += 1
        
        print("")
    
    print(f"=== Finalizat ===")
    print(f"Fișiere redenumite: {renamed_count}")
    if error_count > 0:
        print(f"Erori: {error_count}")

if __name__ == "__main__":
    rename_wallpapers()
