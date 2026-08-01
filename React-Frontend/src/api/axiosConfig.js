import axios from "axios";

// Production: Railway backend | Development: localhost
const PROD_URL = "https://smartshopproject-production.up.railway.app";
const DEV_URL = "http://localhost:8080";

const isProduction = import.meta.env.PROD;
const BASE_URL = isProduction ? PROD_URL : DEV_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15 seconds timeout (cloud is slower than localhost)
  headers: {
    "Content-Type": "application/json",
  },
});

// Port mapping for local development fallback when API gateway (8080) is offline
const DIRECT_PORT_MAP = {
  "/api/users": 8081,
  "/api/products": 8082,
  "/api/orders": 8083,
};

// Request interceptor to automatically add the Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Fallback to direct service ports in LOCAL DEV if Gateway (8080) fails
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only fallback to direct ports in local dev mode
    if (
      !isProduction &&
      (error.code === "ECONNABORTED" || error.message?.includes("Network Error") || error.response?.status === 503) &&
      !originalRequest._retryDirect
    ) {
      originalRequest._retryDirect = true;
      const url = originalRequest.url || "";

      for (const [prefix, port] of Object.entries(DIRECT_PORT_MAP)) {
        if (url.startsWith(prefix)) {
          console.warn(`Gateway (8080) offline. Retrying directly on port ${port}: ${url}`);
          originalRequest.baseURL = `http://localhost:${port}`;
          return axiosInstance(originalRequest);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;