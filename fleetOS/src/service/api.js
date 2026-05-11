import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1', // Now you only need to write '/auth/verify' instead of the full path
});

// REQUEST INTERCEPTOR: Automatically attach the JWT to every request
api.interceptors.request.use(
  (config) => {
    const tokenCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='));

    if (tokenCookie) {
      const tokenValue = decodeURIComponent(tokenCookie.split('=')[1]);
      config.headers.Authorization = tokenValue;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR: Centralized Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the backend returns 401 (Unauthorized), the token is likely expired
    if (error.response && error.response.status === 401) {
      console.error("Session expired. Redirecting to login...");
      
      // Clear the invalid cookie
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      // Force redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;