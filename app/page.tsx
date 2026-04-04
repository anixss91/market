import { db } from '@/lib/db'
import ProductCard from '@/components/ProductCard'
export default async function Home() {
  const products = await db.product.findMany()

  return (
    <main style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Our Products</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1.5rem'
      }}>
        {products.length === 0 && <p>No products yet.</p>}
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  )
}