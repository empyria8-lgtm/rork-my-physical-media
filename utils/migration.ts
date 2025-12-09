import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MediaItem } from '@/types/media';
import { migrateGuestDataToUser } from './sync';

const MIGRATION_STATUS_KEY = 'migration_status';
const GUEST_DATA_BACKUP_KEY = 'guest_data_backup';

export type MigrationStatus = 'not-started' | 'in-progress' | 'completed' | 'failed';

export async function getMigrationStatus(): Promise<MigrationStatus> {
  try {
    const status = await AsyncStorage.getItem(MIGRATION_STATUS_KEY);
    return (status as MigrationStatus) || 'not-started';
  } catch (error) {
    console.error('Failed to get migration status:', error);
    return 'not-started';
  }
}

export async function setMigrationStatus(status: MigrationStatus): Promise<void> {
  try {
    await AsyncStorage.setItem(MIGRATION_STATUS_KEY, status);
    console.log('Migration status set to:', status);
  } catch (error) {
    console.error('Failed to set migration status:', error);
  }
}

export async function backupGuestData(items: MediaItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(GUEST_DATA_BACKUP_KEY, JSON.stringify({
      items,
      timestamp: new Date().toISOString(),
    }));
    console.log('Guest data backed up successfully');
  } catch (error) {
    console.error('Failed to backup guest data:', error);
    throw error;
  }
}

export async function migrateGuestDataOnLogin(
  guestItems: MediaItem[],
  userId: string,
  deviceId: string
): Promise<MediaItem[]> {
  try {
    console.log('Starting guest data migration for user:', userId);
    await setMigrationStatus('in-progress');
    
    await backupGuestData(guestItems);
    
    const migratedItems = migrateGuestDataToUser(guestItems, userId, deviceId);
    
    await setMigrationStatus('completed');
    console.log('Migration completed successfully');
    
    return migratedItems;
  } catch (error) {
    console.error('Migration failed:', error);
    await setMigrationStatus('failed');
    throw error;
  }
}

export async function getGuestDataBackup(): Promise<{ items: MediaItem[]; timestamp: string } | null> {
  try {
    const backup = await AsyncStorage.getItem(GUEST_DATA_BACKUP_KEY);
    return backup ? JSON.parse(backup) : null;
  } catch (error) {
    console.error('Failed to get guest data backup:', error);
    return null;
  }
}

export async function clearGuestDataBackup(): Promise<void> {
  try {
    await AsyncStorage.removeItem(GUEST_DATA_BACKUP_KEY);
    console.log('Guest data backup cleared');
  } catch (error) {
    console.error('Failed to clear guest data backup:', error);
  }
}
