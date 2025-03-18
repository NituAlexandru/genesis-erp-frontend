"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import CreateUserModal from "@/components/Modals/CreateUserModal";
import EditUserModal from "@/components/Modals/EditUserModal";
import DeleteUserModal from "@/components/Modals/DeleteUserModal";
import Loader from "@/components/Loader";

export default function AdminPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
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

  const handleOpenCreateModal = () => setCreateModalOpen(true);
  const handleCloseCreateModal = () => setCreateModalOpen(false);
  const handleOpenEditModal = () => setEditModalOpen(true);
  const handleCloseEditModal = () => setEditModalOpen(false);
  const handleOpenDeleteModal = () => setDeleteModalOpen(true);
  const handleCloseDeleteModal = () => setDeleteModalOpen(false);


  const handleModalSuccess = (message) => {
    setSuccess(message);
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Gestionați utilizatorii și rolurile.</p>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <div className="flex gap-2">
        <button
          onClick={handleOpenCreateModal}
          className="bg-blue-500 text-white p-2"
        >
          Crează Utilizator
        </button>
        <button
          onClick={handleOpenEditModal}
          className="bg-green-500 text-white p-2"
        >
          Modifică Utilizator
        </button>
        <button
          onClick={handleOpenDeleteModal}
          className="bg-red-500 text-white p-2"
        >
          Șterge Utilizator
        </button>
      </div>
      {createModalOpen && (
        <CreateUserModal
          isOpen={createModalOpen}
          onClose={handleCloseCreateModal}
        />
      )}
      {editModalOpen && (
        <EditUserModal
          isOpen={editModalOpen}
          onClose={handleCloseEditModal}
          onSuccess={handleModalSuccess}
        />
      )}
      {deleteModalOpen && (
        <DeleteUserModal
          isOpen={deleteModalOpen}
          onClose={handleCloseDeleteModal}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
