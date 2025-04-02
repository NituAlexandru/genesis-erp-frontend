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
  const { products, categories, suppliers, refetchProducts } = useProducts();

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);

  // Selected product for details modal.
  const [selectedProduct, setSelectedProduct] = useState(null);

  // State for CRUD modals.
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Local filtering with useMemo.
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesSearch = prod.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      let prodCategoryName = "";
      if (prod.category) {
        if (typeof prod.category === "object") {
          prodCategoryName = prod.category.name;
        } else {
          prodCategoryName = prod.category;
        }
      }
      const matchesCategory = categoryFilter
        ? (() => {
            const selectedCat = categories.find(
              (c) => c._id === categoryFilter
            );
            if (!selectedCat) return false;
            return (
              prodCategoryName.toLowerCase() === selectedCat.name.toLowerCase()
            );
          })()
        : true;

      const matchesSupplier = supplierFilter
        ? prod.mainSupplier && prod.mainSupplier._id === supplierFilter
        : true;

      const price = prod.salesPrice ? prod.salesPrice.price1 : 0;
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
    categories,
    supplierFilter,
    minPrice,
    maxPrice,
    inStockOnly,
  ]);

  // Handlers for modals.
  const handleProductClick = (prod) => setSelectedProduct(prod);
  const handleCloseProductModal = () => setSelectedProduct(null);

  return (
    <div className={styles.container}>
      <h2>Catalog Produse</h2>

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
        categories={categories}
        suppliers={suppliers}
      />

      <ProductTable
        products={filteredProducts}
        onProductClick={handleProductClick}
      />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={handleCloseProductModal}
        />
      )}

      {showAddModal && (
        <AddProductModal
          onClose={() => {
            setShowAddModal(false);
            refetchProducts();
          }}
          categories={categories}
          suppliers={suppliers}
        />
      )}

      {showEditModal && (
        <EditProductModal
          onClose={() => {
            setShowEditModal(false);
            refetchProducts();
          }}
        />
      )}

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
