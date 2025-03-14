import { useState } from "react";
import { useRouter } from "next/router";
import api from "@/services/api";
import useAuth from "@/hooks/useAuth";
import Layout from "@/components/Layout";

export default function CreateUserPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    role: "Agent Vânzări",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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

  if (!isAuthenticated || user?.role !== "Administrator") {
    router.push("/dashboard");
    return null;
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
