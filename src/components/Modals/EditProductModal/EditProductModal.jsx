"use client";

import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./EditProductModal.module.css";

export default function EditProductModal({ product, onClose }) {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // If a product is provided, we skip the search step
  const [selectedProduct, setSelectedProduct] = useState(product || null);
  const [mounted, setMounted] = useState(false);
  const [images, setImages] = useState([]);

  // For searching products if none is selected
  const [searchProdQuery, setSearchProdQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // ---------- Full Lists for Category & Supplier (for dropdowns) ----------
  const [allCategories, setAllCategories] = useState([]);
  const [allSuppliers, setAllSuppliers] = useState([]);

  // ---------- Category Dropdown State ----------
  const [categorySearch, setCategorySearch] = useState("");
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    product?.category || { _id: "", name: "" }
  );

  // ---------- Supplier Dropdown State ----------
  const [supplierSearch, setSupplierSearch] = useState("");
  const [supplierSuggestions, setSupplierSuggestions] = useState([]);
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(
    product?.mainSupplier || { _id: "", name: "" }
  );

  // ---------- Form Data (mirroring AddProductModal fields) ----------
  const [formData, setFormData] = useState(
    selectedProduct
      ? {
          // Basic fields
          name: selectedProduct.name || "",
          barCode: selectedProduct.barCode || "",
          description: selectedProduct.description || "",

          // For editing the final output, we rely on selectedCategory / selectedSupplier
          // in the dropdown states for category & supplier

          // Sales Price fields
          salesPrice: {
            price1: selectedProduct.salesPrice?.price1 || 0,
            price2: selectedProduct.salesPrice?.price2 || 0,
            price3: selectedProduct.salesPrice?.price3 || 0,
          },

          // Stock & date fields
          minStock: selectedProduct.minStock || 0,
          currentStock: selectedProduct.currentStock || 0,
          firstOrderDate: selectedProduct.firstOrderDate
            ? selectedProduct.firstOrderDate.split("T")[0]
            : "",
          lastOrderDate: selectedProduct.lastOrderDate
            ? selectedProduct.lastOrderDate.split("T")[0]
            : "",

          // Dimensions & weight
          length: selectedProduct.length || 0,
          width: selectedProduct.width || 0,
          height: selectedProduct.height || 0,
          weight: selectedProduct.weight || 0,
          volume: selectedProduct.volume || 0,

          // Purchase price
          averagePurchasePrice: selectedProduct.averagePurchasePrice || "",

          // Markups
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
          averagePurchasePrice: "",
          defaultMarkups: { markup1: 0, markup2: 0, markup3: 0 },
          clientMarkups: "",
        }
  );

  // ---------- Load All Categories & Suppliers on Mount ----------
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

  // ---------- Product Search (if no product is selected) ----------
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

  // ---------- Category Filtering ----------
  useEffect(() => {
    if (!showCategoryDropdown) return;

    if (categorySearch.length < 1) {
      // show full list
      setCategorySuggestions(allCategories);
    } else {
      // filter locally
      const filtered = allCategories.filter((cat) =>
        cat.name.toLowerCase().includes(categorySearch.toLowerCase())
      );
      setCategorySuggestions(filtered);
    }
  }, [categorySearch, allCategories, showCategoryDropdown]);

  // ---------- Supplier Filtering ----------
  useEffect(() => {
    if (!showSupplierDropdown) return;

    if (supplierSearch.length < 1) {
      // show full list
      setSupplierSuggestions(allSuppliers);
    } else {
      const filtered = allSuppliers.filter((sup) =>
        sup.name.toLowerCase().includes(supplierSearch.toLowerCase())
      );
      setSupplierSuggestions(filtered);
    }
  }, [supplierSearch, allSuppliers, showSupplierDropdown]);

  // ---------- Sync local states if product changes externally ----------
  useEffect(() => {
    if (selectedProduct) {
      setFormData((prev) => ({
        ...prev,
        name: selectedProduct.name || "",
        barCode: selectedProduct.barCode || "",
        description: selectedProduct.description || "",
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
        averagePurchasePrice: selectedProduct.averagePurchasePrice || "",
        defaultMarkups: {
          markup1: selectedProduct.defaultMarkups?.markup1 || 0,
          markup2: selectedProduct.defaultMarkups?.markup2 || 0,
          markup3: selectedProduct.defaultMarkups?.markup3 || 0,
        },
        clientMarkups: selectedProduct.clientMarkups
          ? JSON.stringify(selectedProduct.clientMarkups, null, 2)
          : "",
      }));

      // Also set selectedCategory & selectedSupplier states
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

  // ---------- Basic Form Handlers ----------
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

    if (!selectedProduct) return; // No product selected

    const data = new FormData();
    data.append("name", formData.name);
    data.append("barCode", formData.barCode);
    data.append("description", formData.description);

    // category & supplier come from the dropdown states
    data.append("category", selectedCategory._id);
    data.append("mainSupplier", selectedSupplier._id);

    // salesPrice
    data.append("salesPrice.price1", formData.salesPrice.price1);
    data.append("salesPrice.price2", formData.salesPrice.price2);
    data.append("salesPrice.price3", formData.salesPrice.price3);

    // stock & dates
    data.append("minStock", formData.minStock);
    data.append("currentStock", formData.currentStock);
    data.append("firstOrderDate", formData.firstOrderDate);
    data.append("lastOrderDate", formData.lastOrderDate);

    // dimensions & weight
    data.append("length", formData.length);
    data.append("width", formData.width);
    data.append("height", formData.height);
    data.append("weight", formData.weight);
    data.append("volume", formData.volume);

    // purchase price
    data.append(
      "averagePurchasePrice",
      Number(formData.averagePurchasePrice) || 0
    );

    // markups
    data.append("defaultMarkups.markup1", formData.defaultMarkups.markup1);
    data.append("defaultMarkups.markup2", formData.defaultMarkups.markup2);
    data.append("defaultMarkups.markup3", formData.defaultMarkups.markup3);
    data.append("clientMarkups", formData.clientMarkups);

    images.forEach((img) => {
      data.append("images", img);
    });

    axios
      .put(`${BASE_URL}/api/products/${selectedProduct._id}`, data)
      .then(() => {
        onClose();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // ---------- Category & Supplier Selectors ----------
  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setCategorySearch(cat.name);
    setShowCategoryDropdown(false);
  };

  const handleSupplierSelect = (sup) => {
    setSelectedSupplier(sup);
    setSupplierSearch(sup.name);
    setShowSupplierDropdown(false);
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Editează Produs</h2>

        {/* If no product is selected, show the product search input */}
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

        {/* Once a product is selected, show the edit form */}
        {selectedProduct && (
          <form onSubmit={handleSubmit}>
            <div className={styles.columns}>
              {/* Left column: Image + Description */}
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

              {/* Right column: 3-column grid for fields */}
              <div className={styles.rightColumn}>
                {/* Name + BarCode */}
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

                {/* Category dropdown */}
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

                {/* Supplier dropdown */}
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

                {/* Stock fields */}
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

                {/* Dimensions & Weight */}
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

                {/* Purchase Price */}
                <div>
                  <label>Preț mediu de achiziție (Lei):</label>
                  <input
                    name="averagePurchasePrice"
                    type="number"
                    value={formData.averagePurchasePrice}
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
