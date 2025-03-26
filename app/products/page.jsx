"use client";

import { useState, useMemo } from "react";
import useProducts from "@/hooks/useProducts";
import ProductModal from "@/components/Modals/ProductModal/ProductModal";
import AddProductModal from "@/components/Modals/AddProductModal/AddProductModal";
import EditProductModal from "@/components/Modals/EditProductModal/EditProductModal";
import DeleteProductModal from "@/components/Modals/DeleteProductModal/DeleteProductModal";
import ProductFilterBar from "@/components/ProductsComponents/ProductFilterBar/ProductFilterBar";
import ProductTable from "@/components/ProductsComponents/ProductTable/ProuctTable";
import ProductActions from "@/components/ProductsComponents/ProductActions/ProductActions";
import styles from "./ProductsPage.module.css";

export default function ProductsPage() {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { products, categories, suppliers, refetchProducts } =
    useProducts(BASE_URL);

  // Filtre
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);

  // Produsul selectat pentru modalul de detalii
  const [selectedProduct, setSelectedProduct] = useState(null);

  // State pentru modalele de CRUD
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Filtrare locală cu useMemo
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesSearch = prod.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter
        ? prod.category === categoryFilter
        : true;
      const matchesSupplier = supplierFilter
        ? prod.mainSupplier?.name === supplierFilter
        : true;
      const price = prod.price || 0;
      const aboveMin = minPrice ? price >= parseFloat(minPrice) : true;
      const belowMax = maxPrice ? price <= parseFloat(maxPrice) : true;
      const isInStock = inStockOnly ? prod.currentStock > 0 : true;
      return (
        matchesSearch &&
        matchesCategory &&
        matchesSupplier &&
        aboveMin &&
        belowMax &&
        isInStock
      );
    });
  }, [
    products,
    searchTerm,
    categoryFilter,
    supplierFilter,
    minPrice,
    maxPrice,
    inStockOnly,
  ]);

  // Handler pentru modalul de detalii
  const handleProductClick = (prod) => setSelectedProduct(prod);
  const handleCloseProductModal = () => setSelectedProduct(null);

  return (
    <div className={styles.container}>
      <h2>Catalog Produse</h2>

      {/* Zona de acțiuni: ProductActions */}
      <ProductActions
        onAdd={() => setShowAddModal(true)}
        onEdit={() => setShowEditModal(true)}
        onDelete={() => setShowDeleteModal(true)}
        onResetFilters={() => {
          setSearchTerm("");
          setCategoryFilter("");
          setSupplierFilter("");
          setMinPrice("");
          setMaxPrice("");
          setInStockOnly(false);
        }}
      />

      {/* Zona de filtre */}
      <ProductFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        supplierFilter={supplierFilter}
        setSupplierFilter={setSupplierFilter}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        inStockOnly={inStockOnly}
        setInStockOnly={setInStockOnly}
        resetFilters={() => {
          setSearchTerm("");
          setCategoryFilter("");
          setSupplierFilter("");
          setMinPrice("");
          setMaxPrice("");
          setInStockOnly(false);
        }}
        categories={categories}
        suppliers={suppliers}
      />

      {/* Tabelul de produse */}
      <ProductTable
        products={filteredProducts}
        onProductClick={handleProductClick}
      />

      {/* Modal pentru detalii */}
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
