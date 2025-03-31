import { useState, useEffect } from "react";
import axios from "axios";

export default function useProducts() {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const fetchProducts = () => {
    axios
      .get(`${BASE_URL}/api/products`, { withCredentials: true })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProducts();
    axios
      .get(`${BASE_URL}/api/categories`, { withCredentials: true })
      .then((res) => {
        // console.log("DEBUG suppliers from server:", res.data);
        setCategories(res.data);
      })
      .catch((err) => console.error(err));
    axios
      .get(`${BASE_URL}/api/suppliers`, { withCredentials: true })
      .then((res) => {
        // console.log("DEBUG suppliers from server:", res.data);
        setSuppliers(res.data);
      })
      .catch((err) => console.error(err));
  }, [BASE_URL]);

  return { products, categories, suppliers, refetchProducts: fetchProducts };
}
