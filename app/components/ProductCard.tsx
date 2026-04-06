'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useCart } from '@/components/CartContext'

type Product = {
  id: number
  name: string
  price: number
  image: string
  images?: string[]
  description: string
  stock: number
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const previewImage = product.images?.[0] || product.image
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!added) return
    const timer = window.setTimeout(() => setAdded(false), 1800)
    return () => window.clearTimeout(timer)
  }, [added])

  return (
    <div className="product-card" style={{
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <Link href={`/products/${product.id}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
        <img
          src={previewImage}
          alt={product.name}
          className="product-card-image"
          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
        />
      </Link>
      <div style={{ padding: '1rem' }}>
        <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{product.name}</h2>
        </Link>
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>{product.description}</p>
        <div className="product-card-actions" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            className="btn-add-cart"
            onClick={() => {
              addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
              })
              setAdded(true)
            }}
          >
            Add to cart
          </button>
          <Link
            href={`/products/${product.id}`}
            className="btn-details"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.95rem 1.2rem',
              borderRadius: '14px',
              border: '1px solid #1a1a1a',
              color: '#1a1a1a',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            View details
          </Link>
          <button
            className="btn-order-now"
            onClick={() => window.location.href = `/order?productId=${product.id}`}
            style={{
              background: '#1a1a1a',
              color: '#fff',
              border: 'none',
              borderRadius: '14px',
              padding: '0.95rem 1.2rem',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Order Now
          </button>
        </div>
        {added && (
          <div className="cart-success" style={{
            marginTop: '0.9rem',
            padding: '0.75rem 1rem',
            background: '#def7ec',
            color: '#0f5132',
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '0.95rem',
          }}>
            Product added to cart!
          </div>
        )}
      </div>
    </div>
  )
}