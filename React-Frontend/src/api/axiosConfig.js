import axios from "axios";

// =============================================
// PRODUCTION: Railway Cloud Backend URLs
// =============================================
const PROD_USER_URL    = "https://smartshopproject-production.up.railway.app";
const PROD_PRODUCT_URL = "https://smartshopproject-production-0cfb.up.railway.app";
const PROD_ORDER_URL   = "https://affectionate-enthusiasm-production-4d16.up.railway.app";

// =============================================
// DEVELOPMENT: Local backend URLs
// =============================================
const DEV_URL = "http://localhost:8080";
const DIRECT_PORT_MAP = {
  "/api/users":    8081,
  "/api/products": 8082,
  "/api/orders":   8083,
};

const isProduction = import.meta.env.PROD;

// Create axios instance (default: user service in prod, gateway in dev)
const axiosInstance = axios.create({
  baseURL: isProduction ? PROD_USER_URL : DEV_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — JWT token + smart URL routing in production
axiosInstance.interceptors.request.use(
  (config) => {
    // Add Authorization header if token exists
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // In PRODUCTION: route to correct Railway service based on URL path
    if (isProduction) {
      const url = config.url || "";
      if (url.startsWith("/api/products")) {
        config.baseURL = PROD_PRODUCT_URL;
      } else if (url.startsWith("/api/orders")) {
        config.baseURL = PROD_ORDER_URL;
      } else {
        config.baseURL = PROD_USER_URL;
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

    if (
      !isProduction &&
      (error.code === "ECONNABORTED" ||
        error.message?.includes("Network Error") ||
        error.response?.status === 503) &&
      !originalRequest._retryDirect
    ) {
      originalRequest._retryDirect = true;
      const url = originalRequest.url || "";

      for (const [prefix, port] of Object.entries(DIRECT_PORT_MAP)) {
        if (url.startsWith(prefix)) {
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