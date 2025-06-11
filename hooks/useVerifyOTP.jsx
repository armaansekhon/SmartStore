import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'https://trackinventory-xdex.onrender.com/api';

const useVerifyOTP = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const verifyOTP = async (payload) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Sending OTP Verification Request:', {
        url: `${BASE_URL}/OTP/VerifyOTP`,
        // payload,
      });

      const response = await fetch(`${BASE_URL}/OTP/VerifyOTP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `OTP verification failed (Status: ${response.status})`);
      }

      // Store accessToken in SecureStore
      if (responseData.accessToken ) {
        await SecureStore.setItemAsync('accessToken', responseData.accessToken);
         
        
      
      } else {
        console.warn('No accessToken found in response:', responseData);
      }

      // console.log('OTP Verification Response:', responseData);
      setLoading(false);
      return responseData;
    } catch (err) {
      console.error('OTP Verification Error:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });

      const errorMessage = err.message || 'An error occurred during OTP verification';
      setLoading(false);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const resendOTP = async (payload) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Sending Resend OTP Request:', {
        url: `${BASE_URL}/User/ResendOtp`,
        payload,
      });

      const response = await fetch(`${BASE_URL}/User/ResendOtp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `Failed to resend OTP (Status: ${response.status})`);
      }

      // console.log('Resend OTP Response:', responseData);
      setLoading(false);
      return responseData;
    } catch (err) {
      console.error('Resend OTP Error:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });

      const errorMessage = err.message || 'An error occurred while resending OTP';
      setLoading(false);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return { verifyOTP, resendOTP, loading, error };
};

export default useVerifyOTP;