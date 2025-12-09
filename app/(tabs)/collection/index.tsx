import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Search, Plus, ArrowUpDown } from 'lucide-react-native';
import { useMediaContext, SortOption } from '@/contexts/MediaContext';
import { CATEGORIES, CategoryId } from '@/constants/categories';
import colors from '@/constants/colors';
import { MediaItem } from '@/types/media';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'title-asc', label: 'A to Z' },
  { value: 'title-desc', label: 'Z to A' },
];

export default function CollectionScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const { items, isLoading } = useMediaContext();

  const filteredItems = useMemo(() => {
    let filtered = items;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'title-asc':
          return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
        case 'title-desc':
          return b.title.toLowerCase().localeCompare(a.title.toLowerCase());
        default:
          return 0;
      }
    });

    return sorted;
  }, [items, searchQuery, selectedCategory, sortBy]);

  const renderItem = ({ item }: { item: MediaItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/detail/${item.id}`)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`View ${item.title} details`}
      accessibilityHint="Double tap to open item details"
    >
      <Image
        source={{ uri: item.photoUri }}
        style={styles.cardImage}
        contentFit="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.cardCategory}>
          {CATEGORIES.find(c => c.id === item.category)?.emoji} {CATEGORIES.find(c => c.id === item.category)?.label}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'My Collection',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '600' as const,
            fontSize: 20,
          },
          headerShadowVisible: false,
        }}
      />

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color={colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by title"
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel="Search collection by title"
            accessibilityHint="Type to filter your media items"
          />
          <TouchableOpacity
            onPress={() => setShowSortMenu(!showSortMenu)}
            style={styles.sortButton}
            accessibilityRole="button"
            accessibilityLabel="Sort options"
            accessibilityHint="Tap to change sorting order"
          >
            <ArrowUpDown size={18} color={colors.text} />
          </TouchableOpacity>
        </View>
        {showSortMenu && (
          <View style={styles.sortMenu}>
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.sortOption,
                  sortBy === option.value && styles.sortOptionActive,
                ]}
                onPress={() => {
                  setSortBy(option.value);
                  setShowSortMenu(false);
                }}
                accessibilityRole="button"
                accessibilityLabel={`Sort by ${option.label}`}
                accessibilityState={{ selected: sortBy === option.value }}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    sortBy === option.value && styles.sortOptionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterChip, selectedCategory === 'all' && styles.filterChipActive]}
          onPress={() => setSelectedCategory('all')}
          accessibilityRole="button"
          accessibilityLabel="Show all categories"
          accessibilityState={{ selected: selectedCategory === 'all' }}
        >
          <Text style={[styles.filterText, selectedCategory === 'all' && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        {CATEGORIES.filter(cat => items.some(item => item.category === cat.id)).map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.filterChip, selectedCategory === category.id && styles.filterChipActive]}
            onPress={() => setSelectedCategory(category.id)}
            accessibilityRole="button"
            accessibilityLabel={`Filter by ${category.label}`}
            accessibilityState={{ selected: selectedCategory === category.id }}
          >
            <Text style={[styles.filterText, selectedCategory === category.id && styles.filterTextActive]}>
              {category.emoji} {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.emptyText}>Loading your collection...</Text>
        </View>
      ) : filteredItems.length === 0 ? (
        items.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <View style={styles.emptyIconCircle}>
                <Text style={styles.emptyEmoji}>📚</Text>
              </View>
            </View>
            <Text style={styles.emptyTitle}>Start Your Collection</Text>
            <Text style={styles.emptyText}>
              Organize your physical media library.{' \n'}
              Add books, vinyl, CDs, games & more.
            </Text>
            <TouchableOpacity
              style={styles.emptyHint}
              onPress={() => router.push('/(tabs)/add')}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Add your first item"
              accessibilityHint="Navigate to add new item screen"
            >
              <View style={styles.emptyHintIcon}>
                <Plus size={16} color={colors.white} strokeWidth={2.5} />
              </View>
              <Text style={styles.emptyHintText}>
                Tap here to add your first item
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>No Results Found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your search or filter
            </Text>
          </View>
        )
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  sortButton: {
    padding: 4,
  },
  sortMenu: {
    marginTop: 8,
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sortOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  sortOptionActive: {
    backgroundColor: colors.cream,
  },
  sortOptionText: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: colors.text,
  },
  sortOptionTextActive: {
    fontWeight: '600' as const,
    color: colors.primary,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 8,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  filterChipActive: {
    backgroundColor: colors.text,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
  },
  filterTextActive: {
    color: colors.white,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.cream,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  cardCategory: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textLight,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.cream,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 32,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 10,
  },
  emptyHintIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.text,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyHintText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    fontWeight: '600' as const,
  },
});
