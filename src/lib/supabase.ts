import { createClient } from '@supabase/supabase-js'

// Konfigurasi Supabase - Menggunakan environment variables dari Vite
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validasi environment variables
const isConfigured = SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  SUPABASE_URL !== 'https://your-project-url.supabase.co' &&
  SUPABASE_ANON_KEY !== 'your-anon-key-here'

// Buat client dengan fallback untuk development
export const supabase = isConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : createClient('https://placeholder.supabase.co', 'placeholder-key')

// Export status konfigurasi
export const isSupabaseConfigured = isConfigured

// Test koneksi Supabase
export const testSupabaseConnection = async () => {
  if (!isSupabaseConfigured) {
    console.warn('Supabase belum dikonfigurasi dengan benar')
    return false
  }

  try {
    const { data, error } = await supabase.from('voters').select('count').limit(1)
    if (error) {
      console.error('Supabase connection test failed:', error)
      return false
    }
    console.log('Supabase connection successful')
    return true
  } catch (error) {
    console.error('Supabase connection test error:', error)
    return false
  }
}

export type Voter = {
  id: string
  name: string
  address: string
  voted_for: string | null
  created_at: string
}

export type Vote = {
  id: string
  candidate_name: string
  user_id: string
  created_at: string
}