import { useState } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const useUploadSaleData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const uploadData = async (formData, buyerDetails, images, documents) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      if (!accessToken) {
        throw new Error('No access token found. Please log in.');
      }

      const payload = {
        id: '-1',
        Name: formData.name || '',
        Description: formData.description || '',
        BatteryHealth: parseInt(formData.batteryHealth) || 0,
        ImeiNumber1: formData.imei1 || '',
        ImeiNumber2: formData.imei2 || '',
        SerialNumber: formData.serialNumber || '',
        Quantity: 1,
        Type: 0,
        BuyerName: buyerDetails.name || '',
        Address: buyerDetails.village || '',
        SellerName: '',
        Price: parseFloat(formData.price) || 0,
        ProductStatus: parseInt(formData.status) || 0, // Changed from status to productStatus
        Images: images.map(img => ({ uri: img.uri })) || [],
        Documents: documents.map(doc => ({ uri: doc.uri, name: doc.name })) || [],
      };

      console.log('Upload Payload:', JSON.stringify(payload, null, 2)); // Debug log

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

      console.log('API Response:', JSON.stringify(response.data, null, 2)); // Debug log

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        return response.data;
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to upload sale data.';
      console.error('Upload Error:', errorMessage, err.response?.data); // Debug log
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadData, isLoading, error, success };
};

export default useUploadSaleData;