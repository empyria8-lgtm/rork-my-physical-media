import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export interface PermissionResult {
  status: PermissionStatus;
  canAskAgain: boolean;
}

export async function requestCameraPermission(): Promise<PermissionResult> {
  try {
    console.log('Requesting camera permission...');
    
    if (Platform.OS === 'web') {
      return { status: 'granted', canAskAgain: false };
    }

    const { status, canAskAgain } = await Camera.requestCameraPermissionsAsync();
    console.log('Camera permission result:', status, 'canAskAgain:', canAskAgain);

    return {
      status: status as PermissionStatus,
      canAskAgain,
    };
  } catch (error) {
    console.error('Failed to request camera permission:', error);
    return { status: 'denied', canAskAgain: false };
  }
}

export async function checkCameraPermission(): Promise<PermissionResult> {
  try {
    if (Platform.OS === 'web') {
      return { status: 'granted', canAskAgain: false };
    }

    const { status, canAskAgain } = await Camera.getCameraPermissionsAsync();
    
    return {
      status: status as PermissionStatus,
      canAskAgain,
    };
  } catch (error) {
    console.error('Failed to check camera permission:', error);
    return { status: 'undetermined', canAskAgain: true };
  }
}

export async function requestPhotoLibraryPermission(): Promise<PermissionResult> {
  try {
    console.log('Requesting photo library permission...');
    
    if (Platform.OS === 'web') {
      return { status: 'granted', canAskAgain: false };
    }

    const { status, canAskAgain } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log('Photo library permission result:', status, 'canAskAgain:', canAskAgain);

    return {
      status: status as PermissionStatus,
      canAskAgain,
    };
  } catch (error) {
    console.error('Failed to request photo library permission:', error);
    return { status: 'denied', canAskAgain: false };
  }
}

export async function checkPhotoLibraryPermission(): Promise<PermissionResult> {
  try {
    if (Platform.OS === 'web') {
      return { status: 'granted', canAskAgain: false };
    }

    const { status, canAskAgain } = await ImagePicker.getMediaLibraryPermissionsAsync();
    
    return {
      status: status as PermissionStatus,
      canAskAgain,
    };
  } catch (error) {
    console.error('Failed to check photo library permission:', error);
    return { status: 'undetermined', canAskAgain: true };
  }
}

export function showPermissionDeniedAlert(permissionType: 'camera' | 'photos' | 'notifications') {
  const messages = {
    camera: {
      title: 'Camera Access Required',
      message: 'To take photos of your media items, please enable camera access in Settings > My Physical Media > Camera.',
    },
    photos: {
      title: 'Photo Library Access Required',
      message: 'To select photos from your library, please enable photo access in Settings > My Physical Media > Photos.',
    },
    notifications: {
      title: 'Notifications Disabled',
      message: 'To receive reminders about your collection, please enable notifications in Settings > My Physical Media > Notifications.',
    },
  };

  const { title, message } = messages[permissionType];

  Alert.alert(
    title,
    message,
    [
      { text: 'Got It', style: 'cancel' },
      {
        text: 'Open Settings',
        onPress: () => {
          if (Platform.OS === 'ios') {
            import('expo-linking').then((Linking) => {
              Linking.default.openURL('app-settings:');
            });
          } else if (Platform.OS === 'android') {
            import('expo-linking').then((Linking) => {
              Linking.default.openSettings();
            });
          }
        },
      },
    ]
  );
}
