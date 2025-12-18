export const lightColors = {
  primary: '#FF9B9B',
  secondary: '#FFD1B0',
  accent: '#FFC4E1',
  mint: '#B8E6D5',
  cream: '#FFF5E4',
  text: '#1A1A1A',
  textLight: '#6B6B6B',
  background: '#F5F5F7',
  white: '#FFFFFF',
  card: '#FFFFFF',
  glass: 'rgba(255, 255, 255, 0.7)',
  glassBorder: 'rgba(0, 0, 0, 0.1)',
  glassText: '#1A1A1A',
  shadow: 'rgba(0, 0, 0, 0.08)',
  border: 'rgba(0, 0, 0, 0.08)',
  error: '#FF6B6B',
};

export const darkColors = {
  primary: '#FF9B9B',
  secondary: '#FFB380',
  accent: '#FFA6D5',
  mint: '#8BCAB3',
  cream: '#2A2A2A',
  text: '#FFFFFF',
  textLight: '#B0B0B0',
  background: '#000000',
  white: '#2A2A2A',
  card: '#2A2A2A',
  glass: 'rgba(30, 30, 30, 0.7)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  glassText: '#FFFFFF',
  shadow: 'rgba(0, 0, 0, 0.5)',
  border: 'rgba(255, 255, 255, 0.1)',
  error: '#FF6B6B',
};

const colors = lightColors;
export default colors;

export type ThemeColors = typeof lightColors;
