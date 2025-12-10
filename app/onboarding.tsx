import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter, Href } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sparkles } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

const ONBOARDING_KEY = 'onboarding_complete';

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const handleContinue = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      router.replace('/(tabs)/collection' as Href);
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
    }
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Sparkles size={48} color={colors.primary} strokeWidth={2.5} />
          </View>
          <Text style={styles.title}>Welcome to{'\n'}My Physical Media</Text>
          <Text style={styles.subtitle}>
            Capture, organize, and cherish your collection of physical treasures
          </Text>

          <View style={styles.steps}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Take a Photo</Text>
                <Text style={styles.stepText}>Snap a picture of your media item</Text>
              </View>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Add Details</Text>
                <Text style={styles.stepText}>Title, category, and notes</Text>
              </View>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Build Your Library</Text>
                <Text style={styles.stepText}>Search and organize with ease</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.note}>
            📱 All your media is stored locally on your device. No cloud storage, no accounts required!
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleContinue}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Get started"
          accessibilityHint="Continue to your collection"
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  steps: {
    width: '100%',
    gap: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingHorizontal: 8,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.white,
  },
  stepContent: {
    flex: 1,
    paddingTop: 2,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 2,
  },
  stepText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  note: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 16,
    textAlign: 'center',
    fontWeight: '500' as const,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 'auto',
  },

  buttonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.white,
  },
});
