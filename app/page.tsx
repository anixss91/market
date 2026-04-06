import { db } from '@/lib/db'
import ProductSearchFilters from '@/components/ProductSearchFilters'
import Navbar from '@/components/Navbar'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const products = await db.product.findMany()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; background: #f8f7f4; color: #1a1a1a; }
        .hero {
          padding: 5rem 2.5rem 3rem;
          max-width: 1200px; margin: 0 auto;
        }
        .hero-tag {
          display: inline-block; background: #e8f5e9; color: #2e7d32;
          font-size: 0.8rem; font-weight: 500; padding: 0.3rem 0.9rem;
          border-radius: 999px; margin-bottom: 1.5rem; letter-spacing: 0.5px;
        }
        .hero h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 800; line-height: 1.1; letter-spacing: -2px;
          color: #1a1a1a; max-width: 700px; margin-bottom: 1.5rem;
        }
        .hero h1 span { color: #888; }
        .hero p {
          color: #666; font-size: 1.1rem; max-width: 480px;
          line-height: 1.7; margin-bottom: 2.5rem; font-weight: 300;
        }
        .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
        .btn-primary {
          background: #1a1a1a; color: #f8f7f4;
          padding: 0.85rem 2rem; border-radius: 10px;
          text-decoration: none; font-weight: 500; font-size: 0.95rem;
          transition: transform 0.15s, background 0.2s; display: inline-block;
        }
        .btn-primary:hover { background: #333; transform: translateY(-2px); }
        .divider {
          height: 1px; background: rgba(0,0,0,0.07);
          max-width: 1200px; margin: 0 auto;
        }
        .products-section {
          max-width: 1200px; margin: 0 auto; padding: 3rem 2.5rem 5rem;
        }
        .section-header {
          display: flex; justify-content: space-between;
          align-items: baseline; margin-bottom: 2rem;
        }
        .section-title {
          font-family: 'Syne', sans-serif; font-size: 1.6rem;
          font-weight: 700; letter-spacing: -0.5px;
        }
        .section-count { color: #999; font-size: 0.9rem; }
        .footer {
          border-top: 1px solid rgba(0,0,0,0.07);
          padding: 2rem 2.5rem; text-align: center;
          color: #aaa; font-size: 0.85rem;
        }
        @media (max-width: 640px) {
          .hero { padding: 3rem 1.25rem 2rem; }
          .products-section { padding: 2rem 1.25rem 3rem; }
        }
      `}</style>

      <Navbar />

      <section className="hero">
        <span className="hero-tag">Free delivery across Algeria</span>
        <h1>Shop the best <span>products</span> online</h1>
        <p>Discover our curated collection. Fast delivery to all 58 wilayas across Algeria.</p>
        <div className="hero-actions">
          <a href="/#products" className="btn-primary">Shop Now</a>
        </div>
      </section>

      <div className="divider" />

      <section className="products-section" id="products">
        <div className="section-header">
          <h2 className="section-title">All Products</h2>
          <span className="section-count">{products.length} items</span>
        </div>
        <ProductSearchFilters products={products} />
      </section>

      <footer className="footer">
        <p>&copy; 2026 MyMarket &mdash; All rights reserved</p>
      </footer>
    </>
  )
}