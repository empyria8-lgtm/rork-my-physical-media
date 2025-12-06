import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import type { MediaItem } from '@/types/media';

const STORAGE_KEY = 'media_collection';

async function loadMediaItems(): Promise<MediaItem[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load media items:', error);
    console.log('Storage error details:', error);
    return [];
  }
}

async function saveMediaItems(items: MediaItem[]): Promise<MediaItem[]> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return items;
  } catch (error) {
    console.error('Failed to save media items:', error);
    console.log('Storage error details:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('QuotaExceeded') || error.message.includes('quota')) {
        throw new Error('STORAGE_FULL');
      }
    }
    
    throw new Error('STORAGE_ERROR');
  }
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

  const addItem = useCallback((item: Omit<MediaItem, 'id' | 'createdAt'>) => {
    const newItem: MediaItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...items, newItem];
    mutate(updated);
  }, [items, mutate]);

  const updateItem = useCallback((id: string, updates: Partial<MediaItem>) => {
    const updated = items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    mutate(updated);
  }, [items, mutate]);

  const deleteItem = useCallback((id: string) => {
    const updated = items.filter(item => item.id !== id);
    mutate(updated);
  }, [items, mutate]);

  return {
    items,
    isLoading: mediaQuery.isLoading,
    addItem,
    updateItem,
    deleteItem,
  };
});

export function useFilteredMedia(categoryFilter?: string, searchQuery?: string) {
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

    return filtered;
  }, [items, categoryFilter, searchQuery]);
}
