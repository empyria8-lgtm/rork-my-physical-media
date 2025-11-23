import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Search, ChevronDown, ChevronRight } from 'lucide-react-native';
import { useMediaContext } from '@/contexts/MediaContext';
import { CATEGORIES, CategoryId } from '@/constants/categories';
import colors from '@/constants/colors';
import { MediaItem } from '@/types/media';

export default function CollectionScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { items } = useMediaContext();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.notes?.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  const groupedByCategory = useMemo(() => {
    const grouped = new Map<CategoryId, MediaItem[]>();
    
    CATEGORIES.forEach(cat => {
      grouped.set(cat.id, []);
    });

    filteredItems.forEach(item => {
      const existing = grouped.get(item.category) || [];
      grouped.set(item.category, [...existing, item]);
    });

    return grouped;
  }, [filteredItems]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'My Physical Media',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '700' as const,
            fontSize: 24,
          },
          headerShadowVisible: false,
        }}
      />

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your collection..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {filteredItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📸</Text>
          <Text style={styles.emptyTitle}>No items yet</Text>
          <Text style={styles.emptyText}>
            Start building your collection by adding your first item!
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {CATEGORIES.map((category) => {
            const categoryItems = groupedByCategory.get(category.id) || [];
            if (categoryItems.length === 0) return null;
            
            const isExpanded = expandedCategories.has(category.id);

            return (
              <View key={category.id} style={styles.categorySection}>
                <TouchableOpacity
                  style={styles.categoryHeader}
                  onPress={() => toggleCategory(category.id)}
                >
                  <View style={styles.categoryHeaderLeft}>
                    <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                    <Text style={styles.categoryTitle}>{category.label}</Text>
                    <View style={styles.countBadge}>
                      <Text style={styles.countText}>{categoryItems.length}</Text>
                    </View>
                  </View>
                  {isExpanded ? (
                    <ChevronDown size={24} color={colors.text} />
                  ) : (
                    <ChevronRight size={24} color={colors.text} />
                  )}
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.categoryGrid}>
                    {categoryItems.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.card}
                        onPress={() => router.push(`/detail/${item.id}`)}
                      >
                        <View style={styles.imageContainer}>
                          <Image
                            source={{ uri: item.photoUri }}
                            style={styles.image}
                            contentFit="cover"
                          />
                        </View>
                        <View style={styles.cardContent}>
                          <Text style={styles.cardTitle} numberOfLines={2}>
                            {item.title}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  categoryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
  },
  countBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  countText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: colors.white,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.cream,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
});
