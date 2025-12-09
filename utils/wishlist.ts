import type { MediaItem, WishlistItem } from '@/types/media';
import type { CategoryId } from '@/constants/categories';

export interface WishlistInfo {
  priority?: 'low' | 'medium' | 'high';
  targetPrice?: number;
  currency?: string;
  wishlistNotes?: string;
}

export function addToWishlist(item: MediaItem, info?: WishlistInfo): MediaItem {
  return {
    ...item,
    wishlist: true,
    wishlistPriority: info?.priority || 'medium',
    wishlistAddedAt: new Date().toISOString(),
    targetPrice: info?.targetPrice,
    currency: info?.currency || item.currency,
    wishlistNotes: info?.wishlistNotes,
    updatedAt: new Date().toISOString(),
    version: item.version + 1,
  };
}

export function removeFromWishlist(item: MediaItem): MediaItem {
  return {
    ...item,
    wishlist: false,
    wishlistPriority: undefined,
    wishlistAddedAt: undefined,
    wishlistNotes: undefined,
    targetPrice: undefined,
    updatedAt: new Date().toISOString(),
    version: item.version + 1,
  };
}

export function getWishlistItems(items: MediaItem[]): MediaItem[] {
  return items.filter(item => item.wishlist);
}

export function sortWishlistByPriority(items: MediaItem[]): MediaItem[] {
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  
  return [...items].sort((a, b) => {
    const aPriority = a.wishlistPriority || 'medium';
    const bPriority = b.wishlistPriority || 'medium';
    return priorityOrder[aPriority] - priorityOrder[bPriority];
  });
}

export function getWishlistByCategory(
  items: MediaItem[],
  category: CategoryId
): MediaItem[] {
  return getWishlistItems(items).filter(item => item.category === category);
}

export function getHighPriorityWishlist(items: MediaItem[]): MediaItem[] {
  return getWishlistItems(items).filter(
    item => item.wishlistPriority === 'high'
  );
}

export function markWishlistItemPurchased(
  wishlistItem: MediaItem,
  collectionItem: MediaItem
): MediaItem {
  return {
    ...wishlistItem,
    wishlist: false,
    updatedAt: new Date().toISOString(),
    version: wishlistItem.version + 1,
  };
}

export function createStandaloneWishlistItem(
  title: string,
  category: CategoryId,
  info?: WishlistInfo
): WishlistItem {
  return {
    id: `wish-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    category,
    priority: info?.priority || 'medium',
    targetPrice: info?.targetPrice,
    currency: info?.currency,
    notes: info?.wishlistNotes,
    addedAt: new Date().toISOString(),
  };
}

export function calculateWishlistBudget(items: MediaItem[]): {
  totalTargetPrice: number;
  itemsWithPrice: number;
  averagePrice: number;
} {
  const wishlistItems = getWishlistItems(items);
  const itemsWithPrice = wishlistItems.filter(item => item.targetPrice);
  const totalTargetPrice = itemsWithPrice.reduce(
    (sum, item) => sum + (item.targetPrice || 0),
    0
  );
  const averagePrice = itemsWithPrice.length > 0 
    ? totalTargetPrice / itemsWithPrice.length 
    : 0;

  return {
    totalTargetPrice,
    itemsWithPrice: itemsWithPrice.length,
    averagePrice,
  };
}
