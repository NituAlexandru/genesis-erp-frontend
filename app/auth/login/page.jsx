"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import Loader from "@/components/Loader";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  if (loading) {
    return <Loader />;
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);

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
      setError(err.response?.data?.msg || "Login failed");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Autentificare</h1>
      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", gap: 8 }}
      >
        <input
          type="text"
          placeholder="Nume utilizator"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Parola"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Conectează-te</button>
      </form>
    </div>
  );
}
