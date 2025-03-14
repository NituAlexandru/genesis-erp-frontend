import api from "./api";

const authService = {
  login: async ({ username, password }) => {
    const response = await api.post("/auth/login", { username, password });
    return response.data;
    // { token, role }
  },
};

export default authService;
