"use client";

import React from "react";
import styles from "./ProductTable.module.css";

export default function ProductTable({ products, onProductClick }) {
  // Utility function to calculate sale price: salePrice = averagePurchasePrice * (1 + markup/100)
  const calculateSalePrice = (avgPrice, markup) => {
    if (avgPrice == null) return "N/A";
    return (avgPrice * (1 + markup / 100)).toFixed(2) + " Lei";
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.colBarCode}>ID</th>
          <th className={styles.colName}>Nume</th>
          <th className={styles.colSupplier}>Furnizor</th>
          <th className={styles.colCategory}>Categorie</th>
          <th className={styles.colPrice1}>Pret1</th>
          <th className={styles.colPrice2}>Pret2</th>
          <th className={styles.colPrice3}>Pret3</th>
          <th className={styles.colStock}>Stoc</th>
        </tr>
      </thead>
      <tbody>
        {products.map((prod) => {
          const inStock = prod.currentStock > 0;
          const avgPrice = prod.averagePurchasePrice;
          const salePrice1 =
            avgPrice != null
              ? calculateSalePrice(avgPrice, prod.defaultMarkups?.markup1 || 0)
              : "N/A";
          const salePrice2 =
            avgPrice != null
              ? calculateSalePrice(avgPrice, prod.defaultMarkups?.markup2 || 0)
              : "N/A";
          const salePrice3 =
            avgPrice != null
              ? calculateSalePrice(avgPrice, prod.defaultMarkups?.markup3 || 0)
              : "N/A";
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
              <td className={styles.colPrice1}>{salePrice1}</td>
              <td className={styles.colPrice2}>{salePrice2}</td>
              <td className={styles.colPrice3}>{salePrice3}</td>
              <td className={styles.colStock}>
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
