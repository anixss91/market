interface CategoryPageProps {
  params: {
    category: string
  }
}

const labelMap: Record<string, string> = {
  men: "Men's Clothing",
  women: "Women's Clothing",
  kids: 'Kids Clothing',
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categoryName = labelMap[params.category] ?? params.category

  return (
    <main style={{ padding: '3rem 2.5rem', maxWidth: '980px', margin: '0 auto' }}>
      <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.95rem' }}>Showing products for {categoryName}.</p>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#111' }}>{categoryName}</h1>
      <div style={{ borderRadius: '18px', background: '#f8f7f4', padding: '2rem', color: '#444' }}>
        <p>This is a placeholder category page. Replace this content with your category-specific products and filters.</p>
      </div>
    </main>
  )
}
