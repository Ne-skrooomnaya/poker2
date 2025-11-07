// client/src/rating/UserRatingPage.js

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import RatingList from './RatingList';
import './UserRatingPage.css';
const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function UserRatingPage() {
  const navigate = useNavigate();
  const [ratings, setRatings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch(`${BACKEND_URL}/rating`)
      .then(res => res.json())
      .then(data => setRatings(data))
      .catch(err => console.error("Ошибка загрузки рейтинга:", err));
  }, []);

  const filteredRatings = useMemo(() => {
    if (!searchTerm.trim()) return ratings;
    const term = searchTerm.toLowerCase();
    return ratings.filter(rating =>
      (rating.username || '').toLowerCase().includes(term)
    );
  }, [ratings, searchTerm]);

  return (
    <div className="user-rating-page"> {/* Убираем mobile-friendly */}
      <h1 className="page-title">Рейтинг Участников</h1>
      <button onClick={() => navigate('/user')} className="btn-back btn-backo">
        ← Назад
      </button>

      <div className="search-box">
        <input
          type="text"
          placeholder="Имя или username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          inputMode="text"
          autoCapitalize="none"
          autoComplete="off"
        />
        <button className="search-button">Найти</button>
      </div>

      <RatingList
        ratings={filteredRatings}
      />
    </div>
  );
}

export default UserRatingPage;