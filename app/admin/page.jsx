"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import CreateUserModal from "@/components/Modals/CreateUserModal";
import EditUserModal from "@/components/Modals/EditUserModal";
import DeleteUserModal from "@/components/Modals/DeleteUserModal";
import Loader from "@/components/Loader/Loader";
import Notiflix from "notiflix";
import AdminVatSettings from "@/components/AdminComponents/AdminVatSettings";
import ProductMarkupTable from "@/components/AdminComponents/ProductMarkupTable";
import styles from "./AdminPage.module.css";

export default function AdminPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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
    Notiflix.Notify.success(message);
  };
  //
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Panou Admin</h2>
      <p className={styles.description}>Gestionați utilizatorii și rolurile.</p>
      <div className={styles.buttonGroup}>
        <button onClick={handleOpenCreateModal} className={styles.createButton}>
          Crează Utilizator
        </button>
        <button onClick={handleOpenEditModal} className={styles.editButton}>
          Modifică Utilizator
        </button>
        <button onClick={handleOpenDeleteModal} className={styles.deleteButton}>
          Șterge Utilizator
        </button>
      </div>

      {/* Secțiune pentru setările TVA (global) */}
      <AdminVatSettings />

      {/* Secțiune pentru markup-uri pe produse */}
      <ProductMarkupTable />

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
