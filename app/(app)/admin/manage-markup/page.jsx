"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import CreateUserModal from "@/components/Modals/CreateUserModal";
import EditUserModal from "@/components/Modals/EditUserModal";
import DeleteUserModal from "@/components/Modals/DeleteUserModal";
import Loader from "@/components/Loader/Loader";
import Notiflix from "notiflix";
import ProductMarkupTable from "@/components/AdminComponents/ProductMarkupTable";
import styles from "./ManageProducts.module.css";

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

  const handleCloseCreateModal = () => setCreateModalOpen(false);
  const handleCloseEditModal = () => setEditModalOpen(false);
  const handleCloseDeleteModal = () => setDeleteModalOpen(false);

  const handleModalSuccess = (message) => {
    Notiflix.Notify.success(message);
  };
  //
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Marja Profit Produse</h2>

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
