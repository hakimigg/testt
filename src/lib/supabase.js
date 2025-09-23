import { createClient } from '@supabase/supabase-js'
import { mockProducts } from '../utils.js'

// These will be your Supabase project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase credentials are available
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Log warning if Supabase is not configured
if (!isSupabaseConfigured) {
  console.warn('Supabase credentials not found. Some features may not work.')
}

// Helper functions for common operations
export const supabaseHelpers = {
  // Products
  async getProducts() {
    if (!supabase) {
      console.warn('Supabase not configured, returning mock products array')
      return mockProducts
    }
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getProduct(id) {
    if (!supabase) {
      console.warn('Supabase not configured, using mock data')
      return mockProducts.find(p => p.id === id) || null
    }
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async createProduct(product) {
    console.log('createProduct called with:', product)
    
    if (!supabase) {
      console.warn('Supabase not configured, using mock data instead')
      // Fallback to mock behavior
      const newProduct = {
        id: Date.now().toString(),
        ...product,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      console.log('Created mock product:', newProduct)
      return newProduct
    }
    
    console.log('Using Supabase to create product')
    
    // Clean the product data to only include fields that exist in the schema
    const cleanProduct = {
      name: product.name?.toString() || '',
      description: product.description?.toString() || '',
      company: product.company?.toString() || 'c1',
      price: Number(product.price) || 0,
      stock: Number(product.stock) || 0,
      photos: product.photos || []
    }
    
    // Validate required fields
    if (!cleanProduct.name.trim()) {
      throw new Error('Product name is required')
    }
    
    console.log('Cleaned product data:', cleanProduct)
    
    const { data, error } = await supabase
      .from('products')
      .insert([cleanProduct])
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error:', error)
      console.warn('Falling back to mock data due to Supabase error')
      
      // Fallback to mock behavior if Supabase fails
      const mockProduct = {
        id: Date.now().toString(),
        ...cleanProduct,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      console.log('Created fallback mock product:', mockProduct)
      return mockProduct
    }
    console.log('Supabase created product:', data)
    return data
  },

  async updateProduct(id, updates) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteProduct(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },


  // Authentication
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (error) throw error
    return data
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return true
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Real-time subscriptions
  subscribeToProducts(callback) {
    return supabase
      .channel('products')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' }, 
        callback
      )
      .subscribe()
  }
}
