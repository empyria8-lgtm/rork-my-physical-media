import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckSquare, Square, Sparkles } from 'lucide-react-native';
import colors from '@/constants/colors';

const ONBOARDING_KEY = 'onboarding_complete';
const EMAIL_KEY = 'user_email';
const NEWSLETTER_KEY = 'newsletter_opt_in';

const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyJz_JEvkSal8yyzFn4LSCnFGes3nI1QuTdGFF0VbzEPz3ooHD23cxq-H0Nsf7IbOE-9w/exec';

export default function OnboardingScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [optIn, setOptIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendToGoogleSheets = async (email: string, optIn: boolean) => {
    if (!email.trim()) {
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append('email', email.trim());
      formData.append('optIn', optIn.toString());

      await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      console.log('Email sent to Google Sheets successfully');
    } catch (error) {
      console.error('Failed to send email to Google Sheets:', error);
    }
  };

  const handleContinue = async () => {
    if (!isValidEmail) return;
    
    setIsSubmitting(true);
    
    try {
      if (email.trim() && optIn) {
        await sendToGoogleSheets(email, optIn);
      }
      
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      
      if (email.trim()) {
        await AsyncStorage.setItem(EMAIL_KEY, email.trim());
      }
      
      await AsyncStorage.setItem(NEWSLETTER_KEY, optIn.toString());
      
      router.replace('/(tabs)/collection');
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidEmail = email.trim().length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Sparkles size={48} color={colors.primary} strokeWidth={2.5} />
          </View>
          <Text style={styles.title}>Welcome to{'\n'}My Physical Media</Text>
          <Text style={styles.subtitle}>
            Capture, organize, and cherish your collection of physical treasures
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address (Optional)</Text>
            <TextInput
              style={[styles.input, !isValidEmail && styles.inputError]}
              placeholder="your@email.com"
              placeholderTextColor={colors.textLight}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {!isValidEmail && (
              <Text style={styles.errorText}>Please enter a valid email</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setOptIn(!optIn)}
            activeOpacity={0.7}
          >
            {optIn ? (
              <CheckSquare size={24} color={colors.primary} strokeWidth={2.5} />
            ) : (
              <Square size={24} color={colors.textLight} strokeWidth={2} />
            )}
            <Text style={styles.checkboxLabel}>
              I&apos;d like to receive updates, tips, and newsletter
            </Text>
          </TouchableOpacity>

          <Text style={styles.note}>
            📱 All your media is stored locally on your device. No internet storage needed!
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, (!isValidEmail || isSubmitting) && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!isValidEmail || isSubmitting}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? 'Starting...' : 'Get Started'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 48,
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
  },
  form: {
    flex: 1,
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
    fontSize: 16,
    color: colors.text,
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  errorText: {
    fontSize: 14,
    color: '#FF6B6B',
    marginTop: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 8,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginTop: 2,
  },
  note: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 22,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 'auto',
  },
  buttonDisabled: {
    backgroundColor: colors.textLight,
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.white,
  },
});
