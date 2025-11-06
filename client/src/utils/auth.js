    // client/src/utils/auth.js
    import axios from 'axios';
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            
    //  = 'http://localhost:5000'; // Adjust as needed

    export const telegramLogin = async (telegramData) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/telegram-login`, telegramData);
        return response.data; // Should contain the JWT token
      } catch (error) {
        console.error('Telegram login error:', error);
        throw error; // Re-throw the error for handling in the component
      }
    };

    export const adminLogin = async (username, password) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/admin-login`, { username, password });
        return response.data; // Should contain the JWT token
      } catch (error) {
        console.error('Admin login error:', error);
        throw error; // Re-throw the error for handling in the component
      }
    };

    export const setAuthToken = (token) => {
      localStorage.setItem('authToken', token);  // or sessionStorage
    };

    export const getAuthToken = () => {
      return localStorage.getItem('authToken'); // or sessionStorage
    };

    export const clearAuthToken = () => {
      localStorage.removeItem('authToken');  // or sessionStorage
    };

    export const isAuthenticated = () => {
      return !!getAuthToken();
    };

    // Function to make authenticated requests
    export const makeAuthenticatedRequest = async (url, options = {}) => {
        const token = getAuthToken();
        if (!token) {
            throw new Error('No authentication token found');
        }

        const headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
        };

        try {
            const response = await axios(url, { ...options, headers });
            return response.data;
        } catch (error) {
            // Handle 401/403 errors (e.g., redirect to login)
            console.error('Authenticated request error:', error);
            throw error;
        }
    };
// client/src/utils/auth.js

export const checkAuth = async (userId) => {
  try {
    const res = await fetch(`/api/auth/check?userId=${userId}`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    }
    return await res.json(); // ← если здесь ошибка — значит, сервер вернул не JSON
  } catch (err) {
    console.error('Auth check failed:', err);
    throw err; // чтобы App.js знал, что авторизация не удалась
  }
};
