import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "./utils";


export default function Layout({ children }) {
  const location = useLocation();


  const navigation = [
    { name: "Home", url: createPageUrl("Home") },
    { name: "Products", url: createPageUrl("Products") },
    { name: "Add Product", url: createPageUrl("AddProduct") }
  ];


  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to={createPageUrl("Home")} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">PP</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Product Plaza
                </h1>
              </div>
            </Link>


            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <Link
                    key={item.name}
                    to={item.url}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
                        : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md'
                    }`}
                  >
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>


      <main>{children}</main>


      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-slate-200 shadow-lg">
        <div className="flex justify-around py-3">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.url);
            return (
              <Link
                key={item.name}
                to={item.url}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'text-blue-600 bg-blue-50 shadow-md transform scale-105' 
                    : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold mb-1 ${
                  isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {item.name.charAt(0)}
                </div>
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="h-20 md:hidden"></div>
    </div>
  );
}
