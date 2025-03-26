"use client";

import React from "react";
import styles from "./ProductActions.module.css";

export default function ProductActions({
  onAdd,
  onEdit,
  onDelete,
  onResetFilters,
}) {
  return (
    <div className={styles.actions}>
      <button onClick={onAdd}>Adauga</button>
      <button onClick={onEdit}>Editeaza</button>
      <button onClick={onDelete}>Sterge</button>
      <button onClick={onResetFilters} className={styles.resetButton}>
        Sterge Filtre
      </button>
    </div>
  );
}
