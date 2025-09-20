import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { Package, Tag, Building } from "lucide-react";


export default function ProductCard({ product }) {
  return (
    <Link to={createPageUrl(`ProductDetail/${product.id}` )} className="block group">
      <div className="border rounded-lg p-4 h-full flex flex-col hover:shadow-lg transition-shadow bg-white">
        <div className="bg-slate-100 rounded-md flex-grow flex items-center justify-center p-4 mb-4">
          <Package className="w-24 h-24 text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600">{product.name}</h3>
        <div className="flex items-center justify-between mt-2">
            <div className="text-slate-600 flex items-center gap-1 text-sm"><Building className="w-4 h-4" /> {product.company}</div>
            <div className="text-xl font-bold text-blue-600">${product.price}</div>
        </div>
        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{product.description}</p>
      </div>
    </Link>
  );
}
