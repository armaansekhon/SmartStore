import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'https://fanfliks.onrender.com/api';

const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const resetPassword = async (password) => {
    setLoading(true);
    setError(null);
    let responseText = '';

    try {
      // Retrieve access token
      const accessToken = await SecureStore.getItemAsync('accessToken');
      if (!accessToken) {
        throw new Error('Access token not found. Please try the forgot password process again.');
      }

      const payload = {
        Password: password,
      };

      // console.log('Sending Reset Password Request:', {
      //   url: `${BASE_URL}/User/ResetPassword`,
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      //   payload,
      // });

      const response = await fetch(`${BASE_URL}/User/ResetPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      console.log('Response Status:', response.status);

      responseText = await response.text();
      // console.log('Raw Response Text:', responseText || 'Empty');

      if (!response.ok) {
        throw new Error(responseText || `Failed to reset password (Status: ${response.status})`);
      }

      // console.log('Reset Password Request Successful');
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Reset Password Error:', {
        message: err.message,
        responseText: responseText || 'No response text',
      });

      const errorMessage = err.message || 'An error occurred while resetting the password';
      setLoading(false);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return { resetPassword, loading, error };
};

export default useResetPassword;