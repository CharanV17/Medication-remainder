import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if token exists on mount
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
    }
    setLoading(false)
  }, [])

  const handleSetToken = (newToken) => {
    if (newToken) {
      localStorage.setItem('token', newToken)
      setToken(newToken)
    } else {
      localStorage.removeItem('token')
      setToken(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Routes>
          <Route 
            path="/login" 
            element={
              token ? <Navigate to="/dashboard" replace /> : <Login setToken={handleSetToken} />
            } 
          />
          <Route 
            path="/register" 
            element={
              token ? <Navigate to="/dashboard" replace /> : <Register setToken={handleSetToken} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              token ? <Dashboard token={token} setToken={handleSetToken} /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/" 
            element={<Navigate to={token ? "/dashboard" : "/login"} replace />} 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
