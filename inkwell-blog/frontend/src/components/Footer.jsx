import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container footer__inner">
      <Link to="/" className="footer__brand">
        <span>✒</span> Inkwell
      </Link>
      <p className="footer__copy">
        © {new Date().getFullYear()} Inkwell Blog — Bitirme Projesi Buğra Berk Bal
      </p>
    </div>
  </footer>
);

export default Footer;
