import { db } from '@/lib/db'
import ProductSearchFilters from '@/components/ProductSearchFilters'

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const products = await db.product.findMany()

  return (
    <main style={{ padding: '3rem 2.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.95rem' }}>Explore our full catalog of products.</p>
      <h1 style={{ fontSize: '2.75rem', marginBottom: '1.5rem', color: '#111' }}>All Products</h1>
      <ProductSearchFilters products={products} />
    </main>
  )
}
