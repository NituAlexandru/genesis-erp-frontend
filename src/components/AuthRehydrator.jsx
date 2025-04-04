"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "@/hooks/useAuth";
import Loader from "@/components/Loader/Loader";

export default function AuthRehydrator({ children }) {
  const { login, logout, user, loading: authLoading } = useAuth();
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    let isMounted = true;

    const attemptRehydration = async () => {
      // Sarim peste rehidratare DOAR dacă userul există deja în context.
      if (user) {
        // Dacă sărim, înseamnă că starea e deja 'hidratată', deci nu mai 'rehidratăm local'
        return;
      }

      try {
        const meResponse = await axios.get(`${BASE_URL}/api/auth/me`, {
          withCredentials: true,
        });
        if (isMounted) {
          login(meResponse.data);
        }
      } catch (meError) {
        if (meError.response?.data?.code === "TOKEN_EXPIRED") {
          try {
            await axios.post(
              `${BASE_URL}/api/auth/refresh`,
              {},
              { withCredentials: true }
            );

            const meResponseAfterRefresh = await axios.get(
              `${BASE_URL}/api/auth/me`,
              {
                withCredentials: true,
              }
            );

            if (isMounted) {
              login(meResponseAfterRefresh.data);
            }
          } catch (refreshError) {
            if (isMounted) {
              logout();
            }
          }
        } else {
          if (isMounted) {
            logout();
          }
        }
      }
    };

    attemptRehydration();

    return () => {
      isMounted = false;
    };
    // Dependențele: Rulează când contextul se schimbă (user, login, logout)
    // pentru a re-evalua dacă trebuie sărit peste rehidratare.
  }, [user, login, logout, BASE_URL]);
  // Afișăm Loader DOAR pe baza stării de loading din contextul global.
  // AuthRehydrator este responsabil pentru a se asigura că această stare
  // ajunge eventual la 'false' prin apelarea login() sau logout().
  if (authLoading) {
    return <Loader />;
  }

  return children;
}
