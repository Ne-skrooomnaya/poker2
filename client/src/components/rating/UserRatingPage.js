// client/src/rating/UserRatingPage.js

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import RatingList from './RatingList';

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
    <div className="user-rating-page">
      <h1 className="page-title">Рейтинг Участников</h1>
      <button onClick={() => navigate('/user')} className="btn-back">← Назад</button>
      <div className="search-container">
        <input
          type="text"
          placeholder="Поиск по username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <RatingList
        title="Рейтинг участников"
        ratings={filteredRatings}
        // убираем users, потому что теперь username в каждом rating
      />
    </div>
  );
}

export default UserRatingPage;