// client/src/components/UserRatingPage.js
import React, { useState, useEffect } from 'react';
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
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch rating');
        return res.json();
      })
      .then(data => setRatings(data))
      .catch(err => console.error('Error loading rating:', err));
  }, []);

  // Загрузка пользователей
  useEffect(() => {
    fetch(`${BACKEND_URL}/users`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
      })
      .then(data => {
        const userMap = {};
        data.forEach(user => {
          userMap[user._id] = user;
        });
        setUsers(userMap);
      })
      .catch(err => console.error('Error loading users:', err));
  }, []);

  // Фильтрация с защитой от гонок и undefined
  const filteredRatings = React.useMemo(() => {
    return ratings.filter(rating => {
      const user = users[rating.userId];
      if (!user) {
        // Теоретически не должно происходить, но на всякий случай оставляем запись
        return true;
      }

      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim().toLowerCase();
      const username = (user.username || '').toLowerCase();

      return (
        fullName.includes(searchTerm.toLowerCase()) ||
        username.includes(searchTerm.toLowerCase())
      );
    });
  }, [ratings, users, searchTerm]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
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
          fontSize: '16px',
          border: '1px solid #ccc',
          borderRadius: '4px'
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