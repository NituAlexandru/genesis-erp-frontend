"use client";

import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
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
        <h2>Detalii Produs</h2>
        <div className={styles.columns}>
          <div className={styles.leftColumn}>
            <div className={styles.imageContainer}>
              {product.image ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <div className={styles.imagePlaceholder}>Imagine Produs</div>
              )}
            </div>
            <div className={styles.description}>
              <strong>Descriere:</strong>
              <p>{product.description}</p>
            </div>
          </div>
          <div className={styles.rightColumn}>
            <p>
              <strong>Nume:</strong> {product.name}
            </p>
            <p>
              <strong>ID</strong> {product.barCode}
            </p>
            <p>
              <strong>ID Furnizor:</strong>{" "}
              {product.mainSupplier?.name || product.mainSupplier}
            </p>
            <p>
              <strong>Prețuri:</strong> {product.salesPrice?.price1} /{" "}
              {product.salesPrice?.price2} / {product.salesPrice?.price3} Lei
            </p>
            <p>
              <strong>Stoc minim:</strong> {product.minStock}
            </p>
            <p>
              <strong>Stoc curent:</strong> {product.currentStock}
            </p>
            <p>
              <strong>Data primei comenzi:</strong>{" "}
              {new Date(product.firstOrderDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Data ultimei comenzi:</strong>{" "}
              {new Date(product.lastOrderDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Dimensiuni (L x l x h):</strong> {product.length} x{" "}
              {product.width} x {product.height}
            </p>
            <p>
              <strong>Greutate:</strong> {product.weight}
            </p>
            <p>
              <strong>Volum:</strong> {product.volume}
            </p>
          </div>
        </div>
        <button onClick={onClose} className={styles.closeButton}>
          Închide
        </button>
      </div>
    </div>,
    document.body
  );
}
