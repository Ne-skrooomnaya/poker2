// client/src/pages/UserRatingPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RatingList from './RatingList';
const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // Эта константа здесь больше не нужна, но оставлена на случай, если у вас есть другие запросы

function UserRatingPage({ user }) {
  const navigate = useNavigate();
  const [ratings, setRatings] = useState([]);
  const [users, setUsers] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Получаем все рейтинги
  useEffect(() => {
    fetch(`${BACKEND_URL}/rating`)
      .then(res => res.json())
      .then(data => setRatings(data));
  }, []);

  // Получаем всех пользователей (один раз)
  useEffect(() => {
    fetch(`${BACKEND_URL}/users`)
      .then(res => res.json())
      .then(data => {
        const userMap = {};
        data.forEach(user => {
          userMap[user._id] = user; // ключ — userId (ObjectId)
        });
        setUsers(userMap);
      });
  }, []);

  // Фильтруем рейтинги по имени пользователя
  const filteredRatings = ratings.filter(rating => {
  const user = users[rating.userId];
  if (!user) {
    console.warn(`Пользователь с userId=${rating.userId} не найден в users`);
    // Не удаляем, просто помечаем как "Неизвестный"
    return true;
  }

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim().toLowerCase();
  const username = user.username?.toLowerCase() || '';

  return (
    fullName.includes(searchTerm.toLowerCase()) ||
    username.includes(searchTerm.toLowerCase())
  );
});
    return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>Рейтинг Пользователей</h1>
       {/* Кнопка "Назад" */}
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
         {/* Поле поиска */}
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

      {/* Передаём отфильтрованные рейтинги в RatingList */}
      <RatingList
  title="Рейтинг участников"
  ratings={filteredRatings}
  users={users} // ← карта: { [userId]: user }
/>

        </div>
      );
    }

    export default UserRatingPage;