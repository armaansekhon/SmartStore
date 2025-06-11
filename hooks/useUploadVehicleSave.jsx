import { useState } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const useUploadVehicleSave = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateStr.match(regex);
    if (!match) {
      console.warn(`Invalid date format: ${dateStr}, expected DD/MM/YYYY`);
      return null;
    }

    const [day, month, year] = match.slice(1).map(Number);
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date: ${dateStr}`);
      return null;
    }
    return date.toISOString();
  };

  const uploadData = async (formData, buyerDetails, images = [], documents = [], id = '-1') => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      if (!accessToken) {
        throw new Error('No access token found. Please log in.');
      }

      const formDataPayload = new FormData();

      formDataPayload.append('Id', id);
      formDataPayload.append('Name', formData.vehicleName || '');
      formDataPayload.append('Model', formData.model || '');
      formDataPayload.append('VehicleOwner', formData.owner || '');
      formDataPayload.append('Color', formData.color || '');
      const insuranceValidDate = parseDate(formData.insuranceValidDate);
      if (insuranceValidDate) formDataPayload.append('InsuranceValidDate', insuranceValidDate);
      formDataPayload.append('TyrePercentage', formData.tyreCondition ? String(formData.tyreCondition) : '');
      formDataPayload.append('NoOfKeys', String(parseInt(formData.numberOfKeys) || 0));
      formDataPayload.append('NotWorking', JSON.stringify(formData.condition ? [formData.condition] : []));
      formDataPayload.append('Description', formData.description || '');
      const permitExpired = parseDate(formData.permitExpiryDate);
      if (permitExpired) formDataPayload.append('PermitExpired', permitExpired);
      formDataPayload.append('Price', String(parseFloat(formData.price) || 0));
      formDataPayload.append('ChassisNumber', formData.chassisNumber || '');
      formDataPayload.append('EngineNumber', formData.engineNumber || '');
      formDataPayload.append('Type', '0'); // Vehicle Sale
      formDataPayload.append('VehicleStatus', String(parseInt(formData.status) || 0));
      formDataPayload.append('CustomerName', buyerDetails.name || '');
      formDataPayload.append('PhoneNumber', buyerDetails.phone || '');
      formDataPayload.append('Address', buyerDetails.village || '');

      if (images.length > 0) {
        for (const [index, image] of images.entries()) {
          const fileName = image.uri.split('/').pop() || `image-${index}.jpg`;
          formDataPayload.append('VehicleMedia', {
            uri: image.uri,
            name: fileName,
            type: 'image/jpeg',
          });
        }
      }

      if (documents.length > 0) {
        for (const [index, doc] of documents.entries()) {
          const fileName = doc.name || `document-${index}`;
          formDataPayload.append('CustomerMedia', {
            uri: doc.uri,
            name: fileName,
            type: doc.mimeType || 'application/octet-stream',
          });
        }
      }

      // console.log('Vehicle Sale Upload Payload:', {
      //   Id: id,
      //   Name: formData.vehicleName || '',
      //   Model: formData.model || '',
      //   Color: formData.color || '',
      //   InsuranceValidDate: insuranceValidDate,
      //   TyrePercentage: formData.tyreCondition ? String(formData.tyreCondition) : '',
      //   NoOfKeys: parseInt(formData.numberOfKeys) || 0,
      //   NotWorking: formData.condition ? [formData.condition] : [],
      //   Description: formData.description || '',
      //   PermitExpired: permitExpired,
      //   Price: parseFloat(formData.price) || 0,
      //   ChassisNumber: formData.chassisNumber || '',
      //   EngineNumber: formData.engineNumber || '',
      //   Type: 0,
      //   VehicleStatus: parseInt(formData.status) || 0,
      //   CustomerName: buyerDetails.name || '',
      //   PhoneNumber: buyerDetails.phone || '',
      //   Address: buyerDetails.village || '',
      //   vehicleMediaCount: images.length,
      //   customerMediaCount: documents.length,
      // });

      const response = await axios.post(
        'https://trackinventory-xdex.onrender.com/api/Vehicle/CreateUpdate',
        formDataPayload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // console.log('Vehicle Sale API Response:', JSON.stringify(response.data, null, 2));

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        return response.data;
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.title || err.message || 'Failed to upload vehicle sale data.';
      console.error('Vehicle Sale Upload Error:', {
        message: errorMessage,
        status: err.response?.status,
        data: err.response?.data,
        stack: err.stack,
      });
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadData, isLoading, error, success };
};

export default useUploadVehicleSave;