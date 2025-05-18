import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const useFetchSales = (days) => {
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const take = 10;

  const statusToWarranty = (productStatus) => {
    switch (parseInt(productStatus)) {
      case 0: return 'Warranty';
      case 1: return 'Out of Warranty';
      case 2: return 'Damaged';
      case 3: return 'Lost';
      case 4: return 'Stolen';
      default: return 'Unknown';
    }
  };

  const fetchSales = useCallback(async (reset = false) => {
    if (isLoading || (!hasMore && !reset)) return;

    setIsLoading(true);
    setIsInitialLoading(reset);
    setError(null);

    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      if (!accessToken) {
        throw new Error('No access token found. Please log in.');
      }

      const currentSkip = reset ? 0 : skip;

      const requestBody = {
        Type: '0', // Sales products
        Skip: currentSkip,
        Take: take,
      };

      if (days !== null) {
        requestBody.Days = days;
      }

      console.log('API request body:', requestBody);

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

      const newData = Array.isArray(response.data?.products) ? response.data.products : [];
      const totalCount = response.data?.totalCount || 0;

      const mappedData = newData.map(item => ({
        ...item,
        warranty: statusToWarranty(item.productStatus),
      }));

      console.log('API response.data:', response.data);
      console.log('Mapped data:', mappedData);

      setSales((prev) => (reset ? mappedData : [...prev, ...mappedData]));
      setSkip(currentSkip + take);
      setHasMore(currentSkip + take < totalCount);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to fetch sales.';
      setError(errorMessage);
      setSales([]);
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  }, [hasMore, isLoading, days]);

  const loadMore = useCallback(() => {
    fetchSales(false);
  }, [fetchSales]);

  const refresh = useCallback(() => {
    setSales([]);
    setSkip(0);
    setHasMore(true);
    fetchSales(true);
  }, [fetchSales]);

  useEffect(() => {
    refresh();
  }, [days]);

  return { sales, isLoading, isInitialLoading, error, loadMore, refresh };
};

export default useFetchSales;