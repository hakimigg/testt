import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";


export default function ProductCard({ product }) {
  return (
    <Link to={createPageUrl(`ProductDetail/${product.id}` )} className="block group">
      <div className="border border-slate-200 rounded-xl p-6 h-full flex flex-col hover:shadow-xl hover:border-blue-300 transition-all duration-300 bg-white group-hover:transform group-hover:scale-105">
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg flex-grow flex items-center justify-center mb-4 min-h-[120px] overflow-hidden">
          {product.photos && product.photos.length > 0 ? (
            <img 
              src={product.photos[0]} 
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">{product.name.charAt(0).toUpperCase()}</span>
            </div>
          )}
        </div>
        <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-200">{product.name}</h3>
        <div className="flex items-center justify-between mt-3">
            <div className="text-slate-600 text-sm font-medium bg-slate-100 px-3 py-1 rounded-full">
              {product.company.toUpperCase()}
            </div>
            <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              ${product.price}
            </div>
        </div>
        <p className="text-sm text-slate-500 mt-3 line-clamp-2 leading-relaxed">{product.description}</p>
      </div>
    </Link>
  );
}
