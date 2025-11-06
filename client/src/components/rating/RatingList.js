// client/src/components/rating/RatingList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RatingList.css';
const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function RatingList({ title, refreshKey = 0, ratings: externalRatings, users: externalUsers }) {
  const [ratingData, setRatingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Статичные примеры игроков (для демонстрации)
  const staticPlayers = [
    { name: 'Алексей Москалев', score: 2700000 },
    { name: 'Денис Чернов', score: 2375000 },
    { name: 'Валерий Паршин', score: 1491900 },
    { name: 'Ваграм Карапетян', score: 1350000 },
    { name: 'Максим Найман', score: 1280000 },
    { name: 'Александр Кузнецов', score: 1080000 },
    { name: 'Айя Чернышева', score: 840000 },
    { name: 'Сергей Дмитриев', score: 700000 },
    { name: 'Ранель Шайхутдинов', score: 620000 },
    { name: 'Андрей Миронов', score: 570000 },
    { name: 'Олег Кириллов', score: 540000 },
    { name: 'Дарья Автономова', score: 535000 },
    { name: 'Павел Куприянов', score: 535000 },
    { name: 'Юлия Лазарева', score: 420000 },
    { name: 'Евгений Михайлов', score: 400000 },
    { name: 'Ильдар Гатауллин', score: 270000 },
    { name: 'Павел Чемезов', score: 206200 },
    { name: 'Даниль Исмагилов', score: 200000 },
    { name: 'Артём Жарков', score: 183800 },
    { name: 'Диана Рыбакова', score: 180000 },
    { name: 'Булат Ахунов', score: 180000 },
    { name: 'Глеб Фомин', score: 140000 },
    { name: 'Булат Гатауллин', score: 138300 },
    { name: 'Артём Автономов', score: 135000 },
    { name: 'Денис Умурянов', score: 100000 },
    { name: 'Ильдар Файзуллин', score: 100000 },
    { name: 'Булат Хабибуллин', score: 95000 },
    { name: 'Ванис Кузнецов', score: 80000 },
    { name: 'Роберт Федоров', score: 60000 },
    { name: 'Илюза Шарифуллина', score: 53300 },
    { name: 'Альфир Зиннатуллин', score: 40000 },
    { name: 'Рифнур Агалиуллин', score: 40000 },
    { name: 'Максим Борисов', score: 40000 },
    { name: 'Фарида Нигматзянова', score: 33800 },
    { name: 'Рустем Хазиахметов', score: 33600 },
    { name: 'Ильназ Хасаншин', score: 20000 },
    { name: 'Айрат Гимадетдинов', score: 15000 },
    { name: 'Илья Темячов', score: 12700 },
  ];


  
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
      setLoading(false);
    }
  }, [refreshKey, externalRatings]);

  const dataToShow = externalRatings !== undefined ? externalRatings : ratingData;

  return (
    <div className="rating-container">
      {title && <h2 className="rating-title">{title}</h2>}

      {loading && <p className="rating-loading">Загрузка рейтинга...</p>}
      {error && <p className="rating-error">{error}</p>}

      {!loading && !error && (
        <div>
          {/* Статичные игроки (примеры) */}
          <ul className="rating-list">
            {staticPlayers.map((player, idx) => (
              <li key={`fake-${idx}`} className="rating-item">
                <span className="rating-name">
                  {idx + 1}. {player.name}
                </span>
                <span className="rating-score">Score: {player.score.toLocaleString()}</span>
              </li>
            ))}


            {/* Реальные пользователи из БД */}
            {dataToShow.map((item, index) => {
              let displayName = 'Неизвестный пользователь';
              if (externalUsers && item.userId) {
                const user = externalUsers[item.userId];
                if (user) {
                  displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Без имени';
                }
              } else {
                displayName = item.username || item.firstName || 'Неизвестный пользователь';
              }

              return (
                <li key={item._id || `real-${index}`} className="rating-item">
                  <span className="rating-name">
                    {staticPlayers.length + index + 1}. {displayName}
                  </span>
                  <span className="rating-score">Score: {item.score || 0}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}


export default RatingList;