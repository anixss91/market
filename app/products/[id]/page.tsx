import { db } from '@/lib/db'
import { notFound } from 'next/navigation'

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const productId = Number(params.id)

  if (!params.id || Number.isNaN(productId)) {
    notFound()
  }

  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  })

  if (!product) {
    notFound()
  }

  const previewImage = product.images?.[0] || product.image

  return (
    <main style={{ padding: '3rem 2.5rem', maxWidth: '980px', margin: '0 auto' }}>
      <p style={{ color: '#666', marginBottom: '0.75rem', fontSize: '0.95rem' }}>Product details</p>
      <h1 style={{ fontSize: '2.75rem', marginBottom: '1.5rem', color: '#111' }}>{product.name}</h1>
      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1.2fr 0.8fr' }}>
        <img
          src={previewImage}
          alt={product.name}
          style={{ width: '100%', borderRadius: '20px', objectFit: 'cover', minHeight: '360px' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '2rem', borderRadius: '20px', background: '#f8f7f4' }}>
            <p style={{ color: '#666', marginBottom: '1rem' }}>{product.description}</p>
            <p style={{ marginBottom: '1rem', fontWeight: 700, fontSize: '1.5rem' }}>{product.price} DA</p>
            <p style={{ color: '#444' }}>Stock: {product.stock}</p>
          </div>
          <a
            href={`/order?productId=${product.id}`}
            style={{ display: 'inline-block', padding: '1rem 1.5rem', borderRadius: '14px', background: '#1a1a1a', color: '#fff', textDecoration: 'none', fontWeight: 600, textAlign: 'center' }}
          >
            Order this product
          </a>
        </div>
      </div>
    </main>
  )
}
