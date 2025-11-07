// client/src/rating/RatingList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../MonthlyRacePage/MonthlyRacePage.css'
const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function RatingList({ title, refreshKey = 0, ratings: externalRatings }) {
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
        <div style={{ overflowX: 'auto' }}>
          <table className="monthly-race-table">
            <thead className="thead">
              <tr>
                <th>№</th>
                <th>Титул</th>
                <th>Игрок</th>
                <th>Очки</th>
              </tr>
            </thead>
            <tbody>
              {dataToShow.length > 0 ? (
                dataToShow.map((item, index) => (
                  <tr key={item._id || index}>
                    <td>{index + 1}</td>
                    <td>
                      <span className={`title-badge ${item.title === 'GM' ? 'title-gm' : item.title === 'SE' ? 'title-se' : 'title-default'}`}>
                        {item.title || ''}
                      </span>
                    </td>
                    <td>{item.username || 'Неизвестный'}</td>
                    <td style={{ textAlign: 'right' }}>{item.score?.toLocaleString() || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                    Рейтинг пока пуст.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RatingList;