"use client";

import { useEffect } from "react";
import axios from "axios";
import useAuth from "@/hooks/useAuth";

export default function AuthRehydrator({ children }) {
  const { login } = useAuth();

  useEffect(() => {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    async function fetchUser() {
      try {
        const res = await axios.get(`${BASE_URL}/api/auth/me`, {
          withCredentials: true,
        });
        login({ username: res.data.username, role: res.data.role }, null);
      } catch (error) {
        console.log("User not authenticated");
      }
    }
    fetchUser();
  }, [login]);

  return children;
}
