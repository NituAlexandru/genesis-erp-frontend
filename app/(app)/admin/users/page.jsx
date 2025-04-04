"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth"; // Asigură calea corectă
import CreateUserModal from "@/components/Modals/CreateUserModal"; // Asigură calea corectă
import EditUserModal from "@/components/Modals/EditUserModal"; // Asigură calea corectă
import DeleteUserModal from "@/components/Modals/DeleteUserModal"; // Asigură calea corectă
import Loader from "@/components/Loader/Loader"; // Asigură calea corectă
import Notiflix from "notiflix";
import styles from "./Users.module.css";

export default function UsersAdminPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // --- Verificare Rol Admin ---
  useEffect(() => {
    if (
      !loading &&
      (!isAuthenticated || !["Admin", "Administrator"].includes(user?.role))
    ) {
      router.push("/no-access");
    }
  }, [isAuthenticated, user, loading, router]);

  // Afișare loader sau null până la verificarea completă
  if (loading) {
    return <Loader />;
  }
  if (!isAuthenticated || !["Admin", "Administrator"].includes(user?.role)) {
    return null;
  }

  // --- Handlere Modale (preluate din AdminPage vechi) ---
  const handleOpenCreateModal = () => setCreateModalOpen(true);
  const handleCloseCreateModal = () => setCreateModalOpen(false);
  const handleOpenEditModal = () => setEditModalOpen(true);
  const handleCloseEditModal = () => setEditModalOpen(false);
  const handleOpenDeleteModal = () => setDeleteModalOpen(true);
  const handleCloseDeleteModal = () => setDeleteModalOpen(false);

  const handleModalSuccess = (message) => {
    Notiflix.Notify.success(message || "Operație reușită!");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Management Utilizatori</h2>
      <p className={styles.description}>
        Gestionați utilizatorii aplicației, rolurile și permisiunile acestora.
      </p>

      <div className={styles.buttonGroup}>
        <button onClick={handleOpenCreateModal} className={styles.createButton}>
          Crează Utilizator Nou
        </button>
        <button onClick={handleOpenEditModal} className={styles.editButton}>
          Modifică Utilizator Existent
        </button>
        <button onClick={handleOpenDeleteModal} className={styles.deleteButton}>
          Șterge Utilizator
        </button>
      </div>

      {/* Adăuga un tabel sau o listă de utilizatori în viitor */}
      {/* <UserListTable /> */}

      {createModalOpen && (
        <CreateUserModal
          isOpen={createModalOpen}
          onClose={handleCloseCreateModal}
          onSuccess={handleModalSuccess}
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
