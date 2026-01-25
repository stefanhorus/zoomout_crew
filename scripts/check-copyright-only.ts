#!/usr/bin/env tsx

/**
 * Script pentru verificarea copyright-urilor
 * pentru fișierele din folderul Sound Design de pe Google Drive
 * 
 * DOAR VERIFICARE - nu modifică nimic
 * 
 * Utilizare:
 *   npm run check-copyright <FOLDER_ID>
 * 
 * Exemplu:
 *   npm run check-copyright 1Xi393MvpvojRydJCkJa4zRfAQqYIWJA8
 */

import { google } from 'googleapis';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Încarcă variabilele de mediu
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// ID-ul folderului Sound Design
const SOUND_DESIGN_FOLDER_ID = process.argv[2] || '1Xi393MvpvojRydJCkJa4zRfAQqYIWJA8';
const COPYRIGHT_TEXT = '© 2026 Zoomout_crew. All rights reserved.';

interface FileMetadata {
  id: string;
  name: string;
  createdTime: string;
  modifiedTime: string;
  mimeType: string;
  size?: string;
  description?: string;
  properties?: Record<string, string>;
}

async function authenticateGoogleDrive() {
  const serviceAccountKey = process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY;
  
  if (!serviceAccountKey) {
    console.error('❌ GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY nu este setat în .env.local');
    console.log('\n💡 Pentru a verifica copyright-urile, ai nevoie de:');
    console.log('  1. Service Account în Google Cloud Console');
    console.log('  2. JSON key descărcat');
    console.log('  3. Adaugă în .env.local: GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY=\'{"type":"service_account",...}\'');
    console.log('  4. Partajează folderul cu service account-ul (permisiunea "Editor")');
    process.exit(1);
  }

  try {
    const credentials = JSON.parse(serviceAccountKey);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    return google.drive({ version: 'v3', auth });
  } catch (error: any) {
    console.error('❌ Eroare la autentificare:', error.message);
    process.exit(1);
  }
}

async function listAllItems(drive: any, folderId: string): Promise<FileMetadata[]> {
  const items: FileMetadata[] = [];
  let pageToken: string | undefined;

  do {
    try {
      const response = await drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        fields: 'nextPageToken, files(id, name, createdTime, modifiedTime, mimeType, size, description, properties)',
        pageToken,
        pageSize: 1000,
      });

      if (response.data.files) {
        items.push(...(response.data.files as FileMetadata[]));
      }

      pageToken = response.data.nextPageToken || undefined;
    } catch (error: any) {
      console.error('❌ Eroare la listarea itemelor:', error.message);
      throw error;
    }
  } while (pageToken);

  return items;
}

async function checkCopyrights() {
  console.log('🔍 Verificare copyright-uri pentru folderul Sound Design...\n');
  console.log(`📁 Folder ID: ${SOUND_DESIGN_FOLDER_ID}`);
  console.log(`©  Copyright așteptat: ${COPYRIGHT_TEXT}\n`);

  try {
    const drive = await authenticateGoogleDrive();
    
    // Listă toate itemele din folder (fișiere și foldere)
    console.log('📋 Listare iteme...');
    const items = await listAllItems(drive, SOUND_DESIGN_FOLDER_ID);
    
    console.log(`\n📊 Găsite ${items.length} iteme:\n`);

    // Verifică copyright-urile
    const itemsWithCopyright: FileMetadata[] = [];
    const itemsWithoutCopyright: FileMetadata[] = [];
    const itemsWithWrongCopyright: FileMetadata[] = [];

    for (const item of items) {
      const hasDescription = item.description === COPYRIGHT_TEXT;
      const hasProperty = item.properties?.copyright === COPYRIGHT_TEXT;
      const hasAnyCopyright = item.description?.includes('©') || item.properties?.copyright?.includes('©');
      
      if (hasDescription && hasProperty) {
        itemsWithCopyright.push(item);
        console.log(`✅ ${item.name}`);
        console.log(`   Description: ${item.description || 'LIPSEȘTE'}`);
        console.log(`   Copyright property: ${item.properties?.copyright || 'LIPSEȘTE'}`);
      } else if (hasAnyCopyright && (!hasDescription || !hasProperty)) {
        itemsWithWrongCopyright.push(item);
        console.log(`⚠️  ${item.name}`);
        console.log(`   Description: ${item.description || 'LIPSEȘTE'}`);
        console.log(`   Copyright property: ${item.properties?.copyright || 'LIPSEȘTE'}`);
        console.log(`   ⚠️  Copyright parțial sau incorect`);
      } else {
        itemsWithoutCopyright.push(item);
        console.log(`❌ ${item.name}`);
        console.log(`   Description: ${item.description || 'LIPSEȘTE'}`);
        console.log(`   Copyright property: ${item.properties?.copyright || 'LIPSEȘTE'}`);
        console.log(`   ❌ Lipsește copyright`);
      }
      
      if (item.size) {
        const sizeMB = (parseInt(item.size) / (1024 * 1024)).toFixed(2);
        console.log(`   Size: ${sizeMB} MB`);
      }
      console.log('');
    }

    // Rezumat
    console.log('\n📈 Rezumat copyright-uri:');
    console.log(`   ✅ Cu copyright corect: ${itemsWithCopyright.length} iteme`);
    console.log(`   ⚠️  Cu copyright parțial/incorect: ${itemsWithWrongCopyright.length} iteme`);
    console.log(`   ❌ Fără copyright: ${itemsWithoutCopyright.length} iteme`);
    console.log(`   📊 Total: ${items.length} iteme`);

    if (itemsWithoutCopyright.length > 0 || itemsWithWrongCopyright.length > 0) {
      console.log('\n💡 Pentru a actualiza copyright-urile, rulează:');
      console.log(`   npm run check-sound-design-metadata ${SOUND_DESIGN_FOLDER_ID}`);
    } else {
      console.log('\n✅ Toate itemele au copyright-urile corecte!');
    }

  } catch (error: any) {
    console.error('\n❌ Eroare:', error.message);
    if (error.message?.includes('permission') || error.message?.includes('403')) {
      console.error('\n💡 Sfat: Asigură-te că ai partajat folderul cu service account-ul și i-ai dat permisiunea "Editor"');
    }
    if (error.response?.data) {
      console.error('\n📋 Detalii eroare:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

// Rulează scriptul
checkCopyrights().catch(console.error);
