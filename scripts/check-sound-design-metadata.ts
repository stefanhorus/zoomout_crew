#!/usr/bin/env tsx

/**
 * Script pentru verificarea și actualizarea metadata și copyright-urilor
 * pentru fișierele din folderul Sound Design de pe Google Drive
 * 
 * Setează data de creare/modificare pe 22 ianuarie 2026
 * 
 * Utilizare:
 *   npm run check-sound-design-metadata <FOLDER_ID>
 * 
 * SAU setează SOUND_DESIGN_FOLDER_ID în .env.local
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

// ID-ul folderului Sound Design (trebuie să fie setat în .env.local sau ca argument)
const SOUND_DESIGN_FOLDER_ID = process.env.SOUND_DESIGN_FOLDER_ID || process.argv[2];

// Data țintă: 22 ianuarie 2026
const TARGET_DATE = new Date('2026-01-22T00:00:00.000Z');
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
    throw new Error('GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY nu este setat în .env.local');
  }

  const credentials = JSON.parse(serviceAccountKey);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive'],
  });

  return google.drive({ version: 'v3', auth });
}

async function listFilesInFolder(drive: any, folderId: string): Promise<FileMetadata[]> {
  const files: FileMetadata[] = [];
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
        files.push(...(response.data.files as FileMetadata[]));
      }

      pageToken = response.data.nextPageToken || undefined;
    } catch (error: any) {
      console.error('❌ Eroare la listarea fișierelor:', error.message);
      throw error;
    }
  } while (pageToken);

  return files;
}

async function updateFileMetadata(
  drive: any,
  fileId: string,
  fileName: string,
  targetDate: Date
): Promise<void> {
  try {
    // Actualizează metadata fișierului
    // Notă: Google Drive API nu permite modificarea directă a createdTime,
    // dar putem seta modifiedTime și properties (copyright)
    
    const updateBody: any = {
      modifiedTime: targetDate.toISOString(),
      description: COPYRIGHT_TEXT,
    };

    // Adaugă properties dacă nu există deja
    const file = await drive.files.get({
      fileId,
      fields: 'properties',
    });

    const existingProperties = file.data.properties || {};
    
    updateBody.properties = {
      ...existingProperties,
      copyright: COPYRIGHT_TEXT,
      createdDate: targetDate.toISOString(),
      modifiedDate: targetDate.toISOString(),
      'zoomout_crew_original_created': targetDate.toISOString(),
    };

    await drive.files.update({
      fileId,
      requestBody: updateBody,
      fields: 'id, name, modifiedTime, description, properties',
    });

    console.log(`✅ Actualizat: ${fileName}`);
  } catch (error: any) {
    console.error(`❌ Eroare la actualizarea ${fileName}:`, error.message);
    if (error.response?.data) {
      console.error('   Detalii:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

async function checkAndUpdateMetadata() {
  if (!SOUND_DESIGN_FOLDER_ID) {
    console.error('❌ SOUND_DESIGN_FOLDER_ID nu este setat!');
    console.log('\n📝 Utilizare:');
    console.log('  1. Setează SOUND_DESIGN_FOLDER_ID în .env.local, SAU');
    console.log('  2. Rulează: npm run check-sound-design-metadata <FOLDER_ID>');
    process.exit(1);
  }

  console.log('🔍 Verificare metadata pentru folderul Sound Design...\n');
  console.log(`📁 Folder ID: ${SOUND_DESIGN_FOLDER_ID}`);
  console.log(`📅 Data țintă: ${TARGET_DATE.toLocaleDateString('ro-RO')}`);
  console.log(`©  Copyright: ${COPYRIGHT_TEXT}\n`);

  try {
    const drive = await authenticateGoogleDrive();
    
    // Listă toate fișierele din folder
    console.log('📋 Listare fișiere...');
    const files = await listFilesInFolder(drive, SOUND_DESIGN_FOLDER_ID);
    
    console.log(`\n📊 Găsite ${files.length} fișiere:\n`);

    // Verifică metadata pentru fiecare fișier
    const filesToUpdate: FileMetadata[] = [];
    const filesOK: FileMetadata[] = [];

    for (const file of files) {
      const createdDate = new Date(file.createdTime);
      const modifiedDate = new Date(file.modifiedTime);
      
      // Verifică dacă fișierul necesită actualizare
      const modifiedTimeOK = Math.abs(modifiedDate.getTime() - TARGET_DATE.getTime()) < 1000; // 1 secundă toleranță
      const descriptionOK = file.description === COPYRIGHT_TEXT;
      const copyrightOK = file.properties?.copyright === COPYRIGHT_TEXT;
      const metadataDateOK = file.properties?.['zoomout_crew_original_created'] === TARGET_DATE.toISOString();
      
      const needsUpdate = !modifiedTimeOK || !descriptionOK || !copyrightOK || !metadataDateOK;

      if (needsUpdate) {
        filesToUpdate.push(file);
        console.log(`⚠️  ${file.name}`);
        console.log(`   Created: ${createdDate.toLocaleDateString('ro-RO')} ${createdDate.toLocaleTimeString('ro-RO')}`);
        console.log(`   Modified: ${modifiedDate.toLocaleDateString('ro-RO')} ${modifiedDate.toLocaleTimeString('ro-RO')}`);
        console.log(`   Copyright: ${file.properties?.copyright || 'LIPSEȘTE'}`);
        console.log(`   Description: ${file.description || 'LIPSEȘTE'}`);
        if (file.size) {
          const sizeMB = (parseInt(file.size) / (1024 * 1024)).toFixed(2);
          console.log(`   Size: ${sizeMB} MB`);
        }
      } else {
        filesOK.push(file);
        console.log(`✅ ${file.name} (OK)`);
      }
    }

    console.log(`\n📈 Rezumat:`);
    console.log(`   ✅ OK: ${filesOK.length} fișiere`);
    console.log(`   ⚠️  Necesită actualizare: ${filesToUpdate.length} fișiere`);

    if (filesToUpdate.length > 0) {
      console.log(`\n🔄 Actualizare metadata pentru ${filesToUpdate.length} fișiere...\n`);
      
      for (const file of filesToUpdate) {
        await updateFileMetadata(drive, file.id, file.name, TARGET_DATE);
        // Mic delay pentru a evita rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`\n✅ Actualizare completă! Toate fișierele au metadata setată pe 22 ianuarie 2026.`);
    } else {
      console.log(`\n✅ Toate fișierele au deja metadata corectă!`);
    }

  } catch (error: any) {
    console.error('\n❌ Eroare:', error.message);
    if (error.code === 'ENOENT') {
      console.error('\n💡 Sfat: Asigură-te că ai setat GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY în .env.local');
    } else if (error.message?.includes('GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY')) {
      console.error('\n💡 Sfat:');
      console.error('  1. Creează un Service Account în Google Cloud Console');
      console.error('  2. Descarcă JSON key-ul');
      console.error('  3. Adaugă în .env.local: GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY=\'{"type":"service_account",...}\'');
    } else if (error.message?.includes('permission') || error.message?.includes('403')) {
      console.error('\n💡 Sfat: Asigură-te că ai partajat folderul cu service account-ul și i-ai dat permisiunea "Editor"');
    }
    if (error.response?.data) {
      console.error('\n📋 Detalii eroare:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

// Rulează scriptul
checkAndUpdateMetadata().catch(console.error);
