"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ProductMarkupTable.module.css";

export default function ProductMarkupTable() {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/products`, { withCredentials: true })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, [BASE_URL]);

 
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
      alert(`Markup-uri actualizate pentru: ${res.data.name}`);
    } catch (error) {
      console.error(error);
      alert("Eroare la actualizarea markup-urilor");
    }
  };

  return (
    <div>
      <h3>Marja Profit Produse</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.colBarCode}>ID</th>
            <th className={styles.colName}>Nume</th>
            <th className={`${styles.markup}`}>Marja 1 (%)</th>
            <th className={`${styles.markup}`}>Marja 2 (%)</th>
            <th className={`${styles.markup}`}>Marja 3 (%)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod._id}>
              <td>{prod.barCode || prod._id}</td>
              <td>{prod.name}</td>
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
                <input
                  type="number"
                  className={styles.input}
                  value={prod.defaultMarkups?.markup3 || 0}
                  onChange={(e) =>
                    handleMarkupChange(prod._id, "markup3", e.target.value)
                  }
                />
              </td>
              <td>
                <button
                  className={styles.btn}
                  onClick={() => handleUpdateMarkups(prod._id)}
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
