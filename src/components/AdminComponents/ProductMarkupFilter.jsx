"use client";

import React from "react";
import styles from "./ProductMarkupFilter.module.css";

export default function ProductMarkupFilter({
  searchTerm,
  setSearchTerm,
  minMarkup,
  setMinMarkup,
  maxMarkup,
  setMaxMarkup,
  resetFilters,
}) {
  return (
    <div className={styles.filters}>
      <input
        className={styles.searchBar}
        type="text"
        placeholder="Caută după nume..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <input
        className={styles.markupInput}
        type="number"
        placeholder="Marjă minimă (%)"
        value={minMarkup}
        onChange={(e) => setMinMarkup(e.target.value)}
      />
      <input
        className={styles.markupInput}
        type="number"
        placeholder="Marjă maximă (%)"
        value={maxMarkup}
        onChange={(e) => setMaxMarkup(e.target.value)}
      />
      <button className={styles.resetButton} onClick={resetFilters}>
        Resetează
      </button>
    </div>
  );
}
