import Link from 'next/link'

export default function CategoriesPage() {
  return (
    <main style={{ padding: '3rem 2.5rem', maxWidth: '980px', margin: '0 auto' }}>
      <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.95rem' }}>Browse our available clothing categories.</p>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#111' }}>Categories</h1>
      <div style={{ display: 'grid', gap: '1rem', maxWidth: '420px' }}>
        <Link href="/categories/men" style={{ padding: '1rem 1.25rem', borderRadius: '14px', background: '#f4f2ef', color: '#111', textDecoration: 'none', fontWeight: 600 }}>Men's Clothing</Link>
        <Link href="/categories/women" style={{ padding: '1rem 1.25rem', borderRadius: '14px', background: '#f4f2ef', color: '#111', textDecoration: 'none', fontWeight: 600 }}>Women's Clothing</Link>
        <Link href="/categories/kids" style={{ padding: '1rem 1.25rem', borderRadius: '14px', background: '#f4f2ef', color: '#111', textDecoration: 'none', fontWeight: 600 }}>Kids Clothing</Link>
      </div>
    </main>
  )
}
