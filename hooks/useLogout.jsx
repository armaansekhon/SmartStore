import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter, useNavigation } from 'expo-router';

const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const navigation = useNavigation();

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // List of known keys to delete
      const knownKeys = [
        'accessToken',
        'userToken',
        'userId',
        'firstLogin',
        'userDetails',
        'businessDetails',
      ];

      // Delete all known keys
      const deletePromises = knownKeys.map((key) =>
        SecureStore.deleteItemAsync(key).catch((err) => {
          console.warn(`Failed to delete ${key}:`, err.message);
          // Continue even if one key fails
        })
      );

      await Promise.all(deletePromises);

      // Navigate to login and reset navigation stack
      router.replace('/login');

      // Reset navigation state to prevent back navigation
    //   navigation.reset({
    //     index: 0,
    //     routes: [{ name: 'login' }],
    //   });

      console.log('Logout successful: SecureStore cleared, navigated to /login');
    } catch (err) {
      const errorMessage = err.message || 'Failed to log out';
      setError(errorMessage);
      console.error('Logout error:', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading, error };
};

export default useLogout;