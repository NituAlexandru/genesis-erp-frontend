"use client";

import { createContext, useState, useCallback } from "react";

const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // {username, role}
  const [token, setToken] = useState(null); // token JWT
  const [loading, setLoading] = useState(true);

  const login = useCallback((userData, tokenValue) => {
    // console.log(
    //   "AuthContext.login called with:",
    //   userData,
    //   "Token Value is:",
    //   tokenValue
    // );
    setUser(userData);
    setToken(tokenValue);
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    console.log("AuthContext.logout called");
    setUser(null);
    setToken(null);
    setLoading(false);
  }, []);

  const isAuthenticated = Boolean(user);

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  // console.log("Value:", value);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
