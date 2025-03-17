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

// Alte funcții: getUser, updateUser, deleteUser.
export default { createUser };
