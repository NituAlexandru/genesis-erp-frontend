"use client";

import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AddProductModal.module.css";

export default function AddProductModal({ onClose }) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    barCode: "",
    description: "",
    mainSupplier: "",
    price: "",
    currentStock: "",
    // Adaugă alte câmpuri după nevoie
    category: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/products", formData)
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
        <h2>Add Product</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Barcode:</label>
            <input
              name="barCode"
              value={formData.barCode}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Description:</label>
            <input
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Producer (Supplier ID):</label>
            <input
              name="mainSupplier"
              value={formData.mainSupplier}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Price:</label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Current Stock:</label>
            <input
              name="currentStock"
              type="number"
              value={formData.currentStock}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Category:</label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>
          <button className={styles.button} type="submit">
            Add Product
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
