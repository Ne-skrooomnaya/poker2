// client/src/components/MonthlyRacePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'MonthlyRacePage.css'
function MonthlyRacePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [raceData, setRaceData] = useState([
    { id: 1, title: 'GM', name: 'Константин Путилов', score: 89050000 },
    { id: 2, title: 'SE', name: 'Дмитрий Салихов', score: 58250000 },
    { id: 3, title: 'SE', name: 'Юлия Шакирова', score: 45390000 },
    { id: 4, title: 'SE', name: 'Сурия Пашаева', score: 42170000 },
    { id: 5, title: 'SE', name: 'Алик Карапетян', score: 39000000 },
    { id: 6, title: 'SE', name: 'Данияр Балтабаев', score: 35175000 },
    { id: 7, title: 'SE', name: 'Мурад Пашаев', score: 34200000 },
  ]);

  // Фильтрация по имени
  const filteredData = raceData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="monthly-race-page">
  <h1 className="monthly-race-title">Текущая гонка месяца</h1>
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
      <thead>
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
              <span className={`title-badge ${item.title === 'GM' ? 'title-gm' : 'title-se'}`}>
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

  <button onClick={() => navigate('/user')} className="btn-back">
    ← Назад
  </button>
</div>
  );
}

export default MonthlyRacePage;