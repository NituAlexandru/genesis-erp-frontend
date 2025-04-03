"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./EditUserModal.module.css";
import { getUserByUsername, updateUser } from "@/services/userService";
import Notiflix from "notiflix";

export default function EditUserModal({ isOpen, onClose, onSuccess }) {
  const [searchUsername, setSearchUsername] = useState("");
  const [userData, setUserData] = useState(null); // Datele curente afișate/modificate
  const [initialUserData, setInitialUserData] = useState(null); // Copie pt a detecta modificări
  const [newPassword, setNewPassword] = useState(""); // Stare separată pt parola nouă
  const [loading, setLoading] = useState(false); // Loading pt submit update
  const [searching, setSearching] = useState(false); // Loading pt căutare
  const modalContentRef = useRef(null);
  const [isBrowser, setIsBrowser] = useState(false); // Pt portal

  // --- Efecte pt închidere modal și resetare state ---
  useEffect(() => {
    setIsBrowser(true);
    const handleClickOutside = (event) => {
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(event.target)
      )
        onClose();
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      // Resetează tot când se deschide
      setSearchUsername("");
      setUserData(null);
      setInitialUserData(null);
      setNewPassword("");
      setLoading(false);
      setSearching(false);
    }
  }, [isOpen]);

  if (!isOpen || !isBrowser) return null;

  // --- Handler Căutare ---
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchUsername) return;
    setSearching(true);
    setUserData(null); // Resetează datele vechi
    setInitialUserData(null);
    Notiflix.Loading.standard("Căutare utilizator...");
    try {
      const user = await getUserByUsername(searchUsername);
      if (!user) throw new Error("Utilizator negăsit");

      const currentUserData = {
        ...user,
        // Stocăm numele rolului direct pentru a simplifica formularul
        role: typeof user.role === "object" ? user.role.name : user.role,
      };
      setUserData(currentUserData);
      setInitialUserData(JSON.parse(JSON.stringify(currentUserData))); // Copie profundă
      setNewPassword(""); // Golește câmpul parolei noi
      Notiflix.Loading.remove();
    } catch (err) {
      Notiflix.Loading.remove();
      console.error("Search user error:", err.response || err);
      Notiflix.Notify.failure(
        err.response?.data?.msg || "Utilizatorul nu a fost găsit"
      );
      setUserData(null);
      setInitialUserData(null);
    } finally {
      if (Notiflix.Loading.isLoading) Notiflix.Loading.remove();
      setSearching(false);
    }
  };

  // --- Handler Modificări Formular (NU pt parola nouă) ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Handler Modificare Parolă Nouă ---
  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  // --- Handler Submit Actualizare ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData?._id) {
      Notiflix.Notify.failure("Selectați un utilizator pentru actualizare");
      return;
    }
    setLoading(true);
    Notiflix.Loading.standard("Actualizare utilizator...");

    // --- Construire Payload Corect ---
    const payload = {
      // Include doar câmpurile modificate (comparativ cu initialUserData)
      // sau cele obligatorii
    };

    // Verifică și adaugă câmpurile modificate
    if (userData.name !== initialUserData.name) payload.name = userData.name;
    if (userData.email !== initialUserData.email)
      payload.email = userData.email;
    if (userData.role !== initialUserData.role)
      payload.roleName = userData.role; // Trimite ca roleName
    if (newPassword) payload.password = newPassword; // Trimite parola DOAR dacă newPassword nu e gol

    // -------------------------------

    // Verifică dacă există ceva de actualizat
    if (Object.keys(payload).length === 0) {
      Notiflix.Loading.remove();
      Notiflix.Notify.info("Nu au fost detectate modificări.");
      setLoading(false);
      return;
    }

    // Validare rapidă parolă nouă (dacă există)
    if (payload.password && payload.password.length < 6) {
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(
        "Parola nouă trebuie să aibă cel puțin 6 caractere."
      );
      setLoading(false);
      return;
    }

    try {
      const updatedUser = await updateUser(userData._id, payload);
      Notiflix.Loading.remove();
      Notiflix.Notify.success(
        `Utilizatorul "${
          updatedUser.user?.username || userData.username
        }" a fost actualizat!`
      );
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      Notiflix.Loading.remove();
      let errorMsg = "Eroare la actualizarea utilizatorului";
      if (
        err.response?.data?.errors &&
        Array.isArray(err.response.data.errors)
      ) {
        errorMsg = err.response.data.errors
          .map((e) => `${e.path || "Eroare"}: ${e.msg}`)
          .join("\n");
      } else {
        errorMsg = err.response?.data?.msg || err.message || errorMsg;
      }
      console.error("Update user error:", err.response || err);
      Notiflix.Notify.failure(errorMsg);
    } finally {
      if (Notiflix.Loading.isLoading) Notiflix.Loading.remove();
      setLoading(false);
    }
  };

  // --- Render Logic ---
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay}>
      <div ref={modalContentRef} className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h2>Modifică Utilizator</h2>

        {/* --- Formular Căutare --- */}
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
            <button
              type="submit"
              className={styles.submitButton}
              disabled={searching}
            >
              {searching ? "Se caută..." : "Caută"}
            </button>
          </form>
        )}

        {/* --- Formular Editare --- */}
        {userData && (
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            {/* Username (disabled) */}
            <div className={styles.formGroup}>
              <label htmlFor="username">Nume Utilizator (nemodificabil)</label>
              <input
                id="username"
                name="username"
                value={userData.username}
                disabled
                className={styles.input}
              />
            </div>
            {/* Nume Real */}
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
            {/* Email (Obligatoriu la update conform validării) */}
            <div className={styles.formGroup}>
              <label htmlFor="email">
                Email <span className={styles.required}>*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={userData.email || ""}
                onChange={handleChange}
                placeholder="Email"
                required
                className={styles.input}
              />
            </div>
            {/* Parolă Nouă */}
            <div className={styles.formGroup}>
              <label htmlFor="newPassword">
                Parolă nouă (lasă gol pt. a păstra)
              </label>
              {/* Folosim stare separată 'newPassword' */}
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={handlePasswordChange}
                placeholder="Minim 6 caractere"
                minLength="6"
                className={styles.input}
              />
            </div>
            {/* Rol */}
            <div className={styles.formGroup}>
              <label htmlFor="role">
                Rol <span className={styles.required}>*</span>
              </label>
              {/* Folosim 'name="role"' dar trimitem valoarea ca 'roleName' */}
              <select
                id="role"
                name="role"
                value={userData.role || ""}
                onChange={handleChange}
                required
                className={styles.select}
              >
                <option value="Agent Vanzari">Agent Vanzari</option>
                <option value="Admin">Admin</option>
                <option value="Administrator">Administrator</option>
                <option value="Contabil">Contabil</option>
                <option value="Operator Logistica">Operator Logistica</option>
                <option value="Sofer">Sofer</option>
              </select>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Se actualizează..." : "Actualizează Utilizator"}
            </button>
            {/* Buton pentru a căuta alt user */}
            <button
              type="button"
              onClick={() => setUserData(null)}
              className={styles.secondaryButton}
            >
              Caută Alt Utilizator
            </button>
          </form>
        )}
      </div>
    </div>,
    modalRoot
  );
}
