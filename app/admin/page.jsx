"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import CreateUserModal from "@/components/Modals/CreateUserModal";
import Loader from "@/components/Loader";
import { createUser } from "@/services/userService";

export default function AdminPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (
      !loading &&
      (!isAuthenticated || !["Admin", "Administrator"].includes(user?.role))
    ) {
      router.push("/no-access");
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading) {
    return <Loader />;
  }
  if (!isAuthenticated || !["Admin", "Administrator"].includes(user?.role)) {
    return null;
  }

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Extragem datele din formular cu FormData
    const form = e.target;
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      await createUser(data);
      setSuccess("Utilizator creat cu succes!");
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.msg || "Eroare la crearea utilizatorului");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Panel</h1>
      <p>Gestionați utilizatorii și rolurile.</p>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <button onClick={handleOpenModal} className="bg-blue-500 text-white p-2">
        Crează Utilizator
      </button>
      {modalOpen && (
        <CreateUserModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          onSubmit={handleUserSubmit}
        />
      )}
    </div>
  );
}
