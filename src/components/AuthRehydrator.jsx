"use client";

import { useEffect } from "react";
import axios from "axios";
import useAuth from "@/hooks/useAuth";

export default function AuthRehydrator({ children }) {
  const { login, user } = useAuth();

  useEffect(() => {
    // Dacă avem deja user, nu rehidrata
    if (user) return;

    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    async function fetchUser() {
      try {
        const res = await axios.get(`${BASE_URL}/api/auth/me`, {
          withCredentials: true,
        });
        console.log("Fetched user data:", res.data);
        login(
          {
            username: res.data.username,
            role: res.data.role,
            permissions: res.data.permissions,
          },
          null
        );
      } catch (error) {
        console.error("Error fetching user:", error);
        // Dacă nu reușești să recuperezi userul, apelezi login cu null
        login(null, null);
      }
    }
    fetchUser();
  }, [login, user]);

  return children;
}
