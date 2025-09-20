import React, { useState, useEffect } from "react";
import { Product } from "../entities/all";
import ProductCard from "../components/shared/ProductCard";
import { useLocation } from "react-router-dom";


export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();


  const [companyFilter, setCompanyFilter] = useState("all");


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const company = params.get("company");
    if (company) {
      setCompanyFilter(company);
    }
  }, [location.search]);


  useEffect(() => {
    async function loadProducts() {
      try {
        const fetchedProducts = await Product.list('-created_date', 100);
        setProducts(fetchedProducts);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);


  useEffect(() => {
    let filtered = products;
    if (companyFilter !== "all") {
      filtered = products.filter(p => p.company === companyFilter);
    }
    setFilteredProducts(filtered);
  }, [products, companyFilter]);


  const companies = ["all", "c1", "c2", "c3", "c4"];


  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-slate-800 text-center mb-10">All Products</h1>
      <div className="flex gap-4 mb-8 justify-center">
        {companies.map(c => (
          <button
            key={c}
            onClick={() => setCompanyFilter(c)}
            className={`px-4 py-2 rounded-md font-medium ${
              companyFilter === c
                ? "bg-blue-600 text-white"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            {c === "all" ? "All Companies" : c.toUpperCase()}
          </button>
        ))}
      </div>


      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {isLoading
          ? Array(8).fill(0).map((_, i) => <div key={i} className="border rounded-lg p-4 h-64 bg-slate-200 animate-pulse"></div>)
          : filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </div>
  );
}
