// client/src/pages/AdminRatingPage;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

    const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    /**
     * Компонент для отображения списка рейтинга пользователей.
     *
     * @param {object} props - Свойства компонента.
     * @param {string} [props.title] - Заголовок, который будет отображаться над списком (необязательно).
     * @param {number} [props.refreshKey=0] - Ключ для принудительной перезагрузки данных. При изменении этого числа список будет перезагружаться.
     */
    function RatingList({ title, refreshKey = 0 }) { // <--- ПРОВЕРЬТЕ ЗДЕСЬ
      const [ratingData, setRatingData] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
  const [users, setUsers] = useState([]); // Список всех пользователей

      useEffect(() => {
        const fetchRatingData = async () => {
          try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${BACKEND_URL}/rating`);
            setRatingData(response.data);
          } catch (err) {
            console.error("Ошибка при загрузке рейтинга:", err);
            setError("Не удалось загрузить рейтинг. Попробуйте позже.");
          } finally {
            setLoading(false);
          }
        };

        fetchRatingData();
      }, [refreshKey]); // <--- И ПРОВЕРЬТЕ ЗДЕСЬ
const handleDelete = async (telegramId) => {
  if (!window.confirm('Вы уверены, что хотите удалить этого пользователя из рейтинга?')) {
    return;
  }

  try {
    const response = await fetch(`/api/ratings/${telegramId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      setUsers(prev => prev.filter(user => user.telegramId !== telegramId));
    } else {
      alert('Ошибка при удалении пользователя из рейтинга');
    }
  } catch (error) {
    console.error('Ошибка при удалении:', error);
    alert('Ошибка сети');
  }
};
      return (
        <div style={{ padding: '0px', fontFamily: 'Arial, sans-serif' }}>
          {title && <h2 style={{ color: '#333', marginBottom: '15px' }}>{title}</h2>}

          {loading && (
            <p style={{ color: '#666' }}>Загрузка рейтинга...</p>
          )}

          {error && (
            <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>
          )}

          {!loading && !error && (
            <div>
              {ratingData.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {ratingData.map((item, index) => (
                    <li
                      key={item._id || index}
                      style={{
                        marginBottom: '10px',
                        padding: '8px',
                        borderBottom: '1px solid #eee',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
                        borderRadius: '4px',
                      }}
                    >
                      <span style={{ fontWeight: 'bold' }}>
                        {index + 1}.{' '}
                        {item.username || item.firstName || 'Неизвестный пользователь'}
                      </span>
                      <span style={{ color: '#007bff' }}>Score: {item.score || 0}</span>
                      <span>      {
  users.map((user) => (
    <div key={user.telegramId}>
      <span>{user.name} ({user.telegramId})</span>
      <button onClick={() => handleDelete(user.telegramId)}>Удалить из рейтинга</button>
    </div>
  ))
}                     </span>
                    </li>
                  ))} 
                </ul>
              ) : (
                <p style={{ color: '#666' }}>Рейтинг пока пуст.</p>
              )}
            </div>
          )}
        </div>
      );
    }

    export default RatingList;