import React, { useState, useEffect, useCallback } from 'react';
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

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState('');

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

  const fetchComments = useCallback(async () => {
    try {
      const { data } = await api.get(`/posts/${id}/comments`);
      setComments(data);
    } catch {
      // sessiz hata
    }
  }, [id]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentLoading(true);
    setCommentError('');
    try {
      const { data } = await api.post(`/posts/${id}/comments`, { content: commentText });
      setComments((prev) => [...prev, data]);
      setCommentText('');
    } catch (err) {
      setCommentError(err.response?.data?.message || 'Yorum eklenemedi.');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/posts/${id}/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch {
      alert('Yorum silinemedi.');
    }
  };

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

        {/* Yorumlar */}
        <section className="comments-section fade-in-up">
          <h2 className="comments-title">Yorumlar ({comments.length})</h2>

          {/* Yorum formu */}
          {user ? (
            <form onSubmit={handleAddComment} className="comment-form">
              <textarea
                className="comment-input"
                placeholder="Yorumunuzu yazın..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
                maxLength={500}
              />
              {commentError && <p className="comment-error">{commentError}</p>}
              <button type="submit" className="btn btn-primary" disabled={commentLoading}>
                {commentLoading ? 'Gönderiliyor...' : 'Yorum Yap'}
              </button>
            </form>
          ) : (
            <p className="comment-login-prompt">
              Yorum yapmak için <Link to="/login">giriş yapın</Link>.
            </p>
          )}

          {/* Yorum listesi */}
          <div className="comment-list">
            {comments.length === 0 ? (
              <p className="comment-empty">Henüz yorum yok. İlk yorumu siz yapın!</p>
            ) : (
              comments.map((c) => (
                <div key={c._id} className="comment-card">
                  <div className="comment-card__header">
                    <div className="comment-card__avatar">
                      {c.author?.username?.[0]?.toUpperCase()}
                    </div>
                    <span className="comment-card__author">{c.author?.username}</span>
                    <time className="comment-card__date">{formatDate(c.createdAt)}</time>
                    {user && user._id === c.author?._id && (
                      <button
                        className="comment-card__delete"
                        onClick={() => handleDeleteComment(c._id)}
                      >
                        Sil
                      </button>
                    )}
                  </div>
                  <p className="comment-card__content">{c.content}</p>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </main>
  );
};

export default PostDetail;
