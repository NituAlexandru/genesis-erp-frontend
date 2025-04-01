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
            <p>Nume: {product.name}</p>
            <p>Cod de bare: {product.barCode}</p>
            <p>
              Furnizor:{" "}
              {product.mainSupplier?.name || product.mainSupplier || "-"}
            </p>
            <p>
              Categorie: {product.category?.name || product.category || "-"}
            </p>
            <p>Preț achiziție: {product.averagePurchasePrice.toFixed(2)}</p>
            <p>
              Preț vanzare: {product.salesPrice?.price1.toFixed(2)} /{" "}
              {product.salesPrice?.price2.toFixed(2)} /{" "}
              {product.salesPrice?.price3.toFixed(2)} Lei
            </p>
            <p>Stoc minim: {product.minStock.toFixed(0)}</p>
            <p>Stoc curent: {product.currentStock.toFixed(0)}</p>
            <p>
              Dimensiuni (L x l x h): {product.length} x {product.width} x{" "}
              {product.height}
            </p>
            <p>Greutate: {product.weight}</p>
            <p>Volum: {product.volume} m3</p>
            <p>Nr. produse în pachet: {product.packaging?.itemsPerBox}</p>
            <p>Nr. pachete pe palet: {product.packaging?.boxesPerPallet}</p>
            <p>Nr. produse pe palet: {product.packaging?.itemsPerPallet}</p>
            <p>
              Nr. paleti max pe tir: {product.packaging?.maxPalletsPerTruck}
            </p>
            <p>
              Data primei comenzi:{" "}
              {product.firstOrderDate
                ? new Date(product.firstOrderDate).toLocaleDateString()
                : "-"}
            </p>
            <p>
              Data ultimei comenzi:{" "}
              {product.lastOrderDate
                ? new Date(product.lastOrderDate).toLocaleDateString()
                : "-"}
            </p>
            {product.createdAt && (
              <p>Creat: {new Date(product.createdAt).toLocaleString()}</p>
            )}
            {product.updatedAt && (
              <p>Actualizat: {new Date(product.updatedAt).toLocaleString()}</p>
            )}
            <p>Status: {product.isActive ? "Activ" : "Inactiv"}</p>
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
