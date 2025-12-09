import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback } from 'react';
import { getUserMode, setUserMode, type UserMode } from '@/utils/sync';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [mode, setMode] = useState<UserMode>('guest');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      console.log('Initializing auth...');
      const currentMode = await getUserMode();
      console.log('Current user mode:', currentMode);
      setMode(currentMode);
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      setMode('guest');
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsGuest = useCallback(async () => {
    try {
      console.log('Setting guest mode...');
      await setUserMode('guest');
      setMode('guest');
    } catch (error) {
      console.error('Failed to set guest mode:', error);
    }
  }, []);

  const loginWithAccount = useCallback(async () => {
    console.log('Account login not yet implemented');
  }, []);

  const logout = useCallback(async () => {
    try {
      console.log('Logging out, setting guest mode...');
      await setUserMode('guest');
      setMode('guest');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }, []);

  return {
    mode,
    isLoading,
    isGuest: mode === 'guest',
    isAuthenticated: mode === 'authenticated',
    loginAsGuest,
    loginWithAccount,
    logout,
  };
});
