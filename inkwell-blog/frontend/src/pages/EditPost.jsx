import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './PostForm.css';

const CATEGORIES = ['Teknoloji', 'Yaşam', 'Seyahat', 'Yemek', 'Spor', 'Diğer'];

/**
 * EditPost: Mevcut blog yazısını düzenleme formu.
 * Sadece yazının sahibi bu sayfaya erişebilir.
 */
const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '', content: '', summary: '', category: 'Diğer', coverImage: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Mevcut yazıyı yükle
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);

        // Sahip değilse ana sayfaya gönder
        if (user && data.author._id !== user._id) {
          navigate('/', { replace: true });
          return;
        }

        setFormData({
          title: data.title,
          content: data.content,
          summary: data.summary || '',
          category: data.category || 'Diğer',
          coverImage: data.coverImage || '',
        });
      } catch {
        setError('Yazı yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, user, navigate]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const { data } = await api.put(`/posts/${id}`, formData);
      navigate(`/post/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Güncelleme başarısız.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="spinner-wrapper"><div className="spinner" /></div>;

  return (
    <main className="page-wrapper">
      <div className="container">
        <div className="post-form-page">
          <div className="page-header">
            <h1>Yazıyı Düzenle</h1>
            <p>Değişikliklerinizi yapıp kaydedin</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="post-form fade-in-up">

            <div className="form-group">
              <label className="form-label" htmlFor="title">Başlık</label>
              <input
                id="title" name="title" type="text"
                className="form-input post-form__title-input"
                value={formData.title}
                onChange={handleChange}
                maxLength={150}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="category">Kategori</label>
              <select id="category" name="category" className="form-select"
                value={formData.category} onChange={handleChange}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="summary">Özet</label>
              <textarea id="summary" name="summary" className="form-textarea"
                value={formData.summary} onChange={handleChange} maxLength={300} rows={3} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="coverImage">Kapak Görseli URL</label>
              <input id="coverImage" name="coverImage" type="url" className="form-input"
                value={formData.coverImage} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="content">İçerik</label>
              <textarea id="content" name="content"
                className="form-textarea post-form__content-area"
                value={formData.content}
                onChange={handleChange}
                required rows={16} />
            </div>

            <div className="post-form__footer">
              <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
                İptal
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Kaydediliyor...' : '💾 Kaydet'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default EditPost;
