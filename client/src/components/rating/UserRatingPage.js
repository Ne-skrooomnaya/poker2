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
    <div className="monthly-race-page"> {/* Используем стиль гонки */}
      <h1 className="monthly-race-title">Рейтинг Участников</h1>
      <button onClick={() => navigate('/user')} className="btn-backg">← Назад</button>

      <div className="monthly-race-search">
        <input
          type="text"
          placeholder="Введите имя игрока"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button>Найти</button>
      </div>

      <RatingList
        title="Рейтинг участников"
        ratings={filteredRatings} // Передаём отфильтрованный список
      />

    </div>
  );
}

export default UserRatingPage;