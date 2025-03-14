"use client";

import "../styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { useEffect } from "react";
import axios from "axios";
import useAuth from "@/hooks/useAuth";

export const metadata = {
  title: "Genesis ERP",
  description: "ERP solution for Genesis Marketing and Distribution",
};

function AuthRehydrator({ children }) {
  const { login } = useAuth();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get("/api/auth/me", { withCredentials: true });
        login({ username: res.data.username, role: res.data.role }, null);
      } catch (error) {
        console.log("User not authenticated");
      }
    }
    fetchUser();
  }, [login]);

  return children;
}

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body>
        <AuthProvider>
          <AuthRehydrator>{children}</AuthRehydrator>
        </AuthProvider>
      </body>
    </html>
  );
}
