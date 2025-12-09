import type { MediaItem, LoanRecord } from '@/types/media';

export interface LoanInfo {
  loanedTo: string;
  loanedToContact?: string;
  loanedAt: string;
  expectedReturnDate?: string;
  loanNotes?: string;
}

export function loanItem(item: MediaItem, loanInfo: LoanInfo): MediaItem {
  return {
    ...item,
    loanedTo: loanInfo.loanedTo,
    loanedToContact: loanInfo.loanedToContact,
    loanedAt: loanInfo.loanedAt,
    expectedReturnDate: loanInfo.expectedReturnDate,
    loanNotes: loanInfo.loanNotes,
    loanStatus: 'loaned',
    updatedAt: new Date().toISOString(),
    version: item.version + 1,
  };
}

export function returnItem(item: MediaItem): MediaItem {
  return {
    ...item,
    loanStatus: 'available',
    updatedAt: new Date().toISOString(),
    version: item.version + 1,
  };
}

export function getLoanedItems(items: MediaItem[]): MediaItem[] {
  return items.filter(item => 
    item.loanStatus === 'loaned' || item.loanStatus === 'overdue'
  );
}

export function getOverdueLoans(items: MediaItem[]): MediaItem[] {
  const now = new Date();
  return items.filter(item => {
    if (item.loanStatus !== 'loaned' || !item.expectedReturnDate) {
      return false;
    }
    const returnDate = new Date(item.expectedReturnDate);
    return returnDate < now;
  });
}

export function updateOverdueLoanStatus(item: MediaItem): MediaItem {
  if (item.loanStatus === 'loaned' && item.expectedReturnDate) {
    const now = new Date();
    const returnDate = new Date(item.expectedReturnDate);
    
    if (returnDate < now) {
      return {
        ...item,
        loanStatus: 'overdue',
      };
    }
  }
  return item;
}

export function checkAndUpdateOverdueLoans(items: MediaItem[]): MediaItem[] {
  return items.map(updateOverdueLoanStatus);
}

export function getLoansByPerson(items: MediaItem[], person: string): MediaItem[] {
  return items.filter(item => 
    item.loanedTo?.toLowerCase().includes(person.toLowerCase())
  );
}

export function createLoanRecord(item: MediaItem): LoanRecord | null {
  if (!item.loanedTo || !item.loanedAt) {
    return null;
  }

  return {
    id: `loan-${item.id}-${item.loanedAt}`,
    itemId: item.id,
    loanedTo: item.loanedTo,
    loanedToContact: item.loanedToContact,
    loanedAt: item.loanedAt,
    expectedReturnDate: item.expectedReturnDate,
    actualReturnDate: item.loanStatus === 'available' ? new Date().toISOString() : undefined,
    notes: item.loanNotes,
    status: item.loanStatus === 'available' ? 'returned' : 
            item.loanStatus === 'overdue' ? 'overdue' : 'active',
  };
}

export function getLoanHistory(items: MediaItem[]): LoanRecord[] {
  const records: LoanRecord[] = [];
  
  items.forEach(item => {
    const record = createLoanRecord(item);
    if (record) {
      records.push(record);
    }
  });
  
  return records.sort((a, b) => 
    new Date(b.loanedAt).getTime() - new Date(a.loanedAt).getTime()
  );
}
