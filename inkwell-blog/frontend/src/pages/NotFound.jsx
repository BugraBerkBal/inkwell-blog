import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <main className="page-wrapper">
    <div className="container" style={{ textAlign: 'center', paddingTop: 40 }}>
      <p style={{ fontSize: 72, marginBottom: 16 }}>404</p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, marginBottom: 12 }}>
        Sayfa Bulunamadı
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <Link to="/" className="btn btn-primary">Ana Sayfaya Dön</Link>
    </div>
  </main>
);

export default NotFound;
