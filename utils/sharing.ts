import type { MediaItem } from '@/types/media';
import { prepareItemForSharing } from './sync';

export interface ShareOptions {
  isPublic: boolean;
  sharedWith?: string[];
  expiresAt?: string;
  allowDownload?: boolean;
  allowComments?: boolean;
}

export async function shareItem(
  item: MediaItem,
  options: ShareOptions
): Promise<{ shareUrl: string; shareToken: string }> {
  console.log('Preparing item for sharing:', item.id, options);
  
  const sharedItem = prepareItemForSharing(
    item,
    options.isPublic,
    options.sharedWith
  );
  
  const shareToken = sharedItem.shareToken!;
  const shareUrl = `https://app.example.com/shared/${shareToken}`;
  
  console.log('Share URL generated:', shareUrl);
  
  return { shareUrl, shareToken };
}

export function revokeSharing(item: MediaItem): MediaItem {
  return {
    ...item,
    shareToken: undefined,
    isPublic: false,
    sharedWith: undefined,
  };
}

export function canUserAccessItem(
  item: MediaItem,
  currentUserId?: string
): boolean {
  if (item.userId === currentUserId) {
    return true;
  }
  
  if (item.isPublic) {
    return true;
  }
  
  if (currentUserId && item.sharedWith?.includes(currentUserId)) {
    return true;
  }
  
  return false;
}

export function filterSharedItems(
  items: MediaItem[],
  currentUserId?: string
): MediaItem[] {
  return items.filter(item => canUserAccessItem(item, currentUserId));
}
