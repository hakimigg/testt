import React, { useState, useEffect } from "react";
import { supabaseHelpers } from "../lib/supabase";
import ProductCard from "../components/shared/ProductCard";
import { useSearchParams } from "react-router-dom";


export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [companyData, setCompanyData] = useState([]); // Store full company objects for display names
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companyFilter, setCompanyFilter] = useState(searchParams.get("company") || "all");

  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedProducts, fetchedCompanies] = await Promise.all([
          supabaseHelpers.getProducts(),
          supabaseHelpers.getCompanies()
        ]);
        setProducts(fetchedProducts);
        
        // Filter out placeholder companies (like C1, C2, C3, etc.) and only keep real companies
        const realCompanies = fetchedCompanies.filter(company => {
          // Only include companies that have proper names (not single letters or placeholder patterns)
          return company.name && 
                 company.name.length > 2 && 
                 !company.name.match(/^C\d+$/i) && // Exclude C1, C2, C3, etc.
                 company.name !== company.id; // Exclude cases where name equals ID for placeholders
        });
        
        // Store full company data for display names
        setCompanyData(realCompanies);
        
        // Create filter options from real companies only
        const companyOptions = ["all", ...realCompanies.map(c => c.id)];
        setCompanies(companyOptions);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    let filtered = products;
    if (companyFilter !== "all") {
      filtered = products.filter(p => p.company === companyFilter);
    }
    setFilteredProducts(filtered);
  }, [products, companyFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">All Products</h1>
        <p className="text-lg text-slate-600">Discover our complete collection</p>
      </div>
      
      <div className="flex flex-wrap gap-3 mb-12 justify-center">
        {companies.map(c => {
          // Find the company data to get the proper display name
          const companyInfo = companyData.find(comp => comp.id === c);
          const displayName = c === "all" ? "All Companies" : (companyInfo?.name || c.charAt(0).toUpperCase() + c.slice(1));
          
          return (
            <button
              key={c}
              onClick={() => setCompanyFilter(c)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                companyFilter === c
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-md hover:transform hover:scale-105"
              }`}
            >
              {displayName}
            </button>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {isLoading
          ? Array(8).fill(0).map((_, i) => (
              <div key={i} className="border border-slate-200 rounded-xl p-6 h-80 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse"></div>
            ))
          : filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </div>
  );
}
