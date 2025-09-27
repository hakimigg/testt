import React, { useState, useEffect } from "react";
import { supabaseHelpers } from "../../lib/supabase";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { useTranslation } from "react-i18next";
export default function AdminProducts() {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const fetchedProducts = await supabaseHelpers.getProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error loading products:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  const [companies, setCompanies] = useState([{ id: 'all', name: t('adminProducts.allCompanies') }]);
  
  // Load companies from database
  useEffect(() => {
    async function loadCompanies() {
      try {
        const dbCompanies = await supabaseHelpers.getCompanies();
        setCompanies([
          { id: 'all', name: t('adminProducts.allCompanies') },
          ...dbCompanies
        ]);
      } catch (error) {
        console.error('Error loading companies:', error);
      }
    }
    loadCompanies();
  }, [t]);
  const filteredProducts = filter === "all"
    ? products
    : products.filter(p => p.company === filter);

  // Refresh products from database
  const refreshProducts = async () => {
    try {
      const fetchedProducts = await supabaseHelpers.getProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      console.error('Error refreshing products:', err);
      setError(err);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm(t('adminProducts.confirmDelete'))) {
      try {
        await supabaseHelpers.deleteProduct(productId);
        // Refresh the products list after deletion
        await refreshProducts();
      } catch (error) {
        alert(t('adminProducts.deleteError'));
      }
    }
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-red-600">
        Error: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-slate-200 rounded w-1/3"></div>
          <div className="h-6 bg-slate-200 rounded w-1/2"></div>
        </div>
        <p className="text-center text-slate-500 mt-4">
          {t('adminProducts.loading')}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-center text-slate-800 mb-4">
          {t('adminProducts.title')}
        </h1>
        <p className="text-xl text-slate-600 text-center">
          {t('adminProducts.subtitle')}
        </p>
      </div>

      {/* Filter and Stats */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-semibold text-slate-700">
            {t('adminProducts.filterByCompany')}:
          </span>
          <div className="flex flex-wrap gap-2">
            {companies.map((company) => (
              <button
                key={company.id}
                onClick={() => setFilter(company.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === company.id
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {company.id === 'all' ? t('adminProducts.allCompanies') : company.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-slate-400 text-4xl mb-4">📦</div>
            <p className="text-slate-500 text-lg">{t('adminProducts.noProducts')}</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} className="h-full">
              <Link to={createPageUrl(`ProductDetail/${product.id}`)} className="block group h-full">
                <div className="border border-slate-200 rounded-xl p-6 flex flex-col h-full bg-white hover:shadow-xl hover:border-blue-300 transition-all duration-300 group-hover:transform group-hover:scale-105">
                  {/* Product Image */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg flex-grow flex items-center justify-center mb-4 min-h-[120px] overflow-hidden">
                    {product.photos && product.photos.length > 0 ? (
                      <img 
                        src={product.photos[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-xl">{product.name?.charAt(0)?.toUpperCase() || 'P'}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-200 mb-2">{product.name}</h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-600 text-sm font-medium bg-slate-100 px-3 py-1 rounded-full">
                        {product.company?.toUpperCase() || 'N/A'}
                      </span>
                      <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                        {product.price} da
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.stock > 10
                          ? 'bg-green-100 text-green-700'
                          : product.stock > 0
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                      }`}>
                        {t('common.stock')}: {product.stock}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
              
              {/* Admin Actions */}
              <div className="mt-2 flex justify-end">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete(product.id);
                  }}
                  className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {t('common.delete')}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Product Button */}
      <div className="mt-12 text-center">
        <Link
          to="/admin/add-product"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2 text-base"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          {t('adminProducts.addNewProduct')}
        </Link>
      </div>
    </div>
  );
}
