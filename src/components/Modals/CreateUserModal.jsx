"use client";

import ReactDOM from "react-dom";
import styles from "./CreateUserModal.module.css";

export default function CreateUserModal({ isOpen, onClose, onSubmit }) {
  if (!isOpen) return null;

  // Definește handler-ul local pentru submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formul a fost trimis");
    onSubmit(e);
  };

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
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
          <button type="submit" className={styles.submitButton}>
            Crează Utilizator
          </button>
        </form>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
