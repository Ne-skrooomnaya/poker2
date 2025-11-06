// client/src/components/rating/RatingList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Компонент для отображения списка рейтинга пользователей.
 *
 * @param {object} props
 * @param {string} [props.title] - Заголовок над списком
 * @param {number} [props.refreshKey=0] - Ключ для перезагрузки (работает, если данные запрашиваются внутри)
 * @param {Array} [props.ratings] - Опционально: уже загруженные рейтинги (если переданы — не делаем запрос)
 * @param {Object} [props.users] - Опционально: карта пользователей по id для отображения имён
 */
function RatingList({ title, refreshKey = 0, ratings: externalRatings, users: externalUsers }) {
  const [ratingData, setRatingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Если внешние данные НЕ переданы — запрашиваем сами (старое поведение)
  useEffect(() => {
    if (externalRatings === undefined) {
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
    } else {
      // Если данные переданы — не загружаем, просто "загружено"
      setLoading(false);
      // Нет смысла обновлять local state, если данные управляемые
    }
  }, [refreshKey, externalRatings]); // ← Зависимость от externalRatings

  // Решаем, что отображать: внешние данные или внутренние
  const dataToShow = externalRatings !== undefined ? externalRatings : ratingData;

  return (
    <div style={{ padding: '0px', fontFamily: 'Arial, sans-serif' }}>
      {title && <h2 style={{ color: '#333', marginBottom: '15px' }}>{title}</h2>}

      {loading && <p style={{ color: '#666' }}>Загрузка рейтинга...</p>}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      {!loading && !error && (
        <div>
          {dataToShow.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {dataToShow.map((item, index) => {
                // Пытаемся получить имя из externalUsers (если есть)
                let displayName = 'Неизвестный пользователь';

                if (externalUsers && item.userId) {
                  const user = externalUsers[item.userId];
                  if (user) {
                    displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Без имени';
                  }
                } else {
                  // Старое поведение: используем поля из item (если они есть)
                  displayName = item.username || item.firstName || 'Неизвестный пользователь';
                }

                return (
                  <li
                    key={item._id || index}
                    style={{
                      marginBottom: '10px',
                      padding: '8px',
                      borderBottom: '1px solid #463d97ff',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: index % 2 === 0 ? '#988080ff' : '#452121ff',
                      borderRadius: '4px',
                    }}
                  >
                    <span style={{ fontWeight: 'bold', color: '#000000ff' }}>
                      {index + 1}. {displayName}
                    </span>
                    <span style={{ color: '#007bff' }}>Score: {item.score || 0}</span>
                  </li>
                );
              })}
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