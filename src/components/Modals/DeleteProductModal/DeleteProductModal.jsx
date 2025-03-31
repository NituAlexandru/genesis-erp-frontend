"use client";

import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./DeleteProductModal.module.css";

export default function DeleteProductModal({ onClose }) {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Căutare folosind endpoint-ul existent (/api/products?query=...)
  useEffect(() => {
    if (searchQuery.length > 2) {
      axios
        .get(`${BASE_URL}/api/products?query=${searchQuery}`)
        .then((res) => {
          setSuggestions(res.data);
        })
        .catch((err) => console.error(err));
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleDelete = (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    axios
      .delete(`${BASE_URL}/api/products/${selectedProduct._id}`)
      .then(() => onClose())
      .catch((err) => console.error(err));
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Șterge Produs</h2>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Caută produs după nume..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {suggestions.length > 0 && (
            <ul className={styles.suggestions}>
              {suggestions.map((prod) => (
                <li
                  key={prod._id}
                  onClick={() => {
                    setSelectedProduct(prod);
                    setSearchQuery(prod.name);
                    setSuggestions([]);
                  }}
                >
                  {prod.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        {selectedProduct && (
          <div className={styles.productInfo}>
            <div className={styles.columns}>
              <div className={styles.leftColumn}>
                <div className={styles.imageContainer}>
                  {selectedProduct.image ? (
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                    />
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      Imagine Produs
                    </div>
                  )}
                </div>
                <div className={styles.description}>
                  <strong>Descriere:</strong>
                  <p>{selectedProduct.description}</p>
                </div>
              </div>
              <div className={styles.rightColumn}>
                <p>
                  <strong>Nume:</strong> {selectedProduct.name}
                </p>
                <p>
                  <strong>Cod de bare:</strong> {selectedProduct.barCode}
                </p>
                <p>
                  <strong>ID Furnizor:</strong> {selectedProduct.mainSupplier}
                </p>
                <p>
                  <strong>Prețuri:</strong> {selectedProduct.salesPrice?.price1}{" "}
                  / {selectedProduct.salesPrice?.price2} /{" "}
                  {selectedProduct.salesPrice?.price3} Lei
                </p>
                <p>
                  <strong>Stoc minim:</strong> {selectedProduct.minStock}
                </p>
                <p>
                  <strong>Stoc curent:</strong> {selectedProduct.currentStock}
                </p>
                <p>
                  <strong>Data primei comenzi:</strong>{" "}
                  {new Date(
                    selectedProduct.firstOrderDate
                  ).toLocaleDateString()}
                </p>
                <p>
                  <strong>Data ultimei comenzi:</strong>{" "}
                  {new Date(selectedProduct.lastOrderDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Dimensiuni (L x l x h):</strong>{" "}
                  {selectedProduct.length} x {selectedProduct.width} x{" "}
                  {selectedProduct.height}
                </p>
                <p>
                  <strong>Greutate:</strong> {selectedProduct.weight}
                </p>
                <p>
                  <strong>Volum:</strong> {selectedProduct.volume}
                </p>
                <p>
                  <strong>Preț mediu de achiziție:</strong>{" "}
                  {selectedProduct.averagePurchasePrice}
                </p>
                <p>
                  <strong>Marje implicite:</strong>{" "}
                  {selectedProduct.defaultMarkups?.markup1} /{" "}
                  {selectedProduct.defaultMarkups?.markup2} /{" "}
                  {selectedProduct.defaultMarkups?.markup3}
                </p>
                <p>
                  <strong>Markup personalizat per client:</strong>{" "}
                  {JSON.stringify(selectedProduct.clientMarkups)}
                </p>
              </div>
            </div>
            <div className={styles.buttons}>
              <button onClick={handleDelete} className={styles.button}>
                Șterge Produs
              </button>
            </div>
          </div>
        )}
        <button onClick={onClose} className={styles.button}>
          Anulează
        </button>
      </div>
    </div>,
    document.body
  );
}
