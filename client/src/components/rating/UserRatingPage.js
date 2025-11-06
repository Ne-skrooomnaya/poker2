// client/src/components/UserRatingPage.js
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import RatingList from './RatingList';

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function UserRatingPage() {
  const navigate = useNavigate();
  const [ratings, setRatings] = useState([]);
  const [users, setUsers] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Загрузка рейтингов
  useEffect(() => {
    fetch(`${BACKEND_URL}/rating`)
      .then(res => res.json())
      .then(data => setRatings(data));
  }, []);

  // Загрузка пользователей
  useEffect(() => {
    fetch(`${BACKEND_URL}/users`)
      .then(res => res.json())
      .then(data => {
        const map = {};
        data.forEach(u => map[u._id] = u);
        setUsers(map);
      });
  }, []);

  // Фильтрация с защитой от гонок
  const filteredRatings = useMemo(() => {
    if (!searchTerm.trim()) return ratings; // показываем всё, если поиск пустой

    return ratings.filter(rating => {
      const user = users[rating.userId];
      if (!user) return false; // если пользователя нет — не показываем

      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim().toLowerCase();
      const username = (user.username || '').toLowerCase();

      return (
        fullName.includes(searchTerm.toLowerCase()) ||
        username.includes(searchTerm.toLowerCase())
      );
    });
  }, [ratings, users, searchTerm]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Рейтинг Пользователей</h1>

      <button
        onClick={() => navigate('/user')}
        style={{
          marginBottom: '20px',
          padding: '8px 16px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        ← Назад
      </button>

      <input
        type="text"
        placeholder="Поиск по имени или никнейму..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          fontSize: '16px'
        }}
      />

      <RatingList
        title="Рейтинг участников"
        ratings={filteredRatings}
        users={users}
      />
    </div>
  );
}

export default UserRatingPage;