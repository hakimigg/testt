import { createClient } from '@supabase/supabase-js'
import { mockProducts } from '../utils.js'
import { mockCompanies } from '../entities/all.js'

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
    console.log('🔍 getCompanies called');
    console.log('📦 mockCompanies:', mockCompanies);
    
    if (!supabase) {
      console.warn('Supabase not configured, returning mock companies')
      console.log('✅ Returning mockCompanies:', mockCompanies);
      // Always return a copy of the array to prevent mutations
      return [...mockCompanies]
    }
    
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.warn('Supabase companies error (table may not exist), using fallback:', error)
        console.log('Fallback to mockCompanies:', mockCompanies)
        return [...mockCompanies]
      }
      
      console.log('✅ Supabase returned companies:', data)
      return data || [...mockCompanies]
    } catch (error) {
      console.warn('Supabase companies request failed, using fallback:', error)
      console.log('Fallback to mockCompanies:', mockCompanies)
      return [...mockCompanies]
    }
  },

  async getCompany(id) {
    if (!supabase) {
      console.warn('Supabase not configured, using mock data')
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
    console.log('🗑️ deleteCompany called with ID:', id);
    console.log('🔗 Supabase client configured:', !!supabase);
    
    if (!supabase) {
      console.warn('Supabase not configured, simulating delete')
      // Don't actually modify the shared mockCompanies array
      // Just simulate a successful deletion
      console.log('Simulated deletion of company:', id)
      return true
    }
    
    try {
      console.log('🚀 Attempting to delete company from database:', id);
      
      // First, let's check if the company exists
      const { data: existingCompany, error: fetchError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single()
      
      if (fetchError) {
        console.error('Error checking if company exists:', fetchError);
        throw new Error(`Company not found or error checking: ${fetchError.message}`);
      }
      
      console.log('📋 Company found, proceeding with deletion:', existingCompany);
      
      // Now delete the company
      const { data, error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id)
        .select() // This will return the deleted row(s)
      
      if (error) {
        console.error('❌ Supabase delete error:', error)
        throw new Error(`Failed to delete company: ${error.message}`)
      }
      
      console.log('✅ Successfully deleted company from Supabase:', data);
      return true
    } catch (error) {
      console.error('💥 Supabase delete request failed:', error)
      throw error
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
