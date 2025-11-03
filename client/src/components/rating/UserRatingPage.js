// client/src/pages/UserRatingPage.js
import React from 'react'; // axios, useState, useEffect больше не нужны здесь
import RatingList from './RatingList'; // Импортируем новый компонент

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // Эта константа здесь больше не нужна, но оставлена на случай, если у вас есть другие запросы

function UserRatingPage({ user }) {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>Рейтинг Пользователей</h1>

      {/* Вставляем компонент RatingList сюда */}
      {/* Заголовок H1 уже есть, поэтому для RatingList можно не указывать title, или указать другой, например "Общий рейтинг" как H2 */}
      <RatingList />

      {user && user.role === 'admin' && (
        <button
          onClick={() => window.location.href = '/admin'}
          style={{
            marginTop: '20px',
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Перейти в Админку
        </button>
      )}
    </div>
  );
}

export default UserRatingPage;
