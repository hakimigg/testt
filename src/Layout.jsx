import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "./utils";
import { Store, Home, ShoppingBag, PlusCircle, Heart } from "lucide-react";


export default function Layout({ children }) {
  const location = useLocation();


  const navigation = [
    { name: "Home", url: createPageUrl("Home"), icon: Home },
    { name: "Products", url: createPageUrl("Products"), icon: ShoppingBag },
    { name: "Add Product", url: createPageUrl("AddProduct"), icon: PlusCircle },
    { name: "Wishlist", url: createPageUrl("Wishlist"), icon: Heart }
  ];


  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to={createPageUrl("Home")} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
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
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>


      <main>{children}</main>


      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-slate-200">
        <div className="flex justify-around py-2">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.url);
            return (
              <Link
                key={item.name}
                to={item.url}
                className={`flex flex-col items-center py-2 px-3 rounded-lg ${
                  isActive ? 'text-blue-600' : 'text-slate-500'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs mt-1 font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="h-20 md:hidden"></div>
    </div>
  );
}
