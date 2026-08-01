import axios from "axios";

// =============================================
// PRODUCTION: Railway Cloud Backend URLs
// =============================================
const PROD_USER_URL    = "https://smartshopproject-production.up.railway.app";
const PROD_PRODUCT_URL = "https://smartshopproject-production-0cfb.up.railway.app";
const PROD_ORDER_URL   = "https://affectionate-enthusiasm-production-4d16.up.railway.app";

const axiosInstance = axios.create({
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — JWT token + bulletproof full URL routing
axiosInstance.interceptors.request.use(
  (config) => {
    // Add Authorization header if token exists
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const hostname = window.location.hostname;
    const isCloud = hostname !== "localhost" && hostname !== "127.0.0.1";

    if (isCloud) {
      const url = config.url || "";
      if (url.startsWith("/api/products")) {
        config.url = `${PROD_PRODUCT_URL}${url}`;
      } else if (url.startsWith("/api/orders")) {
        config.url = `${PROD_ORDER_URL}${url}`;
      } else if (url.startsWith("/api/users")) {
        config.url = `${PROD_USER_URL}${url}`;
      }
    } else {
      if (!config.url.startsWith("http")) {
        config.url = `http://localhost:8080${config.url}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — local dev fallback to direct ports
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const hostname = window.location.hostname;
    const isLocal = hostname === "localhost" || hostname === "127.0.0.1";

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
          originalRequest.url = `http://localhost:${port}${prefix}`;
          return axiosInstance(originalRequest);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;