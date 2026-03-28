import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import type { UserProfile } from '@/types/media';
import { useAuth } from './AuthContext';

const USER_PROFILE_KEY = 'user_profile';

async function loadUserProfile(): Promise<UserProfile | null> {
  try {
    const stored = await AsyncStorage.getItem(USER_PROFILE_KEY);
    if (!stored) {
      console.log('No user profile found');
      return null;
    }
    const profile = JSON.parse(stored) as UserProfile;
    console.log('Loaded user profile:', profile.id);
    return profile;
  } catch (error) {
    console.error('Failed to load user profile:', error);
    return null;
  }
}

async function saveUserProfile(profile: UserProfile): Promise<UserProfile> {
  try {
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    console.log('Saved user profile:', profile.id);
    return profile;
  } catch (error) {
    console.error('Failed to save user profile:', error);
    throw error;
  }
}

export const [UserProfileProvider, useUserProfile] = createContextHook(() => {
  const queryClient = useQueryClient();
  const { userId, isAuthenticated } = useAuth();

  const profileQuery = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: loadUserProfile,
    enabled: isAuthenticated && !!userId,
  });

  const saveMutation = useMutation({
    mutationFn: saveUserProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['userProfile', userId], data);
    },
  });

  const { mutate: mutateProfile } = saveMutation;

  const profile = useMemo(() => profileQuery.data, [profileQuery.data]);

  const createProfile = useCallback(
    (userIdParam: string, email?: string, displayName?: string) => {
      const now = new Date().toISOString();
      const newProfile: UserProfile = {
        id: userIdParam,
        email,
        displayName,
        createdAt: now,
        updatedAt: now,
        subscriptionStatus: 'none',
        subscriptionTier: 'free',
        totalItems: 0,
        storageUsedMb: 0,
        storageQuotaMb: 100,
        preferences: {
          defaultCurrency: 'USD',
          showValueEstimates: true,
          enablePushNotifications: true,
          enableLoanReminders: true,
          defaultWishlistPrivacy: 'private',
        },
      };
      return new Promise<void>((resolve, reject) => {
        mutateProfile(newProfile, {
          onSuccess: () => {
            console.log('Profile created successfully');
            resolve();
          },
          onError: (error) => {
            console.error('Failed to create profile:', error);
            reject(error);
          },
        });
      });
    },
    [mutateProfile]
  );

  const updateProfile = useCallback(
    (updates: Partial<UserProfile>) => {
      if (!profile) {
        console.error('No profile to update');
        return;
      }
      const updated: UserProfile = {
        ...profile,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      mutateProfile(updated, {
        onSuccess: () => console.log('Profile updated successfully'),
        onError: (error) => console.error('Failed to update profile:', error),
      });
    },
    [profile, mutateProfile]
  );

  const updateSubscription = useCallback(
    (subscriptionUpdates: Partial<UserProfile>) => {
      if (!profile) {
        console.error('No profile to update subscription');
        return;
      }
      updateProfile(subscriptionUpdates);
    },
    [profile, updateProfile]
  );

  return {
    profile,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    createProfile,
    updateProfile,
    updateSubscription,
    refetch: profileQuery.refetch,
  };
});
