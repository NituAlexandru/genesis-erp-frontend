"use client";

import React from "react";
import styles from "./ProductTable.module.css";

export default function ProductTable({ products, onProductClick }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.colBarCode}>ID</th>
          <th className={styles.colName}>Nume</th>
          <th className={styles.colSupplier}>Furnizor</th>
          <th className={styles.colCategory}>Categorie</th>
          <th className={styles.colPrice}>Pret</th>
          <th className={styles.colStock}>Stoc</th>
        </tr>
      </thead>
      <tbody>
        {products.map((prod) => {
          const inStock = prod.currentStock > 0;
          return (
            <tr key={prod._id}>
              <td>{prod.barCode || "N/A"}</td>
              <td
                className={styles.productName}
                onClick={() => onProductClick(prod)}
              >
                {prod.name}
              </td>
              <td>{prod.mainSupplier?.name || "N/A"}</td>
              <td>{prod.category || "N/A"}</td>
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
  );
}
