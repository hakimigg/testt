// Mock entities for Product Plaza demo
import { mockProducts, mockUsers, mockWishlist } from '../utils.js';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Product entity
export class Product {
  static async list(sortBy = '-created_date', limit = 100) {
    await delay(500); // Simulate API call
    let products = [...mockProducts];
    
    if (sortBy === '-created_date') {
      products = products.reverse();
    }
    
    return products.slice(0, limit);
  }

  static async filter(filters, sortBy = '', limit = 100) {
    await delay(300);
    let products = [...mockProducts];
    
    if (filters.id) {
      products = products.filter(p => p.id === filters.id);
    }
    
    if (filters.company) {
      products = products.filter(p => p.company === filters.company);
    }
    
    return products.slice(0, limit);
  }

  static async create(productData) {
    console.log('Product.create called with:', productData);
    await delay(800);
    const newProduct = {
      id: Date.now().toString(),
      ...productData,
      specs: productData.specs || [],
      tags: productData.tags || []
    };
    console.log('Created product:', newProduct);
    mockProducts.push(newProduct);
    return newProduct;
  }

  static async update(id, productData) {
    await delay(500);
    const index = mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      mockProducts[index] = { ...mockProducts[index], ...productData };
      return mockProducts[index];
    }
    throw new Error('Product not found');
  }

  static async delete(id) {
    await delay(300);
    const index = mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      mockProducts.splice(index, 1);
      return true;
    }
    throw new Error('Product not found');
  }
}

// Mock User entity
export class User {
  static async me() {
    await delay(200);
    // Simulate logged in user
    return mockUsers[0];
  }

  static async loginWithRedirect(returnUrl) {
    await delay(100);
    // In a real app, this would redirect to auth provider
    console.log('Redirecting to login...', returnUrl);
    // For demo, we'll just simulate successful login
    return mockUsers[0];
  }

  static async logout() {
    await delay(100);
    console.log('Logging out...');
    return true;
  }
}

// Mock UserWishlist entity
export class UserWishlist {
  static async filter(filters) {
    await delay(200);
    let wishlist = [...mockWishlist];
    
    if (filters.user_email) {
      wishlist = wishlist.filter(w => w.user_email === filters.user_email);
    }
    
    if (filters.product_id) {
      wishlist = wishlist.filter(w => w.product_id === filters.product_id);
    }
    
    return wishlist;
  }

  static async create(wishlistData) {
    await delay(300);
    const newWishlistItem = {
      id: Date.now().toString(),
      ...wishlistData
    };
    mockWishlist.push(newWishlistItem);
    return newWishlistItem;
  }

  static async delete(id) {
    await delay(200);
    const index = mockWishlist.findIndex(w => w.id === id);
    if (index !== -1) {
      mockWishlist.splice(index, 1);
      return true;
    }
    throw new Error('Wishlist item not found');
  }
}
