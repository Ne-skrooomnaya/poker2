// client/src/components/MonthlyRacePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MonthlyRacePage.css'
function MonthlyRacePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [raceData, setRaceData] = useState([
  { id: 1, title: '', name: 'Артём Волков', score: 92400000 },
  { id: 2, title: '', name: 'Мария Петрова', score: 67300000 },
  { id: 3, title: '', name: 'Рустам Алиев', score: 58900000 },
  { id: 4, title: '', name: 'Анна Соколова', score: 51200000 },
  { id: 5, title: '', name: 'Илья Морозов', score: 46700000 },
  { id: 6, title: '', name: 'Лейла Гусейнова', score: 41500000 },
  { id: 7, title: '', name: 'Егор Кузнецов', score: 37800000 },
]);

  // Фильтрация по имени
  const filteredData = raceData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="monthly-race-page">
  <h1 className="monthly-race-title">Текущая гонка месяца</h1>
    <button onClick={() => navigate('/user')} className="btn-back">
    ← Назад
  </button>
  <p>ноябрь 2025 года</p>

  <div className="monthly-race-search">
    <input
      type="text"
      placeholder="Введите имя игрока"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <button>Найти</button>
  </div>

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
        {filteredData.map((item, index) => (
          <tr key={item.id}>
            <td>{index + 1}</td>
            <td>
              <span className={`title-badge ${item.title === '' ? 'title-gm' : 'title-se'}`}>
                {item.title}
              </span>
            </td>
            <td>{item.name}</td>
            <td style={{ textAlign: 'right' }}>{item.score.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>


</div>
  );
}

export default MonthlyRacePage;