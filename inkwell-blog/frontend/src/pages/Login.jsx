import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthForm.css';

/**
 * Login Sayfası: Kullanıcı e-posta ve şifre ile giriş yapar.
 * Başarılı girişte önceki sayfaya veya ana sayfaya yönlendirir.
 */
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş başarısız. Tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-wrapper auth-page">
      <div className="container">
        <div className="auth-card fade-in-up">

          <div className="auth-card__header">
            <h1>Tekrar hoş geldiniz</h1>
            <p>Hesabınıza giriş yapın</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
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
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <p className="auth-card__switch">
            Hesabınız yok mu?{' '}
            <Link to="/register">Kayıt olun</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
