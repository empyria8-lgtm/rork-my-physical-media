import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MediaItem } from '@/types/media';

const BACKUP_METADATA_KEY = 'backup_metadata';
const LOCAL_BACKUP_KEY = 'local_backup';

export interface BackupMetadata {
  lastBackup: string;
  backupCount: number;
  totalSize: number;
  cloudProvider?: 'firebase' | 's3' | 'cloudinary' | 'custom';
  autoBackupEnabled: boolean;
}

export async function getBackupMetadata(): Promise<BackupMetadata | null> {
  try {
    const metadata = await AsyncStorage.getItem(BACKUP_METADATA_KEY);
    return metadata ? JSON.parse(metadata) : null;
  } catch (error) {
    console.error('Failed to get backup metadata:', error);
    return null;
  }
}

export async function updateBackupMetadata(metadata: BackupMetadata): Promise<void> {
  try {
    await AsyncStorage.setItem(BACKUP_METADATA_KEY, JSON.stringify(metadata));
    console.log('Backup metadata updated');
  } catch (error) {
    console.error('Failed to update backup metadata:', error);
  }
}

export async function createLocalBackup(items: MediaItem[]): Promise<void> {
  try {
    const backup = {
      items,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
    
    await AsyncStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(backup));
    console.log('Local backup created successfully');
    
    const currentMetadata = await getBackupMetadata();
    await updateBackupMetadata({
      lastBackup: backup.timestamp,
      backupCount: (currentMetadata?.backupCount || 0) + 1,
      totalSize: new Blob([JSON.stringify(backup)]).size,
      autoBackupEnabled: currentMetadata?.autoBackupEnabled || false,
    });
  } catch (error) {
    console.error('Failed to create local backup:', error);
    throw error;
  }
}

export async function restoreFromLocalBackup(): Promise<MediaItem[] | null> {
  try {
    const backup = await AsyncStorage.getItem(LOCAL_BACKUP_KEY);
    if (!backup) {
      console.log('No local backup found');
      return null;
    }
    
    const parsed = JSON.parse(backup);
    console.log('Restoring backup from:', parsed.timestamp);
    return parsed.items;
  } catch (error) {
    console.error('Failed to restore from local backup:', error);
    return null;
  }
}

export async function prepareExportData(items: MediaItem[]): Promise<string> {
  const exportData = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    itemCount: items.length,
    items: items.map(item => ({
      ...item,
      syncStatus: 'local',
      deviceId: '',
      userId: undefined,
    })),
  };
  
  return JSON.stringify(exportData, null, 2);
}

export async function importData(jsonString: string): Promise<MediaItem[]> {
  try {
    const data = JSON.parse(jsonString);
    
    if (!data.items || !Array.isArray(data.items)) {
      throw new Error('Invalid import format');
    }
    
    console.log('Importing', data.items.length, 'items');
    return data.items;
  } catch (error) {
    console.error('Failed to import data:', error);
    throw error;
  }
}
