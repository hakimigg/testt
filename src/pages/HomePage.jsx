import React, { useState, useEffect } from "react";
import { Product } from "../entities/all";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Building, Package } from "lucide-react";
import ProductCard from "../components/shared/ProductCard";


export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    async function loadProducts() {
      try {
        const fetchedProducts = await Product.list('-created_date', 8);
        setProducts(fetchedProducts);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);


  const companies = [
    { name: "c1", icon: Building, company: "c1" },
    { name: "c2", icon: Building, company: "c2" },
    { name: "c3", icon: Building, company: "c3" },
    { name: "c4", icon: Building, company: "c4" }
  ];


  return (
    <div>
      <section className="bg-slate-100 py-20 text-center">
        <h1 className="text-5xl font-bold text-slate-800">Welcome to Product Plaza</h1>
        <p className="text-slate-600 mt-4">Your one-stop shop for everything</p>
        <Link to={createPageUrl("Products")} className="mt-6 inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700">
          Browse Products
        </Link>
      </section>


      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-10">Shop by Company</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {companies.map((co) => (
            <Link key={co.name} to={`${createPageUrl("Products")}?company=${co.company}` }>
              <div className="p-6 border rounded-lg flex items-center justify-start gap-6 hover:shadow-lg transition-shadow bg-white">
                <co.icon className="w-12 h-12 text-blue-600 flex-shrink-0" />
                <h3 className="text-2xl font-bold text-slate-800">{co.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>


      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-10">Featured Products</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading
              ? Array(4).fill(0).map((_, i) => <div key={i} className="border rounded-lg p-4 h-64 bg-slate-200 animate-pulse"></div>)
              : products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
