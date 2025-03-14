import { useState } from "react";
import { useRouter } from "next/router";
import authService from "@/services/authService";
import useAuth from "@/hooks/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await authService.login({ username, password });
      // data conține { token, role }
      // Construim userData
      const userData = { username, role: data.role };
      login(userData, data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Eroare la login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold">Autentificare</h2>
      <form onSubmit={handleLogin} className="flex flex-col space-y-4 mt-4">
        <input
          type="text"
          placeholder="Nume utilizator"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="border p-2"
        />
        <input
          type="password"
          placeholder="Parolă"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="bg-blue-500 text-white p-2">
          Conectează-te
        </button>
      </form>
    </div>
  );
}
