import axios from "axios";
import { getToken, removeToken } from "./auth";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

api.interceptors.request.use(config => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      removeToken();
      window.location.reload();
    }
    return Promise.reject(err);
  }
);

export default api;
