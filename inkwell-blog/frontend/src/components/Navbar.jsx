import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

/**
 * Navbar: Sayfanın üst navigasyon çubuğu.
 * Scroll'da gölge ekler, mobilde hamburger menü açar.
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Rota değişince menüyü kapat
  useEffect(() => setMenuOpen(false), [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">✒</span>
          Inkwell
        </Link>

        {/* Desktop Links */}
        <div className="navbar__links">
          <Link to="/" className={`navbar__link ${location.pathname === '/' ? 'active' : ''}`}>
            Yazılar
          </Link>

          {user ? (
            <>
              <Link to="/create" className="btn btn-primary btn-sm">
                + Yeni Yazı
              </Link>
              <div className="navbar__user">
                <Link to="/my-posts" className="navbar__link">
                  Yazılarım
                </Link>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                  Çıkış
                </button>
              </div>
            </>
          ) : (
            <div className="navbar__auth">
              <Link to="/login" className="btn btn-ghost btn-sm">Giriş Yap</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Kayıt Ol</Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menü"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="navbar__mobile">
          <Link to="/" className="navbar__mobile-link">Tüm Yazılar</Link>
          {user ? (
            <>
              <Link to="/create" className="navbar__mobile-link">+ Yeni Yazı</Link>
              <Link to="/my-posts" className="navbar__mobile-link">Yazılarım</Link>
              <button onClick={handleLogout} className="navbar__mobile-link navbar__mobile-logout">
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__mobile-link">Giriş Yap</Link>
              <Link to="/register" className="navbar__mobile-link">Kayıt Ol</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
