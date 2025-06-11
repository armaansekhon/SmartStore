import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const useFetchVehiclePurchases = (days) => {
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const take = 100; // Number of items per request, as per endpoint

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

      // Build query parameters
      const params = {
        skip: currentSkip,
        take,
        type: 1, // Vehicle purchases
      };
      if (days !== null) {
        params.days = days;
      }

      // API request
      const response = await axios.get(
        'https://trackinventory-xdex.onrender.com/api/Vehicle/GetAllVehicles',
        {
          params,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Extract vehicles and ensure it's an array
      const newData = Array.isArray(response.data?.vehicles) ? response.data.vehicles : [];
      const totalCount = response.data?.totalCount || 0;

      // Map data to include warranty field
      const mappedData = newData.map(item => ({
        ...item,
        warranty: (() => {
          switch (parseInt(item.vehicleStatus)) {
            case 0: return 'Warranty';
            case 1: return 'Out of Warranty';
            case 2: return 'Damaged';
            case 3: return 'Lost';
            case 4: return 'Stolen';
            default: return 'Unknown';
          }
        })(),
      }));

  
      // Update state
      setPurchases((prev) => (reset ? mappedData : [...prev, ...mappedData]));
      setSkip(currentSkip + take);
      setHasMore(currentSkip + take < totalCount); // Use totalCount for pagination
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to fetch vehicle purchases.';
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

export default useFetchVehiclePurchases;