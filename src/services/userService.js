import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

export const createUser = async (userData) => {
  const res = await api.post("/api/users", userData);
  console.log(res.data);
  return res.data;
};

export const getUserByUsername = async (username) => {
  const res = await api.get(`/api/users/username/${username}`);
  return res.data;
};

export const updateUser = async (userId, updatedData) => {
  const res = await api.put(`/api/users/${userId}`, updatedData);
  return res.data;
};

export const deleteUser = async (userId) => {
  const res = await api.delete(`/api/users/${userId}`);
  return res.data;
};

export default { createUser, getUserByUsername, updateUser, deleteUser };
