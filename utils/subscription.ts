import type { UserProfile } from '@/types/media';

export type SubscriptionTier = 'free' | 'premium' | 'pro';
export type SubscriptionStatus = 'none' | 'active' | 'cancelled' | 'expired' | 'trial';

export interface SubscriptionFeatures {
  maxItems: number;
  maxStorageMb: number;
  cloudSync: boolean;
  advancedSearch: boolean;
  valuationTools: boolean;
  loanTracking: boolean;
  barcodeScanning: boolean;
  exportData: boolean;
  prioritySupport: boolean;
  customCategories: boolean;
  shareCollections: boolean;
}

export const TIER_FEATURES: Record<SubscriptionTier, SubscriptionFeatures> = {
  free: {
    maxItems: 100,
    maxStorageMb: 100,
    cloudSync: false,
    advancedSearch: false,
    valuationTools: false,
    loanTracking: true,
    barcodeScanning: false,
    exportData: false,
    prioritySupport: false,
    customCategories: false,
    shareCollections: false,
  },
  premium: {
    maxItems: 1000,
    maxStorageMb: 1000,
    cloudSync: true,
    advancedSearch: true,
    valuationTools: true,
    loanTracking: true,
    barcodeScanning: true,
    exportData: true,
    prioritySupport: false,
    customCategories: true,
    shareCollections: true,
  },
  pro: {
    maxItems: -1,
    maxStorageMb: 10000,
    cloudSync: true,
    advancedSearch: true,
    valuationTools: true,
    loanTracking: true,
    barcodeScanning: true,
    exportData: true,
    prioritySupport: true,
    customCategories: true,
    shareCollections: true,
  },
};

export function getFeatures(tier: SubscriptionTier): SubscriptionFeatures {
  return TIER_FEATURES[tier];
}

export function hasFeature(
  tier: SubscriptionTier,
  feature: keyof SubscriptionFeatures
): boolean {
  return TIER_FEATURES[tier][feature] as boolean;
}

export function canAddMoreItems(
  currentCount: number,
  tier: SubscriptionTier
): boolean {
  const features = getFeatures(tier);
  return features.maxItems === -1 || currentCount < features.maxItems;
}

export function canUseStorage(
  currentUsageMb: number,
  tier: SubscriptionTier
): boolean {
  const features = getFeatures(tier);
  return currentUsageMb < features.maxStorageMb;
}

export function isSubscriptionActive(profile: UserProfile): boolean {
  return profile.subscriptionStatus === 'active' || 
         profile.subscriptionStatus === 'trial';
}

export function isSubscriptionExpired(profile: UserProfile): boolean {
  if (!profile.subscriptionEndDate) {
    return false;
  }
  
  const endDate = new Date(profile.subscriptionEndDate);
  const now = new Date();
  
  return endDate < now;
}

export function getDaysUntilExpiration(profile: UserProfile): number {
  if (!profile.subscriptionEndDate) {
    return -1;
  }
  
  const endDate = new Date(profile.subscriptionEndDate);
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

export function createTrialSubscription(
  userId: string,
  tier: SubscriptionTier = 'premium',
  durationDays: number = 7
): Partial<UserProfile> {
  const now = new Date();
  const endDate = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

  return {
    subscriptionStatus: 'trial',
    subscriptionTier: tier,
    subscriptionStartDate: now.toISOString(),
    subscriptionEndDate: endDate.toISOString(),
    subscriptionAutoRenew: false,
  };
}

export function updateSubscriptionFromReceipt(
  profile: UserProfile,
  receipt: {
    productId: string;
    transactionId: string;
    purchaseDate: string;
    expirationDate?: string;
    platform: 'ios' | 'android';
  }
): UserProfile {
  let tier: SubscriptionTier = 'free';
  
  if (receipt.productId.includes('premium')) {
    tier = 'premium';
  } else if (receipt.productId.includes('pro')) {
    tier = 'pro';
  }

  return {
    ...profile,
    subscriptionStatus: 'active',
    subscriptionTier: tier,
    subscriptionStartDate: receipt.purchaseDate,
    subscriptionEndDate: receipt.expirationDate,
    subscriptionAutoRenew: true,
    subscriptionPlatform: receipt.platform,
    subscriptionTransactionId: receipt.transactionId,
    updatedAt: new Date().toISOString(),
  };
}

export async function restorePurchases(
  userId: string
): Promise<UserProfile | null> {
  console.log('Restore purchases ready for future iOS integration:', userId);
  return null;
}

export async function checkSubscriptionStatus(
  userId: string
): Promise<SubscriptionStatus> {
  console.log('Subscription check ready for future backend integration:', userId);
  return 'none';
}
