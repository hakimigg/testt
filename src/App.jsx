import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import AdminLayout from './AdminLayout'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import WishlistPage from './pages/WishlistPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminAddProduct from './pages/admin/AdminAddProduct'
import AdminProducts from './pages/admin/AdminProducts'

function App() {
  return (
    <Router basename="/testt">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/Home" element={<Layout><HomePage /></Layout>} />
        <Route path="/Products" element={<Layout><ProductsPage /></Layout>} />
        <Route path="/ProductDetail/:id" element={<Layout><ProductDetailPage /></Layout>} />
        <Route path="/Wishlist" element={<Layout><WishlistPage /></Layout>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/add-product" element={<AdminLayout><AdminAddProduct /></AdminLayout>} />
        <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
      </Routes>
    </Router>
  )
}

export default App
