import React, { useState } from "react";
import { Product, User } from "../entities/all";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";


export default function AddProductPage() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({ name: "", description: "", company: "c1", price: 0, stock: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await User.me();
    } catch (err) {
      await User.loginWithRedirect(window.location.href);
      return;
    }
    setIsSubmitting(true);
    try {
      const newProduct = await Product.create({ ...product, price: Number(product.price), stock: Number(product.stock) });
      navigate(createPageUrl(`ProductDetail/${newProduct.id}` ));
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-800 text-center mb-8">Add a New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 border rounded-lg shadow-sm">
        <div>
          <label className="font-medium">Product Name</label>
          <Input value={product.name} onChange={e => setProduct({ ...product, name: e.target.value })} required />
        </div>
        <div>
          <label className="font-medium">Description</label>
          <Textarea value={product.description} onChange={e => setProduct({ ...product, description: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Company</label>
            <select value={product.company} onChange={e => setProduct({ ...product, company: e.target.value })} className="w-full p-2 border rounded-md">
              <option value="c1">c1</option>
              <option value="c2">c2</option>
              <option value="c3">c3</option>
              <option value="c4">c4</option>
            </select>
          </div>
          <div>
            <label className="font-medium">Price</label>
            <Input type="number" value={product.price} onChange={e => setProduct({ ...product, price: e.target.value })} required />
          </div>
        </div>
        <div>
          <label className="font-medium">Stock</label>
          <Input type="number" value={product.stock} onChange={e => setProduct({ ...product, stock: e.target.value })} required />
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
          {isSubmitting ? "Submitting..." : "Add Product"}
        </Button>
      </form>
    </div>
  );
}
