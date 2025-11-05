// client/src/components/UserPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function UserPage({ user }) {
  const navigate = useNavigate();
console.log('UserPage rendered with user:', user);
  return (
    <div style={{ padding: '20px' }}>
      <h1>Добро пожаловать, {user.firstName || user.username || 'Пользователь'}!</h1>
      <p>Это ваша главная страница.</p>

      <button onClick={() => navigate('/rating')} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Перейти к рейтингу
      </button>
    </div>
  );
}

export default UserPage;