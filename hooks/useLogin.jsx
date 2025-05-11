import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'https://fanfliks.onrender.com/api';

// Utility to decode JWT payload (base64 decode)
const decodeJwtPayload = (token) => {
  try {
    const base64Url = token.split('.')[1]; // Get payload part
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('Failed to decode JWT:', err.message);
    return null;
  }
};

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async ({ email, password }, retries = 3) => {
    setLoading(true);
    setError(null);

    for (let attempt = 1; attempt <= retries; attempt++) {
      let response = null;
      let responseData = null;
      let responseText = ''; // Initialize responseText

      try {
        const payload = {
          email,
          password,
          source: '2', // Explicitly set source to "2"
        };

        console.log('Sending Login Request:', {
          url: `${BASE_URL}/User/login`, // Lowercase 'login'
          payload,
          attempt,
        });

        response = await fetch(`${BASE_URL}/User/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        // Log response status and headers
        console.log('Response Status:', response.status, 'Headers:', {
          contentType: response.headers.get('content-type'),
          contentLength: response.headers.get('content-length'),
        });

        // Read response text
        try {
          responseText = await response.text();
          console.log('Raw Response Text:', responseText || 'Empty');
        } catch (textErr) {
          console.warn('Failed to read response text:', textErr.message);
          throw new Error('Unable to read response');
        }

        // Parse response if present
        if (responseText) {
          try {
            responseData = JSON.parse(responseText);
            console.log('Parsed Response Data:', responseData);
          } catch (jsonErr) {
            console.warn('Failed to parse JSON:', jsonErr.message, 'Response Text:', responseText);
            throw new Error(`Invalid JSON response: ${jsonErr.message}`);
          }
        } else {
          console.warn('Empty response body from /User/login');
          responseData = {};
        }

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Invalid credentials');
          }
          throw new Error(
            responseData?.message || `Login failed (Status: ${response.status})`
          );
        }

        // Validate required fields (soft validation)
        const { accessToken, userToken, userId } = responseData;
        if (!accessToken || !userToken || !userId) {
          console.warn('Missing required fields in response:', {
            hasAccessToken: !!accessToken,
            hasUserToken: !!userToken,
            hasUserId: !!userId,
          });
        }

        // Decode JWT to get FirstLogin
        let firstLogin = 'False';
        if (accessToken) {
          const decodedPayload = decodeJwtPayload(accessToken);
          if (decodedPayload && decodedPayload.FirstLogin) {
            firstLogin = decodedPayload.FirstLogin;
          } else {
            console.warn('Failed to extract FirstLogin from accessToken:', decodedPayload);
          }
        }

        // Store available data in SecureStore
        const storePromises = [];
        if (accessToken) storePromises.push(SecureStore.setItemAsync('accessToken', accessToken));
        if (userToken) storePromises.push(SecureStore.setItemAsync('userToken', userToken));
        if (userId) storePromises.push(SecureStore.setItemAsync('userId', userId));
        storePromises.push(SecureStore.setItemAsync('firstLogin', firstLogin));

        await Promise.all(storePromises);

        console.log('Stored in SecureStore:', {
          accessToken: accessToken ? accessToken.slice(0, 10) + '...' : 'Missing',
          userToken: userToken ? userToken.slice(0, 10) + '...' : 'Missing',
          userId: userId || 'Missing',
          firstLogin,
        });

        // Include firstLogin in responseData
        responseData.firstLogin = firstLogin;

        console.log('Login Successful:', responseData);
        setLoading(false);
        return responseData;
      } catch (err) {
        console.error('Login Error:', {
          message: err.message,
          status: response?.status || 'No response',
          responseText: responseText || 'No response text',
          attempt,
        });

        if (attempt < retries) {
          console.log(`Retrying login (${attempt + 1}/${retries})...`);
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
          continue;
        }

        const errorMessage = err.message || 'An error occurred during login';
        setLoading(false);
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    }
  };

  return { login, loading, error };
};

export default useLogin;