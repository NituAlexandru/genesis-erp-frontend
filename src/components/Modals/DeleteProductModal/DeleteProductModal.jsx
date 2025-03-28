"use client";

import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./DeleteProductModal.module.css";

export default function DeleteProductModal({ onClose }) {
  const [mounted, setMounted] = useState(false);
  const [productId, setProductId] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleDelete = (e) => {
    e.preventDefault();
    axios
      .delete(`/api/products/${productId}`)
      .then(() => {
        onClose();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Delete Product</h2>
        <form onSubmit={handleDelete}>
          <div>
            <label>Product ID (Barcode):</label>
            <input
              name="productId"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
            />
          </div>
          <button className={styles.button} type="submit">
            Delete
          </button>
        </form>
        <button className={styles.button} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>,
    document.body
  );
}
