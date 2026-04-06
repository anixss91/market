'use client'

import Link from 'next/link'
import { useCart } from '@/components/CartContext'

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart()

  return (
    <main style={{ padding: '3rem 2.5rem', maxWidth: '1020px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#111' }}>Your Cart</h1>
      {items.length === 0 ? (
        <div style={{ padding: '2rem', borderRadius: '18px', background: '#f8f7f4', color: '#555' }}>
          <p style={{ marginBottom: '1rem' }}>Your cart is empty.</p>
          <Link href="/" style={{ color: '#1a1a1a', fontWeight: 600 }}>Continue shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div style={{ borderRadius: '18px', background: '#fff', padding: '1.5rem', boxShadow: '0 1px 20px rgba(0,0,0,0.06)' }}>
            {items.map(item => (
              <div key={item.id} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '1rem', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #f0f0f0' }}>
                <img src={item.image} alt={item.name} style={{ width: '96px', height: '96px', objectFit: 'cover', borderRadius: '16px' }} />
                <div>
                  <h2 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{item.name}</h2>
                  <p style={{ color: '#666', marginBottom: '0.75rem' }}>{item.price} DA each</p>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <label style={{ color: '#555', fontSize: '0.95rem' }}>
                      Qty
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => updateQuantity(item.id, Number(e.target.value))}
                        style={{ width: '4rem', marginLeft: '0.5rem', padding: '0.55rem 0.75rem', borderRadius: '10px', border: '1px solid #ddd' }}
                      />
                    </label>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{ border: 'none', background: '#f5f5f5', color: '#555', padding: '0.55rem 0.9rem', borderRadius: '10px', cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, fontSize: '1rem' }}>{item.quantity * item.price} DA</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderRadius: '18px', background: '#fff', padding: '1.5rem', boxShadow: '0 1px 20px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: '#666' }}>Items</span>
              <span style={{ fontWeight: 700 }}>{totalItems}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.15rem' }}>
              <span>Total</span>
              <span style={{ fontWeight: 700 }}>{totalPrice} DA</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/checkout" style={{ display: 'inline-block', width: '100%', textAlign: 'center', padding: '1rem', borderRadius: '14px', background: '#1a1a1a', color: '#fff', textDecoration: 'none', fontWeight: 600 }}>
                Checkout
              </Link>
              <button
                onClick={clearCart}
                style={{ display: 'inline-block', width: '100%', padding: '1rem', borderRadius: '14px', background: '#f3f3f3', color: '#333', border: '1px solid #ddd', cursor: 'pointer' }}
              >
                Clear cart
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
