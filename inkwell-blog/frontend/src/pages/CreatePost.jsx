import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './PostForm.css';

const CATEGORIES = ['Teknoloji', 'Yaşam', 'Seyahat', 'Yemek', 'Spor', 'Diğer'];

/**
 * CreatePost: Yeni blog yazısı oluşturma formu.
 * Canlı karakter sayacı ve kategori seçimi içerir.
 */
const CreatePost = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    category: 'Diğer',
    coverImage: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.title.trim().length < 3) {
      return setError('Başlık en az 3 karakter olmalıdır.');
    }
    if (formData.content.trim().length < 10) {
      return setError('İçerik en az 10 karakter olmalıdır.');
    }

    setLoading(true);
    try {
      const { data } = await api.post('/posts', formData);
      navigate(`/post/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Yazı oluşturulamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-wrapper">
      <div className="container">
        <div className="post-form-page">
          <div className="page-header">
            <h1>Yeni Yazı</h1>
            <p>Fikirlerinizi dünyayla paylaşın</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="post-form fade-in-up">

            {/* Başlık */}
            <div className="form-group">
              <label className="form-label" htmlFor="title">
                Başlık <span className="form-count">{formData.title.length}/150</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className="form-input post-form__title-input"
                placeholder="Dikkat çekici bir başlık yazın..."
                value={formData.title}
                onChange={handleChange}
                maxLength={150}
                required
              />
            </div>

            {/* Kategori */}
            <div className="form-group">
              <label className="form-label" htmlFor="category">Kategori</label>
              <select
                id="category"
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Özet */}
            <div className="form-group">
              <label className="form-label" htmlFor="summary">
                Özet{' '}
                <span className="form-label__hint">(isteğe bağlı — boş bırakılırsa otomatik oluşturulur)</span>
              </label>
              <textarea
                id="summary"
                name="summary"
                className="form-textarea"
                placeholder="Yazınızı kısaca özetleyin..."
                value={formData.summary}
                onChange={handleChange}
                maxLength={300}
                rows={3}
              />
            </div>

            {/* Kapak Görseli */}
            <div className="form-group">
              <label className="form-label" htmlFor="coverImage">
                Kapak Görseli URL{' '}
                <span className="form-label__hint">(isteğe bağlı)</span>
              </label>
              <input
                id="coverImage"
                name="coverImage"
                type="url"
                className="form-input"
                placeholder="https://images.unsplash.com/..."
                value={formData.coverImage}
                onChange={handleChange}
              />
            </div>

            {/* İçerik */}
            <div className="form-group">
              <label className="form-label" htmlFor="content">
                İçerik <span className="form-count">{formData.content.length} karakter</span>
              </label>
              <textarea
                id="content"
                name="content"
                className="form-textarea post-form__content-area"
                placeholder="Yazınızı buraya yazın..."
                value={formData.content}
                onChange={handleChange}
                required
                rows={16}
              />
            </div>

            <div className="post-form__footer">
              <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
                İptal
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Yayınlanıyor...' : '🚀 Yayınla'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default CreatePost;
