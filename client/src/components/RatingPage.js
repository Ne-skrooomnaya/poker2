// client/src/components/RatingPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RatingList from './rating/RatingList';

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function RatingPage({ user }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) {
      setMessage('Доступ запрещён. Пожалуйста, авторизуйтесь.');
      return;
    }
  }, [user]);

  if (!user) {
    return <div>{message}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Рейтинг Пользователей</h1>

      <RatingList title="Текущий Рейтинг" />

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => window.history.back()} style={{ padding: '8px 15px' }}>
          Назад
        </button>
      </div>
    </div>
  );
}

export default RatingPage;