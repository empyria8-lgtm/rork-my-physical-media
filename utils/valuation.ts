import type { MediaItem, CollectionStats } from '@/types/media';
import type { CategoryId } from '@/constants/categories';

export interface ValuationUpdate {
  currentValue: number;
  valuationDate: string;
  valuationSource?: string;
  condition?: 'mint' | 'excellent' | 'good' | 'fair' | 'poor';
}

export function updateItemValuation(
  item: MediaItem,
  valuation: ValuationUpdate
): MediaItem {
  return {
    ...item,
    currentValue: valuation.currentValue,
    valuationDate: valuation.valuationDate,
    valuationSource: valuation.valuationSource,
    condition: valuation.condition,
    updatedAt: new Date().toISOString(),
    version: item.version + 1,
  };
}

export function calculateCollectionValue(
  items: MediaItem[],
  currency: string = 'USD'
): number {
  return items.reduce((total, item) => {
    if (item.currentValue && item.currency === currency) {
      return total + item.currentValue;
    }
    return total;
  }, 0);
}

export function calculateCollectionStats(
  items: MediaItem[],
  currency: string = 'USD'
): CollectionStats {
  const itemsByCategory: Record<CategoryId, number> = {} as Record<CategoryId, number>;
  const valueByCategory: Record<CategoryId, number> = {} as Record<CategoryId, number>;
  
  let totalValue = 0;
  let loanedItems = 0;
  let wishlistItems = 0;

  items.forEach(item => {
    itemsByCategory[item.category] = (itemsByCategory[item.category] || 0) + 1;
    
    if (item.currentValue && item.currency === currency) {
      totalValue += item.currentValue;
      valueByCategory[item.category] = (valueByCategory[item.category] || 0) + item.currentValue;
    }
    
    if (item.loanStatus === 'loaned' || item.loanStatus === 'overdue') {
      loanedItems += 1;
    }
    
    if (item.wishlist) {
      wishlistItems += 1;
    }
  });

  return {
    totalItems: items.length,
    totalValue,
    currency,
    itemsByCategory,
    valueByCategory,
    loanedItems,
    wishlistItems,
    updatedAt: new Date().toISOString(),
  };
}

export function getHighValueItems(
  items: MediaItem[],
  threshold: number,
  currency: string = 'USD'
): MediaItem[] {
  return items
    .filter(item => 
      item.currentValue && 
      item.currency === currency && 
      item.currentValue >= threshold
    )
    .sort((a, b) => (b.currentValue || 0) - (a.currentValue || 0));
}

export function calculateValueChange(
  purchasePrice: number,
  currentValue: number
): {
  change: number;
  changePercent: number;
  direction: 'up' | 'down' | 'same';
} {
  const change = currentValue - purchasePrice;
  const changePercent = purchasePrice > 0 
    ? (change / purchasePrice) * 100 
    : 0;
  
  let direction: 'up' | 'down' | 'same' = 'same';
  if (change > 0) direction = 'up';
  if (change < 0) direction = 'down';

  return { change, changePercent, direction };
}

export function getItemsByCondition(
  items: MediaItem[],
  condition: 'mint' | 'excellent' | 'good' | 'fair' | 'poor'
): MediaItem[] {
  return items.filter(item => item.condition === condition);
}

export async function estimateItemValue(
  item: MediaItem
): Promise<number | null> {
  console.log('Value estimation ready for future API integration:', item.id);
  return null;
}
