import axiosInstance from "../api/axiosConfig";

export const fetchAllProducts = async () => {
  const response = await axiosInstance.get("/api/products");
  return response.data;
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