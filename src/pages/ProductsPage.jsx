import React, { useState, useEffect } from "react";
import { supabaseHelpers } from "../lib/supabase";
import ProductCard from "../components/shared/ProductCard";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companyFilter, setCompanyFilter] = useState(searchParams.get("company") || "all");
  const { t } = useTranslation();

  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedProducts, fetchedCompanies] = await Promise.all([
          supabaseHelpers.getProducts(),
          supabaseHelpers.getCompanies()
        ]);
        setProducts(fetchedProducts);
        
        // Get unique company IDs from products (this might be where C1, C2, etc. are coming from)
        const productCompanyIds = [...new Set(fetchedProducts.map(p => p.company))];
        console.log('Product company IDs:', productCompanyIds);
        console.log('Fetched companies:', fetchedCompanies);
        
        // Define a list of allowed company IDs (whitelist approach)
        // Include both mock companies and real database companies
        const allowedCompanyIds = [
          'nokia', 'samsung', 'apple', 'premium', // Mock companies
          'techcorp', 'innovatelab', 'futuretech', 'smartdevices' // Real database companies
        ];
        
        // Filter products to only include those from allowed companies
        const filteredProducts = fetchedProducts.filter(product => 
          allowedCompanyIds.includes(product.company?.toLowerCase())
        );
        
        // Update products to only include valid ones
        setProducts(filteredProducts);
        
        // Filter out placeholder companies (like C1, C2, C3, etc.) and only keep real companies
        const realCompanies = fetchedCompanies.filter(company => {
          // Only include companies that have proper names and are in our allowed list
          return company.name && 
                 company.name.length > 2 && 
                 !company.name.match(/^C\d+$/i) && // Exclude C1, C2, C3, etc.
                 company.name !== company.id && // Exclude cases where name equals ID for placeholders
                 allowedCompanyIds.includes(company.id?.toLowerCase()); // Only allowed companies
        });
        
        // Get valid company IDs that actually have products and are allowed
        const validCompanyIds = productCompanyIds.filter(companyId => 
          allowedCompanyIds.includes(companyId?.toLowerCase())
        );
        
        console.log('Valid company IDs:', validCompanyIds);
        
        // Store full company data for display names
        setCompanyData(realCompanies);
        
        // Create filter options from valid company IDs only
        const companyOptions = ["all", ...validCompanyIds];
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
    let filtered = [...products];
    if (companyFilter !== "all") {
      filtered = products.filter(p => p.company === companyFilter);
    }
    setFilteredProducts(filtered);
  }, [products, companyFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-center text-slate-800 mb-4">
          {t('products.title')}
        </h1>
        <p className="text-xl text-slate-600 text-center mb-12">
          {t('products.subtitle')}
        </p>
      </div>
      
      <div className="flex flex-wrap gap-3 mb-12 justify-center">
        {companies.map(c => {
          const companyInfo = companyData.find(comp => comp.id === c);
          const displayName = c === "all" 
            ? t('products.allCompanies') 
            : (companyInfo?.name || c.charAt(0).toUpperCase() + c.slice(1));
          
          return (
            <button
              key={c}
              onClick={() => setCompanyFilter(c)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg transform ${
                companyFilter === c
                  ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white scale-105"
                  : "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 hover:scale-105 opacity-90 hover:opacity-100"
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
