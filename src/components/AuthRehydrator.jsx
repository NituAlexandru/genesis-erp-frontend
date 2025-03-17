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
        console.log("Fetched user data:", res.data);
        // Decodăm direct datele din token (rolul este deja numele rolului)
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
        login(null, null);
      }
    }
    fetchUser();
  }, [login]);

  return children;
}
