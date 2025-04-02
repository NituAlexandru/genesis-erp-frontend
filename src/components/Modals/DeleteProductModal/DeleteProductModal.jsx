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
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Căutare folosind endpoint-ul (/api/products?query=...)
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
  }, [searchQuery, BASE_URL]);

  const handleProductSelect = (prod) => {
    setSelectedProduct(prod);
    setSearchQuery(prod.name);
    setSuggestions([]);
    setShowConfirmation(true);
  };

  // Apelează endpoint-ul dedicat pentru soft delete
  const handleDelete = (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    axios
      .patch(`${BASE_URL}/api/products/${selectedProduct._id}/soft-delete`, {
        isActive: false,
      })
      .then(() => onClose())
      .catch((err) => console.error(err));
  };

  if (!mounted) return null;

  return createPortal(
    <>
      {showConfirmation ? (
        <div className={styles.overlay} onClick={onClose}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Confirmă Ștergerea Produsului</h2>
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
                  <p>Nume: {selectedProduct.name}</p>
                  <p>ID: {selectedProduct.barCode}</p>
                  <p>
                    Furnizor:{" "}
                    {selectedProduct.mainSupplier?.name ||
                      selectedProduct.mainSupplier ||
                      "-"}
                  </p>
                  <p>
                    Categorie:{" "}
                    {selectedProduct.category?.name ||
                      selectedProduct.category ||
                      "-"}
                  </p>
                  <p>
                    Preț achiziție:{" "}
                    {Number(selectedProduct.averagePurchasePrice).toFixed(2)}
                  </p>
                  <p>
                    Preț vanzare:{" "}
                    {Number(selectedProduct.salesPrice?.price1).toFixed(2)} /{" "}
                    {Number(selectedProduct.salesPrice?.price2).toFixed(2)} /{" "}
                    {Number(selectedProduct.salesPrice?.price3).toFixed(2)} Lei
                  </p>
                  <p>
                    Stoc minim: {Number(selectedProduct.minStock).toFixed(0)}
                  </p>
                  <p>
                    Stoc curent:{" "}
                    {Number(selectedProduct.currentStock).toFixed(0)}
                  </p>
                  <p>
                    Dimensiuni (L x l x h): {selectedProduct.length} x{" "}
                    {selectedProduct.width} x {selectedProduct.height}
                  </p>
                  <p>Greutate: {selectedProduct.weight}</p>
                  <p>Volum: {selectedProduct.volume} m3</p>
                  <p>
                    Nr. produse în pachet:{" "}
                    {selectedProduct.packaging?.itemsPerBox}
                  </p>
                  <p>
                    Nr. pachete pe palet:{" "}
                    {selectedProduct.packaging?.boxesPerPallet}
                  </p>
                  <p>
                    Nr. produse pe palet:{" "}
                    {selectedProduct.packaging?.itemsPerPallet}
                  </p>
                  <p>
                    Nr. paleti max pe tir:{" "}
                    {selectedProduct.packaging?.maxPalletsPerTruck}
                  </p>
                  {selectedProduct.createdAt && (
                    <p>
                      Creat:{" "}
                      {new Date(selectedProduct.createdAt).toLocaleString()}
                    </p>
                  )}
                  {selectedProduct.updatedAt && (
                    <p>
                      Actualizat:{" "}
                      {new Date(selectedProduct.updatedAt).toLocaleString()}
                    </p>
                  )}
                  <p>
                    Data primei comenzi:{" "}
                    {selectedProduct.firstOrderDate
                      ? new Date(
                          selectedProduct.firstOrderDate
                        ).toLocaleDateString()
                      : "-"}
                  </p>
                  <p>
                    Data ultimei comenzi:{" "}
                    {selectedProduct.lastOrderDate
                      ? new Date(
                          selectedProduct.lastOrderDate
                        ).toLocaleDateString()
                      : "-"}
                  </p>
                  <p>
                    Status: {selectedProduct.isActive ? "Activ" : "Inactiv"}
                  </p>
                  <div className={styles.confirmationContainer}>
                    {" "}
                    <p>Ești sigur că vrei să ștergi acest produs?</p>
                    <div className={styles.buttons}>
                      <button onClick={handleDelete} className={styles.button}>
                        Șterge Produs
                      </button>
                      <button onClick={onClose} className={styles.button}>
                        Anulează
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.overlay} onClick={onClose}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
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
                      onClick={() => handleProductSelect(prod)}
                    >
                      {prod.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button onClick={onClose} className={styles.button}>
              Anulează
            </button>
          </div>
        </div>
      )}
    </>,
    document.body
  );
}
