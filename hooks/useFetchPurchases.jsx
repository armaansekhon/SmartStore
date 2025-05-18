import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const useFetchPurchases = (days) => {
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const take = 10; // Number of items per request

  const fetchPurchases = useCallback(async (reset = false) => {
    if (isLoading || (!hasMore && !reset)) return;

    setIsLoading(true);
    setIsInitialLoading(reset);
    setError(null);

    try {
      // Retrieve access token
      const accessToken = await SecureStore.getItemAsync('accessToken');
      if (!accessToken) {
        throw new Error('No access token found. Please log in.');
      }

      // Calculate skip for pagination
      const currentSkip = reset ? 0 : skip;

      // Build request body
      const requestBody = {
        Type: '1',
        Skip: currentSkip,
        Take: take,
      };
      if (days !== null) {
        requestBody.Days = days;
      }

      // API request
      const response = await axios.post(
        'https://fanfliks.onrender.com/api/Product/GetAllProducts',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Extract products and ensure it's an array
      const newData = Array.isArray(response.data?.products) ? response.data.products : [];
      const totalCount = response.data?.totalCount || 0;

      // Map data to include warranty field
      const mappedData = newData.map(item => ({
        ...item,
        warranty: item.status === 1 ? 'IN WARRANTY' : 'OUT OF WARRANTY', // Adjust based on API logic
      }));

      console.log('API request body:', requestBody); // Debug log
      console.log('API response.data:', response.data); // Debug log
      console.log('Mapped data:', mappedData); // Debug log

      // Update state
      setPurchases((prev) => (reset ? mappedData : [...prev, ...mappedData]));
      setSkip(currentSkip + take);
      setHasMore(currentSkip + take < totalCount); // Use totalCount for pagination
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to fetch purchases.';
      setError(errorMessage);
      setPurchases([]); // Reset purchases on error
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  }, [hasMore, isLoading, days]);

  // Load more items (infinite scroll)
  const loadMore = useCallback(() => {
    fetchPurchases(false);
  }, [fetchPurchases]);

  // Refresh data (pull-to-refresh or days change)
  const refresh = useCallback(() => {
    setPurchases([]);
    setSkip(0);
    setHasMore(true);
    fetchPurchases(true);
  }, [fetchPurchases]);

  // Fetch on mount and when days changes
  useEffect(() => {
    refresh();
  }, [days]);

  return { purchases, isLoading, isInitialLoading, error, loadMore, refresh };
};

export default useFetchPurchases;