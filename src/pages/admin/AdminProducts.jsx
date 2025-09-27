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

  const companies = ["all", "c1", "c2", "c3", "c4"];
  const filteredProducts = filter === "all"
    ? products
    : products.filter(p => p.company === filter);

  const handleDelete = async (productId) => {
    if (window.confirm(t('adminProducts.confirmDelete'))) {
      try {
        await supabaseHelpers.deleteProduct(productId);
        setProducts(products.filter(p => p.id !== productId));
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
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          {t('adminProducts.title')}
        </h1>
        <p className="text-lg text-slate-600">{t('adminProducts.subtitle')}</p>
      </div>

      {/* Filter and Stats */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-700">
              {t('adminProducts.filterByCompany')}:
            </span>
            <div className="flex gap-2 flex-wrap">
              {companies.map(company => (
                <button
                  key={company}
                  onClick={() => setFilter(company)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    filter === company
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {company === "all" ? t('common.all') : company.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="text-sm text-slate-600">
            {t('adminProducts.showingResults', { shown: filteredProducts.length, total: products.length })}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  {t('adminProducts.tableHeaders.product')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  {t('adminProducts.tableHeaders.company')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  {t('adminProducts.tableHeaders.price')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  {t('adminProducts.tableHeaders.stock')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  {t('adminProducts.tableHeaders.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="text-slate-400 mb-2">📦</div>
                    <p className="text-slate-500">{t('adminProducts.noProducts')}</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {product.name?.charAt(0)?.toUpperCase() || 'P'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800">{product.name}</h3>
                          <p className="text-sm text-slate-500 line-clamp-1">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {product.company}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock > 10
                          ? 'bg-green-100 text-green-700'
                          : product.stock > 0
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          to={createPageUrl(`ProductDetail/${product.id}`)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors duration-200"
                        >
                          {t('common.view')}
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors duration-200"
                        >
                          {t('common.delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Button */}
      <div className="mt-8 text-center">
        <Link
          to="/admin/add-product"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 w-fit mx-auto"
        >
          <span>+</span> {t('adminProducts.addNewProduct')}
        </Link>
      </div>
    </div>
  );
}
