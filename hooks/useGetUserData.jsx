import { useState, useEffect } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const useGetUserData = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const fetchUserData = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      if (!accessToken) {
        throw new Error('No access token found. Please log in.');
      }

      const response = await axios.get(
        'https://trackinventory-xdex.onrender.com/api/User/GetUserDetails',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // console.log('User Data Response:', JSON.stringify(response.data, null, 2)); // Debug log

      if (response.status === 200) {
        setData(response.data);
        // console.log(response.data)
        setSuccess(true);
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to fetch user data.';
      console.error('Fetch Error:', errorMessage, err.response?.data); // Debug log
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const refetch = () => {
    fetchUserData();
  };

  return { data, isLoading, error, success, refetch };
};

export default useGetUserData;