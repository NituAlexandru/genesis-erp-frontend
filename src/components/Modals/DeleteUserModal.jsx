"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./DeleteUserModal.module.css";
import { getUserByUsername, deleteUser } from "@/services/userService";
import Notiflix from "notiflix";

export default function DeleteUserModal({ isOpen, onClose, onSuccess }) {
  const [searchUsername, setSearchUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const modalContentRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const user = await getUserByUsername(searchUsername);
      setUserData(user);
    } catch (err) {
      Notiflix.Notify.failure(
        err.response?.data?.msg || "Utilizatorul nu a fost găsit"
      );
      setUserData(null);
    }
  };

  const handleDelete = async () => {
    if (!userData?._id) {
      Notiflix.Notify.failure("Nu s-a găsit utilizatorul pentru ștergere");
      return;
    }
    try {
      await deleteUser(userData._id);
      onSuccess("Utilizator șters cu succes!");
      Notiflix.Notify.success("Utilizator șters cu succes!");
      onClose();
    } catch (err) {
      Notiflix.Notify.failure(
        err.response?.data?.msg || "Eroare la ștergerea utilizatorului"
      );
    }
  };

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay}>
      <div ref={modalContentRef} className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h2>Șterge Utilizator</h2>
        {!userData && (
          <form onSubmit={handleSearch} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="searchUsername">
                Introdu numele de utilizator:
              </label>
              <input
                id="searchUsername"
                name="searchUsername"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                placeholder="Nume utilizator"
                required
                className={styles.input}
              />
            </div>
            <button type="submit" className={styles.submitButton}>
              Caută
            </button>
          </form>
        )}
        {userData && (
          <div>
            <p>
              Ești sigur că dorești să ștergi utilizatorul{" "}
              <strong>{userData.username}</strong>?
            </p>
            <button onClick={handleDelete} className={styles.deleteButton}>
              Confirmă Ștergerea
            </button>
          </div>
        )}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
