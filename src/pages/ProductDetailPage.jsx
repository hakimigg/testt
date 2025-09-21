import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Product, User, UserWishlist } from "../entities/all";
import { Button } from "../components/ui/button";


export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);


  useEffect(() => {
    async function loadUser() {
      try {
        setUser(await User.me());
      } catch (e) { /* not logged in */ }
    }
    loadUser();
  }, []);


  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      try {
        const results = await Product.filter({ id: id }, '', 1);
        if (results.length > 0) {
          setProduct(results[0]);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [id]);


  useEffect(() => {
    async function checkWishlist() {
      if (user && product) {
        const wishlistItem = await UserWishlist.filter({ user_email: user.email, product_id: product.id });
        setIsWishlisted(wishlistItem.length > 0);
      }
    }
    checkWishlist();
  }, [user, product]);


  const handleWishlistToggle = async () => {
    if (!user) {
      await User.loginWithRedirect(window.location.href);
      return;
    }
    if (isWishlisted) {
      const items = await UserWishlist.filter({ user_email: user.email, product_id: product.id });
      if (items.length > 0) await UserWishlist.delete(items[0].id);
      setIsWishlisted(false);
    } else {
      await UserWishlist.create({ user_email: user.email, product_id: product.id });
      setIsWishlisted(true);
    }
  };


  if (isLoading) return <div className="text-center p-10">Loading...</div>;
  if (!product) return <div className="text-center p-10">Product not found.</div>;


  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="mb-8 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
      >
        ← Back
      </Button>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="border border-slate-200 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-12 min-h-[400px]">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-white font-bold text-4xl">{product.name.charAt(0).toUpperCase()}</span>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">{product.name}</h1>
          <p className="text-lg text-slate-600 mb-6 leading-relaxed">{product.description}</p>
          <div className="mb-6 text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">${product.price}</div>
          <div className="flex flex-col gap-3 mb-4">
            <div className="bg-slate-100 px-4 py-2 rounded-lg">
              <span className="font-medium text-slate-700">Company:</span>
              <span className="ml-2 text-slate-600 font-semibold">{product.company.toUpperCase()}</span>
            </div>
            <div className="bg-slate-100 px-4 py-2 rounded-lg">
              <span className="font-medium text-slate-700">Stock:</span>
              <span className="ml-2 text-slate-600 font-semibold">{product.stock} units</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {product.tags?.map(tag => <div key={tag} className="bg-blue-100 text-blue-700 px-3 py-1 text-sm rounded-full font-medium">{tag}</div>)}
          </div>
          <div className="flex gap-4">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 flex-1 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
              Add to Cart
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={handleWishlistToggle}
              className={`px-6 py-3 border-2 transition-all duration-200 ${
                isWishlisted 
                  ? 'border-red-500 text-red-500 bg-red-50 hover:bg-red-100' 
                  : 'border-slate-300 text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              {isWishlisted ? '♥ Wishlisted' : '♡ Wishlist'}
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-slate-800 mb-8">Specifications</h2>
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {product.specs?.map((spec, index) => (
            <div key={index} className={`flex justify-between p-6 transition-colors duration-150 ${
              index % 2 === 0 ? 'bg-gradient-to-r from-slate-50 to-white' : 'bg-white'
            } hover:bg-blue-50`}>
              <span className="font-semibold text-slate-700">{spec.spec}</span>
              <span className="text-slate-600 font-medium">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
