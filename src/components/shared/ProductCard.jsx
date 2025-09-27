import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";

export default function ProductCard({ product }) {
  // Generate a subtle gradient based on the product name for consistent colors
  const nameHash = product.name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  const gradientColors = [
    'from-blue-400 to-blue-600',
    'from-emerald-400 to-emerald-600',
    'from-amber-400 to-amber-600',
    'from-rose-400 to-rose-600',
    'from-violet-400 to-violet-600',
    'from-cyan-400 to-cyan-600',
  ];
  const gradient = gradientColors[Math.abs(nameHash) % gradientColors.length];

  return (
    <Link 
      to={createPageUrl(`ProductDetail/${product.id}`)} 
      className="block h-full group"
    >
      <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-slate-200">
        {/* Image container */}
        <div className="relative pt-[100%] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
            {product.photos && product.photos.length > 0 ? (
              <img 
                src={product.photos[0]} 
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                <span className="text-white font-bold text-2xl">
                  {product.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          
          {/* Stock indicator */}
          <div className="absolute bottom-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              product.stock > 10 
                ? 'bg-green-100 text-green-700' 
                : product.stock > 0 
                  ? 'bg-amber-100 text-amber-700' 
                  : 'bg-rose-100 text-rose-700'
            }`}>
              {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>

        {/* Product info */}
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {product.company}
              </span>
              <div className="text-sm font-semibold text-slate-900">
                {product.price} da
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
              {product.name}
            </h3>
            
            <p className="text-sm text-slate-600 line-clamp-2 mb-4">
              {product.description}
            </p>
          </div>
          
          <button 
            className="mt-auto w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg text-sm transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={(e) => e.preventDefault()}
          >
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
}
