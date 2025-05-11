import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'https://fanfliks.onrender.com/api';

const useSaveBusinessDetails = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveBusinessDetails = async (payload) => {
    setLoading(true);
    setError(null);

    try {
      // Retrieve accessToken from SecureStore
      const accessToken = await SecureStore.getItemAsync('accessToken');
      console.log('Access Token:', accessToken);
      if (!accessToken) {
        throw new Error('No access token found. Please log in again.');
      }

      // Log payload details
      console.log('Payload CategoryId:', payload.CategoryId);
      console.log('Sending Business Details Request:', {
        url: `${BASE_URL}/User/SaveBusinessDetails`,
        payload,
      });

      const response = await fetch(`${BASE_URL}/User/SaveBusinessDetails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      // Log response status and headers
      console.log('Response Status:', response.status);
      console.log('Response Headers:', [...response.headers.entries()]);

      let responseText = '';
      try {
        responseText = await response.text();
        console.log('Raw Response Text:', responseText || 'Empty');
      } catch (textErr) {
        console.warn('Failed to read response text:', textErr.message);
      }

      let responseData = null;
      if (responseText) {
        try {
          responseData = JSON.parse(responseText);
          console.log('Parsed Response Data:', responseData);
        } catch (jsonErr) {
          console.warn('Failed to parse JSON:', jsonErr.message, 'Response Text:', responseText);
          responseData = { message: `Invalid JSON response: ${responseText}` };
        }
      }

      if (!response.ok) {
        const errorMessage =
          responseData?.message ||
          `Failed to save business details (Status: ${response.status})`;
        throw new Error(errorMessage);
      }

      console.log('Business Details Saved Successfully:', responseData);
      setLoading(false);
      return responseData;
    } catch (err) {
      console.error('Business Details Error:', {
        message: err.message,
        status: response?.status || 'Unknown',
        responseText: responseText || 'No response text',
      });

      const errorMessage = err.message || 'An error occurred while saving business details';
      setLoading(false);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return { saveBusinessDetails, loading, error };
};

export default useSaveBusinessDetails;