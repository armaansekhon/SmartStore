import { useState } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const useUploadPurchaseData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const uploadData = async (formData, sellerDetails) => {
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
        id: '-1',
        Name: formData.name || '',
        Description: formData.description || '',
        BatteryHealth: parseInt(formData.batteryHealth) || 0,
        ImeiNumber1: formData.imei1 || '',
        ImeiNumber2: formData.imei2 || '',
        SerialNumber: formData.serialNumber || '',
        Quantity: 1,
        Type: 1,
        BuyerName: '',
        Address: sellerDetails.village || '',
        SellerName: sellerDetails.name || '',
        Price: parseFloat(formData.price) || 0, // Add Price field
      };

      // Post to API
      const response = await axios.post(
        'https://fanfliks.onrender.com/api/Product/UploadDetailsAndMedia',
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
      const errorMessage = err.response?.data?.message || err.message || 'Failed to upload purchase data.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadData, isLoading, error, success };
};

export default useUploadPurchaseData;