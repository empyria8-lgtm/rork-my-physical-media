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

  barcode?: string;
  barcodeType?: 'upc' | 'ean' | 'isbn' | 'qr' | 'other';
  scannedAt?: string;
  
  purchasePrice?: number;
  currentValue?: number;
  currency?: string;
  valuationDate?: string;
  valuationSource?: string;
  condition?: 'mint' | 'excellent' | 'good' | 'fair' | 'poor';
  
  loanedTo?: string;
  loanedToContact?: string;
  loanedAt?: string;
  expectedReturnDate?: string;
  loanNotes?: string;
  loanStatus?: 'available' | 'loaned' | 'overdue';
  
  wishlist?: boolean;
  wishlistPriority?: 'low' | 'medium' | 'high';
  wishlistAddedAt?: string;
  wishlistNotes?: string;
  targetPrice?: number;
  
  subscriptionTier?: 'free' | 'premium' | 'pro';
  subscriptionFeatures?: string[];
}

export interface UserProfile {
  id: string;
  email?: string;
  displayName?: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
  
  subscriptionStatus?: 'none' | 'active' | 'cancelled' | 'expired' | 'trial';
  subscriptionTier?: 'free' | 'premium' | 'pro';
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  subscriptionAutoRenew?: boolean;
  subscriptionPlatform?: 'ios' | 'android' | 'web';
  subscriptionTransactionId?: string;
  
  totalItems?: number;
  storageUsedMb?: number;
  storageQuotaMb?: number;
  
  preferences?: {
    defaultCurrency?: string;
    showValueEstimates?: boolean;
    enablePushNotifications?: boolean;
    enableLoanReminders?: boolean;
    defaultWishlistPrivacy?: 'private' | 'public';
  };
}

export interface CollectionStats {
  totalItems: number;
  totalValue: number;
  currency: string;
  itemsByCategory: Record<CategoryId, number>;
  valueByCategory: Record<CategoryId, number>;
  loanedItems: number;
  wishlistItems: number;
  updatedAt: string;
}

export interface LoanRecord {
  id: string;
  itemId: string;
  loanedTo: string;
  loanedToContact?: string;
  loanedAt: string;
  expectedReturnDate?: string;
  actualReturnDate?: string;
  notes?: string;
  status: 'active' | 'returned' | 'overdue';
}

export interface WishlistItem {
  id: string;
  title: string;
  category: CategoryId;
  priority: 'low' | 'medium' | 'high';
  targetPrice?: number;
  currency?: string;
  notes?: string;
  photoUri?: string;
  addedAt: string;
  purchasedAt?: string;
  purchasedItemId?: string;
}
