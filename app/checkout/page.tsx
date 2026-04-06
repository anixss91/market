'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/components/CartContext'
import { useAuth } from '@/components/AuthContext'

type Address = {
  id: number
  label?: string
  wilaya: string
  city: string
  details: string
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const { user, token, isAuthenticated } = useAuth()
  const [submitted, setSubmitted] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [form, setForm] = useState({ fullName: '', phone: '', wilaya: '', city: '', deliveryMethod: 'Standard' })

  useEffect(() => {
    if (!user || !token) return

    fetch('/api/addresses', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setAddresses(data))
  }, [user, token])

  useEffect(() => {
    if (!selectedAddressId) return
    const address = addresses.find(a => String(a.id) === selectedAddressId)
    if (address) {
      setForm(prev => ({ ...prev, wilaya: address.wilaya, city: address.city }))
    }
  }, [selectedAddressId, addresses])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (items.length === 0) return

    await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        fullName: form.fullName,
        phone: form.phone,
        wilaya: form.wilaya,
        city: form.city,
        deliveryMethod: form.deliveryMethod,
        items: items.map(item => ({ productId: item.id, quantity: item.quantity }))
      })
    })

    clearCart()
    setSubmitted(true)
  }

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <main style={{ padding: '3rem 2.5rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#111' }}>Checkout</h1>
      {items.length === 0 && !submitted ? (
        <div style={{ padding: '2rem', borderRadius: '18px', background: '#f8f7f4', color: '#555' }}>
          <p style={{ marginBottom: '1rem' }}>Your cart is empty. Add items to the cart before checking out.</p>
          <Link href="/" style={{ color: '#1a1a1a', fontWeight: 600 }}>Return to shop</Link>
        </div>
      ) : submitted ? (
        <div style={{ padding: '2rem', borderRadius: '18px', background: '#e8f5e9', color: '#1b5e20' }}>
          <h2 style={{ marginBottom: '0.75rem' }}>Order received!</h2>
          <p>Your order has been placed successfully. We will contact you shortly.</p>
          <Link href="/" style={{ display: 'inline-block', marginTop: '1rem', color: '#1a1a1a', fontWeight: 600 }}>Back to store</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '2rem' }}>
          <form onSubmit={handleSubmit} style={{ borderRadius: '18px', background: '#fff', padding: '1.5rem', boxShadow: '0 1px 24px rgba(0,0,0,0.06)' }}>
            {isAuthenticated && addresses.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>Choose saved address</label>
                <select value={selectedAddressId} onChange={e => setSelectedAddressId(e.target.value)} style={{ width: '100%', padding: '0.95rem 1rem', borderRadius: '14px', border: '1px solid #ddd' }}>
                  <option value="">Select address</option>
                  {addresses.map(address => (
                    <option key={address.id} value={address.id}>{address.label || `${address.city}, ${address.wilaya}`}</option>
                  ))}
                </select>
              </div>
            )}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>Full Name</label>
              <input value={form.fullName} onChange={e => handleChange('fullName', e.target.value)} style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '14px', border: '1px solid #ddd' }} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>Phone</label>
                <input value={form.phone} onChange={e => handleChange('phone', e.target.value)} style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '14px', border: '1px solid #ddd' }} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>Wilaya</label>
                <input value={form.wilaya} onChange={e => handleChange('wilaya', e.target.value)} style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '14px', border: '1px solid #ddd' }} required />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>City</label>
                <input value={form.city} onChange={e => handleChange('city', e.target.value)} style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '14px', border: '1px solid #ddd' }} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>Delivery method</label>
                <select value={form.deliveryMethod} onChange={e => handleChange('deliveryMethod', e.target.value)} style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '14px', border: '1px solid #ddd' }}>
                  <option>Standard</option>
                  <option>Express</option>
                </select>
              </div>
            </div>
            <button type="submit" style={{ width: '100%', padding: '1rem', borderRadius: '14px', background: '#1a1a1a', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
              Place Order
            </button>
          </form>

          <aside style={{ borderRadius: '18px', background: '#fff', padding: '1.5rem', boxShadow: '0 1px 24px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Order summary</h2>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span>{item.name} x{item.quantity}</span>
                <span>{item.quantity * item.price} DA</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
              <span>Total</span>
              <span>{totalPrice} DA</span>
            </div>
            {!isAuthenticated && (
              <p style={{ marginTop: '1rem', color: '#555' }}>
                Want to save your order history? <Link href="/auth/login" style={{ color: '#1a1a1a', fontWeight: 700 }}>Login</Link> or <Link href="/auth/signup" style={{ color: '#1a1a1a', fontWeight: 700 }}>sign up</Link>.
              </p>
            )}
          </aside>
        </div>
      )}
    </main>
  )
}
