// client/src/components/rating/RatingList.js

import React from 'react';
import './RatingList.css';

function RatingList({ title, combinedList, users }) {
  return (
    <div className="rating-container">
      {title && <h2 className="rating-title">{title}</h2>}

      {/* Нет загрузки, потому что данные уже переданы */}
      {!combinedList && <p className="rating-loading">Загрузка рейтинга...</p>}
      {!combinedList && <p className="rating-error">Ошибка при загрузке рейтинга.</p>}

      {combinedList && (
        <div>
          {combinedList.length > 0 ? (
            <ul className="rating-list">
              {combinedList.map((item, index) => {
                let displayName = 'Неизвестный пользователь';
                if (item.isStatic) {
                  displayName = item.name;
                } else {
                  if (users && item.userId) {
                    const user = users[item.userId];
                    if (user) {
                      displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Без имени';
                    }
                  } else {
                    displayName = item.username || item.firstName || 'Неизвестный пользователь';
                  }
                }

                return (
                  <li key={item.id || index} className="rating-item">
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