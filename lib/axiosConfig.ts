import axios from "axios";
import { getCookie, setCookie } from "cookies-next";

interface refreshTokenResponse {
  message: string;
  access_token: string;
}

const refreshAxios = axios.create({
  // baseURL: "http://localhost:8000/api/v1",
  baseURL: "https://checkmate-api-xfgf.onrender.com/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

export const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  // baseURL: "https://checkmate-api-xfgf.onrender.com/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use(
  config => {
    const token = getCookie('cm_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  async error => {
    const status = error.response ? error.response.status : null;
    
    if (status === 401 && !error.config._isRetry) {
      try {
        // Mark this request as a retry attempt
        error.config._isRetry = true;
        
        const refresh_token = getCookie('cm_refresh_token');
        // Use the separate axios instance to avoid triggering the interceptor again
        const response = await refreshAxios.post<refreshTokenResponse>('/auth/refresh', { refresh_token });
        const access_token = response.data.access_token;
        setCookie('cm_access_token', access_token);
        
        // Update the original request with the new token
        error.config.headers.Authorization = `Bearer ${access_token}`;
        
        // Retry the original request with the new token
        return axios(error.config);
      } catch (e) {
        // Redirect to login page when refresh token fails
        window.location.href = '/login';
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);