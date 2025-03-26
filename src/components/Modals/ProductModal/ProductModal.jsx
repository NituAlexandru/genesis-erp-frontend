"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import styles from "./ProductModal.module.css";

export default function ProductModal({ product, onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Product Details</h2>
        <p>
          <strong>Name:</strong> {product.name}
        </p>
        <p>
          <strong>Furnizor:</strong> {product.mainSupplier?.name || "N/A"}
        </p>
        <p>
          <strong>Price:</strong> {product.price} Lei
        </p>
        <p>
          <strong>Current Stock:</strong> {product.currentStock}
        </p>
        <p>
          <strong>Description:</strong> {product.description}
        </p>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>,
    document.body
  );
}
