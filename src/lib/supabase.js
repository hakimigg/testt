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
  console.log('Environment check:', {
    VITE_SUPABASE_URL: supabaseUrl ? 'SET' : 'NOT SET',
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? 'SET' : 'NOT SET',
    NODE_ENV: import.meta.env.MODE,
    allEnvVars: Object.keys(import.meta.env)
  })
} else {
  console.log('✅ Supabase configured successfully:', {
    url: supabaseUrl?.substring(0, 30) + '...',
    keyLength: supabaseAnonKey?.length
  })
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
    
    // If Supabase is not configured, return mock companies
    if (!supabase) {
      console.warn('Supabase not configured, returning mock companies')
      return [...mockCompanies];
    }
    
    try {
      console.log('🔍 Fetching companies from Supabase...');
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        console.error('❌ Error fetching companies:', error);
        throw error;
      }
      
      console.log('✅ Fetched companies from Supabase:', data);
      
      // If no companies in the database, return mock companies as fallback
      if (!data || data.length === 0) {
        console.warn('No companies found in database, using mock data');
        return [...mockCompanies];
      }
      
      return data;
      
    } catch (error) {
      console.error('❌ Failed to fetch companies, using mock data:', error);
      return [...mockCompanies];
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
    
    // If Supabase is not configured, simulate a successful deletion
    if (!supabase) {
      console.warn('Supabase not configured, simulating delete');
      console.log('Simulated deletion of company:', id);
      return true;
    }
    
    try {
      console.log('🚀 Attempting to delete company from database:', id);
      
      // First, verify the company exists
      const { data: existingCompany, error: fetchError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        console.error('❌ Error checking if company exists:', fetchError);
        throw new Error(`Company not found or error checking: ${fetchError.message}`);
      }
      
      console.log('📋 Company found, proceeding with deletion:', existingCompany);
      
      // Attempt to delete the company
      console.log('🔥 Attempting database deletion...');
      
      // First try: Delete with select (for immediate feedback)
      let { data, error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id)
        .select();
      
      // If first attempt fails, try without select (some RLS policies block select on delete)
      if (error) {
        console.warn('⚠️ Standard delete failed, trying alternative method:', error);
        
        const { error: deleteError } = await supabase
          .from('companies')
          .delete()
          .eq('id', id);
        
        if (deleteError) {
          console.error('❌ Company deletion failed:', deleteError);
          throw new Error(`Failed to delete company: ${deleteError.message}`);
        }
        
        console.log('✅ Company deleted using alternative method');
      } else {
        console.log('✅ Company deleted successfully:', data);
      }
      
      // Verify the company was actually deleted
      const { data: checkData } = await supabase
        .from('companies')
        .select('id')
        .eq('id', id)
        .maybeSingle();
      
      if (checkData) {
        console.error('❌ Deletion verification failed - company still exists');
        throw new Error('Company deletion verification failed - the company still exists in the database.');
      }
      
      console.log('✅ Deletion verified - company successfully removed');
      return true;
      
    } catch (error) {
      console.error('💥 Error in deleteCompany:', error);
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
