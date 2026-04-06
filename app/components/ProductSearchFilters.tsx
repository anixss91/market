'use client'

import { useMemo, useState } from 'react'
import ProductCard from './ProductCard'

type Product = {
  id: number
  name: string
  price: number
  image: string
  description: string
  stock: number
}

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'kids', label: 'Kids' },
]

function matchesCategory(product: Product, category: string) {
  if (category === 'all') return true
  const text = `${product.name} ${product.description}`.toLowerCase()

  if (category === 'men') {
    return text.includes('men') || text.includes('male') || text.includes('man')
  }
  if (category === 'women') {
    return text.includes('women') || text.includes('female') || text.includes('woman')
  }
  if (category === 'kids') {
    return text.includes('kid') || text.includes('child') || text.includes('baby')
  }
  return true
}

export default function ProductSearchFilters({ products }: { products: Product[] }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [availability, setAvailability] = useState('all')

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const query = search.trim().toLowerCase()
      if (query) {
        const content = `${product.name} ${product.description}`.toLowerCase()
        if (!content.includes(query)) return false
      }

      if (!matchesCategory(product, category)) return false

      const min = Number(minPrice)
      if (minPrice && !Number.isNaN(min) && product.price < min) return false

      const max = Number(maxPrice)
      if (maxPrice && !Number.isNaN(max) && product.price > max) return false

      if (availability === 'in-stock' && product.stock <= 0) return false
      if (availability === 'out-of-stock' && product.stock > 0) return false

      return true
    })
  }, [products, search, category, minPrice, maxPrice, availability])

  return (
    <section style={{ padding: '2rem 0' }}>
      <div style={{ display: 'grid', gap: '1rem' }}>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>Search</label>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products, brands, or features..."
              style={{ width: '100%', padding: '0.95rem 1rem', borderRadius: '14px', border: '1px solid #ddd', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: '0.95rem 1rem', borderRadius: '14px', border: '1px solid #ddd' }}>
                {categories.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>Min price</label>
              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                placeholder="0"
                style={{ padding: '0.95rem 1rem', borderRadius: '14px', border: '1px solid #ddd' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>Max price</label>
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                placeholder="Any"
                style={{ padding: '0.95rem 1rem', borderRadius: '14px', border: '1px solid #ddd' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>Availability</label>
              <select value={availability} onChange={e => setAvailability(e.target.value)} style={{ padding: '0.95rem 1rem', borderRadius: '14px', border: '1px solid #ddd' }}>
                <option value="all">All</option>
                <option value="in-stock">In stock</option>
                <option value="out-of-stock">Out of stock</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <p style={{ margin: 0, color: '#555' }}>
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>
      </div>

      <div style={{ marginTop: '1.75rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {filteredProducts.length === 0 ? (
          <div style={{ gridColumn: '1/-1', padding: '3rem', borderRadius: '18px', background: '#fff', color: '#777', textAlign: 'center' }}>
            No products match your search or filters.
          </div>
        ) : (
          filteredProducts.map(product => <ProductCard key={product.id} product={product} />)
        )}
      </div>
    </section>
  )
}
