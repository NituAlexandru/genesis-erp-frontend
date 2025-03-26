"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import ProductModal from "@/components/Modals/ProductModal/ProductModal";
import AddProductModal from "@/components/Modals/AddProductModal/AddProductModal";
import EditProductModal from "@/components/Modals/EditProductModal/EditProductModal";
import DeleteProductModal from "@/components/Modals/DeleteProductModal/DeleteProductModal";
import styles from "./ProductsPage.module.css";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  // Filtre
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);

  // Categoriile vin din DB (exemplu: endpointul /api/categories)
  const [categories, setCategories] = useState([]);

  // Produsul selectat pentru modalul de detalii
  const [selectedProduct, setSelectedProduct] = useState(null);

  // State pentru modalele de CRUD
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Adresă backend din variabilă de mediu
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Fetch produse din backend
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/products`, { withCredentials: true })
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => console.error(err));
  }, [BASE_URL]);

  // Fetch categorii din backend
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/categories`, { withCredentials: true })
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => console.error(err));
  }, [BASE_URL]);

  // Filtrare locală cu useMemo
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesSearch = prod.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter
        ? prod.category === categoryFilter
        : true;

      const price = prod.price || 0;
      const aboveMin = minPrice ? price >= parseFloat(minPrice) : true;
      const belowMax = maxPrice ? price <= parseFloat(maxPrice) : true;

      const isInStock = inStockOnly ? prod.currentStock > 0 : true;

      return (
        matchesSearch && matchesCategory && aboveMin && belowMax && isInStock
      );
    });
  }, [products, searchTerm, categoryFilter, minPrice, maxPrice, inStockOnly]);

  // Handlers pentru deschiderea modalelor CRUD
  const handleAddProduct = () => setShowAddModal(true);
  const handleEditProduct = () => setShowEditModal(true);
  const handleDeleteProduct = () => setShowDeleteModal(true);

  // Handlers pentru modalul de detalii
  const handleProductClick = (prod) => {
    setSelectedProduct(prod);
  };
  const handleCloseProductModal = () => setSelectedProduct(null);

  // După operații CRUD, refetch produsele (poți adăuga funcționalitate suplimentară)
  const refetchProducts = () => {
    axios
      .get(`${BASE_URL}/api/products`, { withCredentials: true })
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className={styles.container}>
      <h2>Catalog Produse</h2>

      {/* Zona de acțiuni: butoane CRUD */}
      <div className={styles.actions}>
        <button onClick={handleAddProduct}>Adauga</button>
        <button onClick={handleEditProduct}>Editeaza</button>
        <button onClick={handleDeleteProduct}>Sterge</button>
      </div>

      {/* Zona de filtre */}
      <div className={styles.filters}>
        <input
          className={styles.searchBar}
          type="text"
          placeholder="Cauta Produs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className={styles.categoryFilter}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">Toate categoriile</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <div className={styles.priceInputs}>
          <input
            className={styles.priceInput}
            type="number"
            placeholder="Pret minim"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            className={styles.priceInput}
            type="number"
            placeholder="Pret maxim"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        <label>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
          />
          &nbsp; In Stoc
        </label>
      </div>

      {/* Tabel cu produse */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.colBarCode}>ID</th>
            <th className={styles.colName}>Nume</th>
            <th className={styles.colSupplier}>Furnizor</th>
            <th className={styles.colPrice}>Preț</th>
            <th className={styles.colStock}>Stoc</th>
          </tr>
        </thead>

        <tbody>
          {filteredProducts.map((prod) => {
            const inStock = prod.currentStock > 0;
            return (
              <tr key={prod._id}>
                <td>{prod.barCode || "N/A"}</td>
                <td
                  className={styles.productName}
                  onClick={() => handleProductClick(prod)}
                >
                  {prod.name}
                </td>
                <td>{prod.mainSupplier?.name || "N/A"}</td>
                <td>{prod.price} Lei</td>
                <td>
                  {inStock ? (
                    <span className={styles.inStockYes}>Da</span>
                  ) : (
                    <span className={styles.inStockNo}>Nu</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal pentru detalii despre produs */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={handleCloseProductModal}
        />
      )}

      {/* Modal pentru Add Product */}
      {showAddModal && (
        <AddProductModal
          onClose={() => {
            setShowAddModal(false);
            refetchProducts();
          }}
        />
      )}

      {/* Modal pentru Edit Product */}
      {showEditModal && (
        <EditProductModal
          onClose={() => {
            setShowEditModal(false);
            refetchProducts();
          }}
        />
      )}

      {/* Modal pentru Delete Product */}
      {showDeleteModal && (
        <DeleteProductModal
          onClose={() => {
            setShowDeleteModal(false);
            refetchProducts();
          }}
        />
      )}
    </div>
  );
}
