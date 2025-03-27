"use client";

import React from "react";
import styles from "./ProductFilterBar.module.css";

export default function ProductFilterBar({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  supplierFilter,
  setSupplierFilter,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  inStockOnly,
  setInStockOnly,
  categories,
  suppliers,
}) {
  return (
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

      <select
        className={styles.supplierFilter}
        value={supplierFilter}
        onChange={(e) => setSupplierFilter(e.target.value)}
      >
        <option value="">Toti furnizorii</option>
        {suppliers.map((sup) => (
          <option key={sup} value={sup}>
            {sup}
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
  );
}
