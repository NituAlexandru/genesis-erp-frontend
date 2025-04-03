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
        console.log(
          "AuthRehydrator: Skipping rehydration (user already exists in context)."
        );
        // Dacă sărim, înseamnă că starea e deja 'hidratată', deci nu mai 'rehidratăm local'
        return;
      }
      // -----------------------
      console.log(
        "AuthRehydrator: Attempting rehydration (user not found in context)..."
      );

      try {
        console.log("AuthRehydrator: Calling /api/auth/me");
        const meResponse = await axios.get(`${BASE_URL}/api/auth/me`, {
          withCredentials: true,
        });

        if (isMounted) {
          console.log(
            "AuthRehydrator: /me successful. User data:",
            meResponse.data
          );
          login(meResponse.data);
        }
      } catch (meError) {
        console.warn(
          "AuthRehydrator: /me failed.",
          meError.response?.data?.msg || meError.message
        );

        if (meError.response?.data?.code === "TOKEN_EXPIRED") {
          console.log(
            "AuthRehydrator: Access token expired. Attempting refresh..."
          );
          try {
            console.log("AuthRehydrator: Calling /api/auth/refresh");
            await axios.post(
              `${BASE_URL}/api/auth/refresh`,
              {},
              { withCredentials: true }
            );

            console.log("AuthRehydrator: Refresh successful. Retrying /me...");
            const meResponseAfterRefresh = await axios.get(
              `${BASE_URL}/api/auth/me`,
              {
                withCredentials: true,
              }
            );

            if (isMounted) {
              console.log(
                "AuthRehydrator: Second /me successful. User data:",
                meResponseAfterRefresh.data
              );
              login(meResponseAfterRefresh.data);
            }
          } catch (refreshError) {
            console.error(
              "AuthRehydrator: Refresh failed.",
              refreshError.response?.data?.msg || refreshError.message
            );
            if (isMounted) {
              logout();
            }
          }
        } else {
          console.log(
            "AuthRehydrator: /me failed for other reason. Assuming logged out."
          );
          if (isMounted) {
            logout();
          }
        }
      }
    };

    attemptRehydration();

    return () => {
      isMounted = false;
      console.log("AuthRehydrator: Component unmounted.");
    };
    // Dependențele: Rulează când contextul se schimbă (user, login, logout)
    // pentru a re-evalua dacă trebuie sărit peste rehidratare.
  }, [user, login, logout, BASE_URL]);
  // Afișăm Loader DOAR pe baza stării de loading din contextul global.
  // AuthRehydrator este responsabil pentru a se asigura că această stare
  // ajunge eventual la 'false' prin apelarea login() sau logout().
  if (authLoading) {
    console.log(
      "AuthRehydrator: Showing Loader (authLoading from context is true)"
    );
    return <Loader />;
  }

  console.log("AuthRehydrator: Rendering children (authLoading is false).");
  return children;
}
