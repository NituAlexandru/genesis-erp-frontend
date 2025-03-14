"use client";

import { createContext, useState, useCallback } from "react";

const AuthContext = createContext({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); //{username, role}
  const [token, setToken] = useState(null); // token JWT

  const login = useCallback((userData, tokenValue) => {
    setUser(userData);
    setToken(tokenValue);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
  }, []);

  const isAuthenticated = !!token;

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
