import React, { useState, useEffect } from "react";
import { Product, UserWishlist, User } from "../entities/all";
import ProductCard from "../components/shared/ProductCard";
import { Heart } from "lucide-react";
import { Button } from "../components/ui/button";


export default function WishlistPage() {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);


  useEffect(() => {
    async function loadUserAndWishlist() {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        const wishlistItems = await UserWishlist.filter({ user_email: currentUser.email });
        const productIds = wishlistItems.map(item => item.product_id);
        if (productIds.length > 0) {
          const products = await Promise.all(
            productIds.map(async id => (await Product.filter({ id }, '', 1))[0])
          );
          setWishlistProducts(products.filter(Boolean));
        }
      } catch (e) { /* not logged in */ }
      finally {
        setIsLoading(false);
      }
    }
    loadUserAndWishlist();
  }, []);


  if (isLoading) return <div className="text-center p-10">Loading...</div>;


  if (!user) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold mb-4">Please log in to see your wishlist.</h2>
        <Button onClick={() => User.loginWithRedirect(window.location.href)}>Log In</Button>
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-slate-800 text-center mb-10 flex items-center justify-center gap-3">
        <Heart className="w-8 h-8 text-red-500" /> Your Wishlist
      </h1>
      {wishlistProducts.length === 0 ? (
        <p className="text-center text-slate-600">Your wishlist is empty.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlistProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
}
