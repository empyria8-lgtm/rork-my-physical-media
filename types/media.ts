import type { CategoryId } from '@/constants/categories';

export interface MediaItem {
  id: string;
  title: string;
  category: CategoryId;
  photoUri: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  localOnly: boolean;
  syncStatus: 'synced' | 'pending' | 'conflict' | 'local';
  userId?: string;
  deviceId: string;
  version: number;
  deletedAt?: string;
}
