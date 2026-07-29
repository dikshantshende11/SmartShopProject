import axiosInstance from "../api/axiosConfig";

export const registerUser = async (userData) => {
  const response = await axiosInstance.post("/api/users/register", userData);
  return response.data;
};

export const loginUser = async (email, password) => {
  // The backend login controller expects a request body with User fields (email, password)
  const response = await axiosInstance.post("/api/users/login", { email, password });
  return response.data; // This is the plain-text JWT token or "Invalid credentials!"
};

export const fetchUsers = async () => {
  const response = await axiosInstance.get("/api/users");
  return response.data; // List of all User entities
};

export const updateUserProfile = async (id, userData) => {
  const response = await axiosInstance.put(`/api/users/${id}`, userData);
  return response.data;
};
