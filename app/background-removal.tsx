import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedUri, setProcessedUri] = useState<string>('');
  const [error, setError] = useState<string>('');

  const removeBackground = async () => {
    if (!imageUri) return;

    setIsProcessing(true);
    setError('');

    try {
      const formData = new FormData();
      
      if (Platform.OS === 'web') {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        formData.append('image_file', blob, 'image.jpg');
      } else {
        formData.append('image_file', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'image.jpg',
        } as any);
      }
      
      formData.append('size', 'auto');

      const removeResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': 'YOUR_REMOVE_BG_API_KEY',
        },
        body: formData,
      });

      if (!removeResponse.ok) {
        throw new Error('Failed to remove background');
      }

      const blob = await removeResponse.blob();
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const base64data = reader.result as string;
        setProcessedUri(base64data);
        setIsProcessing(false);
      };
      
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Background removal error:', error);
      setError('Unable to remove background. Please try again or use manual selection.');
      setIsProcessing(false);
      
      Alert.alert(
        'Processing Failed',
        'We couldn\'t automatically remove the background. You can try:\n\n• Using the rectangle tool to manually select the object\n• Taking a new photo with better lighting\n• Choosing a different image',
        [{ text: 'OK' }]
      );
    }
  };

  const handleAutoDetect = () => {
    setSelectionMode('auto');
    removeBackground();
  };

  const handleRectangleSelect = () => {
    setSelectionMode('rectangle');
    Alert.alert(
      'Rectangle Selection',
      'Draw a rectangle around the object you want to keep. The background outside the rectangle will be removed.',
      [{ text: 'Got It' }]
    );
  };

  const handleFreeformSelect = () => {
    setSelectionMode('freeform');
    Alert.alert(
      'Freeform Selection',
      'Draw around the object you want to keep. The background outside your selection will be removed.',
      [{ text: 'Got It' }]
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
              💡 Tip: Start with Auto detect for best results. Use manual tools if needed.
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
