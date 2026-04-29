import React from 'react';
import { Link } from 'react-router-dom';
import './PostCard.css';

/** Tarihi okunabilir formata çevirir */
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('tr-TR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
};

/**
 * PostCard: Blog yazısı kart bileşeni.
 * Ana sayfada grid içinde listelenir.
 */
const PostCard = ({ post }) => {
  const { _id, title, summary, category, author, createdAt, views } = post;

  return (
    <article className="post-card fade-in-up">
      {/* Kategori bandı */}
      <div className="post-card__top">
        <span className="badge">{category || 'Diğer'}</span>
        <span className="post-card__views">👁 {views || 0}</span>
      </div>

      {/* İçerik */}
      <div className="post-card__body">
        <h2 className="post-card__title">
          <Link to={`/post/${_id}`}>{title}</Link>
        </h2>
        <p className="post-card__summary">
          {summary?.length > 160 ? summary.substring(0, 160) + '...' : summary}
        </p>
      </div>

      {/* Alt bilgi */}
      <div className="post-card__footer">
        <div className="post-card__author">
          <div className="post-card__avatar">
            {author?.username?.[0]?.toUpperCase() || '?'}
          </div>
          <span>{author?.username || 'Anonim'}</span>
        </div>
        <time className="post-card__date" dateTime={createdAt}>
          {formatDate(createdAt)}
        </time>
      </div>
    </article>
  );
};

export default PostCard;
