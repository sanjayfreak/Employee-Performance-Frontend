import axios from "axios";
import { getToken, logout } from "./auth";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://employee-performance-backend-t6nd.onrender.com",
  headers: { "Content-Type": "application/json" },
});

/* Attach the signed token to every request. The backend is stateless —
   without this header every protected endpoint returns 401. */
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Token missing, expired or rejected — send them back to sign in.
    if (status === 401 && !window.location.pathname.match(/^\/(register)?$/)) {
      logout();
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

/** Pulls a readable message out of whatever the backend returned. */
export const apiMessage = (error, fallback) => {
  const data = error?.response?.data;
  if (typeof data === "string" && data.trim()) return data;
  if (data?.message) return data.message;
  return fallback;
};

export default api;
