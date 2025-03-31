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
  //   LISTE COMPLETE
  // ---------------------
  const [allCategories, setAllCategories] = useState([]);
  const [allSuppliers, setAllSuppliers] = useState([]);

  // La mount, încărcăm TOATE categoriile și TOȚI furnizorii (ca să avem lista completă)
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/categories`)
      .then((res) => {
        // res.data ar trebui să fie array de obiecte { _id, name }
        setAllCategories(res.data);
      })
      .catch((err) => console.error(err));

    axios
      .get(`${BASE_URL}/api/suppliers`)
      .then((res) => {
        // res.data poate fi un array de nume sau un array de obiecte
        // Depinde de implementarea ta; dacă e doar un array de string, va trebui adaptat
        setAllSuppliers(res.data);
      })
      .catch((err) => console.error(err));
  }, [BASE_URL]);

  // ---------------------
  //   CATEGORIE
  // ---------------------
  const [categorySearch, setCategorySearch] = useState("");
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({
    _id: "",
    name: "",
  });

  // Filtrăm local categoriile în funcție de categorySearch
  useEffect(() => {
    if (!showCategoryDropdown) return;

    if (categorySearch.length < 1) {
      // Dacă userul nu tastează nimic, afișăm toată lista
      setCategorySuggestions(allCategories);
    } else {
      // Filtrăm local
      const filtered = allCategories.filter((cat) =>
        cat.name.toLowerCase().includes(categorySearch.toLowerCase())
      );
      setCategorySuggestions(filtered);
    }
  }, [categorySearch, allCategories, showCategoryDropdown]);

  // ---------------------
  //   SUPPLIER
  // ---------------------
  const [supplierSearch, setSupplierSearch] = useState("");
  const [supplierSuggestions, setSupplierSuggestions] = useState([]);
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState({
    _id: "",
    name: "",
  });

  // Filtrăm local furnizorii
  useEffect(() => {
    if (!showSupplierDropdown) return;

    if (supplierSearch.length < 1) {
      // Dacă userul nu tastează nimic, afișăm toată lista
      setSupplierSuggestions(allSuppliers);
    } else {
      const filtered = allSuppliers.filter((sup) =>
        sup.name.toLowerCase().includes(supplierSearch.toLowerCase())
      );
      setSupplierSuggestions(filtered);
    }
  }, [supplierSearch, allSuppliers, showSupplierDropdown]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Gestionează câmpurile text/number (formData)
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

  // Gestionează imaginile
  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  // Submit formular
  const handleSubmit = (e) => {
    e.preventDefault();

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

    axios
      .post(`${BASE_URL}/api/products`, data)
      .then(() => {
        onClose();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Când userul face click pe un item din dropdown (categorie)
  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setCategorySearch(cat.name);
    setShowCategoryDropdown(false);
  };

  // Când userul face click pe un item din dropdown (furnizor)
  const handleSupplierSelect = (sup) => {
    setSelectedSupplier(sup);
    setSupplierSearch(sup.name);
    setShowSupplierDropdown(false);
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
              <div className={styles.fieldWithDropdown}>
                <label>Categorie:</label>
                <div className={styles.inputRow}>
                  <input
                    type="text"
                    placeholder="Caută categorie..."
                    value={categorySearch || selectedCategory.name}
                    onChange={(e) => {
                      setCategorySearch(e.target.value);
                      setShowCategoryDropdown(true);
                    }}
                  />
                  {/* Săgeată pentru a deschide/închide dropdown */}
                  <button
                    type="button"
                    className={styles.arrowBtn}
                    onClick={() => setShowCategoryDropdown((prev) => !prev)}
                  >
                    ▼
                  </button>
                  {/* Buton + */}
                  <button
                    type="button"
                    className={styles.plusBtn}
                    onClick={() => alert("Modal adăugare categorie (TODO)")}
                  >
                    +
                  </button>
                </div>
                {showCategoryDropdown && categorySuggestions.length > 0 && (
                  <ul className={styles.suggestions}>
                    {categorySuggestions.map((cat) => (
                      <li
                        key={cat._id}
                        onClick={() => handleCategorySelect(cat)}
                      >
                        {cat.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Furnizor */}
              <div className={styles.fieldWithDropdown}>
                <label>Furnizor:</label>
                <div className={styles.inputRow}>
                  <input
                    type="text"
                    placeholder="Caută furnizor..."
                    value={supplierSearch || selectedSupplier.name}
                    onChange={(e) => {
                      setSupplierSearch(e.target.value);
                      setShowSupplierDropdown(true);
                    }}
                  />
                  <button
                    type="button"
                    className={styles.arrowBtn}
                    onClick={() => setShowSupplierDropdown((prev) => !prev)}
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    className={styles.plusBtn}
                    onClick={() => alert("Modal adăugare furnizor (TODO)")}
                  >
                    +
                  </button>
                </div>
                {showSupplierDropdown && supplierSuggestions.length > 0 && (
                  <ul className={styles.suggestions}>
                    {supplierSuggestions.map((sup) => (
                      <li
                        key={sup._id}
                        onClick={() => handleSupplierSelect(sup)}
                      >
                        {sup.name}
                      </li>
                    ))}
                  </ul>
                )}
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
