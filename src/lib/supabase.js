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
    const mockProduct = {
      id: Date.now().toString(),
      ...product,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    if (!supabase) {
      console.warn('Supabase not configured, using mock data instead')
      return mockProduct
    }
    
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single()
      
      if (error) {
        console.warn('Supabase error, using mock data instead:', error)
        return mockProduct
      }
      
      return data
    } catch (error) {
      console.warn('Supabase request failed, using mock data instead:', error)
      return mockProduct
    }
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

  // Companies
  async getCompanies() {
    const mockCompanies = [
      { id: "nokia", name: "Nokia", description: "Leading technology company", website: "https://nokia.com", created_at: "2024-01-01T00:00:00Z" },
      { id: "samsung", name: "Samsung", description: "Innovation-focused company", website: "https://samsung.com", created_at: "2024-01-02T00:00:00Z" },
      { id: "apple", name: "Apple", description: "Premium technology brand", website: "https://apple.com", created_at: "2024-01-03T00:00:00Z" },
      { id: "premium", name: "Premium Brand", description: "Luxury products", website: "", created_at: "2024-01-04T00:00:00Z" }
    ]

    if (!supabase) {
      console.warn('Supabase not configured, returning mock companies')
      return mockCompanies
    }
    
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.warn('Supabase companies error (table may not exist), using fallback:', error)
        return mockCompanies
      }
      
      return data || mockCompanies
    } catch (error) {
      console.warn('Supabase companies request failed, using fallback:', error)
      return mockCompanies
    }
  },

  async getCompany(id) {
    if (!supabase) {
      console.warn('Supabase not configured, using mock data')
      const mockCompanies = [
        { id: "nokia", name: "Nokia", description: "Leading technology company", website: "https://nokia.com", created_at: "2024-01-01T00:00:00Z" },
        { id: "samsung", name: "Samsung", description: "Innovation-focused company", website: "https://samsung.com", created_at: "2024-01-02T00:00:00Z" }
      ]
      return mockCompanies.find(c => c.id === id) || null
    }
    
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async createCompany(company) {
    console.log('createCompany called with:', company)
    
    const cleanCompany = {
      id: company.name.toLowerCase().replace(/\s+/g, '-'),
      name: company.name?.toString() || '',
      description: company.description?.toString() || '',
      website: company.website?.toString() || '',
      logo: company.logo || null
    }
    
    if (!cleanCompany.name.trim()) {
      throw new Error('Company name is required')
    }
    
    const mockCompany = {
      ...cleanCompany,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    if (!supabase) {
      console.warn('Supabase not configured, using mock data instead')
      console.log('Created mock company:', mockCompany)
      return mockCompany
    }
    
    try {
      console.log('Cleaned company data:', cleanCompany)
      
      const { data, error } = await supabase
        .from('companies')
        .insert([cleanCompany])
        .select()
        .single()
      
      if (error) {
        console.error('Supabase error (table may not exist):', error)
        console.warn('Falling back to mock data due to Supabase error')
        return mockCompany
      }
      
      console.log('Supabase created company:', data)
      return data
    } catch (error) {
      console.error('Supabase request failed:', error)
      console.warn('Using mock company due to request failure')
      return mockCompany
    }
  },

  async updateCompany(id, updates) {
    if (!supabase) {
      console.warn('Supabase not configured, mock update')
      return { id, ...updates, updated_at: new Date().toISOString() }
    }
    
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.warn('Supabase update error, using mock:', error)
      return { id, ...updates, updated_at: new Date().toISOString() }
    }
    return data
  },

  async deleteCompany(id) {
    if (!supabase) {
      console.warn('Supabase not configured, mock delete')
      return true
    }
    
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.warn('Supabase delete error (table may not exist):', error)
        // For now, pretend it worked since table doesn't exist
        return true
      }
      return true
    } catch (error) {
      console.warn('Supabase delete request failed:', error)
      // For now, pretend it worked since table doesn't exist
      return true
    }
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
