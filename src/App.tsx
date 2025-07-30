import React, { useState, useEffect } from 'react'
import { LoginForm } from './components/LoginForm'
import { VotingInterface } from './components/VotingInterface'
import { testSupabaseConnection } from './lib/supabase'

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
    // Test koneksi Supabase saat aplikasi dimuat
    const checkConnection = async () => {
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
          <h2 className="text-xl font-bold text-gray-800 mb-2">Koneksi Database Gagal</h2>
          <p className="text-gray-600 mb-4">
            Tidak dapat terhubung ke database Supabase. Pastikan konfigurasi sudah benar.
          </p>
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