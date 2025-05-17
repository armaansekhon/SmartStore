import { useState } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const useChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const changePassword = async (oldPassword, newPassword) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Retrieve access token from SecureStore
      const accessToken = await SecureStore.getItemAsync('accessToken');
      if (!accessToken) {
        throw new Error('No access token found. Please log in.');
      }

      // Construct JSON payload
      const payload = {
        Password: oldPassword,
        newPassword: newPassword,
      };

      // Post to API
      const response = await axios.post(
        'https://fanfliks.onrender.com/api/User/ChangePassword',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        return response.data;
      } else {
        throw new Error('Unexpected response status: ' + response.status);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to change password.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { changePassword, isLoading, error, success };
};

export default useChangePassword;