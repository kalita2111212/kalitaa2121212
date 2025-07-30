import React, { useState, useEffect } from 'react'
import { LoginForm } from './components/LoginForm'
import { VotingInterface } from './components/VotingInterface'
import { testSupabaseConnection, isSupabaseConfigured } from './lib/supabase'

interface Voter {
  id: string
  name: string
  address: string
  voted_for: string | null
}

function App() {
  const [voter, setVoter] = useState<Voter | null>(null)
  const [isConnected, setIsConnected] = useState<boolean | null>(null)

  useEffect(() => {
    const checkConnection = async () => {
      if (!isSupabaseConfigured) {
        setIsConnected(false)
        return
      }
      const connected = await testSupabaseConnection()
      setIsConnected(connected)
    }
    checkConnection()
  }, [])

  const handleLogin = (voterData: Voter) => {
    setVoter(voterData)
  }

  const handleLogout = () => {
    setVoter(null)
  }

  // Tampilkan loading saat mengecek koneksi
  if (isConnected === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Menghubungkan ke database...</p>
        </div>
      </div>
    )
  }

  // Tampilkan error jika koneksi gagal
  if (isConnected === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {!isSupabaseConfigured ? 'Konfigurasi Supabase Diperlukan' : 'Koneksi Database Gagal'}
          </h2>
          <div className="text-gray-600 mb-4">
            {!isSupabaseConfigured ? (
              <div className="text-left">
                <p className="mb-3">Untuk menggunakan aplikasi ini, Anda perlu:</p>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Buat project di <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">supabase.com</a></li>
                  <li>Salin Project URL dan Anon Key dari Settings → API</li>
                  <li>Update file .env dengan kredensial yang benar</li>
                  <li>Restart aplikasi</li>
                </ol>
              </div>
            ) : (
              <p>Tidak dapat terhubung ke database Supabase. Pastikan konfigurasi sudah benar.</p>
            )}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      {voter ? (
        <VotingInterface voter={voter} onLogout={handleLogout} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  )
}

export default App