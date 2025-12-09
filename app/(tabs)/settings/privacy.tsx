import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function PrivacyPolicyScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.lastUpdated}>Last Updated: December 9, 2024</Text>

      <View style={styles.section}>
        <Text style={styles.heading}>Introduction</Text>
        <Text style={styles.paragraph}>
          My Physical Media (&quot;we&quot;, &quot;our&quot;, or &quot;the app&quot;) is committed to protecting your privacy. 
          This Privacy Policy explains how our app handles your information when you use our 
          offline-first physical media collection management application.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Data We Collect</Text>
        <Text style={styles.paragraph}>
          My Physical Media is designed as a fully offline application. All data you create, 
          including:
        </Text>
        <Text style={styles.bullet}>• Photos of your media items</Text>
        <Text style={styles.bullet}>• Item titles and descriptions</Text>
        <Text style={styles.bullet}>• Categories and notes</Text>
        <Text style={styles.bullet}>• Collection organization data</Text>
        <Text style={styles.paragraph}>
          ...is stored exclusively on your device using local storage (AsyncStorage and file system). 
          We do not collect, transmit, or store any of your personal data on external servers.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>How We Use Your Data</Text>
        <Text style={styles.paragraph}>
          All data is used solely for the purpose of providing app functionality to you. 
          Your collection data remains entirely on your device and is used to:
        </Text>
        <Text style={styles.bullet}>• Display your media collection</Text>
        <Text style={styles.bullet}>• Enable search, filtering, and sorting</Text>
        <Text style={styles.bullet}>• Provide image previews and details</Text>
        <Text style={styles.bullet}>• Persist your collection between app sessions</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Data Storage and Security</Text>
        <Text style={styles.paragraph}>
          Your data is stored locally on your device using industry-standard mobile storage 
          mechanisms. The security of your data depends on your device&apos;s security measures 
          (passcode, biometric authentication, encryption). We recommend:
        </Text>
        <Text style={styles.bullet}>• Keeping your device secure with a strong passcode</Text>
        <Text style={styles.bullet}>• Enabling device encryption</Text>
        <Text style={styles.bullet}>• Regularly backing up your device</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Third-Party Services</Text>
        <Text style={styles.paragraph}>
          My Physical Media does not integrate with any third-party analytics, advertising, 
          or tracking services. The app operates completely offline and makes no network 
          requests.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Permissions</Text>
        <Text style={styles.paragraph}>
          The app requests the following permissions for functionality:
        </Text>
        <Text style={styles.bullet}>
          • <Text style={styles.bold}>Camera:</Text> To take photos of your media items
        </Text>
        <Text style={styles.bullet}>
          • <Text style={styles.bold}>Photo Library:</Text> To select existing photos and save captured images
        </Text>
        <Text style={styles.bullet}>
          • <Text style={styles.bold}>Storage:</Text> To save and retrieve your collection data locally
        </Text>
        <Text style={styles.paragraph}>
          All permissions are used exclusively for the stated purposes and data never leaves 
          your device.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Data Retention and Deletion</Text>
        <Text style={styles.paragraph}>
          You have complete control over your data. Your collection data persists on your 
          device until you:
        </Text>
        <Text style={styles.bullet}>• Delete individual items within the app</Text>
        <Text style={styles.bullet}>• Uninstall the application</Text>
        <Text style={styles.bullet}>• Clear app data through device settings</Text>
        <Text style={styles.paragraph}>
          Uninstalling the app will permanently delete all locally stored data from your device.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Children&apos;s Privacy</Text>
        <Text style={styles.paragraph}>
          My Physical Media does not knowingly collect any personal information. The app is 
          safe for users of all ages as all data remains local to the device.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Changes to This Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy from time to time. Any changes will be reflected 
          in the &quot;Last Updated&quot; date at the top of this policy. We encourage you to review 
          this policy periodically.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions about this Privacy Policy or our data practices, please 
          contact us through the app store review system or our support channels.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By using My Physical Media, you acknowledge that you have read and understood this 
          Privacy Policy.
        </Text>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  lastUpdated: {
    fontSize: 13,
    color: colors.textLight,
    fontStyle: 'italic',
    marginBottom: 24,
  },
  section: {
    marginBottom: 28,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.text,
    marginBottom: 12,
  },
  bullet: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.text,
    marginLeft: 12,
    marginBottom: 8,
  },
  bold: {
    fontWeight: '700' as const,
  },
  footer: {
    marginTop: 12,
    padding: 16,
    backgroundColor: colors.cream,
    borderRadius: 12,
  },
  footerText: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
