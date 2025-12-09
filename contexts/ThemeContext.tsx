import createContextHook from '@nkzw/create-context-hook';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, ThemeColors } from '@/constants/colors';

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  
  const colors: ThemeColors = isDark ? darkColors : lightColors;

  return {
    colors,
    isDark,
  };
});
