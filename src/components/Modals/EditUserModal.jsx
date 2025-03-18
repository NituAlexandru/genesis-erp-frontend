"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./EditUserModal.module.css";
import { getUserByUsername, updateUser } from "@/services/userService";
import Notiflix from "notiflix";

export default function EditUserModal({ isOpen, onClose, onSuccess }) {
  const [searchUsername, setSearchUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const modalContentRef = useRef(null);

  // Închide modalul când se face click în afara lui sau când se apasă tasta ESC
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData?._id) {
      Notiflix.Notify.failure("Nu s-a găsit utilizatorul pentru actualizare");
      return;
    }
    try {
      const payload = {
        name: userData.name,
        email: userData.email,
        password: userData.password, // dacă se dorește actualizarea parolei
        role:
          typeof userData.role === "object"
            ? userData.role.name
            : userData.role,
      };

      await updateUser(userData._id, payload);
      Notiflix.Notify.success("Utilizator actualizat cu succes!");
      onClose();
    } catch (err) {
      const message =
        err.response?.data?.msg || "Eroare la actualizarea utilizatorului";
      if (message === "Utilizatorul are deja acest rol") {
        Notiflix.Notify.warning(message);
      } else if (message === "Rolul specificat nu există") {
        Notiflix.Notify.failure(message);
      } else {
        Notiflix.Notify.failure(message);
      }
    }
  };

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay}>
      <div ref={modalContentRef} className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h2>Modifică Utilizator</h2>
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
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="username">
                Nume Utilizator (nu se poate modifica)
              </label>
              <input
                id="username"
                name="username"
                value={userData.username}
                disabled
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="name">Nume Real</label>
              <input
                id="name"
                name="name"
                value={userData.name || ""}
                onChange={handleChange}
                placeholder="Nume Real"
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                value={userData.email || ""}
                onChange={handleChange}
                placeholder="Email"
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Parolă nouă (opțional)</label>
              <input
                id="password"
                name="password"
                type="password"
                onChange={handleChange}
                placeholder="Noua parolă"
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="role">Rol</label>
              <select
                id="role"
                name="role"
                value={
                  typeof userData.role === "object"
                    ? userData.role.name
                    : userData.role || ""
                }
                onChange={handleChange}
                className={styles.select}
              >
                <option value="Agent Vanzari">Agent Vanzari</option>
                <option value="Admin">Admin</option>
                <option value="Contabil">Contabil</option>
                <option value="Operator Logistica">Operator Logistica</option>
                <option value="Sofer">Sofer</option>
              </select>
            </div>
            <button type="submit" className={styles.submitButton}>
              Actualizează Utilizator
            </button>
          </form>
        )}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
