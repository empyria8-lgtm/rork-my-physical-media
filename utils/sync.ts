import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MediaItem } from '@/types/media';

export const USER_MODE_KEY = 'user_mode';
export const LAST_SYNC_KEY = 'last_sync_timestamp';

export type UserMode = 'guest' | 'authenticated';

export async function getUserMode(): Promise<UserMode> {
  try {
    const mode = await AsyncStorage.getItem(USER_MODE_KEY);
    return (mode as UserMode) || 'guest';
  } catch (error) {
    console.error('Failed to get user mode:', error);
    return 'guest';
  }
}

export async function setUserMode(mode: UserMode): Promise<void> {
  try {
    await AsyncStorage.setItem(USER_MODE_KEY, mode);
    console.log('User mode set to:', mode);
  } catch (error) {
    console.error('Failed to set user mode:', error);
  }
}

export async function getLastSyncTimestamp(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(LAST_SYNC_KEY);
  } catch (error) {
    console.error('Failed to get last sync timestamp:', error);
    return null;
  }
}

export async function setLastSyncTimestamp(timestamp: string): Promise<void> {
  try {
    await AsyncStorage.setItem(LAST_SYNC_KEY, timestamp);
    console.log('Last sync timestamp set to:', timestamp);
  } catch (error) {
    console.error('Failed to set last sync timestamp:', error);
  }
}

export function prepareItemsForSync(items: MediaItem[]): MediaItem[] {
  return items.filter(item => 
    item.syncStatus === 'pending' || item.syncStatus === 'local'
  );
}

export function mergeItems(
  localItems: MediaItem[], 
  remoteItems: MediaItem[]
): MediaItem[] {
  const itemMap = new Map<string, MediaItem>();

  [...localItems, ...remoteItems].forEach(item => {
    const existing = itemMap.get(item.id);
    
    if (!existing) {
      itemMap.set(item.id, item);
      return;
    }

    if (item.version > existing.version) {
      itemMap.set(item.id, item);
    } else if (item.version === existing.version) {
      const itemTime = new Date(item.updatedAt).getTime();
      const existingTime = new Date(existing.updatedAt).getTime();
      
      if (itemTime > existingTime) {
        itemMap.set(item.id, item);
      }
    }
  });

  return Array.from(itemMap.values()).filter(item => !item.deletedAt);
}

export function markItemsAsSynced(items: MediaItem[]): MediaItem[] {
  return items.map(item => ({
    ...item,
    syncStatus: 'synced' as const,
    localOnly: false,
  }));
}
