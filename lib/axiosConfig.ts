import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  response => response,
  async error => {
    const status = error.response ? error.response.status : null;
    if (status === 401) {
      try {
        await api.post('/auth/refresh');
        return axios(error.config);
      } catch (e: any) {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
)
