import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Pencil, Trash2, Check, X } from 'lucide-react-native';
import { useMediaContext } from '@/contexts/MediaContext';
import { CATEGORIES, CategoryId } from '@/constants/categories';
import colors from '@/constants/colors';

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { items, updateItem, deleteItem } = useMediaContext();

  const item = items.find((i) => i.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item?.title || '');
  const [editCategory, setEditCategory] = useState<CategoryId>(item?.category || 'other');
  const [editNotes, setEditNotes] = useState(item?.notes || '');

  if (!item) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Item Not Found' }} />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Item not found</Text>
        </View>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item from your collection?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteItem(id);
            router.back();
          },
        },
      ]
    );
  };

  const handleSave = () => {
    if (!editTitle.trim()) {
      Alert.alert('Error', 'Title cannot be empty');
      return;
    }

    updateItem(id, {
      title: editTitle.trim(),
      category: editCategory,
      notes: editNotes.trim() || undefined,
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(item.title);
    setEditCategory(item.category);
    setEditNotes(item.notes || '');
    setIsEditing(false);
  };

  const category = CATEGORIES.find((c) => c.id === item.category);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: isEditing ? 'Edit Item' : 'Item Details',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '700' as const,
          },
          headerShadowVisible: false,
          headerRight: () =>
            isEditing ? (
              <View style={styles.headerButtons}>
                <TouchableOpacity
                  onPress={handleCancel}
                  style={styles.headerButton}
                >
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSave}
                  style={styles.headerButton}
                >
                  <Check size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.headerButtons}>
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  style={styles.headerButton}
                >
                  <Pencil size={20} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDelete}
                  style={styles.headerButton}
                >
                  <Trash2 size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
            ),
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.photoUri }}
            style={styles.image}
            contentFit="cover"
          />
        </View>

        {isEditing ? (
          <View style={styles.editSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                value={editTitle}
                onChangeText={setEditTitle}
                placeholder="Item title"
                placeholderTextColor={colors.textLight}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categories}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryChip,
                      editCategory === cat.id && styles.categoryChipActive,
                    ]}
                    onPress={() => setEditCategory(cat.id)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        editCategory === cat.id && styles.categoryTextActive,
                      ]}
                    >
                      {cat.emoji} {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editNotes}
                onChangeText={setEditNotes}
                placeholder="Add notes..."
                placeholderTextColor={colors.textLight}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          </View>
        ) : (
          <View style={styles.detailSection}>
            <Text style={styles.title}>{item.title}</Text>

            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>
                {category?.emoji} {category?.label}
              </Text>
            </View>

            {item.notes && (
              <View style={styles.notesContainer}>
                <Text style={styles.notesLabel}>Notes</Text>
                <Text style={styles.notesText}>{item.notes}</Text>
              </View>
            )}

            <View style={styles.metadata}>
              <Text style={styles.metadataText}>
                Added {new Date(item.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
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
  headerButtons: {
    flexDirection: 'row',
    gap: 16,
    marginRight: 8,
  },
  headerButton: {
    padding: 4,
  },
  detailSection: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 16,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  categoryBadgeText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.white,
  },
  notesContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
  },
  notesText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  metadata: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  metadataText: {
    fontSize: 14,
    color: colors.textLight,
  },
  editSection: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 12,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
  },
  categoryTextActive: {
    color: colors.white,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 18,
    color: colors.textLight,
  },
});
