
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'https://trackinventory-xdex.onrender.com/api';

const useSaveBusinessDetails = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveBusinessDetails = async (payload) => {
    setLoading(true);
    setError(null);

    try {
      // Retrieve accessToken
      const accessToken = await SecureStore.getItemAsync('accessToken');
      if (!accessToken) {
        throw new Error('No access token found. Please log in again.');
      }

      // Log payload
      console.log('Sending Payload:', payload);

      // Make API request
      const response = await fetch(`${BASE_URL}/User/SaveBusinessDetails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      // Log response status
      console.log('Response Status:', response.status);

      // Parse response
      const responseText = await response.text();
      const responseData = responseText ? JSON.parse(responseText) : {};

      // Log response data
      console.log('Response Data:', responseData);

      // Check success
      if (response.status !== 200) {
        const errorMessage = responseData?.message || `Failed to save business details (Status: ${response.status})`;
        throw new Error(errorMessage);
      }

      // Save serviceName
      const serviceName = responseData?.serviceName || 'Mobile';
      await SecureStore.setItemAsync('serviceName', serviceName);
      console.log('Saved serviceName to SecureStore:', serviceName);

      setLoading(false);
      return { success: true, message: 'Business details saved', serviceName };
    } catch (err) {
      console.error('Error saving business details:', err.message);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return { saveBusinessDetails, loading, error };
};

export default useSaveBusinessDetails;
