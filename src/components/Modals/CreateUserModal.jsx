"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import Notiflix from "notiflix";
// PRESUPUNEM că funcțiile din userService includ { withCredentials: true }
import { createUser } from "@/services/userService";
import styles from "./CreateUserModal.module.css";

export default function CreateUserModal({ isOpen, onClose, onSuccess }) {
  // Adăugat onSuccess pt refresh potențial
  const [loading, setLoading] = useState(false);
  const modalContentRef = useRef(null);
  const [isBrowser, setIsBrowser] = useState(false); // Pentru ReactDOM.createPortal

  useEffect(() => {
    setIsBrowser(true); // Se execută doar pe client
    const handleClickOutside = (e) => {
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(e.target)
      ) {
        onClose();
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // Reset loading state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen || !isBrowser) return null; // Nu randa pe server sau dacă e închis

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    Notiflix.Loading.standard("Creare utilizator...");

    const form = e.target;
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value.trim();
    }); // Trim values

    // --- Construire Payload Corect pentru Backend ---
    const payload = {
      username: data.username,
      name: data.name || undefined, // Trimite undefined dacă e gol
      email: data.email, // Email este acum necesar
      password: data.password,
      roleName: data.role, // Backend așteaptă 'roleName', valoarea din select este numele
    };
    // -------------------------------------------

    try {
      // Verificare rapidă frontend pt câmpuri obligatorii (dublare validare backend)
      if (
        !payload.username ||
        !payload.email ||
        !payload.password ||
        !payload.roleName
      ) {
        throw new Error("Toate câmpurile marcate cu * sunt obligatorii.");
      }
      if (payload.password.length < 6) {
        throw new Error("Parola trebuie să aibă cel puțin 6 caractere.");
      }
      const newUser = await createUser(payload);
      Notiflix.Loading.remove();
      Notiflix.Notify.success(
        `Utilizatorul "${
          newUser.user?.username || payload.username
        }" creat cu succes!`
      ); // Folosește răspunsul
      if (onSuccess) onSuccess(); // Apelează callback pt refresh listă useri, etc.
      onClose();
    } catch (err) {
      Notiflix.Loading.remove();
      let errorMsg = "Eroare la crearea utilizatorului";
      // Afișează erorile de validare din backend dacă există
      if (
        err.response?.data?.errors &&
        Array.isArray(err.response.data.errors)
      ) {
        errorMsg = err.response.data.errors
          .map((e) => `${e.path || "Eroare"}: ${e.msg}`)
          .join("\n");
      } else {
        errorMsg = err.response?.data?.msg || err.message || errorMsg; // Folosește și err.message
      }
      console.error("Create user error:", err.response || err);
      Notiflix.Notify.failure(errorMsg);
    } finally {
      if (Notiflix.Loading.isLoading) Notiflix.Loading.remove();
      setLoading(false);
    }
  };

  // --- Portal Rendering ---
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) {
    console.error("CreateUserModal: Element with id 'modal-root' not found.");
    return null;
  }

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay}>
      <div ref={modalContentRef} className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h2>Creare Utilizator Nou</h2>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {/* Username */}
          <div className={styles.formGroup}>
            <label htmlFor="username">
              {" "}
              Nume Utilizator <span className={styles.required}>*</span>{" "}
            </label>
            <input
              id="username"
              name="username"
              placeholder="Minim 3 caractere"
              required
              minLength="3"
              className={styles.input}
            />
          </div>
          {/* Nume Real */}
          <div className={styles.formGroup}>
            <label htmlFor="name">Nume Real</label>
            <input
              id="name"
              name="name"
              placeholder="Introduceți numele complet"
              className={styles.input}
            />
          </div>
          {/* Email - OBLIGATORIU */}
          <div className={styles.formGroup}>
            <label htmlFor="email">
              {" "}
              Email <span className={styles.required}>*</span>{" "}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Introduceți adresa de email"
              required
              className={styles.input}
            />
          </div>
          {/* Parola */}
          <div className={styles.formGroup}>
            <label htmlFor="password">
              {" "}
              Parolă <span className={styles.required}>*</span>{" "}
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Minim 6 caractere"
              required
              minLength="6"
              className={styles.input}
            />
          </div>
          {/* Rol */}
          <div className={styles.formGroup}>
            <label htmlFor="role">
              {" "}
              Rol <span className={styles.required}>*</span>{" "}
            </label>
            {/* Folosim 'name="role"' dar trimitem valoarea ca 'roleName' */}
            <select
              id="role"
              name="role"
              required
              defaultValue="Agent Vanzari"
              className={styles.select}
            >
              <option value="Agent Vanzari">Agent Vanzari</option>
              <option value="Admin">Admin</option>
              <option value="Administrator">Administrator</option>{" "}
              {/* Verifică dacă există acest rol */}
              <option value="Contabil">Contabil</option>
              <option value="Operator Logistica">Operator Logistica</option>
              <option value="Sofer">Sofer</option>
            </select>
          </div>
          {/* Buton Submit */}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Se creează..." : "Crează Utilizator"}
          </button>
        </form>
      </div>
    </div>,
    modalRoot
  );
}
