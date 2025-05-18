import { useState, useEffect } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const useGetProductStats = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const fetchProductStats = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      if (!accessToken) {
        throw new Error('No access token found. Please log in.');
      }

      const response = await axios.get(
        'https://fanfliks.onrender.com/api/Product/GetProductStats',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log('Product Stats Response:', JSON.stringify(response.data, null, 2)); // Debug log

      if (response.status === 200) {
        setData(response.data);
        setSuccess(true);
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to fetch product stats.';
      console.error('Fetch Error:', errorMessage, err.response?.data); // Debug log
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductStats();
  }, []);

  const refetch = () => {
    fetchProductStats();
  };

  return { data, isLoading, error, success, refetch };
};

export default useGetProductStats;