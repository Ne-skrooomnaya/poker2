// client/src/components/rating/RatingList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RatingList.css';
const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function RatingList({ title, refreshKey = 0, ratings: externalRatings, users: externalUsers }) {
  const [ratingData, setRatingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          {dataToShow.length > 0 ? (
            <ul className="rating-list">
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
                  <li key={item._id || index} className="rating-item">
                    <span className="rating-name">
                      {index + 1}. {displayName}
                    </span>
                    <span className="rating-score">Score: {item.score || 0}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="rating-empty">Рейтинг пока пуст.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default RatingList;