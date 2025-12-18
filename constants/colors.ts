export const lightColors = {
  primary: '#FF9B9B',
  secondary: '#FFD1B0',
  accent: '#FFC4E1',
  mint: '#B8E6D5',
  cream: '#FFF5E4',
  text: '#6B4F4F',
  textLight: '#9E8181',
  background: '#FFF8F0',
  white: '#FFFFFF',
  card: '#FFFFFF',
  shadow: 'rgba(107, 79, 79, 0.1)',
  border: 'rgba(255, 155, 155, 0.2)',
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
  background: '#1A1A1A',
  white: '#2A2A2A',
  card: '#2A2A2A',
  shadow: 'rgba(0, 0, 0, 0.3)',
  border: 'rgba(255, 155, 155, 0.15)',
  error: '#FF6B6B',
};

const colors = lightColors;
export default colors;

export type ThemeColors = typeof lightColors;
