// client/src/pages/UserRatingPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Константа для URL бэкенда. Предполагается, что она правильно настроена в .env файле
// Используйте процесс.env.REACT_APP_API_URL, если он определен, иначе fallback к localhost
const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function UserRatingPage({ user }) {
  const [ratingData, setRatingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Создаем асинхронную функцию для получения данных рейтинга
    const fetchRatingData = async () => {
      try {
        setLoading(true); // Устанавливаем флаг загрузки в true перед запросом
        setError(null);   // Сбрасываем предыдущие ошибки

        // Выполняем GET-запрос к эндпоинту /rating
        const response = await axios.get(`${BACKEND_URL}/rating`);

        // Если запрос успешен, обновляем состояние ratingData
        setRatingData(response.data);
      } catch (err) {
        console.error("Ошибка при загрузке рейтинга:", err);
        // Устанавливаем сообщение об ошибке для пользователя
        setError("Не удалось загрузить рейтинг. Попробуйте позже.");
      } finally {
        // Независимо от успеха или неудачи, устанавливаем флаг загрузки в false
        setLoading(false);
      }
    };

    // Вызываем функцию получения данных рейтинга при монтировании компонента
    fetchRatingData();
  }, []); // Пустой массив зависимостей означает, что эффект выполнится только один раз при монтировании

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>Рейтинг Пользователей</h1>

      {/* Отображение индикатора загрузки */}
      {loading && (
        <p style={{ color: '#666' }}>Загрузка рейтинга...</p>
      )}

      {/* Отображение сообщения об ошибке */}
      {error && (
        <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>
      )}

      {/* Отображение рейтинга, если нет загрузки и нет ошибок */}
      {!loading && !error && (
        <div>
          {ratingData.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {ratingData.map((item, index) => (
                <li
                  key={item._id || index} // Используем _id, если есть, иначе индекс. Важно для уникальности ключей.
                  style={{
                    marginBottom: '15px',
                    padding: '10px',
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontWeight: 'bold' }}>
                    {index + 1}.{' '}
                    {item.user?.username || item.user?.firstName || 'Неизвестный пользователь'}
                  </span>
                  <span style={{ color: '#007bff' }}>Score: {item.score}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#666' }}>Рейтинг пока пуст.</p>
          )}
        </div>
      )}

      {/* Кнопка для перехода в админку, если пользователь существует и имеет роль 'admin' */}
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
