import type { MediaItem } from '@/types/media';

export type BarcodeFormat = 'upc' | 'ean' | 'isbn' | 'qr' | 'other';

export interface BarcodeData {
  data: string;
  type: BarcodeFormat;
  scannedAt: string;
}

export function validateBarcode(barcode: string, type: BarcodeFormat): boolean {
  switch (type) {
    case 'upc':
      return /^\d{12}$/.test(barcode);
    case 'ean':
      return /^\d{13}$/.test(barcode);
    case 'isbn':
      return /^(97[89])?\d{9}[\dX]$/.test(barcode.replace(/-/g, ''));
    case 'qr':
      return barcode.length > 0;
    case 'other':
      return barcode.length > 0;
    default:
      return false;
  }
}

export function detectBarcodeType(barcode: string): BarcodeFormat {
  const cleaned = barcode.replace(/-/g, '');
  
  if (/^\d{12}$/.test(cleaned)) {
    return 'upc';
  }
  
  if (/^\d{13}$/.test(cleaned)) {
    return 'ean';
  }
  
  if (/^(97[89])?\d{9}[\dX]$/.test(cleaned)) {
    return 'isbn';
  }
  
  return 'other';
}

export function attachBarcodeToItem(
  item: MediaItem,
  barcodeData: BarcodeData
): MediaItem {
  return {
    ...item,
    barcode: barcodeData.data,
    barcodeType: barcodeData.type,
    scannedAt: barcodeData.scannedAt,
    updatedAt: new Date().toISOString(),
    version: item.version + 1,
  };
}

export function searchItemsByBarcode(
  items: MediaItem[],
  barcode: string
): MediaItem[] {
  return items.filter(item => item.barcode === barcode);
}

export function getItemsWithBarcodes(items: MediaItem[]): MediaItem[] {
  return items.filter(item => item.barcode);
}

export async function lookupBarcodeInfo(
  barcode: string,
  type: BarcodeFormat
): Promise<{
  title?: string;
  category?: string;
  description?: string;
  imageUrl?: string;
  price?: number;
} | null> {
  console.log('Barcode lookup ready for future API integration:', barcode, type);
  return null;
}
