import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import type { MediaItem } from '@/types/media';

const STORAGE_KEY = 'media_collection';
const STORAGE_VERSION_KEY = 'media_collection_version';
const DEVICE_ID_KEY = 'device_id';
const USER_MODE_KEY = 'user_mode';
const CURRENT_VERSION = '1.0.0';
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 500;

async function getOrCreateDeviceId(): Promise<string> {
  try {
    const existing = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (existing) {
      return existing;
    }
    const deviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
    console.log('Created new device ID:', deviceId);
    return deviceId;
  } catch (error) {
    console.error('Failed to get/create device ID:', error);
    return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadMediaItems(): Promise<MediaItem[]> {
  for (let attempt = 0; attempt < MAX_RETRY_ATTEMPTS; attempt++) {
    try {
      const [stored, version] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(STORAGE_VERSION_KEY),
      ]);

      console.log('Loading media items (attempt', attempt + 1, ')...');
      
      if (!stored) {
        console.log('No stored data found, initializing empty collection');
        if (!version) {
          await AsyncStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
          console.log('Set initial version:', CURRENT_VERSION);
        }
        return [];
      }

      let items = JSON.parse(stored) as MediaItem[];
      console.log('Loaded', items.length, 'items from storage');
      
      const deviceId = await getOrCreateDeviceId();
      items = items.map(item => ({
        ...item,
        updatedAt: item.updatedAt || item.createdAt,
        localOnly: item.localOnly ?? true,
        syncStatus: item.syncStatus || 'local',
        deviceId: item.deviceId || deviceId,
        version: item.version || 1,
      }));
      
      const needsMigration = items.some(item => !item.deviceId || !item.updatedAt);
      if (needsMigration) {
        console.log('Migrating items to new schema');
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      }
      
      if (!version) {
        await AsyncStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
        console.log('Set version after data load:', CURRENT_VERSION);
      }

      return items;
    } catch (error) {
      console.error('Failed to load media items (attempt', attempt + 1, '):', error);
      
      if (attempt < MAX_RETRY_ATTEMPTS - 1) {
        console.log('Retrying in', RETRY_DELAY, 'ms...');
        await delay(RETRY_DELAY * (attempt + 1));
      } else {
        console.error('All load attempts failed, returning empty array');
        return [];
      }
    }
  }
  return [];
}

async function saveMediaItems(items: MediaItem[]): Promise<MediaItem[]> {
  for (let attempt = 0; attempt < MAX_RETRY_ATTEMPTS; attempt++) {
    try {
      console.log('Saving', items.length, 'items (attempt', attempt + 1, ')...');
      
      const data = JSON.stringify(items);
      const dataSize = new Blob([data]).size;
      console.log('Data size:', Math.round(dataSize / 1024), 'KB');
      
      await AsyncStorage.setItem(STORAGE_KEY, data);
      console.log('Successfully saved items to storage');
      
      return items;
    } catch (error) {
      console.error('Failed to save media items (attempt', attempt + 1, '):', error);
      
      if (error instanceof Error) {
        if (error.message.includes('QuotaExceeded') || error.message.includes('quota')) {
          console.error('Storage quota exceeded');
          throw new Error('STORAGE_FULL');
        }
      }
      
      if (attempt < MAX_RETRY_ATTEMPTS - 1) {
        console.log('Retrying save in', RETRY_DELAY, 'ms...');
        await delay(RETRY_DELAY * (attempt + 1));
      } else {
        console.error('All save attempts failed');
        throw new Error('STORAGE_ERROR');
      }
    }
  }
  throw new Error('STORAGE_ERROR');
}

export const [MediaProvider, useMediaContext] = createContextHook(() => {
  const queryClient = useQueryClient();

  const mediaQuery = useQuery({
    queryKey: ['media'],
    queryFn: loadMediaItems,
  });

  const saveMutation = useMutation({
    mutationFn: saveMediaItems,
    onSuccess: (data) => {
      queryClient.setQueryData(['media'], data);
    },
  });

  const { mutate } = saveMutation;

  const items = useMemo(() => mediaQuery.data ?? [], [mediaQuery.data]);

  const addItem = useCallback(async (item: Omit<MediaItem, 'id' | 'createdAt' | 'updatedAt' | 'localOnly' | 'syncStatus' | 'deviceId' | 'version'>) => {
    const deviceId = await getOrCreateDeviceId();
    const now = new Date().toISOString();
    const newItem: MediaItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
      localOnly: true,
      syncStatus: 'local',
      deviceId,
      version: 1,
    };
    console.log('Adding new item:', newItem.id, newItem.title);
    const updated = [...items, newItem];
    return new Promise<void>((resolve, reject) => {
      mutate(updated, {
        onSuccess: () => {
          console.log('Item added successfully');
          resolve();
        },
        onError: (error) => {
          console.error('Failed to add item:', error);
          reject(error);
        },
      });
    });
  }, [items, mutate]);

  const updateItem = useCallback((id: string, updates: Partial<MediaItem>) => {
    console.log('Updating item:', id, updates);
    const updated = items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          ...updates,
          updatedAt: new Date().toISOString(),
          version: item.version + 1,
          syncStatus: 'pending' as const,
        };
      }
      return item;
    });
    mutate(updated, {
      onSuccess: () => console.log('Item updated successfully'),
      onError: (error) => console.error('Failed to update item:', error),
    });
  }, [items, mutate]);

  const deleteItem = useCallback((id: string) => {
    console.log('Deleting item:', id);
    const now = new Date().toISOString();
    const updated = items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          deletedAt: now,
          updatedAt: now,
          version: item.version + 1,
          syncStatus: 'pending' as const,
        };
      }
      return item;
    }).filter(item => !item.deletedAt);
    mutate(updated, {
      onSuccess: () => console.log('Item deleted successfully'),
      onError: (error) => console.error('Failed to delete item:', error),
    });
  }, [items, mutate]);

  return {
    items,
    isLoading: mediaQuery.isLoading,
    isError: mediaQuery.isError,
    addItem,
    updateItem,
    deleteItem,
    refetch: mediaQuery.refetch,
  };
});

export type SortOption = 'newest' | 'oldest' | 'title-asc' | 'title-desc';

export function useFilteredMedia(
  categoryFilter?: string, 
  searchQuery?: string,
  sortBy: SortOption = 'newest'
) {
  const { items } = useMediaContext();

  return useMemo(() => {
    let filtered = items;

    if (categoryFilter && categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.notes?.toLowerCase().includes(query)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'title-asc':
          return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
        case 'title-desc':
          return b.title.toLowerCase().localeCompare(a.title.toLowerCase());
        default:
          return 0;
      }
    });

    return sorted;
  }, [items, categoryFilter, searchQuery, sortBy]);
}
