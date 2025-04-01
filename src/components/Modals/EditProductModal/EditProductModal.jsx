"use client";

import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./EditProductModal.module.css";

export default function EditProductModal({ product, onClose }) {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Dacă se furnizează un produs, se sare peste pasul de căutare
  const [selectedProduct, setSelectedProduct] = useState(product || null);
  const [mounted, setMounted] = useState(false);
  const [images, setImages] = useState([]);

  // Pentru căutarea produselor (dacă nu a fost selectat niciunul)
  const [searchProdQuery, setSearchProdQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Liste complete pentru dropdown-urile de categorie și furnizor
  const [allCategories, setAllCategories] = useState([]);
  const [allSuppliers, setAllSuppliers] = useState([]);

  // Stare pentru dropdown-ul de categorie
  const [categorySearch, setCategorySearch] = useState("");
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    product?.category || { _id: "", name: "" }
  );

  // Stare pentru dropdown-ul de furnizor
  const [supplierSearch, setSupplierSearch] = useState("");
  const [supplierSuggestions, setSupplierSuggestions] = useState([]);
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(
    product?.mainSupplier || { _id: "", name: "" }
  );

  // Structura de date – aceeași ca în AddProductModal
  const [formData, setFormData] = useState(
    selectedProduct
      ? {
          name: selectedProduct.name || "",
          barCode: selectedProduct.barCode || "",
          description: selectedProduct.description || "",
          minStock: selectedProduct.minStock || 0,
          currentStock: selectedProduct.currentStock || 0,
          length: selectedProduct.length || 0,
          width: selectedProduct.width || 0,
          height: selectedProduct.height || 0,
          weight: selectedProduct.weight || 0,
          averagePurchasePrice: selectedProduct.averagePurchasePrice || "",
          packaging: {
            itemsPerBox: selectedProduct.packaging?.itemsPerBox || 0,
            boxesPerPallet: selectedProduct.packaging?.boxesPerPallet || 0,
            itemsPerPallet: selectedProduct.packaging?.itemsPerPallet || 0,
            maxPalletsPerTruck:
              selectedProduct.packaging?.maxPalletsPerTruck || 0,
          },
        }
      : {
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
        }
  );

  // Încărcarea categoriilor și furnizorilor la montare
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/categories`)
      .then((res) => setAllCategories(res.data))
      .catch((err) => console.error(err));

    axios
      .get(`${BASE_URL}/api/suppliers`)
      .then((res) => setAllSuppliers(res.data))
      .catch((err) => console.error(err));
  }, [BASE_URL]);

  // Căutarea produsului (dacă nu este selectat niciun produs)
  useEffect(() => {
    if (!selectedProduct && searchProdQuery.length > 2) {
      axios
        .get(`${BASE_URL}/api/products?query=${searchProdQuery}`)
        .then((res) => setSuggestions(res.data))
        .catch((err) => console.error(err));
    } else {
      setSuggestions([]);
    }
  }, [searchProdQuery, selectedProduct, BASE_URL]);

  // Filtrare pentru categorie
  useEffect(() => {
    if (!showCategoryDropdown) return;

    if (categorySearch.length < 1) {
      setCategorySuggestions(allCategories);
    } else {
      const filtered = allCategories.filter((cat) =>
        cat.name.toLowerCase().includes(categorySearch.toLowerCase())
      );
      setCategorySuggestions(filtered);
    }
  }, [categorySearch, allCategories, showCategoryDropdown]);

  // Filtrare pentru furnizor
  useEffect(() => {
    if (!showSupplierDropdown) return;

    if (supplierSearch.length < 1) {
      setSupplierSuggestions(allSuppliers);
    } else {
      const filtered = allSuppliers.filter((sup) =>
        sup.name.toLowerCase().includes(supplierSearch.toLowerCase())
      );
      setSupplierSuggestions(filtered);
    }
  }, [supplierSearch, allSuppliers, showSupplierDropdown]);

  // Sincronizare a stărilor locale dacă produsul se modifică extern
  useEffect(() => {
    if (selectedProduct) {
      setFormData((prev) => ({
        ...prev,
        name: selectedProduct.name || "",
        barCode: selectedProduct.barCode || "",
        description: selectedProduct.description || "",
        minStock: selectedProduct.minStock || 0,
        currentStock: selectedProduct.currentStock || 0,
        length: selectedProduct.length || 0,
        width: selectedProduct.width || 0,
        height: selectedProduct.height || 0,
        weight: selectedProduct.weight || 0,
        averagePurchasePrice: selectedProduct.averagePurchasePrice || "",
        packaging: {
          itemsPerBox: selectedProduct.packaging?.itemsPerBox || 0,
          boxesPerPallet: selectedProduct.packaging?.boxesPerPallet || 0,
          itemsPerPallet: selectedProduct.packaging?.itemsPerPallet || 0,
          maxPalletsPerTruck:
            selectedProduct.packaging?.maxPalletsPerTruck || 0,
        },
      }));

      if (selectedProduct.category) {
        setSelectedCategory(selectedProduct.category);
        setCategorySearch(selectedProduct.category.name || "");
      } else {
        setSelectedCategory({ _id: "", name: "" });
        setCategorySearch("");
      }

      if (selectedProduct.mainSupplier) {
        setSelectedSupplier(selectedProduct.mainSupplier);
        setSupplierSearch(selectedProduct.mainSupplier.name || "");
      } else {
        setSelectedSupplier({ _id: "", name: "" });
        setSupplierSearch("");
      }
    }
  }, [selectedProduct]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Handlere pentru modificarea câmpurilor formularului
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

    if (!selectedProduct) return;

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
      .put(`${BASE_URL}/api/products/${selectedProduct._id}`, data)
      .then(() => {
        onClose();
      })
      .catch((err) => console.error(err));
  };

  // Selectarea categoriei
  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setCategorySearch(cat.name);
    setShowCategoryDropdown(false);
  };

  // Selectarea furnizorului
  const handleSupplierSelect = (sup) => {
    setSelectedSupplier(sup);
    setSupplierSearch(sup.name);
    setShowSupplierDropdown(false);
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Editează Produs</h2>

        {/* Dacă nu e selectat niciun produs, se afișează input-ul de căutare */}
        {!selectedProduct && (
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Caută produs pentru editare..."
              value={searchProdQuery}
              onChange={(e) => setSearchProdQuery(e.target.value)}
            />
            {suggestions.length > 0 && (
              <ul className={styles.suggestions}>
                {suggestions.map((prod) => (
                  <li
                    key={prod._id}
                    onClick={() => {
                      setSelectedProduct(prod);
                      setSearchProdQuery("");
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

              {/* Coloana dreaptă: câmpuri pentru formular */}
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

                {/* Dropdown pentru categorie */}
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
                    <button
                      type="button"
                      className={styles.arrowBtn}
                      onClick={() => setShowCategoryDropdown((prev) => !prev)}
                    >
                      ▼
                    </button>
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

                {/* Dropdown pentru furnizor */}
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
                  <label>Stoc minim:</label>
                  <input
                    name="minStock"
                    type="number"
                    value={formData.minStock}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Stoc inițial:</label>
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

                {/* Câmpurile pentru packaging */}
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
