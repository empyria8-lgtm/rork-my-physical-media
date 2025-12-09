import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Scissors, Wand2, X, Square } from 'lucide-react-native';
import colors from '@/constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_SIZE = SCREEN_WIDTH - 40;

type SelectionMode = 'auto' | 'rectangle' | 'freeform';

export default function BackgroundRemovalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ uri: string }>();
  const imageUri = params.uri;

  const [selectionMode, setSelectionMode] = useState<SelectionMode>('auto');
  const [isProcessing] = useState(false);
  const [processedUri] = useState<string>('');
  const [error] = useState<string>('');



  const handleAutoDetect = () => {
    setSelectionMode('auto');
    Alert.alert(
      'Feature Coming Soon',
      'Automatic background removal is not yet available.\n\nYou can continue with the original photo, or edit it in another app before uploading.',
      [
        {
          text: 'Use Original Photo',
          onPress: () => router.back(),
        },
        {
          text: 'OK',
          style: 'cancel',
        },
      ]
    );
  };

  const handleRectangleSelect = () => {
    setSelectionMode('rectangle');
    Alert.alert(
      'Feature Coming Soon',
      'Rectangle selection tool is not yet available.\n\nYou can use the photo as-is or edit it in another app.',
      [{ text: 'OK' }]
    );
  };

  const handleFreeformSelect = () => {
    setSelectionMode('freeform');
    Alert.alert(
      'Feature Coming Soon',
      'Freeform selection tool is not yet available.\n\nYou can use the photo as-is or edit it in another app.',
      [{ text: 'OK' }]
    );
  };

  const handleDone = () => {
    if (processedUri) {
      router.back();
      router.setParams({ processedUri });
    } else {
      router.back();
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (!imageUri) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Remove Background' }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No image provided</Text>
          <TouchableOpacity style={styles.button} onPress={handleCancel}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Remove Background',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerLeft: () => (
            <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={handleDone} 
              style={styles.headerButton}
              disabled={isProcessing}
            >
              <Text style={[
                styles.doneText,
                isProcessing && styles.doneTextDisabled
              ]}>
                Done
              </Text>
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: processedUri || imageUri }}
            style={styles.image}
            contentFit="contain"
          />
          
          {isProcessing && (
            <View style={styles.processingOverlay}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.processingText}>Removing background...</Text>
            </View>
          )}
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>Selection Tools</Text>
          
          <View style={styles.tools}>
            <TouchableOpacity
              style={[
                styles.tool,
                selectionMode === 'auto' && styles.toolActive,
              ]}
              onPress={handleAutoDetect}
              disabled={isProcessing}
            >
              <Wand2 
                size={24} 
                color={selectionMode === 'auto' ? colors.primary : colors.text} 
              />
              <Text style={[
                styles.toolText,
                selectionMode === 'auto' && styles.toolTextActive,
              ]}>
                Auto
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tool,
                selectionMode === 'rectangle' && styles.toolActive,
              ]}
              onPress={handleRectangleSelect}
              disabled={isProcessing}
            >
              <Square 
                size={24} 
                color={selectionMode === 'rectangle' ? colors.primary : colors.text} 
              />
              <Text style={[
                styles.toolText,
                selectionMode === 'rectangle' && styles.toolTextActive,
              ]}>
                Rectangle
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tool,
                selectionMode === 'freeform' && styles.toolActive,
              ]}
              onPress={handleFreeformSelect}
              disabled={isProcessing}
            >
              <Scissors 
                size={24} 
                color={selectionMode === 'freeform' ? colors.primary : colors.text} 
              />
              <Text style={[
                styles.toolText,
                selectionMode === 'freeform' && styles.toolTextActive,
              ]}>
                Freeform
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.hint}>
            <Text style={styles.hintText}>
              ℹ️ Background removal tools are coming soon. For now, use your photos as-is or edit them in an external app before uploading.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  processingText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
  },
  toolbar: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  toolbarTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 12,
  },
  tools: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  tool: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: colors.cream,
    borderRadius: 10,
    gap: 6,
  },
  toolActive: {
    backgroundColor: colors.cream,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  toolText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.text,
  },
  toolTextActive: {
    color: colors.primary,
  },
  hint: {
    backgroundColor: colors.cream,
    borderRadius: 8,
    padding: 12,
  },
  hintText: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 18,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.text,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.white,
  },
  errorBanner: {
    backgroundColor: '#FEE',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    fontSize: 13,
    color: '#C33',
    lineHeight: 18,
  },
  headerButton: {
    padding: 8,
  },
  doneText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.primary,
  },
  doneTextDisabled: {
    opacity: 0.4,
  },
});
