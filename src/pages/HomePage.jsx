import React, { useState, useEffect } from "react";
import { supabaseHelpers } from "../lib/supabase";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import ProductCard from "../components/shared/ProductCard";


export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    async function loadProducts() {
      try {
        const fetchedProducts = await supabaseHelpers.getProducts();
        setProducts(fetchedProducts.slice(0, 8)); // Get first 8 products
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);


  const companies = [
    { name: "c1", company: "c1" },
    { name: "c2", company: "c2" },
    { name: "c3", company: "c3" },
    { name: "c4", company: "c4" }
  ];


  return (
    <div>
      <section className="relative py-24 text-center overflow-hidden">
        {/* Background Image - Your chosen modern interior photo */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/assets/background-image.jpg')",
            // Fallback gradient if image doesn't load
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #7c3aed 100%)"
          }}
        ></div>
        
        {/* Light overlay for better text readability while showing your beautiful interior */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Welcome to Product Plaza
          </h1>
          <p className="text-xl text-white mb-8 leading-relaxed opacity-90">
            Discover amazing products from top companies, all in one place
          </p>
          <Link 
            to={createPageUrl("Products")} 
            className="inline-block bg-white text-blue-700 font-bold py-4 px-8 rounded-xl hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Browse Products
          </Link>
        </div>
      </section>

      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-slate-800 text-center mb-12">Shop by Company</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {companies.map((co) => (
            <Link key={co.name} to={`${createPageUrl("Products")}?company=${co.company}` }>
              <div className="p-8 border border-slate-200 rounded-xl flex items-center justify-start gap-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 bg-white hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-white font-bold text-xl">{co.name.charAt(0).toUpperCase()}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800">{co.name.toUpperCase()}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-800 text-center mb-12">Featured Products</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading
              ? Array(4).fill(0).map((_, i) => (
                  <div key={i} className="border border-slate-200 rounded-xl p-6 h-80 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse"></div>
                ))
              : products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
