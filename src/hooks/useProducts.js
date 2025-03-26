import { useState, useEffect } from "react";
import axios from "axios";

export default function useProducts(baseUrl) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const fetchProducts = () => {
    axios
      .get(`${baseUrl}/api/products`, { withCredentials: true })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProducts();
    axios
      .get(`${baseUrl}/api/categories`, { withCredentials: true })
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
    axios
      .get(`${baseUrl}/api/suppliers`, { withCredentials: true })
      .then((res) => setSuppliers(res.data))
      .catch((err) => console.error(err));
  }, [baseUrl]);

  return { products, categories, suppliers, refetchProducts: fetchProducts };
}
