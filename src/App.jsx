import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import AddProductPage from './pages/AddProductPage'
import WishlistPage from './pages/WishlistPage'

function App() {
  return (
    <Router basename="/product-plaza">
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Home" element={<HomePage />} />
          <Route path="/Products" element={<ProductsPage />} />
          <Route path="/ProductDetail/:id" element={<ProductDetailPage />} />
          <Route path="/AddProduct" element={<AddProductPage />} />
          <Route path="/Wishlist" element={<WishlistPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
