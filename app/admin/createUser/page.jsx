"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import useAuth from "@/hooks/useAuth";

export default function CreateUserPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    role: "Agent Vânzări", // Default, dar poate fi selectat și alt rol, în funcție de permisiuni
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (
      !loading &&
      (!isAuthenticated ||
        !user ||
        !["Admin", "Administrator"].includes(user.role))
    ) {
      router.push("/no-access");
    }
  }, [isAuthenticated, user, loading, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const res = await api.post("/auth/create-user", formData);
      setSuccess("Utilizator creat cu succes!");
    } catch (err) {
      setError(err.response?.data?.msg || "Eroare la crearea utilizatorului");
    }
  };

  // Dacă încă se rehidratează sau userul nu e autorizat, afișează loader sau returnează null
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Creare Utilizator</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <input
          name="username"
          type="text"
          placeholder="Nume utilizator"
          value={formData.username}
          onChange={handleChange}
          required
          className="border p-2"
        />
        <input
          name="name"
          type="text"
          placeholder="Nume real"
          value={formData.name}
          onChange={handleChange}
          required
          className="border p-2"
        />
        <input
          name="email"
          type="email"
          placeholder="Email (opțional)"
          value={formData.email}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Parola"
          value={formData.password}
          onChange={handleChange}
          required
          className="border p-2"
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="border p-2"
        >
          <option value="Administrator">Administrator</option>
          <option value="Admin">Admin</option>
          <option value="Agent Vânzări">Agent Vânzări</option>
          <option value="Șofer">Șofer</option>
          <option value="Manipulator Depozit">Manipulator Depozit</option>
        </select>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <button type="submit" className="bg-blue-500 text-white p-2">
          Crează Utilizator
        </button>
      </form>
    </Layout>
  );
}
