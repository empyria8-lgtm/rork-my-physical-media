import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Shield, FileText, Database } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const legalItems = [
    {
      id: 'privacy',
      title: 'Privacy Policy',
      description: 'How we handle your information',
      icon: Shield,
      route: '/(tabs)/settings/privacy',
    },
    {
      id: 'terms',
      title: 'Terms of Use',
      description: 'Terms and conditions for using this app',
      icon: FileText,
      route: '/(tabs)/settings/terms',
    },
    {
      id: 'data',
      title: 'Data Handling Disclosure',
      description: 'Learn about your data storage and privacy',
      icon: Database,
      route: '/(tabs)/settings/data',
    },
  ];

  const styles = createStyles(colors);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal & Privacy</Text>
        <View style={styles.itemsContainer}>
          {legalItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.item,
                  index === legalItems.length - 1 && styles.itemLast,
                ]}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={item.title}
                accessibilityHint={`Open ${item.title}`}
              >
                <View style={styles.iconContainer}>
                  <Icon size={22} color={colors.primary} />
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                </View>
                <ChevronRight size={20} color={colors.textLight} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.itemsContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>App Name</Text>
            <Text style={styles.infoValue}>My Physical Media</Text>
          </View>
          <View style={[styles.infoItem, styles.itemLast]}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
        </View>
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
    paddingVertical: 20,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  itemsContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  itemLast: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cream,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 18,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.text,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.textLight,
  },
});
