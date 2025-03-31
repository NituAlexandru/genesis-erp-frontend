"use client";

import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AddProductModal.module.css";

export default function AddProductModal({ onClose }) {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [mounted, setMounted] = useState(false);
  const [images, setImages] = useState([]);

  // Datele principale ale produsului
  const [formData, setFormData] = useState({
    name: "",
    barCode: "",
    description: "",
    minStock: 0,
    currentStock: 0,
    length: 0,
    width: 0,
    height: 0,
    weight: 0,
    averagePurchasePrice: "",
    packaging: {
      itemsPerBox: 0,
      boxesPerPallet: 0,
      itemsPerPallet: 0,
      maxPalletsPerTruck: 0,
    },
  });

  // ---------------------
  //   CATEGORIE
  // ---------------------
  const [categorySearch, setCategorySearch] = useState("");
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({
    _id: "",
    name: "",
  });

  useEffect(() => {
    if (categorySearch.length > 2) {
      axios
        .get(`${BASE_URL}/api/categories/search?query=${categorySearch}`)
        .then((res) => {
          setCategorySuggestions(res.data);
        })
        .catch((err) => console.error(err));
    } else {
      setCategorySuggestions([]);
    }
  }, [categorySearch, BASE_URL]);

  // ---------------------
  //   SUPPLIER
  // ---------------------
  const [supplierSearch, setSupplierSearch] = useState("");
  const [supplierSuggestions, setSupplierSuggestions] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState({
    _id: "",
    name: "",
  });

  useEffect(() => {
    if (supplierSearch.length > 2) {
      axios
        .get(`${BASE_URL}/api/suppliers/search?query=${supplierSearch}`)
        .then((res) => {
          setSupplierSuggestions(res.data);
        })
        .catch((err) => console.error(err));
    } else {
      setSupplierSuggestions([]);
    }
  }, [supplierSearch, BASE_URL]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Handle input changes (formData) – log pentru debugging
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => {
        const newData = {
          ...prev,
          [parent]: { ...prev[parent], [child]: value },
        };
        // console.log("DEBUG handleChange:", newData);
        return newData;
      });
    } else {
      setFormData((prev) => {
        const newData = { ...prev, [name]: value };
        // console.log("DEBUG handleChange:", newData);
        return newData;
      });
    }
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  // Submit formular
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("DEBUG handleSubmit -> formData:", formData);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("barCode", formData.barCode);
    data.append("description", formData.description);
    data.append("minStock", formData.minStock);
    data.append("currentStock", formData.currentStock);
    data.append("length", formData.length);
    data.append("width", formData.width);
    data.append("height", formData.height);
    data.append("weight", formData.weight);
    // Convertim averagePurchasePrice la număr; dacă este "", va deveni 0.
    data.append(
      "averagePurchasePrice",
      Number(formData.averagePurchasePrice) || 0
    );

    data.append("packaging.itemsPerBox", formData.packaging.itemsPerBox);
    data.append("packaging.boxesPerPallet", formData.packaging.boxesPerPallet);
    data.append("packaging.itemsPerPallet", formData.packaging.itemsPerPallet);
    data.append(
      "packaging.maxPalletsPerTruck",
      formData.packaging.maxPalletsPerTruck
    );

    data.append("category", selectedCategory._id);
    data.append("mainSupplier", selectedSupplier._id);

    images.forEach((img) => {
      data.append("images", img);
    });

    // Logăm conținutul FormData pentru debugging
    for (let pair of data.entries()) {
      console.log("DEBUG FormData entry:", pair[0], pair[1]);
    }

    axios
      .post(`${BASE_URL}/api/products`, data)
      .then(() => {
        onClose();
      })
      .catch((err) => {
        console.error("ERROR in handleSubmit:", err);
      });
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Adaugă Produs</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.columns}>
            {/* Coloana stângă: imagine + descriere */}
            <div className={styles.leftColumn}>
              <div className={styles.imageUpload}>
                <label>Imagine Produs:</label>
                <input type="file" multiple onChange={handleImageChange} />
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

              {/* Categorie */}
              <div style={{ position: "relative" }}>
                <label>Categorie:</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <div style={{ position: "relative", flex: 1 }}>
                    <input
                      type="text"
                      placeholder="Caută categorie..."
                      value={selectedCategory.name || categorySearch}
                      onChange={(e) => {
                        setSelectedCategory({ _id: "", name: "" });
                        setCategorySearch(e.target.value);
                      }}
                    />
                    {categorySuggestions.length > 0 && (
                      <ul className={styles.suggestions}>
                        {categorySuggestions.map((cat) => (
                          <li
                            key={cat._id}
                            onClick={() => {
                              setSelectedCategory(cat);
                              setCategorySearch(cat.name);
                              setCategorySuggestions([]);
                            }}
                          >
                            {cat.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => alert("Modal adăugare categorie (TODO)")}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Furnizor */}
              <div style={{ position: "relative" }}>
                <label>Furnizor:</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <div style={{ position: "relative", flex: 1 }}>
                    <input
                      type="text"
                      placeholder="Caută furnizor..."
                      value={selectedSupplier.name || supplierSearch}
                      onChange={(e) => {
                        setSelectedSupplier({ _id: "", name: "" });
                        setSupplierSearch(e.target.value);
                      }}
                    />
                    {supplierSuggestions.length > 0 && (
                      <ul className={styles.suggestions}>
                        {supplierSuggestions.map((sup) => (
                          <li
                            key={sup._id}
                            onClick={() => {
                              setSelectedSupplier(sup);
                              setSupplierSearch(sup.name);
                              setSupplierSuggestions([]);
                            }}
                          >
                            {sup.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => alert("Modal adăugare furnizor (TODO)")}
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label>Stoc minim dorit:</label>
                <input
                  name="minStock"
                  type="number"
                  value={formData.minStock}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Stoc initial:</label>
                <input
                  name="currentStock"
                  type="number"
                  value={formData.currentStock}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Lungime (cm):</label>
                <input
                  name="length"
                  type="number"
                  value={formData.length}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Lățime (cm):</label>
                <input
                  name="width"
                  type="number"
                  value={formData.width}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Înălțime (cm):</label>
                <input
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Greutate (kg):</label>
                <input
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Preț intrare pe bucata (Lei):</label>
                <input
                  name="averagePurchasePrice"
                  type="number"
                  value={formData.averagePurchasePrice}
                  onChange={handleChange}
                />
              </div>

              {/* Packaging */}
              <div>
                <label>Nr. produse în pachet:</label>
                <input
                  name="packaging.itemsPerBox"
                  type="number"
                  value={formData.packaging.itemsPerBox}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Nr. pachete pe palet:</label>
                <input
                  name="packaging.boxesPerPallet"
                  type="number"
                  value={formData.packaging.boxesPerPallet}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Nr. produse pe palet:</label>
                <input
                  name="packaging.itemsPerPallet"
                  type="number"
                  value={formData.packaging.itemsPerPallet}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Nr. paleti max pe tir:</label>
                <input
                  name="packaging.maxPalletsPerTruck"
                  type="number"
                  value={formData.packaging.maxPalletsPerTruck}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className={styles.buttons}>
            <button type="submit" className={styles.button}>
              Adaugă Produs
            </button>
            <button type="button" onClick={onClose} className={styles.button}>
              Anulează
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
