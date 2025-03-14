"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // noul router
import authService from "@/services/authService";
import useAuth from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await authService.login({ username, password });
      login({ username, role: data.role }, data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Eroare la login");
    }
  };

  return (
    <div>
      <h2>Autentificare</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Nume utilizator"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Parola"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p>{error}</p>}
        <button type="submit">Conectează-te</button>
      </form>
    </div>
  );
}
