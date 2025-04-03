"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import Loader from "@/components/Loader/Loader";
import Notiflix from "notiflix";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const router = useRouter();
  // Preluăm starea și funcțiile necesare din context
  const { login, loading: authLoading, isAuthenticated } = useAuth();

  // Stări locale pentru formular și starea de submit
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // --- Efect pentru Redirecționare ---
  useEffect(() => {
    // Redirecționează către dashboard DOAR dacă:
    // - Contextul nu mai încarcă (authLoading === false) ȘI
    // - Userul este autentificat (isAuthenticated === true)
    if (!authLoading && isAuthenticated) {
      console.log("LoginPage: Already authenticated, redirecting...");
      router.replace("/dashboard"); // Folosește replace pentru a nu adăuga login în istoric
    }
    // Dependențe: rulează când starea de încărcare sau autentificare se schimbă
  }, [authLoading, isAuthenticated, router]);

  // --- Afișare Loader ---
  // Afișăm loader dacă contextul global încă încarcă SAU dacă userul este deja autentificat
  // (caz în care așteptăm ca useEffect de mai sus să facă redirectarea)
  if (authLoading || (!authLoading && isAuthenticated)) {
    console.log(
      "LoginPage: Showing Loader (authLoading:",
      authLoading,
      ", isAuthenticated:",
      isAuthenticated,
      ")"
    );
    return <Loader />;
  }

  // --- Handler pentru Submit Formular ---
  const handleLogin = async (e) => {
    e.preventDefault(); // Previne reîncărcarea paginii
    if (isSubmitting) return; // Previne dublu submit

    setIsSubmitting(true); // Blochează formularul
    Notiflix.Loading.standard("Se autentifică..."); // Indicator vizual

    try {
      console.log(`LoginPage: Attempting login for user: ${username}`);
      // Apel API către backend pentru login
      const response = await axios.post(
        `${BASE_URL}/api/auth/login`,
        { username, password },
        { withCredentials: true } // Esențial pentru gestionarea cookie-urilor
      );

      console.log(
        "LoginPage: Login API call successful. Response data:",
        response.data
      );
      // Extrage datele userului din răspunsul API
      // Backend-ul NU mai trimite token-ul în body
      const userData = {
        userId: response.data.userId,
        username: response.data.username,
        role: response.data.role,
        permissions: response.data.permissions || [],
      };

      // Apelăm funcția `login` din context cu datele primite
      login(userData);

      Notiflix.Loading.remove();
      Notiflix.Notify.success("Autentificare reușită! Redirecționare...");
    } catch (error) {
      setIsSubmitting(false); // Deblochează formularul
      Notiflix.Loading.remove();
      const errorMessage =
        error.response?.data?.msg ||
        "Eroare de autentificare. Verificați datele.";
      console.error("LoginPage: Login failed.", error.response || error);
      Notiflix.Notify.failure(errorMessage);
    }
  };

  // --- Render Formular ---
  console.log("LoginPage: Rendering login form.");
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Autentificare</h3>
      <form onSubmit={handleLogin} className={styles.form} noValidate>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="username">
            Nume utilizator
          </label>
          <input
            id="username"
            className={styles.input}
            type="text"
            placeholder="Introduceți numele de utilizator"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            disabled={isSubmitting}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="password">
            Parola
          </label>
          <input
            id="password"
            className={styles.input}
            type="password"
            placeholder="Introduceți parola"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={isSubmitting}
          />
        </div>
        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? "Se conectează..." : "Conectează-te"}
        </button>
      </form>
    </div>
  );
}
