'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

const wilayas = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra',
  'Béchar', 'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret',
  'Tizi Ouzou', 'Alger', 'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda',
  'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine', 'Médéa', 'Mostaganem',
  'MSila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh', 'Illizi', 'Bordj Bou Arréridj',
  'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued', 'Khenchela',
  'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
  'Ghardaïa', 'Relizane', 'Timimoun', 'Bordj Badji Mokhtar', 'Ouled Djellal',
  'Béni Abbès', 'In Salah', 'In Guezzam', 'Touggourt', 'Djanet',
  'El MGhair', 'El Meniaa'
]

function OrderForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const productId = searchParams.get('productId')
  const [product, setProduct] = useState<any>(null)
  const [submitted, setSubmitted] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    wilaya: '',
    city: '',
    deliveryMethod: 'Home Delivery'
  })

  useEffect(() => {
    const savedUser = window.localStorage.getItem('my-store-user')
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        setCurrentUserId(parsed?.id ?? null)
      } catch {
        setCurrentUserId(null)
      }
    }
  }, [])

  useEffect(() => {
    if (productId) {
      fetch('/api/products')
        .then(res => res.json())
        .then(data => {
          const found = data.find((p: any) => p.id === parseInt(productId))
          setProduct(found)
        })
    }
  }, [productId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, productId: parseInt(productId!), userId: currentUserId })
    })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <main style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{
          background: 'white', padding: '3rem', borderRadius: '12px',
          textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Order Placed!</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Thank you! We will contact you soon.
          </p>
          <button
            onClick={() => router.push('/')}
            style={{
              background: '#2563eb', color: 'white', border: 'none',
              padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: 'bold'
            }}
          >
            Back to Store
          </button>
        </div>
      </main>
    )
  }

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    marginBottom: '1rem'
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <button
        onClick={() => router.push('/')}
        style={{
          background: 'none', border: 'none', color: '#2563eb',
          fontSize: '1rem', marginBottom: '1.5rem', cursor: 'pointer'
        }}
      >
        ← Back to Store
      </button>

      {product && (
        <div style={{
          background: 'white', borderRadius: '12px', padding: '1rem',
          marginBottom: '2rem', display: 'flex', gap: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <img src={product.image} alt={product.name}
            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
          <div>
            <h3>{product.name}</h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>{product.description}</p>
            <p style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>{product.price} DA</p>
          </div>
        </div>
      )}

      <div style={{
        background: 'white', borderRadius: '12px', padding: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Your Details</h2>
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Full Name</label>
          <input
            style={inputStyle}
            placeholder="Your full name"
            value={form.fullName}
            onChange={e => setForm({ ...form, fullName: e.target.value })}
            required
          />

          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Phone Number</label>
          <input
            style={inputStyle}
            placeholder="Your phone number"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            required
          />

          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Wilaya</label>
          <select
            style={inputStyle}
            value={form.wilaya}
            onChange={e => setForm({ ...form, wilaya: e.target.value })}
            required
          >
            <option value="">Select your wilaya</option>
            {wilayas.map(w => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>

          <label style={{ display: 'block', marginBottom: '0.25rem' }}>City</label>
          <input
            style={inputStyle}
            placeholder="Your city"
            value={form.city}
            onChange={e => setForm({ ...form, city: e.target.value })}
            required
          />

          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Delivery Method</label>
          <select
            style={inputStyle}
            value={form.deliveryMethod}
            onChange={e => setForm({ ...form, deliveryMethod: e.target.value })}
          >
            <option value="Home Delivery">Home Delivery</option>
            <option value="Delivery to nearest office">Delivery to nearest office</option>
          </select>

          <button
            type="submit"
            style={{
              width: '100%', padding: '0.75rem', background: '#2563eb',
              color: 'white', border: 'none', borderRadius: '8px',
              fontSize: '1rem', fontWeight: 'bold', marginTop: '0.5rem'
            }}
          >
            Place Order
          </button>
        </form>
      </div>
    </main>
  )
}

export default function OrderPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem' }}>Loading...</div>}>
      <OrderForm />
    </Suspense>
  )
}