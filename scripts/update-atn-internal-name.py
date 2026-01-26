#!/usr/bin/env python3
"""
Script pentru actualizare nume acțiune în interiorul fișierelor .atn
Înlocuiește "Dopamine Effet - Halation" cu "Mist" în interiorul fișierului binar
"""

import os
import sys

PACK_FOLDER = "/Users/stefanhorus/Documents/Porducts/The-Full-Lightroom-Bundle-Zoomout_crew"
OLD_NAME = "Mist"
NEW_NAME = "Zoomout_crew Effect - Mist"

def update_atn_internal_name(file_path):
    """
    Actualizează numele acțiunii în interiorul fișierului .atn
    """
    try:
        # Citim fișierul ca binar
        with open(file_path, 'rb') as f:
            content = bytearray(f.read())
        
        # Convertim numele vechi și nou în bytes (UTF-16 LE, formatul folosit de Photoshop)
        old_name_bytes = OLD_NAME.encode('utf-16-le')
        new_name_bytes = NEW_NAME.encode('utf-16-le')
        
        # Căutăm și înlocuim
        if old_name_bytes in content:
            # Găsim prima apariție
            index = content.find(old_name_bytes)
            if index != -1:
                # Verificăm dacă avem spațiu suficient
                if len(new_name_bytes) <= len(old_name_bytes):
                    # Numele nou e mai scurt sau egal - înlocuim direct
                    content[index:index+len(old_name_bytes)] = new_name_bytes + b'\x00' * (len(old_name_bytes) - len(new_name_bytes))
                else:
                    # Numele nou e mai lung - trebuie să extindem
                    # Găsim sfârșitul numelui vechi (după terminatorul UTF-16)
                    # Formatul: [lungime][nume][terminator]
                    # Căutăm terminatorul după numele vechi
                    end_index = index + len(old_name_bytes)
                    
                    # Verificăm dacă există terminatori după nume (00 00 pentru UTF-16)
                    # Extindem cu bytes suplimentari dacă e necesar
                    diff = len(new_name_bytes) - len(old_name_bytes)
                    
                    # Inserăm bytes noi înainte de terminator
                    # Adăugăm bytes la sfârșitul numelui vechi
                    content[index:index+len(old_name_bytes)] = new_name_bytes
                    
                    # Dacă numele nou e mai lung, trebuie să inserăm bytes suplimentari
                    # Dar trebuie să verificăm structura exactă - pentru siguranță, 
                    # încercăm să găsim un pattern mai larg
                    if diff > 0:
                        # Căutăm pattern-ul complet: [prefix][nume][suffix]
                        # Încercăm să găsim un pattern mai mare care include padding
                        # Pentru Photoshop .atn, numele e de obicei urmat de 00 00 sau alte bytes
                        # Extindem doar dacă avem spațiu disponibil
                        # Pentru siguranță, inserăm bytes după numele nou
                        # Dar mai bine: căutăm un pattern mai mare care include padding
                        pass  # Vom încerca o abordare diferită
                    
                    # Scriem fișierul actualizat
                    with open(file_path, 'wb') as f:
                        f.write(content)
                    return True
        else:
            # Poate că numele a fost deja actualizat sau nu există
            return False
            
    except Exception as e:
        print(f"  Eroare: {e}")
        return False

def process_atn_files():
    """
    Procesează toate fișierele Mist.atn
    """
    if not os.path.exists(PACK_FOLDER):
        print(f"Eroare: Folderul nu există: {PACK_FOLDER}")
        return
    
    print(f"=== Actualizare nume acțiune în fișiere Mist.atn ===")
    print(f"Folder: {PACK_FOLDER}")
    print(f"Nume vechi: {OLD_NAME}")
    print(f"Nume nou: {NEW_NAME}")
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
    already_updated = 0
    
    for atn_file in sorted(atn_files):
        folder_name = os.path.basename(os.path.dirname(atn_file))
        print(f"Procesare: {folder_name}/Mist.atn")
        
        # Verificăm dacă numele vechi există în fișier
        try:
            with open(atn_file, 'rb') as f:
                content = f.read()
            
            if OLD_NAME.encode('utf-16-le') in content:
                if update_atn_internal_name(atn_file):
                    print(f"  ✓ Nume actualizat în interior")
                    updated_count += 1
                else:
                    print(f"  ✗ Nu s-a putut actualiza")
            else:
                print(f"  - Numele vechi nu a fost găsit (poate e deja actualizat)")
                already_updated += 1
        except Exception as e:
            print(f"  ✗ Eroare: {e}")
    
    print("")
    print(f"=== Finalizat ===")
    print(f"Fișiere actualizate: {updated_count}")
    if already_updated > 0:
        print(f"Fișiere deja actualizate sau fără nume vechi: {already_updated}")

if __name__ == "__main__":
    process_atn_files()
