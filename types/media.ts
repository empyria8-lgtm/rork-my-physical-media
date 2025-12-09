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
  
  cloudStorageUrl?: string;
  thumbnailUrl?: string;
  originalFileName?: string;
  fileSize?: number;
  mimeType?: string;
  
  sharedWith?: string[];
  shareToken?: string;
  isPublic?: boolean;
  
  tags?: string[];
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  
  backupStatus?: 'none' | 'queued' | 'backing-up' | 'backed-up' | 'failed';
  lastBackupAt?: string;
  
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    exif?: Record<string, any>;
  };
}
