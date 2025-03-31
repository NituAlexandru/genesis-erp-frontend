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

  // Filtre
  const [searchTerm, setSearchTerm] = useState("");
  // Pentru filtrare, folosim _id-uri pentru category și supplier (din dropdown)
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

  // console.log("DEBUG ProductsPage -> products:", products);
  // console.log("DEBUG ProductsPage -> categories:", categories);
  // console.log("DEBUG ProductsPage -> suppliers:", suppliers);

  // Filtrare locală cu useMemo
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Filtru după nume (searchTerm)
      const matchesSearch = prod.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Filtru pentru categorie:
      // Dacă prod.category e un obiect, extragem name; dacă e string, îl folosim direct.
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
            // Caută categoria selectată în array-ul categories (care sunt obiecte { _id, name })
            const selectedCat = categories.find(
              (c) => c._id === categoryFilter
            );
            if (!selectedCat) return false;
            // Compara numele (case insensitive)
            return (
              prodCategoryName.toLowerCase() === selectedCat.name.toLowerCase()
            );
          })()
        : true;

      // Filtru pentru furnizor:
      // Se compară _id-ul populat pentru mainSupplier.
      const matchesSupplier = supplierFilter
        ? prod.mainSupplier && prod.mainSupplier._id === supplierFilter
        : true;

      // Filtru pentru preț
      const price = prod.salesPrice ? prod.salesPrice.price1 : 0;
      const aboveMin = minPrice ? price >= parseFloat(minPrice) : true;
      const belowMax = maxPrice ? price <= parseFloat(maxPrice) : true;

      // Filtru pentru stoc
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
        categories={categories} // array de obiecte { _id, name }
        suppliers={suppliers} // array de obiecte { _id, name }
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
          categories={categories}
          suppliers={suppliers}
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
