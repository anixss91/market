'use client'

type Product = {
  id: number
  name: string
  price: number
  image: string
  description: string
  stock: number
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <img
        src={product.image}
        alt={product.name}
        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
      />
      <div style={{ padding: '1rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{product.name}</h2>
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>{product.description}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{product.price} DA</span>
          <button
            onClick={() => window.location.href = `/order?productId=${product.id}`}
            style={{
              background: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontWeight: 'bold'
            }}
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  )
}