import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './PostDetail.css';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('tr-TR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

/**
 * PostDetail: Tek bir blog yazısının tam görünümü.
 * Yazar ise düzenle/sil butonları gösterilir.
 */
const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        setPost(data);
      } catch {
        setError('Yazı bulunamadı.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) return;
    setDeleting(true);
    try {
      await api.delete(`/posts/${id}`);
      navigate('/', { replace: true });
    } catch {
      alert('Silme işlemi başarısız.');
      setDeleting(false);
    }
  };

  const isOwner = user && post && user._id === post.author._id;

  if (loading) return <div className="spinner-wrapper"><div className="spinner" /></div>;
  if (error) return (
    <main className="page-wrapper">
      <div className="container">
        <div className="alert alert-error">{error}</div>
        <Link to="/" className="btn btn-outline">← Ana Sayfa</Link>
      </div>
    </main>
  );

  return (
    <main className="page-wrapper">
      <div className="container">
        <article className="post-detail fade-in-up">

          {/* Geri dön + Aksiyonlar */}
          <div className="post-detail__toolbar">
            <Link to="/" className="btn btn-ghost">
              ← Tüm Yazılar
            </Link>
            {isOwner && (
              <div className="post-detail__actions">
                <Link to={`/edit/${post._id}`} className="btn btn-outline btn-sm">
                  ✏️ Düzenle
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="btn btn-danger btn-sm"
                >
                  {deleting ? 'Siliniyor...' : '🗑 Sil'}
                </button>
              </div>
            )}
          </div>

          {/* Kategori */}
          <div className="post-detail__meta-top">
            <span className="badge">{post.category || 'Diğer'}</span>
            {post.readTime && (
              <span className="post-detail__readtime">⏱ {post.readTime} dk okuma</span>
            )}
          </div>

          {/* Başlık */}
          <h1 className="post-detail__title">{post.title}</h1>

          {/* Özet */}
          {post.summary && (
            <p className="post-detail__lead">{post.summary}</p>
          )}

          {/* Yazar bilgisi */}
          <div className="post-detail__author-row">
            <div className="post-detail__avatar">
              {post.author?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <span className="post-detail__author-name">{post.author?.username}</span>
              <time className="post-detail__date">{formatDate(post.createdAt)}</time>
            </div>
            <span className="post-detail__views">👁 {post.views} görüntülenme</span>
          </div>

          <div className="divider" />

          {/* İçerik */}
          <div className="post-detail__content">
            {post.content.split('\n').map((para, i) =>
              para.trim() ? <p key={i}>{para}</p> : <br key={i} />
            )}
          </div>

        </article>
      </div>
    </main>
  );
};

export default PostDetail;
