import type { CategoryId } from '@/constants/categories';

export interface MediaItem {
  id: string;
  title: string;
  category: CategoryId;
  photoUri: string;
  notes?: string;
  createdAt: string;
}
