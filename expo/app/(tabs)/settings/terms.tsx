import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function TermsOfUseScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.lastUpdated}>Last Updated: December 9, 2024</Text>

      <View style={styles.section}>
        <Text style={styles.heading}>Agreement to Terms</Text>
        <Text style={styles.paragraph}>
          By downloading, installing, or using My Physical Media (&quot;the app&quot;), you agree to be 
          bound by these Terms of Use. If you do not agree to these terms, please do not use 
          the app.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>License to Use</Text>
        <Text style={styles.paragraph}>
          We grant you a personal, non-exclusive, non-transferable, revocable license to use 
          My Physical Media for your personal, non-commercial use on your mobile device in 
          accordance with these Terms.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Description of Service</Text>
        <Text style={styles.paragraph}>
          My Physical Media is an offline-first mobile application designed to help you 
          organize and manage your physical media collection, including but not limited to:
        </Text>
        <Text style={styles.bullet}>• Books and publications</Text>
        <Text style={styles.bullet}>• Vinyl records and CDs</Text>
        <Text style={styles.bullet}>• Video games and consoles</Text>
        <Text style={styles.bullet}>• Movies and media</Text>
        <Text style={styles.bullet}>• Other physical collectibles</Text>
        <Text style={styles.paragraph}>
          The app functions entirely offline and stores all data locally on your device.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>User Responsibilities</Text>
        <Text style={styles.paragraph}>You agree to:</Text>
        <Text style={styles.bullet}>
          • Use the app only for lawful purposes and in accordance with these Terms
        </Text>
        <Text style={styles.bullet}>
          • Not use the app to store, organize, or manage illegal or counterfeit items
        </Text>
        <Text style={styles.bullet}>
          • Not attempt to reverse engineer, decompile, or disassemble the app
        </Text>
        <Text style={styles.bullet}>
          • Not use the app in any way that could damage, disable, or impair the app
        </Text>
        <Text style={styles.bullet}>
          • Maintain the security of your device and the data stored by the app
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Your Content</Text>
        <Text style={styles.paragraph}>
          You retain all rights to the content you create in the app (photos, titles, notes, 
          etc.). Since all content is stored locally on your device, we do not claim any 
          ownership or rights to your content.
        </Text>
        <Text style={styles.paragraph}>
          You are responsible for:
        </Text>
        <Text style={styles.bullet}>• Backing up your collection data</Text>
        <Text style={styles.bullet}>• Ensuring you have the right to photograph items you document</Text>
        <Text style={styles.bullet}>• The accuracy and legality of content you create</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Intellectual Property</Text>
        <Text style={styles.paragraph}>
          The app, including its original content, features, and functionality, is owned by 
          the app developers and is protected by international copyright, trademark, and other 
          intellectual property laws.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Disclaimer of Warranties</Text>
        <Text style={styles.paragraph}>
          THE APP IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, 
          EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
        </Text>
        <Text style={styles.bullet}>• Fitness for a particular purpose</Text>
        <Text style={styles.bullet}>• Non-infringement</Text>
        <Text style={styles.bullet}>• Accuracy or reliability of information</Text>
        <Text style={styles.bullet}>• Uninterrupted or error-free operation</Text>
        <Text style={styles.paragraph}>
          We do not warrant that the app will meet your requirements or that defects will be 
          corrected.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, 
          INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR 
          REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, OR 
          OTHER INTANGIBLE LOSSES RESULTING FROM:
        </Text>
        <Text style={styles.bullet}>• Your use of or inability to use the app</Text>
        <Text style={styles.bullet}>• Loss of data stored in the app</Text>
        <Text style={styles.bullet}>• Device failure or malfunction</Text>
        <Text style={styles.bullet}>• Any other matter relating to the app</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Data Backup</Text>
        <Text style={styles.paragraph}>
          Since the app stores all data locally on your device, you are solely responsible for 
          backing up your data. We recommend regularly backing up your device using your 
          device manufacturer&apos;s backup solutions (iCloud, Google Backup, etc.).
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Updates and Modifications</Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify or discontinue the app at any time without notice. 
          We may also update these Terms from time to time. Your continued use of the app 
          after any changes constitutes acceptance of the new Terms.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Termination</Text>
        <Text style={styles.paragraph}>
          You may stop using the app at any time by uninstalling it from your device. Upon 
          uninstallation, all locally stored data will be deleted from your device.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Governing Law</Text>
        <Text style={styles.paragraph}>
          These Terms shall be governed by and construed in accordance with the laws of your 
          jurisdiction, without regard to its conflict of law provisions.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Contact Information</Text>
        <Text style={styles.paragraph}>
          If you have any questions about these Terms, please contact us through the app store 
          review system or our designated support channels.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By using My Physical Media, you acknowledge that you have read, understood, and 
          agree to be bound by these Terms of Use.
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
