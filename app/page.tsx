import { db } from '@/lib/db'
import ProductCard from '@/components/ProductCard'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const products = await db.product.findMany()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: #f8f7f4;
          color: #1a1a1a;
        }

        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(248, 247, 244, 0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(0,0,0,0.07);
          padding: 0 2.5rem;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
        }

        .logo-placeholder {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f8f7f4;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.1rem;
          letter-spacing: -1px;
        }

        .logo-name {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1.2rem;
          color: #1a1a1a;
          letter-spacing: -0.5px;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
          list-style: none;
        }

        .nav-links a {
          text-decoration: none;
          color: #555;
          font-size: 0.95rem;
          font-weight: 400;
          transition: color 0.2s;
        }

        .nav-links a:hover { color: #1a1a1a; }

        .nav-cta {
          background: #1a1a1a;
          color: #f8f7f4 !important;
          padding: 0.5rem 1.25rem;
          border-radius: 8px;
          font-weight: 500 !important;
          transition: background 0.2s, transform 0.1s !important;
        }

        .nav-cta:hover {
          background: #333 !important;
          color: #f8f7f4 !important;
          transform: translateY(-1px);
        }

        .hero {
          padding: 5rem 2.5rem 3rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero-tag {
          display: inline-block;
          background: #e8f5e9;
          color: #2e7d32;
          font-size: 0.8rem;
          font-weight: 500;
          padding: 0.3rem 0.9rem;
          border-radius: 999px;
          margin-bottom: 1.5rem;
          letter-spacing: 0.5px;
        }

        .hero h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -2px;
          color: #1a1a1a;
          max-width: 700px;
          margin-bottom: 1.5rem;
        }

        .hero h1 span {
          color: #888;
        }

        .hero p {
          color: #666;
          font-size: 1.1rem;
          max-width: 480px;
          line-height: 1.7;
          margin-bottom: 2.5rem;
          font-weight: 300;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .btn-primary {
          background: #1a1a1a;
          color: #f8f7f4;
          padding: 0.85rem 2rem;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          transition: transform 0.15s, background 0.2s;
          display: inline-block;
        }

        .btn-primary:hover {
          background: #333;
          transform: translateY(-2px);
        }

        .btn-secondary {
          color: #555;
          padding: 0.85rem 1.5rem;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 400;
          font-size: 0.95rem;
          border: 1px solid #ddd;
          transition: border-color 0.2s, transform 0.15s;
          display: inline-block;
        }

        .btn-secondary:hover {
          border-color: #999;
          transform: translateY(-2px);
        }

        .divider {
          height: 1px;
          background: rgba(0,0,0,0.07);
          max-width: 1200px;
          margin: 0 auto;
        }

        .products-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 2.5rem 5rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 2rem;
        }

        .section-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.6rem;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .section-count {
          color: #999;
          font-size: 0.9rem;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.5rem;
        }

        .empty-state {
          grid-column: 1/-1;
          text-align: center;
          padding: 5rem 2rem;
          color: #999;
        }

        .empty-state p {
          font-size: 1rem;
          margin-top: 0.5rem;
        }

        .footer {
          border-top: 1px solid rgba(0,0,0,0.07);
          padding: 2rem 2.5rem;
          text-align: center;
          color: #aaa;
          font-size: 0.85rem;
        }

        @media (max-width: 640px) {
          .navbar { padding: 0 1.25rem; }
          .nav-links { display: none; }
          .hero { padding: 3rem 1.25rem 2rem; }
          .products-section { padding: 2rem 1.25rem 3rem; }
        }
      `}</style>

      <nav className="navbar">
        <a href="/" className="nav-logo">
          <div className="logo-placeholder">M</div>
          <span className="logo-name">MyMarket</span>
        </a>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/#products">Products</a></li>
          <li><a href="/login" className="nav-cta">Admin</a></li>
        </ul>
      </nav>

      <section className="hero">
        <span className="hero-tag">Free delivery across Algeria</span>
        <h1>Shop the best <span>products</span> online</h1>
        <p>Discover our curated collection. Fast delivery to all 58 wilayas across Algeria.</p>
        <div className="hero-actions">
          <a href="/#products" className="btn-primary">Shop Now</a>
          <a href="/login" className="btn-secondary">Admin Panel</a>
        </div>
      </section>

      <div className="divider" />

      <section className="products-section" id="products">
        <div className="section-header">
          <h2 className="section-title">All Products</h2>
          <span className="section-count">{products.length} items</span>
        </div>
        <div className="products-grid">
          {products.length === 0 && (
            <div className="empty-state">
              <h3>No products yet</h3>
              <p>Check back soon!</p>
            </div>
          )}
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 MyMarket — All rights reserved</p>
      </footer>
    </>
  )
}