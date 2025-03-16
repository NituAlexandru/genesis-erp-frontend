"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // Dacă userul este deja logat, facem redirect imediat la /dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);

    try {
      // Folosește URL-ul backendului din environment
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
        { username, password },
        { withCredentials: true }
      );
      // Răspunsul conține { token, role }
      login({ username, role: res.data.role }, res.data.token);
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
