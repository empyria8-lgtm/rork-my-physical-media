import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { CameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { Camera, Image as ImageIcon, X } from 'lucide-react-native';
import { useMediaContext } from '@/contexts/MediaContext';
import { CATEGORIES, CategoryId } from '@/constants/categories';
import { useTheme } from '@/contexts/ThemeContext';
import PermissionPrompt from '@/components/PermissionPrompt';
import {
  checkCameraPermission,
  checkPhotoLibraryPermission,
  requestCameraPermission,
  requestPhotoLibraryPermission,
} from '@/utils/permissions';

export default function AddScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { addItem } = useMediaContext();

  const [showCamera, setShowCamera] = useState(false);
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
  const [photoUri, setPhotoUri] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId>('other');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCameraPermissionPrompt, setShowCameraPermissionPrompt] = useState(false);
  const [showPhotoPermissionPrompt, setShowPhotoPermissionPrompt] = useState(false);
  const [isCameraPermissionDenied, setIsCameraPermissionDenied] = useState(false);
  const [isPhotoPermissionDenied, setIsPhotoPermissionDenied] = useState(false);

  const compressImage = async (uri: string): Promise<string> => {
    try {
      console.log('Compressing image for optimal performance...');
      const manipResult = await manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.6, format: SaveFormat.JPEG }
      );
      console.log('Image compressed successfully');
      return manipResult.uri;
    } catch (error) {
      console.error('Failed to compress image:', error);
      Alert.alert(
        'Upload Issue',
        'We had trouble processing your photo. The original version will be used instead.',
        [{ text: 'OK' }]
      );
      return uri;
    }
  };

  const takePicture = async () => {
    try {
      if (Platform.OS === 'web') {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.6,
        });

        if (!result.canceled && result.assets[0]) {
          const compressed = await compressImage(result.assets[0].uri);
          setPhotoUri(compressed);
        }
        return;
      }

      const permissionStatus = await checkCameraPermission();
      
      if (permissionStatus.status === 'granted') {
        setShowCamera(true);
        return;
      }

      if (permissionStatus.status === 'denied' && !permissionStatus.canAskAgain) {
        setIsCameraPermissionDenied(true);
        setShowCameraPermissionPrompt(true);
        return;
      }

      setIsCameraPermissionDenied(false);
      setShowCameraPermissionPrompt(true);
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert(
        'Camera Error',
        'Unable to open camera. Please try selecting from your gallery instead.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleCameraPermissionRequest = async () => {
    setShowCameraPermissionPrompt(false);
    
    const result = await requestCameraPermission();
    
    if (result.status === 'granted') {
      setShowCamera(true);
    } else {
      setIsCameraPermissionDenied(true);
      setShowCameraPermissionPrompt(true);
    }
  };

  const capturePhoto = async () => {
    try {
      if (cameraRef) {
        const photo = await cameraRef.takePictureAsync();
        if (photo) {
          const compressed = await compressImage(photo.uri);
          setPhotoUri(compressed);
          setShowCamera(false);
        }
      }
    } catch (error) {
      console.error('Capture error:', error);
      Alert.alert(
        'Photo Capture Failed',
        'Unable to capture photo. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const pickFromGallery = async () => {
    try {
      if (Platform.OS === 'web') {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.6,
        });

        if (!result.canceled && result.assets[0]) {
          const compressed = await compressImage(result.assets[0].uri);
          setPhotoUri(compressed);
        }
        return;
      }

      const permissionStatus = await checkPhotoLibraryPermission();
      
      if (permissionStatus.status === 'granted') {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.6,
        });

        if (!result.canceled && result.assets[0]) {
          const compressed = await compressImage(result.assets[0].uri);
          setPhotoUri(compressed);
        }
        return;
      }

      if (permissionStatus.status === 'denied' && !permissionStatus.canAskAgain) {
        setIsPhotoPermissionDenied(true);
        setShowPhotoPermissionPrompt(true);
        return;
      }

      setIsPhotoPermissionDenied(false);
      setShowPhotoPermissionPrompt(true);
    } catch (error) {
      console.error('Gallery error:', error);
      Alert.alert(
        'Gallery Error',
        'Unable to access your photo library. Please check your permissions and try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handlePhotoPermissionRequest = async () => {
    setShowPhotoPermissionPrompt(false);
    
    const result = await requestPhotoLibraryPermission();
    
    if (result.status === 'granted') {
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
      });

      if (!pickerResult.canceled && pickerResult.assets[0]) {
        const compressed = await compressImage(pickerResult.assets[0].uri);
        setPhotoUri(compressed);
      }
    } else {
      setIsPhotoPermissionDenied(true);
      setShowPhotoPermissionPrompt(true);
    }
  };

  const handleSubmit = async () => {
    if (!photoUri.trim()) {
      Alert.alert(
        '📷 Photo Required',
        'Please add a photo of your item before saving. You can use the camera or choose from your gallery.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (!title.trim()) {
      Alert.alert(
        '✏️ Title Required',
        'Please give your item a title so you can find it easily later.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await addItem({
        title: title.trim(),
        category,
        photoUri,
        notes: notes.trim() || undefined,
      });

      setPhotoUri('');
      setTitle('');
      setCategory('other');
      setNotes('');

      Alert.alert('✅ Item Added!', 'Your item has been saved to your collection.', [
        {
          text: 'View Collection',
          onPress: () => router.push('/collection' as any),
        },
        {
          text: 'Add Another',
          style: 'cancel',
        },
      ]);
    } catch (error) {
      console.error('Failed to add item:', error);
      
      const errorMessage = error instanceof Error && error.message === 'STORAGE_FULL'
        ? 'Your device storage is full. Please free up some space or delete old items from your collection.'
        : 'We couldn\'t save your item. Please check your device storage and try again.';
      
      Alert.alert(
        'Upload Failed',
        errorMessage,
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = createStyles(colors);

  if (showCamera && Platform.OS !== 'web') {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          ref={setCameraRef}
          style={styles.camera}
          facing="back"
        >
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => setShowCamera(false)}
            >
              <X size={32} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={capturePhoto}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
            <View style={styles.cameraButtonPlaceholder} />
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <>
      <Modal
        visible={showCameraPermissionPrompt}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCameraPermissionPrompt(false)}
      >
        <PermissionPrompt
          type="camera"
          onRequestPermission={handleCameraPermissionRequest}
          onCancel={() => setShowCameraPermissionPrompt(false)}
          isDenied={isCameraPermissionDenied}
        />
      </Modal>

      <Modal
        visible={showPhotoPermissionPrompt}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPhotoPermissionPrompt(false)}
      >
        <PermissionPrompt
          type="photos"
          onRequestPermission={handlePhotoPermissionRequest}
          onCancel={() => setShowPhotoPermissionPrompt(false)}
          isDenied={isPhotoPermissionDenied}
        />
      </Modal>

      <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Add Item',
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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {photoUri ? (
          <View style={styles.photoPreviewContainer}>
            <Image
              source={{ uri: photoUri }}
              style={styles.photoPreview}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
            <TouchableOpacity
              style={styles.removePhotoButton}
              onPress={() => setPhotoUri('')}
              accessibilityRole="button"
              accessibilityLabel="Remove photo"
              accessibilityHint="Removes selected photo"
            >
              <X size={18} color={colors.white} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.photoButtons}>
            <TouchableOpacity
              style={styles.photoButton}
              onPress={takePicture}
              accessibilityRole="button"
              accessibilityLabel="Take photo with camera"
              accessibilityHint="Opens camera to capture item photo"
            >
              <Camera size={28} color={colors.text} />
              <Text style={styles.photoButtonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.photoButton}
              onPress={pickFromGallery}
              accessibilityRole="button"
              accessibilityLabel="Choose photo from gallery"
              accessibilityHint="Opens photo library to select image"
            >
              <ImageIcon size={28} color={colors.text} />
              <Text style={styles.photoButtonText}>Choose Photo</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter title"
            placeholderTextColor={colors.textLight}
            value={title}
            onChangeText={setTitle}
            accessibilityLabel="Item title"
            accessibilityHint="Enter a title for your media item"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categories}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  category === cat.id && styles.categoryChipActive,
                ]}
                onPress={() => setCategory(cat.id)}
                accessibilityRole="button"
                accessibilityLabel={`Select ${cat.label} category`}
                accessibilityState={{ selected: category === cat.id }}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === cat.id && styles.categoryTextActive,
                  ]}
                >
                  {cat.emoji} {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Optional notes"
            placeholderTextColor={colors.textLight}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            accessibilityLabel="Item notes"
            accessibilityHint="Enter optional notes about this item"
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
          accessibilityRole="button"
          accessibilityLabel="Save item"
          accessibilityHint="Saves this item to your collection"
          accessibilityState={{ disabled: isSubmitting }}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.submitButtonText}>Save Item</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
    </>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 10,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  photoButton: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  photoButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    textAlign: 'center',
  },
  photoPreviewContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.cream,
    marginBottom: 24,
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.text,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  categoryChipActive: {
    backgroundColor: colors.text,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.text,
  },
  categoryTextActive: {
    color: colors.white,
  },
  submitButton: {
    backgroundColor: colors.text,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: colors.white,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cameraButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
  },
  cameraButtonPlaceholder: {
    width: 60,
  },
});
