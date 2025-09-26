import React, { useState, useEffect } from "react";
import { supabaseHelpers } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../../utils";

export default function AdminAddProduct() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({ name: "", description: "", company: "nokia", price: 0 });
  const [photos, setPhotos] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  // Load companies from database
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setIsLoadingCompanies(true);
        const fetchedCompanies = await supabaseHelpers.getCompanies();
        setCompanies(fetchedCompanies);

        // Set default company to first available if current one doesn't exist
        if (fetchedCompanies.length > 0 && !fetchedCompanies.find(c => c.id === product.company)) {
          setProduct({ ...product, company: fetchedCompanies[0].id });
        }
      } catch (error) {
        console.error('Error loading companies:', error);
      } finally {
        setIsLoadingCompanies(false);
      }
    };

    loadCompanies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!product.name || !product.name.trim()) {
      alert('Please enter a product name');
      return;
    }
    
    if (isNaN(Number(product.price)) || Number(product.price) < 0) {
      alert('Please enter a valid price');
      return;
    }
    
    setIsSubmitting(true);
    setSuccessMessage("");
    
    try {
      const productToCreate = { 
        ...product, 
        price: Number(product.price),
        photos: [] // Simplified for now
      };
      
      const newProduct = await supabaseHelpers.createProduct(productToCreate);
      setSuccessMessage(`Product "${newProduct.name}" created successfully!`);
      setProduct({ name: "", description: "", company: "nokia", price: 0 });
      
      // Auto-redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate(createPageUrl("admin"));
      }, 2000);
    } catch (error) {
      console.error("Error creating product:", error);
      alert(`Error creating product: ${error.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Add New Product
        </h1>
        <p className="text-lg text-slate-600">Add a new product to your inventory</p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-xl">
          <p className="font-semibold">{successMessage}</p>
          <p className="text-sm">Redirecting to dashboard...</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Product Name *</label>
              <input 
                type="text"
                value={product.name} 
                onChange={e => setProduct({ ...product, name: e.target.value })} 
                required 
                className="w-full p-4 border border-slate-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                placeholder="Enter product name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea 
                value={product.description} 
                onChange={e => setProduct({ ...product, description: e.target.value })} 
                className="w-full p-4 border border-slate-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 min-h-[120px]"
                placeholder="Describe your product"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Company *</label>
              {isLoadingCompanies ? (
                <div className="w-full p-4 border border-slate-300 rounded-xl bg-slate-50 text-slate-500">
                  Loading companies...
                </div>
              ) : (
                <select
                  value={product.company}
                  onChange={e => setProduct({ ...product, company: e.target.value })}
                  className="w-full p-4 border border-slate-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white"
                >
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Price (da) *</label>
              <input 
                type="number" 
                value={product.price} 
                onChange={e => setProduct({ ...product, price: e.target.value })} 
                required 
                className="w-full p-4 border border-slate-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            {/* Product Preview */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-700 mb-4 text-center">Product Preview</h3>
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                <div className="mb-4">
                  <div className="w-full h-32 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {product.name ? product.name.charAt(0).toUpperCase() : "P"}
                    </span>
                  </div>
                </div>
                <h4 className="font-bold text-slate-800 text-center mb-2">{product.name || "Product Name"}</h4>
                <p className="text-sm text-slate-600 text-center mb-3">{product.description || "Product description"}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-600">
                    {companies.find(c => c.id === product.company)?.name?.toUpperCase() || product.company.toUpperCase()}
                  </span>
                  <span className="font-bold text-purple-600">
                    {product.price || "0.00"} da
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button 
            type="button"
            onClick={() => navigate(createPageUrl("admin"))}
            className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
          >
            {isSubmitting ? "Creating Product..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
