import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import colors from '@/constants/colors';

export default function DataHandlingScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.lastUpdated}>Last Updated: December 9, 2024</Text>

      <View style={styles.section}>
        <Text style={styles.heading}>Overview</Text>
        <Text style={styles.paragraph}>
          My Physical Media is built with privacy and data security at its core. This 
          disclosure explains exactly how your data is handled, stored, and protected within 
          the app.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Offline-First Architecture</Text>
        <Text style={styles.paragraph}>
          My Physical Media operates as a fully offline application. This means:
        </Text>
        <Text style={styles.bullet}>• No internet connection required for any functionality</Text>
        <Text style={styles.bullet}>• Zero data transmission to external servers</Text>
        <Text style={styles.bullet}>• No cloud storage or syncing</Text>
        <Text style={styles.bullet}>• No analytics or tracking services</Text>
        <Text style={styles.bullet}>• Complete independence from network connectivity</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>What Data Is Stored</Text>
        <Text style={styles.paragraph}>
          All data you create in My Physical Media is stored exclusively on your device:
        </Text>
        <Text style={styles.subheading}>Collection Data</Text>
        <Text style={styles.bullet}>• Item titles and categories</Text>
        <Text style={styles.bullet}>• Optional notes and descriptions</Text>
        <Text style={styles.bullet}>• Creation and modification timestamps</Text>
        <Text style={styles.bullet}>• Sorting and filtering preferences</Text>
        
        <Text style={styles.subheading}>Photos</Text>
        <Text style={styles.bullet}>• Images of your media items</Text>
        <Text style={styles.bullet}>• Stored in app&apos;s local file system</Text>
        <Text style={styles.bullet}>• Cached for optimal performance</Text>
        
        <Text style={styles.subheading}>App Preferences</Text>
        <Text style={styles.bullet}>• Onboarding completion status</Text>
        <Text style={styles.bullet}>• User interface preferences</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Storage Location</Text>
        <Text style={styles.paragraph}>
          Your data is stored using platform-specific secure storage mechanisms:
        </Text>
        <Text style={styles.bullet}>
          • <Text style={styles.bold}>iOS:</Text> App sandbox with AsyncStorage and file system
        </Text>
        <Text style={styles.bullet}>
          • <Text style={styles.bold}>Android:</Text> App-specific storage with AsyncStorage and file system
        </Text>
        <Text style={styles.paragraph}>
          This storage is protected by your device&apos;s operating system security and is 
          inaccessible to other applications.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Data Access</Text>
        <Text style={styles.paragraph}>
          Only you have access to your collection data:
        </Text>
        <Text style={styles.bullet}>• We (app developers) cannot access your data</Text>
        <Text style={styles.bullet}>• Your data never leaves your device</Text>
        <Text style={styles.bullet}>• No remote access or management capabilities</Text>
        <Text style={styles.bullet}>• Other apps cannot access My Physical Media&apos;s data</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Data Security</Text>
        <Text style={styles.paragraph}>
          Your data security depends on your device security:
        </Text>
        
        <Text style={styles.subheading}>We Recommend</Text>
        <Text style={styles.bullet}>• Enable device passcode or biometric authentication</Text>
        <Text style={styles.bullet}>• Keep your device OS updated</Text>
        <Text style={styles.bullet}>• Enable device encryption (standard on modern devices)</Text>
        <Text style={styles.bullet}>• Avoid jailbreaking or rooting your device</Text>
        
        <Text style={styles.subheading}>Built-In Protections</Text>
        <Text style={styles.bullet}>• Isolated app storage (OS-level sandbox)</Text>
        <Text style={styles.bullet}>• No network transmission of data</Text>
        <Text style={styles.bullet}>• Secure local file system storage</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Data Persistence</Text>
        <Text style={styles.paragraph}>
          Your collection data persists between app sessions and device restarts. Data remains 
          on your device until:
        </Text>
        <Text style={styles.bullet}>• You delete specific items within the app</Text>
        <Text style={styles.bullet}>• You uninstall the application</Text>
        <Text style={styles.bullet}>• You clear app data through device settings</Text>
        <Text style={styles.bullet}>• Your device is reset to factory settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Backup Recommendations</Text>
        <Text style={styles.paragraph}>
          Since all data is stored locally, we strongly recommend backing up your device 
          regularly:
        </Text>
        <Text style={styles.bullet}>
          • <Text style={styles.bold}>iOS Users:</Text> iCloud Backup or iTunes/Finder backup
        </Text>
        <Text style={styles.bullet}>
          • <Text style={styles.bold}>Android Users:</Text> Google Backup or manufacturer backup
        </Text>
        <Text style={styles.paragraph}>
          These device-level backups will include your My Physical Media collection data and 
          can be restored if you get a new device or reset your current one.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Permission Usage</Text>
        <Text style={styles.paragraph}>
          The app requests specific permissions to function properly:
        </Text>
        
        <Text style={styles.subheading}>Camera Permission</Text>
        <Text style={styles.bullet}>• Used exclusively to capture photos of your media items</Text>
        <Text style={styles.bullet}>• Photos are saved directly to app storage</Text>
        <Text style={styles.bullet}>• No transmission or sharing of camera data</Text>
        
        <Text style={styles.subheading}>Photo Library Permission</Text>
        <Text style={styles.bullet}>• Allows selecting existing photos for your collection</Text>
        <Text style={styles.bullet}>• Enables saving captured photos to your device gallery</Text>
        <Text style={styles.bullet}>• Read-only access to selected photos</Text>
        
        <Text style={styles.subheading}>Storage Permission</Text>
        <Text style={styles.bullet}>• Required to save and retrieve collection data</Text>
        <Text style={styles.bullet}>• Access limited to app&apos;s designated storage area</Text>
        <Text style={styles.bullet}>• No access to system files or other app data</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Data Portability</Text>
        <Text style={styles.paragraph}>
          Currently, My Physical Media stores data in a local format optimized for app 
          performance. Your data is contained within your device backups and can be restored 
          through device restoration processes.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>No Third-Party Data Sharing</Text>
        <Text style={styles.paragraph}>
          My Physical Media does not integrate with or share data with any third-party 
          services, including:
        </Text>
        <Text style={styles.bullet}>• Analytics platforms</Text>
        <Text style={styles.bullet}>• Advertising networks</Text>
        <Text style={styles.bullet}>• Social media platforms</Text>
        <Text style={styles.bullet}>• Cloud storage providers</Text>
        <Text style={styles.bullet}>• Marketing services</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Future Updates</Text>
        <Text style={styles.paragraph}>
          If we introduce any features that involve data transmission or cloud syncing in 
          future versions, we will:
        </Text>
        <Text style={styles.bullet}>• Update this disclosure and notify users</Text>
        <Text style={styles.bullet}>• Make such features optional and opt-in</Text>
        <Text style={styles.bullet}>• Maintain the current offline-first functionality</Text>
        <Text style={styles.bullet}>• Obtain your consent before enabling new data handling</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Questions and Concerns</Text>
        <Text style={styles.paragraph}>
          If you have questions about how your data is handled, please contact us through app 
          store support channels. We&apos;re committed to transparency and will respond to data 
          handling inquiries promptly.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Your privacy matters. My Physical Media is designed to keep your collection data 
          completely private and secure on your device.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  subheading: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
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
