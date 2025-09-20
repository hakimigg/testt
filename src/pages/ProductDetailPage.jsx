import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Product, User, UserWishlist } from "../entities/all";
import { Heart, ArrowLeft, Tag, Package, Building, ShoppingCart } from "lucide-react";
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="border rounded-lg bg-slate-100 flex items-center justify-center p-8">
          <Package className="w-48 h-48 text-slate-400" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-slate-800">{product.name}</h1>
          <p className="text-slate-600 mt-2">{product.description}</p>
          <div className="mt-4 text-3xl font-bold text-blue-600">${product.price}</div>
          <div className="flex items-center gap-4 mt-4 text-slate-600">
            <div className="flex items-center gap-2"><Building className="w-4 h-4" /> Company: {product.company}</div>
            <div className="flex items-center gap-2"><Package className="w-4 h-4" /> Stock: {product.stock}</div>
          </div>
          <div className="flex gap-2 mt-2">
            {product.tags?.map(tag => <div key={tag} className="bg-slate-200 text-slate-700 px-2 py-1 text-xs rounded-full">{tag}</div>)}
          </div>
          <div className="flex gap-4 mt-6">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 flex-1"><ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart</Button>
            <Button size="lg" variant="outline" onClick={handleWishlistToggle}>
              <Heart className={`w-5 h-5 mr-2 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}` } /> Wishlist
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Specifications</h2>
        <div className="border rounded-lg">
          {product.specs?.map((spec, index) => (
            <div key={index} className={`flex justify-between p-4 ${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}` }>
              <span className="font-medium text-slate-700">{spec.spec}</span>
              <span className="text-slate-600">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
