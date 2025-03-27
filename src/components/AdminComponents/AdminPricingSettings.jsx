"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AdminPricingSettings.module.css";

export default function AdminPricingSettings() {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [vatRate, setVatRate] = useState(19); // 19% implicit

  // La montare, preia valoarea curentă a TVA din backend
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/vat-rate`, { withCredentials: true })
      .then((res) => {
        // res.data.vatRate e fracția, ex. 0.19 => convertim la procent
        setVatRate(res.data.vatRate * 100);
      })
      .catch((err) => console.error(err));
  }, [BASE_URL]);

  // Trimite noua valoare a TVA în backend
  const handleVatSave = async () => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/vat-rate`,
        { vatRate: vatRate / 100 }, //  0.19 pentru 19%
        { withCredentials: true }
      );
      alert("TVA actualizat: " + res.data.vatRate);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Setări TVA</h3>
      <div className={styles.section}>
        <label className={styles.customLabel}>
          TVA (%):
          <input
            type="number"
            className={styles.customInput}
            value={vatRate}
            onChange={(e) => setVatRate(parseFloat(e.target.value))}
          />
        </label>
        <button
          className={`${styles.btn} ${styles.btnHover}`}
          onClick={handleVatSave}
        >
          Salvează TVA
        </button>
      </div>
    </div>
  );
}
