"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import Notiflix from "notiflix";
import { createUser } from "@/services/userService";
import styles from "./CreateUserModal.module.css";

export default function CreateUserModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const modalContentRef = useRef(null);

  // Închide modalul când se face click în afara zonei de conținut sau când se apasă ESC
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(e.target)
      ) {
        onClose();
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      await createUser(data);
      Notiflix.Notify.success("Utilizator creat cu succes!");
      onClose();
    } catch (err) {
      const errorMsg =
        err.response?.data?.msg || "Eroare la crearea utilizatorului";
      Notiflix.Notify.failure(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay}>
      <div ref={modalContentRef} className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h2>Creare Utilizator</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username">
              Nume Utilizator <span className={styles.required}>*</span>
            </label>
            <input
              id="username"
              name="username"
              placeholder="Introduceți numele utilizatorului"
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nume Real</label>
            <input
              id="name"
              name="name"
              placeholder="Introduceți numele complet"
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email (Opțional)</label>
            <input
              id="email"
              name="email"
              placeholder="Introduceți adresa de email"
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">
              Parolă <span className={styles.required}>*</span>
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Introduceți parola"
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="role">Rol</label>
            <select
              id="role"
              name="role"
              defaultValue="Agent Vanzari"
              className={styles.select}
            >
              <option value="Agent Vanzari">Agent Vanzari</option>
              <option value="Admin">Admin</option>
              <option value="Contabil">Contabil</option>
              <option value="Operator Logistica">Operator Logistica</option>
              <option value="Sofer">Sofer</option>
            </select>
          </div>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Se procesează..." : "Crează Utilizator"}
          </button>
        </form>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
