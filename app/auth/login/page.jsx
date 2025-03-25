"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import Loader from "@/components/Loader/Loader";
import Notiflix from "notiflix";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (loading) {
    return <Loader />;
  }

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
        { username, password },
        { withCredentials: true }
      );

      login(
        { username, role: res.data.role, permissions: res.data.permissions },
        res.data.token
      );
      router.push("/dashboard");
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Login failed";
      Notiflix.Notify.failure(errorMessage);
    }
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Autentificare</h3>
      <form onSubmit={handleLogin} className={styles.form}>
        <label className={styles.label} htmlFor="username">
          Nume utilizator
        </label>
        <input
          id="username"
          className={styles.input}
          type="text"
          placeholder="Nume utilizator"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label className={styles.label} htmlFor="password">
          Parola
        </label>
        <input
          id="password"
          className={styles.input}
          type="password"
          placeholder="Parola"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className={styles.button}>
          Conectează-te
        </button>
      </form>
    </div>
  );
}
