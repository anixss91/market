'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Product = {
  id: number
  name: string
  price: number
  image: string
  description: string
  stock: number
}

type Order = {
  id: number
  fullName: string
  phone: string
  wilaya: string
  city: string
  deliveryMethod: string
  status: string
  product: Product
}

export default function Dashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<'products' | 'orders'>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState({
    name: '', price: '', image: '', description: '', stock: ''
  })

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      router.push('/login')
    }
    fetchProducts()
    fetchOrders()
  }, [])

  async function fetchProducts() {
    const res = await fetch('/api/products')
    const data = await res.json()
    setProducts(data)
  }

  async function fetchOrders() {
    const res = await fetch('/api/orders')
    const data = await res.json()
    setOrders(data)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const body = {
      name: form.name,
      price: parseFloat(form.price),
      image: form.image,
      description: form.description,
      stock: parseInt(form.stock)
    }

    if (editing) {
      await fetch(`/api/products/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
    } else {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
    }

    setForm({ name: '', price: '', image: '', description: '', stock: '' })
    setShowForm(false)
    setEditing(null)
    fetchProducts()
  }

  async function deleteProduct(id: number) {
    if (!confirm('Delete this product?')) return
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    fetchProducts()
  }

  async function deleteOrder(id: number) {
    if (!confirm('Delete this order?')) return
    await fetch(`/api/orders/${id}`, { method: 'DELETE' })
    fetchOrders()
  }

  async function markProcessed(id: number) {
    await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'processed' })
    })
    fetchOrders()
  }

  function startEdit(product: Product) {
    setEditing(product)
    setForm({
      name: product.name,
      price: String(product.price),
      image: product.image,
      description: product.description,
      stock: String(product.stock)
    })
    setShowForm(true)
  }

  function logout() {
    localStorage.removeItem('isAdmin')
    router.push('/login')
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
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem' }}>Admin Dashboard</h1>
        <button onClick={logout} style={{
          background: '#ef4444', color: 'white', border: 'none',
          padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 'bold'
        }}>Logout</button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => setTab('products')} style={{
          padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none',
          background: tab === 'products' ? '#2563eb' : '#e5e7eb',
          color: tab === 'products' ? 'white' : '#333', fontWeight: 'bold'
        }}>Products</button>
        <button onClick={() => setTab('orders')} style={{
          padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none',
          background: tab === 'orders' ? '#2563eb' : '#e5e7eb',
          color: tab === 'orders' ? 'white' : '#333', fontWeight: 'bold'
        }}>Orders ({orders.length})</button>
      </div>

      {tab === 'products' && (
        <div>
          <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', price: '', image: '', description: '', stock: '' }) }}
            style={{
              background: '#16a34a', color: 'white', border: 'none',
              padding: '0.75rem 1.5rem', borderRadius: '8px',
              fontWeight: 'bold', marginBottom: '1.5rem'
            }}>
            {showForm ? 'Cancel' : '+ Add Product'}
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} style={{
              background: 'white', padding: '1.5rem',
              borderRadius: '12px', marginBottom: '2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ marginBottom: '1rem' }}>{editing ? 'Edit Product' : 'New Product'}</h2>
              <input style={inputStyle} placeholder="Product name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              <input style={inputStyle} placeholder="Price (DA)" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
              <input style={inputStyle} placeholder="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} required />
              <input style={inputStyle} placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
              <input style={inputStyle} placeholder="Stock quantity" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required />
              <button type="submit" style={{
                background: '#2563eb', color: 'white', border: 'none',
                padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: 'bold'
              }}>{editing ? 'Update' : 'Add Product'}</button>
            </form>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {products.map(product => (
              <div key={product.id} style={{
                background: 'white', borderRadius: '12px',
                overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                <div style={{ padding: '1rem' }}>
                  <h3>{product.name}</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>{product.description}</p>
                  <p style={{ fontWeight: 'bold', margin: '0.5rem 0' }}>{product.price} DA</p>
                  <p style={{ fontSize: '0.85rem', color: '#666' }}>Stock: {product.stock}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button onClick={() => startEdit(product)} style={{
                      flex: 1, background: '#f59e0b', color: 'white',
                      border: 'none', padding: '0.5rem', borderRadius: '6px'
                    }}>Edit</button>
                    <button onClick={() => deleteProduct(product.id)} style={{
                      flex: 1, background: '#ef4444', color: 'white',
                      border: 'none', padding: '0.5rem', borderRadius: '6px'
                    }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                {['Name', 'Phone', 'Wilaya', 'City', 'Delivery', 'Product', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem' }}>{order.fullName}</td>
                  <td style={{ padding: '1rem' }}>{order.phone}</td>
                  <td style={{ padding: '1rem' }}>{order.wilaya}</td>
                  <td style={{ padding: '1rem' }}>{order.city}</td>
                  <td style={{ padding: '1rem' }}>{order.deliveryMethod}</td>
                  <td style={{ padding: '1rem' }}>{order.product?.name}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.85rem',
                      background: order.status === 'processed' ? '#dcfce7' : '#fef9c3',
                      color: order.status === 'processed' ? '#16a34a' : '#854d0e'
                    }}>{order.status}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {order.status !== 'processed' && (
                        <button onClick={() => markProcessed(order.id)} style={{
                          background: '#16a34a', color: 'white', border: 'none',
                          padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem'
                        }}>Done</button>
                      )}
                      <button onClick={() => deleteOrder(order.id)} style={{
                        background: '#ef4444', color: 'white', border: 'none',
                        padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem'
                      }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}