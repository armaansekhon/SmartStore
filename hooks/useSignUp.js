import { useState } from 'react';
import axios from 'axios';

const BASE_URL = 'https://fanfliks.onrender.com/api';

const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signUp = async (payload) => {
    setLoading(true);
    setError(null);

    try {
      // Log payload for debugging
      console.log('SignUp Payload:', payload);

      const response = await axios.post(`https://fanfliks.onrender.com/api/User/SignUp`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 seconds timeout
      });

      // Log response status and data for debugging
      console.log('Response Status:', response.status, 'Body:', response.data);

      setLoading(false);
      return response.data;
    } catch (err) {
      // Log full error details
      console.error('SignUp Error:', err.message, err.response?.data || err);
      
      let errorMessage = 'Sign-up failed';
      if (err.response) {
        // Server responded with a status code outside 2xx
        errorMessage = err.response.data?.message || err.message || 'Sign-up failed';
      } else if (err.request) {
        // Request was made but no response received (e.g., timeout, network error)
        errorMessage = 'Network error: Unable to reach the server';
      } else {
        // Other errors (e.g., request setup error)
        errorMessage = err.message || 'An error occurred during sign-up';
      }

      setLoading(false);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return { signUp, loading, error };
};

export default useSignUp;