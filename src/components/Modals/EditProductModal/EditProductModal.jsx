"use client";

import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./EditProductModal.module.css";

export default function EditProductModal({ product, onClose }) {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [selectedProduct, setSelectedProduct] = useState(product || null);
  const [mounted, setMounted] = useState(false);
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Inițializare formData, în funcție de produsul selectat (dacă există)
  const [formData, setFormData] = useState(
    selectedProduct
      ? {
          name: selectedProduct.name || "",
          barCode: selectedProduct.barCode || "",
          description: selectedProduct.description || "",
          mainSupplier: selectedProduct.mainSupplier || "",
          salesPrice: {
            price1: selectedProduct.salesPrice?.price1 || 0,
            price2: selectedProduct.salesPrice?.price2 || 0,
            price3: selectedProduct.salesPrice?.price3 || 0,
          },
          minStock: selectedProduct.minStock || 0,
          currentStock: selectedProduct.currentStock || 0,
          firstOrderDate: selectedProduct.firstOrderDate
            ? selectedProduct.firstOrderDate.split("T")[0]
            : "",
          lastOrderDate: selectedProduct.lastOrderDate
            ? selectedProduct.lastOrderDate.split("T")[0]
            : "",
          length: selectedProduct.length || 0,
          width: selectedProduct.width || 0,
          height: selectedProduct.height || 0,
          weight: selectedProduct.weight || 0,
          volume: selectedProduct.volume || 0,
          averagePurchasePrice: selectedProduct.averagePurchasePrice || 0,
          defaultMarkups: {
            markup1: selectedProduct.defaultMarkups?.markup1 || 0,
            markup2: selectedProduct.defaultMarkups?.markup2 || 0,
            markup3: selectedProduct.defaultMarkups?.markup3 || 0,
          },
          clientMarkups: selectedProduct.clientMarkups
            ? JSON.stringify(selectedProduct.clientMarkups, null, 2)
            : "",
        }
      : {
          name: "",
          barCode: "",
          description: "",
          mainSupplier: "",
          salesPrice: { price1: 0, price2: 0, price3: 0 },
          minStock: 0,
          currentStock: 0,
          firstOrderDate: "",
          lastOrderDate: "",
          length: 0,
          width: 0,
          height: 0,
          weight: 0,
          volume: 0,
          averagePurchasePrice: 0,
          defaultMarkups: { markup1: 0, markup2: 0, markup3: 0 },
          clientMarkups: "",
        }
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Actualizează formData când se selectează un produs (prin căutare)
  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name || "",
        barCode: selectedProduct.barCode || "",
        description: selectedProduct.description || "",
        mainSupplier: selectedProduct.mainSupplier || "",
        salesPrice: {
          price1: selectedProduct.salesPrice?.price1 || 0,
          price2: selectedProduct.salesPrice?.price2 || 0,
          price3: selectedProduct.salesPrice?.price3 || 0,
        },
        minStock: selectedProduct.minStock || 0,
        currentStock: selectedProduct.currentStock || 0,
        firstOrderDate: selectedProduct.firstOrderDate
          ? selectedProduct.firstOrderDate.split("T")[0]
          : "",
        lastOrderDate: selectedProduct.lastOrderDate
          ? selectedProduct.lastOrderDate.split("T")[0]
          : "",
        length: selectedProduct.length || 0,
        width: selectedProduct.width || 0,
        height: selectedProduct.height || 0,
        weight: selectedProduct.weight || 0,
        volume: selectedProduct.volume || 0,
        averagePurchasePrice: selectedProduct.averagePurchasePrice || 0,
        defaultMarkups: {
          markup1: selectedProduct.defaultMarkups?.markup1 || 0,
          markup2: selectedProduct.defaultMarkups?.markup2 || 0,
          markup3: selectedProduct.defaultMarkups?.markup3 || 0,
        },
        clientMarkups: selectedProduct.clientMarkups
          ? JSON.stringify(selectedProduct.clientMarkups, null, 2)
          : "",
      });
    }
  }, [selectedProduct]);

  // Căutare de produse: folosim endpoint-ul existent (/api/products) cu parametrul query
  useEffect(() => {
    if (!selectedProduct && searchQuery.length > 2) {
      axios
        .get(`${BASE_URL}/api/products/?query=${searchQuery}`)
        .then((res) => {
          setSuggestions(res.data);
        })
        .catch((err) => console.error(err));
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, selectedProduct]);

  if (!mounted) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();

    data.append("name", formData.name);
    data.append("barCode", formData.barCode);
    data.append("description", formData.description);
    data.append("mainSupplier", formData.mainSupplier);
    data.append("salesPrice.price1", formData.salesPrice.price1);
    data.append("salesPrice.price2", formData.salesPrice.price2);
    data.append("salesPrice.price3", formData.salesPrice.price3);
    data.append("minStock", formData.minStock);
    data.append("currentStock", formData.currentStock);
    data.append("firstOrderDate", formData.firstOrderDate);
    data.append("lastOrderDate", formData.lastOrderDate);
    data.append("length", formData.length);
    data.append("width", formData.width);
    data.append("height", formData.height);
    data.append("weight", formData.weight);
    data.append("volume", formData.volume);
    data.append("averagePurchasePrice", formData.averagePurchasePrice);
    data.append("defaultMarkups.markup1", formData.defaultMarkups.markup1);
    data.append("defaultMarkups.markup2", formData.defaultMarkups.markup2);
    data.append("defaultMarkups.markup3", formData.defaultMarkups.markup3);
    data.append("clientMarkups", formData.clientMarkups);

    images.forEach((img) => {
      data.append("images", img);
    });

    // Folosim _id-ul produsului selectat
    axios
      .put(`${BASE_URL}/api/products/${selectedProduct._id}`, data)
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
        <h2>Editează Produs</h2>
        {/* Dacă nu avem un produs selectat, afișăm câmpul de căutare */}
        {!selectedProduct && (
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Caută produs pentru editare..."
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
                      setSearchQuery("");
                      setSuggestions([]);
                    }}
                  >
                    {prod.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Dacă avem produsul selectat, afișăm formularul complet */}
        {selectedProduct && (
          <form onSubmit={handleSubmit}>
            <div className={styles.columns}>
              {/* Coloana stângă: imagine + descriere */}
              <div className={styles.leftColumn}>
                <div className={styles.imageUpload}>
                  <label>Imagine Produs:</label>
                  <input type="file" multiple onChange={handleImageChange} />
                  {selectedProduct?.image && (
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name || "Produs"}
                      className={styles.imagePreview}
                    />
                  )}
                </div>
                <div className={styles.descriptionPreview}>
                  <label>Descriere Produs:</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {/* Coloana dreaptă: restul informațiilor */}
              <div className={styles.rightColumn}>
                <div>
                  <label>Nume:</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Cod de bare:</label>
                  <input
                    name="barCode"
                    value={formData.barCode}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>ID Furnizor:</label>
                  <input
                    name="mainSupplier"
                    value={formData.mainSupplier}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Preț 1:</label>
                  <input
                    name="salesPrice.price1"
                    type="number"
                    value={formData.salesPrice.price1}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Preț 2:</label>
                  <input
                    name="salesPrice.price2"
                    type="number"
                    value={formData.salesPrice.price2}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Preț 3:</label>
                  <input
                    name="salesPrice.price3"
                    type="number"
                    value={formData.salesPrice.price3}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Stoc minim:</label>
                  <input
                    name="minStock"
                    type="number"
                    value={formData.minStock}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Stoc curent:</label>
                  <input
                    name="currentStock"
                    type="number"
                    value={formData.currentStock}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Data primei comenzi:</label>
                  <input
                    name="firstOrderDate"
                    type="date"
                    value={formData.firstOrderDate}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Data ultimei comenzi:</label>
                  <input
                    name="lastOrderDate"
                    type="date"
                    value={formData.lastOrderDate}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Lungime:</label>
                  <input
                    name="length"
                    type="number"
                    value={formData.length}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Lățime:</label>
                  <input
                    name="width"
                    type="number"
                    value={formData.width}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Înălțime:</label>
                  <input
                    name="height"
                    type="number"
                    value={formData.height}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Greutate:</label>
                  <input
                    name="weight"
                    type="number"
                    value={formData.weight}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Volum:</label>
                  <input
                    name="volume"
                    type="number"
                    value={formData.volume}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Preț mediu de achiziție:</label>
                  <input
                    name="averagePurchasePrice"
                    type="number"
                    value={formData.averagePurchasePrice}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Marjă implicită 1:</label>
                  <input
                    name="defaultMarkups.markup1"
                    type="number"
                    value={formData.defaultMarkups.markup1}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Marjă implicită 2:</label>
                  <input
                    name="defaultMarkups.markup2"
                    type="number"
                    value={formData.defaultMarkups.markup2}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Marjă implicită 3:</label>
                  <input
                    name="defaultMarkups.markup3"
                    type="number"
                    value={formData.defaultMarkups.markup3}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Markup personalizat per client (JSON):</label>
                  <textarea
                    name="clientMarkups"
                    value={formData.clientMarkups}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className={styles.buttons}>
              <button type="submit" className={styles.button}>
                Salvează Modificările
              </button>
              <button type="button" onClick={onClose} className={styles.button}>
                Anulează
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
