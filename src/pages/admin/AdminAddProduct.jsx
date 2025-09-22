import React, { useState } from "react";
import { supabaseHelpers } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import PhotoUpload from "../../components/ui/PhotoUpload";

export default function AdminAddProduct() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({ name: "", description: "", company: "c1", price: 0, stock: 0 });
  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Convert photos to base64 strings for storage
      const photoUrls = photos.map(photo => photo.preview);
      
      const newProduct = await supabaseHelpers.createProduct({ 
        ...product, 
        price: Number(product.price), 
        stock: Number(product.stock),
        photos: photoUrls // Store photo data as JSON array
      });
      setSuccessMessage(`Product "${newProduct.name}" created successfully!`);
      setProduct({ name: "", description: "", company: "c1", price: 0, stock: 0 });
      setPhotos([]);
      
      // Auto-redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate(createPageUrl("admin"));
      }, 2000);
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Error creating product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Add New Product
        </h1>
        <p className="text-lg text-slate-600">Add a new product to your inventory</p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-xl">
          <p className="font-semibold">{successMessage}</p>
          <p className="text-sm">Redirecting to dashboard...</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-lg border border-slate-200">
        {/* Photo Upload Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Product Photos</h3>
          <PhotoUpload 
            onPhotosChange={setPhotos}
            maxFiles={5}
            maxSizeInMB={5}
            existingPhotos={photos}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Product Name *</label>
              <Input 
                value={product.name} 
                onChange={e => setProduct({ ...product, name: e.target.value })} 
                required 
                className="w-full p-4 border border-slate-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                placeholder="Enter product name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <Textarea 
                value={product.description} 
                onChange={e => setProduct({ ...product, description: e.target.value })} 
                className="w-full p-4 border border-slate-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 min-h-[120px]"
                placeholder="Describe your product"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Company *</label>
              <select 
                value={product.company} 
                onChange={e => setProduct({ ...product, company: e.target.value })} 
                className="w-full p-4 border border-slate-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white"
              >
                <option value="c1">C1</option>
                <option value="c2">C2</option>
                <option value="c3">C3</option>
                <option value="c4">C4</option>
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Price ($) *</label>
              <Input 
                type="number" 
                value={product.price} 
                onChange={e => setProduct({ ...product, price: e.target.value })} 
                required 
                className="w-full p-4 border border-slate-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Stock Quantity *</label>
              <Input 
                type="number" 
                value={product.stock} 
                onChange={e => setProduct({ ...product, stock: e.target.value })} 
                required 
                className="w-full p-4 border border-slate-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                placeholder="0"
                min="0"
              />
            </div>

            {/* Product Preview */}
            <div className="bg-slate-50 rounded-xl p-4">
              <h3 className="font-semibold text-slate-700 mb-3">Product Preview</h3>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                {/* Product Image or Placeholder */}
                <div className="mb-3">
                  {photos.length > 0 ? (
                    <img 
                      src={photos[0].preview} 
                      alt="Product preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">
                        {product.name ? product.name.charAt(0).toUpperCase() : "P"}
                      </span>
                    </div>
                  )}
                </div>
                <h4 className="font-bold text-slate-800">{product.name || "Product Name"}</h4>
                <p className="text-sm text-slate-600 mt-1">{product.description || "Product description"}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">
                    {product.company.toUpperCase()}
                  </span>
                  <span className="font-bold text-purple-600">
                    ${product.price || "0.00"}
                  </span>
                </div>
                {photos.length > 1 && (
                  <p className="text-xs text-slate-500 mt-2">
                    +{photos.length - 1} more photo{photos.length > 2 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Button 
            type="button"
            onClick={() => navigate(createPageUrl("admin"))}
            className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-all duration-200"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isSubmitting ? "Creating Product..." : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
