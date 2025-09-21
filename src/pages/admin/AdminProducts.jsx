import React, { useState, useEffect } from "react";
import { Product } from "../../entities/all";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");

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

  const companies = ["all", "c1", "c2", "c3", "c4"];
  const filteredProducts = filter === "all" 
    ? products 
    : products.filter(p => p.company === filter);

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await Product.delete(productId);
        setProducts(products.filter(p => p.id !== productId));
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Manage Products
        </h1>
        <p className="text-lg text-slate-600">View and manage all products in your inventory</p>
      </div>

      {/* Filter and Stats */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-700">Filter by Company:</span>
            <div className="flex gap-2">
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
                  {company === "all" ? "All" : company.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="text-sm text-slate-600">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Company</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse"></div>
                        <div className="space-y-2">
                          <div className="w-32 h-4 bg-slate-200 rounded animate-pulse"></div>
                          <div className="w-24 h-3 bg-slate-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="w-16 h-4 bg-slate-200 rounded animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="w-12 h-4 bg-slate-200 rounded animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="w-8 h-4 bg-slate-200 rounded animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="w-20 h-8 bg-slate-200 rounded animate-pulse"></div></td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {product.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800">{product.name}</h3>
                          <p className="text-sm text-slate-500 line-clamp-1">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-sm font-medium">
                        {product.company.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-green-600">${product.price}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${
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
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors duration-200"
                        >
                          Delete
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
          to={createPageUrl("admin/add-product")}
          className="inline-block bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200"
        >
          Add New Product
        </Link>
      </div>
    </div>
  );
}
