import axiosInstance from "../api/axiosConfig";

const PROD_PRODUCT_URL = "https://smartshopproject-production-0cfb.up.railway.app";

export const fetchAllProducts = async () => {
  try {
    const response = await axiosInstance.get("/api/products");
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data && Array.isArray(response.data.content)) {
      return response.data.content;
    }
  } catch (error) {
    console.warn("Axios fetch failed, trying direct cloud fetch fallback:", error);
  }

  // Cloud direct fetch fallback
  try {
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const targetUrl = isLocal ? "http://localhost:8082/api/products" : `${PROD_PRODUCT_URL}/api/products`;
    
    const res = await fetch(targetUrl);
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : (data.content || []);
    }
  } catch (directErr) {
    console.error("Direct fetch error:", directErr);
  }

  return [];
};

export const addProduct = async (productData) => {
  const response = await axiosInstance.post("/api/products", productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await axiosInstance.put(`/api/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axiosInstance.delete(`/api/products/${id}`);
  return response.data;
};