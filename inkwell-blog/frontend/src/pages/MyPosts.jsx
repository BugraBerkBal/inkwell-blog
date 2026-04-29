import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './MyPosts.css';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('tr-TR', { year: 'numeric', month: 'short', day: 'numeric' });

/**
 * MyPosts: Giriş yapan kullanıcının kendi blog yazıları.
 * Düzenle ve sil işlemleri buradan yapılabilir.
 */
const MyPosts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const { data } = await api.get('/posts/user/my-posts');
        setPosts(data);
      } catch {
        setError('Yazılar yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) return;
    setDeletingId(postId);
    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch {
      alert('Silme başarısız.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="spinner-wrapper"><div className="spinner" /></div>;

  return (
    <main className="page-wrapper">
      <div className="container">
        <div className="my-posts__header">
          <div>
            <h1>Yazılarım</h1>
            <p>{posts.length} yazı · {user?.username}</p>
          </div>
          <Link to="/create" className="btn btn-primary">+ Yeni Yazı</Link>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {posts.length === 0 ? (
          <div className="empty-state">
            <p style={{ fontSize: 48, marginBottom: 12 }}>✍️</p>
            <h3>Henüz yazı yok</h3>
            <p>İlk yazınızı oluşturun ve dünyayla paylaşın.</p>
            <Link to="/create" className="btn btn-primary" style={{ marginTop: 20 }}>
              Şimdi Yaz
            </Link>
          </div>
        ) : (
          <div className="my-posts__list fade-in-up">
            {posts.map((post) => (
              <div key={post._id} className="my-post-row">
                <div className="my-post-row__info">
                  <span className="badge">{post.category}</span>
                  <Link to={`/post/${post._id}`} className="my-post-row__title">
                    {post.title}
                  </Link>
                  <div className="my-post-row__meta">
                    <span>📅 {formatDate(post.createdAt)}</span>
                    <span>👁 {post.views} görüntülenme</span>
                  </div>
                </div>

                <div className="my-post-row__actions">
                  <Link to={`/edit/${post._id}`} className="btn btn-outline btn-sm">
                    Düzenle
                  </Link>
                  <button
                    onClick={() => handleDelete(post._id)}
                    disabled={deletingId === post._id}
                    className="btn btn-danger btn-sm"
                  >
                    {deletingId === post._id ? '...' : 'Sil'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyPosts;
