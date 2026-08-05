import axios from "axios";

// =============================================
// PRODUCTION: Railway Cloud Backend Services
// =============================================
const PROD_USER_URL    = "https://smartshop-user-service.onrender.com";
const PROD_PRODUCT_URL = "https://smartshop-product-service.onrender.com";
const PROD_ORDER_URL   = "https://smartshop-order-service.onrender.com";

const axiosInstance = axios.create({
  timeout: 60000, // 60s timeout for Render free tier cold starts
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

    if (!isLocal) {
      const path = config.url || "";
      if (path.startsWith("/api/products")) {
        config.baseURL = PROD_PRODUCT_URL;
      } else if (path.startsWith("/api/orders")) {
        config.baseURL = PROD_ORDER_URL;
      } else {
        config.baseURL = PROD_USER_URL;
      }
    } else {
      config.baseURL = "http://localhost:8080";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

    if (
      isLocal &&
      (error.code === "ECONNABORTED" ||
        error.message?.includes("Network Error") ||
        error.response?.status === 503) &&
      !originalRequest._retryDirect
    ) {
      originalRequest._retryDirect = true;
      const url = originalRequest.url || "";

      const DIRECT_PORT_MAP = {
        "/api/users":    8081,
        "/api/products": 8082,
        "/api/orders":   8083,
      };

      for (const [prefix, port] of Object.entries(DIRECT_PORT_MAP)) {
        if (url.includes(prefix)) {
          console.warn(`Gateway offline. Retrying directly on port ${port}: ${url}`);
          originalRequest.baseURL = `http://localhost:${port}`;
          return axiosInstance(originalRequest);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;