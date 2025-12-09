import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import { Camera, Image as ImageIcon, Bell, AlertCircle } from 'lucide-react-native';
import colors from '@/constants/colors';

type PermissionType = 'camera' | 'photos' | 'notifications';

interface PermissionPromptProps {
  type: PermissionType;
  onRequestPermission: () => void;
  onCancel?: () => void;
  isDenied?: boolean;
}

const PERMISSION_INFO = {
  camera: {
    icon: Camera,
    title: 'Camera Access',
    description: 'Take photos of your books, vinyl, CDs, and games to build your collection.',
    reason: 'We need camera access to capture images of your physical media items.',
    deniedMessage: 'Camera access was denied. To use this feature, please enable camera permissions in your device settings.',
  },
  photos: {
    icon: ImageIcon,
    title: 'Photo Library Access',
    description: 'Choose photos from your library to add items to your collection.',
    reason: 'We need photo library access to let you select existing images for your collection.',
    deniedMessage: 'Photo library access was denied. To use this feature, please enable photo permissions in your device settings.',
  },
  notifications: {
    icon: Bell,
    title: 'Notifications',
    description: 'Get reminders about your collection and stay updated with new features.',
    reason: 'We\'d like to send you helpful reminders and updates about your collection.',
    deniedMessage: 'Notification permissions were denied. You can still use the app, but won\'t receive reminders.',
  },
};

export default function PermissionPrompt({
  type,
  onRequestPermission,
  onCancel,
  isDenied = false,
}: PermissionPromptProps) {
  const info = PERMISSION_INFO[type];
  const Icon = info.icon;

  const openSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else if (Platform.OS === 'android') {
      Linking.openSettings();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {isDenied ? (
            <AlertCircle size={48} color={colors.error} />
          ) : (
            <Icon size={48} color={colors.primary} />
          )}
        </View>

        <Text style={styles.title}>{info.title}</Text>
        <Text style={styles.description}>{info.description}</Text>

        <View style={styles.reasonBox}>
          <Text style={styles.reasonText}>
            {isDenied ? info.deniedMessage : info.reason}
          </Text>
        </View>

        <View style={styles.buttons}>
          {isDenied ? (
            <>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={openSettings}
                accessibilityRole="button"
                accessibilityLabel="Open settings"
                accessibilityHint="Opens device settings to enable permissions"
              >
                <Text style={styles.primaryButtonText}>Open Settings</Text>
              </TouchableOpacity>

              {onCancel && (
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={onCancel}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel"
                >
                  <Text style={styles.secondaryButtonText}>Cancel</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={onRequestPermission}
                accessibilityRole="button"
                accessibilityLabel="Allow access"
                accessibilityHint={`Grants ${type} permission to the app`}
              >
                <Text style={styles.primaryButtonText}>Allow Access</Text>
              </TouchableOpacity>

              {onCancel && (
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={onCancel}
                  accessibilityRole="button"
                  accessibilityLabel="Not now"
                >
                  <Text style={styles.secondaryButtonText}>Not Now</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        <Text style={styles.privacyNote}>
          🔒 Your privacy is important. Photos stay on your device and are never uploaded to the cloud.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  reasonBox: {
    backgroundColor: colors.cream,
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    width: '100%',
  },
  reasonText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttons: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.text,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: colors.white,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.text,
  },
  privacyNote: {
    fontSize: 13,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 24,
  },
});
