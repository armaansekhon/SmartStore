import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccessToken = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync('accessToken');
        console.log('Access token:', accessToken ? 'Found' : 'Not found');
        if (accessToken) {
          router.replace('(drawer)/');
        } else {
          router.replace('/login');
        }
      } catch (error) {
        console.error('Error checking access token:', error);
        router.replace('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAccessToken();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#564dcc" />
      </View>
    );
  }

  return null; // No UI needed after redirect
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});