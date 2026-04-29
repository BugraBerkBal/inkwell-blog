import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthForm.css';

/**
 * Register Sayfası: Kullanıcı adı, e-posta ve şifre ile kayıt.
 */
const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Şifreler eşleşmiyor.');
    }
    if (formData.password.length < 6) {
      return setError('Şifre en az 6 karakter olmalıdır.');
    }

    setLoading(true);
    try {
      await register(formData.username, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt başarısız. Tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-wrapper auth-page">
      <div className="container">
        <div className="auth-card fade-in-up">

          <div className="auth-card__header">
            <h1>Hesap oluşturun</h1>
            <p>Topluluğumuza katılın ve yazmaya başlayın</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="username">Kullanıcı Adı</label>
              <input
                id="username"
                name="username"
                type="text"
                className="form-input"
                placeholder="kullanici_adi"
                value={formData.username}
                onChange={handleChange}
                required
                minLength={3}
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">E-posta</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="ornek@mail.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Şifre</label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-input"
                placeholder="En az 6 karakter"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Şifre Tekrar</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="form-input"
                placeholder="Şifrenizi tekrar girin"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
              {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
            </button>
          </form>

          <p className="auth-card__switch">
            Zaten hesabınız var mı?{' '}
            <Link to="/login">Giriş yapın</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Register;
