'use client'

import { useAuth } from '@/components/AuthContext'
import { useCart } from '@/components/CartContext'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const { totalItems } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .navbar {
          position: sticky; top: 0; z-index: 100;
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(0,0,0,0.07);
          padding: 0 2.5rem; height: 68px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .nav-logo {
          display: flex; align-items: center; gap: 0.75rem;
          text-decoration: none;
        }
        .logo-box {
          width: 38px; height: 38px; border-radius: 10px;
          background: #1a1a1a; display: flex; align-items: center;
          justify-content: center; color: white;
          font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1rem;
        }
        .logo-text {
          font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 1.15rem; color: #1a1a1a; letter-spacing: -0.5px;
        }
        .nav-right {
          display: flex; align-items: center; gap: 1.5rem; list-style: none;
        }
        .nav-right a {
          text-decoration: none; color: #555; font-size: 0.9rem;
          font-weight: 400; transition: color 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .nav-right a:hover { color: #1a1a1a; }
        .cart-btn {
          position: relative; text-decoration: none;
          color: #1a1a1a; font-size: 0.9rem; font-weight: 500;
          background: #f5f5f5; padding: 0.45rem 1rem;
          border-radius: 8px; transition: background 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .cart-btn:hover { background: #ebebeb; }
        .cart-badge {
          position: absolute; top: -6px; right: -6px;
          background: #ef4444; color: white; font-size: 0.7rem;
          font-weight: 700; width: 18px; height: 18px;
          border-radius: 50%; display: flex; align-items: center;
          justify-content: center;
        }
        .btn-login {
          background: #1a1a1a; color: white !important;
          padding: 0.5rem 1.25rem; border-radius: 8px;
          font-weight: 500 !important; transition: background 0.2s !important;
        }
        .btn-login:hover { background: #333 !important; }
        .btn-logout {
          background: none; border: 1px solid #ddd; color: #555;
          padding: 0.45rem 1rem; border-radius: 8px; cursor: pointer;
          font-size: 0.9rem; font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s;
        }
        .btn-logout:hover { border-color: #999; color: #1a1a1a; }
        @media (max-width: 640px) {
          .navbar { padding: 0 1rem; }
          .logo-text { display: none; }
          .nav-right { gap: 0.75rem; }
        }
      `}</style>

      <nav className="navbar">
        <a href="/" className="nav-logo">
          <div className="logo-box">M</div>
          <span className="logo-text">MyMarket</span>
        </a>

        <ul className="nav-right">
          <li><a href="/#products">Products</a></li>
          <li><a href="/categories">Categories</a></li>

          {mounted && (
            <>
              {isAuthenticated ? (
                <>
                  <li><a href="/account">Hi, {user?.name?.split(' ')[0]}</a></li>
                  <li>
                    <button className="btn-logout" onClick={logout}>Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li><a href="/auth/login">Login</a></li>
                  <li><a href="/auth/signup" className="btn-login">Sign up</a></li>
                </>
              )}

              <li>
                <a href="/cart" className="cart-btn">
                  Cart
                  {totalItems > 0 && (
                    <span className="cart-badge">{totalItems}</span>
                  )}
                </a>
              </li>

              {mounted && user?.role === 'admin' && (
                <li><a href="/dashboard">Admin</a></li>
              )}
            </>
          )}
        </ul>
      </nav>
    </>
  )
}