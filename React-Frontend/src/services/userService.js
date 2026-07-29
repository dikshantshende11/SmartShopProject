import axiosInstance from "../api/axiosConfig";

export const fetchAllUsers = async () => {
  const response = await axiosInstance.get("/api/users");
  return response.data;
};

export const updateUserRole = async (id, role) => {
  const response = await axiosInstance.put(`/api/users/${id}/role`, { role });
  return response.data;
};
