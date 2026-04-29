import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import './Home.css';

const CATEGORIES = ['Tümü', 'Teknoloji', 'Yaşam', 'Seyahat', 'Yemek', 'Spor', 'Diğer'];

/**
 * Home Sayfası: Blog yazılarını listeler.
 * Arama, kategori filtresi ve sayfalama içerir.
 */
const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce için arama değerini geciktir
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 9 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (activeCategory !== 'Tümü') params.category = activeCategory;

      const { data } = await api.get('/posts', { params });
      setPosts(data.posts);
      setTotalPages(data.totalPages);
    } catch {
      setError('Yazılar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, activeCategory]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // Kategori veya arama değişince sayfa sıfırla
  useEffect(() => { setPage(1); }, [activeCategory, debouncedSearch]);

  return (
    <main className="page-wrapper">
      <div className="container">

        {/* Hero Banner */}
        <header className="home__hero">
          <h1 className="home__hero-title">
            Fikirler, <em>Hikayeler</em> ve<br />Deneyimler
          </h1>
          <p className="home__hero-sub">
            Topluluktan ilham verici yazılar keşfedin
          </p>
        </header>

        {/* Arama & Filtre */}
        <div className="home__controls">
          <div className="home__search-wrap">
            <span className="home__search-icon">🔍</span>
            <input
              type="text"
              className="form-input home__search"
              placeholder="     Yazılarda ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="home__categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`home__cat-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* İçerik */}
        {loading ? (
          <div className="spinner-wrapper"><div className="spinner" /></div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <p style={{ fontSize: 48, marginBottom: 12 }}>📭</p>
            <h3>Henüz yazı yok</h3>
            <p>Bu kriterlere uygun bir yazı bulunamadı.</p>
          </div>
        ) : (
          <>
            <div className="home__grid">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {/* Sayfalama */}
            {totalPages > 1 && (
              <div className="home__pagination">
                <button
                  className="btn btn-outline"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ← Önceki
                </button>
                <span className="home__page-info">
                  {page} / {totalPages}
                </span>
                <button
                  className="btn btn-outline"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Sonraki →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Home;
