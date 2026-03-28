export const CATEGORIES = [
  { id: 'vinyl', label: 'Vinyl Records', emoji: '💿' },
  { id: 'cds', label: 'CDs', emoji: '💽' },
  { id: 'books', label: 'Books', emoji: '📚' },
  { id: 'dvds', label: 'DVDs', emoji: '📀' },
  { id: 'vhs', label: 'VHS', emoji: '📼' },
  { id: 'magazines', label: 'Magazines', emoji: '📰' },
  { id: 'games', label: 'Video Games', emoji: '🎮' },
  { id: 'other', label: 'Other', emoji: '✨' },
] as const;

export type CategoryId = typeof CATEGORIES[number]['id'];
