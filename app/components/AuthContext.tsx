'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type User = {
  id: number
  name: string
  email: string
  role: string
}

type StoredAuth = {
  token: string
  user: User
}

type AuthContextValue = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string, confirmPassword: string) => Promise<boolean>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const STORAGE_KEY = 'my-store-auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed: StoredAuth = JSON.parse(saved)
        setToken(parsed.token)
        setUser(parsed.user)
      } catch {
        setToken(null)
        setUser(null)
      }
    }
    setLoading(false)
  }, [])

  const refreshUser = async () => {
    if (!token) return
    try {
      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!response.ok) {
        logout()
        return
      }
      const data = await response.json()
      setUser(data.user)
    } catch {
      logout()
    }
  }

  useEffect(() => {
    if (token && !user) {
      refreshUser()
    }
  }, [token])

  const login = async (email: string, password: string) => {
    setError('')
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Login failed')
        return false
      }
      setUser(data.user)
      setToken(data.token)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: data.token, user: data.user }))
      return true
    } catch {
      setError('Login failed')
      return false
    }
  }

  const signup = async (name: string, email: string, password: string, confirmPassword: string) => {
    setError('')
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, confirmPassword })
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Signup failed')
        return false
      }
      setUser(data.user)
      setToken(data.token)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: data.token, user: data.user }))
      return true
    } catch {
      setError('Signup failed')
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    window.localStorage.removeItem(STORAGE_KEY)
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user),
      loading,
      error,
      login,
      signup,
      logout,
      refreshUser
    }),
    [user, token, loading, error]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
