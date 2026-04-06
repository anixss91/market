'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthContext'

export default function SignupPage() {
  const router = useRouter()
  const { signup, isAuthenticated, error } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/account')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    const success = await signup(name, email, password, confirmPassword)
    setLoading(false)
    if (success) router.push('/account')
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 2px 24px rgba(0,0,0,0.08)' }}>
        <h1 style={{ marginBottom: '1.25rem', fontSize: '1.75rem' }}>Create an account</h1>
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '1rem' }} />
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '1rem' }} />
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '1rem' }} />
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>Confirm password</label>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '1rem' }} />
          {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.95rem 1rem', borderRadius: '14px', background: '#1a1a1a', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
            {loading ? 'Signing up…' : 'Sign up'}
          </button>
        </form>
        <p style={{ marginTop: '1rem', color: '#555' }}>
          Already have an account? <a href="/auth/login" style={{ color: '#1a1a1a', fontWeight: 700 }}>Login</a>
        </p>
      </div>
    </main>
  )
}
