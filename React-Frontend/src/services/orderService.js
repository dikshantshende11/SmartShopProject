import axiosInstance from "../api/axiosConfig";

export const placeOrder = async (orderData) => {
  const response = await axiosInstance.post("/api/orders", orderData);
  return response.data;
};

export const fetchAllOrders = async () => {
  const response = await axiosInstance.get("/api/orders");
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await axiosInstance.delete(`/api/orders/${id}`);
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await axiosInstance.put(`/api/orders/${id}/status`, { status });
  return response.data;
};


export const cancelOrder = async (id) => {
  const response = await axiosInstance.put(`/api/orders/${id}/cancel`);
  return response.data;
};
