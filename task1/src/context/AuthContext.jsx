import { createContext, useContext, useEffect, useState } from 'react'

import { authApi } from '../api/client.js'

const AuthContext = createContext(null)
const TOKEN_KEY = 'taskflow_token'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(() => Boolean(token))

  useEffect(() => {
    let isActive = true

    async function loadCurrentUser() {
      if (!token) return

      try {
        const response = await authApi.me()
        if (isActive) setUser(response.data)
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        if (isActive) {
          setToken(null)
          setUser(null)
        }
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    loadCurrentUser()
    return () => {
      isActive = false
    }
  }, [token])

  async function login(credentials) {
    const response = await authApi.login(credentials)
    localStorage.setItem(TOKEN_KEY, response.data.access_token)
    setToken(response.data.access_token)
    const meResponse = await authApi.me()
    setUser(meResponse.data)
    setIsLoading(false)
  }

  async function register(credentials) {
    await authApi.register(credentials)
    await login(credentials)
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
    setIsLoading(false)
  }

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}