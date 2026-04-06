'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthContext'

type Order = {
  id: number
  fullName: string
  phone: string
  wilaya: string
  city: string
  deliveryMethod: string
  status: string
  createdAt: string
  quantity: number
  product: { id: number; name: string; price: number } | null
}

type Address = {
  id: number
  label?: string
  wilaya: string
  city: string
  details: string
}

export default function AccountPage() {
  const router = useRouter()
  const { user, isAuthenticated, logout, token } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [addressForm, setAddressForm] = useState({ label: '', wilaya: '', city: '', details: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }
    if (!user) return

    async function loadData() {
      if (!user || !token) return
      const headers = { Authorization: `Bearer ${token}` }
      const orderRes = await fetch('/api/orders', { headers })
      const addressRes = await fetch('/api/addresses', { headers })
      setOrders(await orderRes.json())
      setAddresses(await addressRes.json())
      setLoading(false)
    }

    loadData()
  }, [user, isAuthenticated, router])

  const handleAddressSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user || !token) return

    await fetch('/api/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(addressForm)
    })

    setAddressForm({ label: '', wilaya: '', city: '', details: '' })
    const res = await fetch('/api/addresses', { headers: { Authorization: `Bearer ${token}` } })
    setAddresses(await res.json())
  }

  const deleteAddress = async (id: number) => {
    if (!confirm('Remove this address?') || !token) return
    await fetch(`/api/addresses/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    const res = await fetch('/api/addresses', { headers: { Authorization: `Bearer ${token}` } })
    setAddresses(await res.json())
  }

  if (!isAuthenticated) {
    return <div style={{ padding: '3rem', color: '#555' }}>Redirecting to login…</div>
  }

  return (
    <main style={{ padding: '3rem 2.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Hello, {user?.name}</h1>
          <p style={{ color: '#555' }}>Your account dashboard includes order history and saved shipping addresses.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link href="/" style={{ padding: '0.85rem 1.25rem', borderRadius: '12px', background: '#f3f4f6', color: '#111', textDecoration: 'none', fontWeight: 600 }}>Continue shopping</Link>
          <button onClick={logout} style={{ padding: '0.85rem 1.25rem', borderRadius: '12px', background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Logout</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <section style={{ background: 'white', borderRadius: '18px', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
          <h2 style={{ marginBottom: '1rem' }}>Order history</h2>
          {loading ? (
            <p>Loading...</p>
          ) : orders.length === 0 ? (
            <p style={{ color: '#555' }}>No orders yet. Start shopping to see your order history.</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {orders.map(order => (
                <div key={order.id} style={{ borderRadius: '16px', border: '1px solid #eee', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div>
                      <p style={{ margin: 0, color: '#777' }}>Order #{order.id} • {new Date(order.createdAt).toLocaleDateString()}</p>
                      <h3 style={{ margin: '0.35rem 0' }}>{order.product?.name ?? 'Product'} x{order.quantity}</h3>
                    </div>
                    <span style={{ background: '#f3f4f6', color: '#374151', padding: '0.45rem 0.85rem', borderRadius: '999px', fontWeight: 600 }}>{order.status}</span>
                  </div>
                  <p style={{ margin: '0.75rem 0 0', color: '#555' }}>Delivery to {order.wilaya}, {order.city}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section style={{ background: 'white', borderRadius: '18px', padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
          <h2 style={{ marginBottom: '1rem' }}>Saved addresses</h2>
          {loading ? (
            <p>Loading...</p>
          ) : addresses.length === 0 ? (
            <p style={{ color: '#555' }}>No saved addresses yet. Add one below.</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
              {addresses.map(address => (
                <div key={address.id} style={{ border: '1px solid #eee', borderRadius: '16px', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600 }}>{address.label || 'Saved address'}</p>
                      <p style={{ margin: '0.35rem 0 0', color: '#555' }}>{address.city}, {address.wilaya}</p>
                      <p style={{ margin: '0.35rem 0 0', color: '#555' }}>{address.details}</p>
                    </div>
                    <button onClick={() => deleteAddress(address.id)} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '10px', padding: '0.55rem 0.9rem', cursor: 'pointer' }}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleAddressSave} style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>Address label</label>
              <input value={addressForm.label} onChange={e => setAddressForm(prev => ({ ...prev, label: e.target.value }))} placeholder="Home, Office, Family" style={{ width: '100%', padding: '0.95rem 1rem', borderRadius: '14px', border: '1px solid #ddd' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>Wilaya</label>
                <input value={addressForm.wilaya} onChange={e => setAddressForm(prev => ({ ...prev, wilaya: e.target.value }))} required style={{ width: '100%', padding: '0.95rem 1rem', borderRadius: '14px', border: '1px solid #ddd' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>City</label>
                <input value={addressForm.city} onChange={e => setAddressForm(prev => ({ ...prev, city: e.target.value }))} required style={{ width: '100%', padding: '0.95rem 1rem', borderRadius: '14px', border: '1px solid #ddd' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>Details</label>
              <textarea value={addressForm.details} onChange={e => setAddressForm(prev => ({ ...prev, details: e.target.value }))} required style={{ width: '100%', minHeight: '100px', padding: '0.95rem 1rem', borderRadius: '14px', border: '1px solid #ddd' }} />
            </div>
            <button type="submit" style={{ width: '100%', padding: '0.95rem 1rem', borderRadius: '14px', background: '#1a1a1a', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Save address</button>
          </form>
        </section>
      </div>
    </main>
  )
}
