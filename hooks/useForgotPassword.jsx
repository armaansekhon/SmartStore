import { useState } from 'react';

const BASE_URL = 'https://fanfliks.onrender.com/api';

const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    let responseText = '';

    try {
      const payload = {
        SentTo: email,
        Type: '1',
      };

      console.log('Sending Forgot Password Request:', {
        url: `${BASE_URL}/User/ForgotPassword`,
        method: 'POST',
        payload,
      });

      const response = await fetch(`${BASE_URL}/User/ForgotPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response Status:', response.status);

      responseText = await response.text();
      console.log('Raw Response Text:', responseText || 'Empty');

      if (!response.ok) {
        throw new Error(responseText || `Failed to send OTP (Status: ${response.status})`);
      }

      if (responseText.trim() !== 'true') {
        throw new Error(responseText || 'Failed to send OTP. Server did not return true.');
      }

      console.log('Forgot Password Request Successful');
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Forgot Password Error:', {
        message: err.message,
        responseText: responseText || 'No response text',
      });

      const errorMessage = err.message || 'An error occurred while sending OTP';
      setLoading(false);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return { forgotPassword, loading, error };
};

export default useForgotPassword;