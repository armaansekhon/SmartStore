import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'https://trackinventory-xdex.onrender.com/api';

const useFetchCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      console.log('Access Token:', accessToken);
      if (!accessToken) {
        throw new Error('No access token found. Please log in again.');
      }

      console.log('Fetching Categories from:', `${BASE_URL}/Service/GetAllServices`);

      const response = await fetch(`${BASE_URL}/Service/GetAllServices`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseData = await response.json();
      console.log('Raw Response Data:', JSON.stringify(responseData, null, 2));

      if (!response.ok) {
        throw new Error(responseData.message || `Failed to fetch categories (Status: ${response.status})`);
      }

      // Map response to DropDownPicker format: { label, value }
      const formattedCategories = responseData.map((item) => ({
        label: item.name,
        value: item.id,
      }));

      setCategories(formattedCategories);
      console.log('Formatted Categories:', formattedCategories);
      setLoading(false);
      return formattedCategories;
    } catch (err) {
      console.error('Fetch Categories Error:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });

      const errorMessage = err.message || 'An error occurred while fetching categories';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Expose refetch function
  const refetch = async () => {
    try {
      await fetchCategories();
    } catch (err) {
      console.log('Refetch Categories Error:', err.message);
    }
  };

  return { categories, loading, error, refetch };
};

export default useFetchCategories;