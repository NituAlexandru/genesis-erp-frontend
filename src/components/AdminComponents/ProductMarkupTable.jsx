"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Notiflix from "notiflix";
import styles from "./ProductMarkupTable.module.css";
import ProductMarkupFilter from "./ProductMarkupFilter";

export default function ProductMarkupTable() {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [products, setProducts] = useState([]);

  // Stări pentru filtrare
  const [searchTerm, setSearchTerm] = useState("");
  const [minMarkup, setMinMarkup] = useState("");
  const [maxMarkup, setMaxMarkup] = useState("");

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/products`, { withCredentials: true })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, [BASE_URL]);

  // Funcție de resetare a filtrelor
  const resetFilters = () => {
    setSearchTerm("");
    setMinMarkup("");
    setMaxMarkup("");
  };

  // Filtrare locală (exemplu: filtrare după nume și după markup1)
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesSearch = prod.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const markup1 = prod.defaultMarkups?.markup1 || 0;
      const min = parseFloat(minMarkup) || 0;
      const max = maxMarkup ? parseFloat(maxMarkup) : Infinity;
      const matchesMarkup = markup1 >= min && markup1 <= max;

      return matchesSearch && matchesMarkup;
    });
  }, [products, searchTerm, minMarkup, maxMarkup]);

  // Funcție utilitară pentru calculul prețului de vânzare
  const calculateSalePrice = (averagePurchasePrice, markup) => {
    if (averagePurchasePrice === null || averagePurchasePrice === undefined)
      return "N/A";
    const salePrice = averagePurchasePrice * (1 + markup / 100);
    return salePrice.toFixed(2) + " Lei";
  };

  const handleMarkupChange = (productId, field, value) => {
    setProducts((prev) =>
      prev.map((prod) =>
        prod._id === productId
          ? {
              ...prod,
              defaultMarkups: {
                ...prod.defaultMarkups,
                [field]: parseFloat(value),
              },
            }
          : prod
      )
    );
  };

  // Trimite update la backend
  const handleUpdateMarkups = async (productId) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;

    try {
      const res = await axios.put(
        `${BASE_URL}/api/markups`,
        {
          productId,
          defaultMarkups: product.defaultMarkups,
        },
        { withCredentials: true }
      );
      const { name, defaultMarkups } = res.data;
      Notiflix.Notify.success(
        `Markup-uri actualizate pentru: ${name}. Marja 1 - ${defaultMarkups.markup1}%, Marja 2 - ${defaultMarkups.markup2}%, Marja 3 - ${defaultMarkups.markup3}%`
      );
    } catch (error) {
      console.error(error);
      Notiflix.Notify.failure("Eroare la actualizarea marjei de profit");
    }
  };

  return (
    <div>
      <h3>Setări Marja Profit Produse</h3>
      {/* Componenta de filtrare cu butonul de reset */}
      <ProductMarkupFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        minMarkup={minMarkup}
        setMinMarkup={setMinMarkup}
        maxMarkup={maxMarkup}
        setMaxMarkup={setMaxMarkup}
        resetFilters={resetFilters}
      />
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.colBarCode}>ID</th>
            <th className={styles.colName}>Nume</th>
            <th className={styles.colAverage}>Pret intrare</th>
            <th className={styles.markup}>Marja 1 (%)</th>
            <th className={styles.markup}>Pret 1</th>
            <th className={styles.markup}>Marja 2 (%)</th>
            <th className={styles.markup}>Pret 2</th>
            <th className={styles.markup}>Marja 3 (%)</th>
            <th className={styles.markup}>Pret 3</th>
            <th>Acțiune</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((prod) => (
            <tr key={prod._id}>
              <td>{prod.barCode || prod._id}</td>
              <td>{prod.name}</td>
              <td className={styles.colAverage}>
                {prod.averagePurchasePrice !== undefined &&
                prod.averagePurchasePrice !== null
                  ? prod.averagePurchasePrice.toFixed(2) + " Lei"
                  : "N/A"}
              </td>
              <td className={styles.markup}>
                <input
                  type="number"
                  className={styles.input}
                  value={prod.defaultMarkups?.markup1 || 0}
                  onChange={(e) =>
                    handleMarkupChange(prod._id, "markup1", e.target.value)
                  }
                />
              </td>
              <td className={styles.markup}>
                {prod.averagePurchasePrice !== undefined &&
                prod.averagePurchasePrice !== null
                  ? calculateSalePrice(
                      prod.averagePurchasePrice,
                      prod.defaultMarkups?.markup1 || 0
                    )
                  : "N/A"}
              </td>
              <td className={styles.markup}>
                <input
                  type="number"
                  className={styles.input}
                  value={prod.defaultMarkups?.markup2 || 0}
                  onChange={(e) =>
                    handleMarkupChange(prod._id, "markup2", e.target.value)
                  }
                />
              </td>
              <td className={styles.markup}>
                {prod.averagePurchasePrice !== undefined &&
                prod.averagePurchasePrice !== null
                  ? calculateSalePrice(
                      prod.averagePurchasePrice,
                      prod.defaultMarkups?.markup2 || 0
                    )
                  : "N/A"}
              </td>
              <td className={styles.markup}>
                <input
                  type="number"
                  className={styles.input}
                  value={prod.defaultMarkups?.markup3 || 0}
                  onChange={(e) =>
                    handleMarkupChange(prod._id, "markup3", e.target.value)
                  }
                />
              </td>
              <td className={styles.markup}>
                {prod.averagePurchasePrice !== undefined &&
                prod.averagePurchasePrice !== null
                  ? calculateSalePrice(
                      prod.averagePurchasePrice,
                      prod.defaultMarkups?.markup3 || 0
                    )
                  : "N/A"}
              </td>
              <td>
                <button
                  className={styles.btn}
                  onClick={() => handleUpdateMarkups(prod._id)}
                >
                  Actualizează
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
