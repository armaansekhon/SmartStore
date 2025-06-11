import { useState } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const useUploadVehiclePurchaseData = () => {
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

  const uploadData = async (formData, sellerDetails, images = [], documents = [], id = '-1') => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      if (!accessToken) {
        throw new Error('No access token found. Please log in.');
      }

      // Create FormData for multipart request
      const formDataPayload = new FormData();

      // Append VehicleCreateUpdateRequest properties as form fields
      formDataPayload.append('Id', id);
      formDataPayload.append('CustomerId', "-1");
      formDataPayload.append('Name', formData.vehicleName || '');
      formDataPayload.append('Model', formData.model || '');
      formDataPayload.append('RegistrationNumber', formData.registrationNumber || '');
      formDataPayload.append('VehicleOwner', formData.owner || '');
      formDataPayload.append('TrallyNo', formData.trallyNo || '');
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
      formDataPayload.append('PurchasedOn', '');
      formDataPayload.append('YearOfManufacture', String(0));
      formDataPayload.append('ChassisNumber', formData.chassisNumber || '');
      formDataPayload.append('EngineNumber', formData.engineNumber || '');
      formDataPayload.append('Type', String(1)); // Assumed ProductType.VehiclePurchase
      formDataPayload.append('VehicleStatus', String(parseInt(formData.status) || 0)); // Assumed valid ProductStatus
      formDataPayload.append('CustomerName', sellerDetails.name || '');
      formDataPayload.append('PhoneNumber', sellerDetails.phone || '');
      formDataPayload.append('City', sellerDetails.city || '');
      formDataPayload.append('Address', sellerDetails.village || '');

      // Append VehicleMedia (images)
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

      // Append CustomerMedia (documents)
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

      // console.log('Upload payload:', {
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
      //   Type: 1,
      //   VehicleStatus: parseInt(formData.status) || 0,
      //   CustomerName: sellerDetails.name || '',
      //   PhoneNumber: sellerDetails.phone || '',
      //   Address: sellerDetails.village || '',
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

      // console.log('API Response:', JSON.stringify(response.data, null, 2));

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        return response.data;
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Failed to upload vehicle purchase data.';
      console.error('Upload Error:', errorMessage, err.response?.data);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadData, isLoading, error, success };
};

export default useUploadVehiclePurchaseData;