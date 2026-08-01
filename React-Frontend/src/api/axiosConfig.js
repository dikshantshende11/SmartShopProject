import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 6000, // 6 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Port mapping for fallback when API gateway (8080) is offline
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

// Response interceptor: Fallback to direct service ports if Gateway (8080) fails/times out
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if network error or gateway failure, and request hasn't been retried yet
    if (
      (error.code === "ECONNABORTED" || error.message?.includes("Network Error") || error.response?.status === 503) &&
      !originalRequest._retryDirect
    ) {
      originalRequest._retryDirect = true;
      const url = originalRequest.url || "";

      for (const [prefix, port] of Object.entries(DIRECT_PORT_MAP)) {
        if (url.startsWith(prefix)) {
          console.warn(`Gateway (8080) offline. Retrying request directly on port ${port}: ${url}`);
          originalRequest.baseURL = `http://localhost:${port}`;
          return axiosInstance(originalRequest);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;