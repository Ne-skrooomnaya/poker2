// client/src/components/PastGamesPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PastGamesPage.css';

function PastGamesPage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('05.11.2025');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    allTournaments: true,
    SixSex: false,
    WinTheButton: false,
    Ананас: false,
    Джокер: false,
    Микс: false,
    Омаха: false,
    Холдем: false
  });

  // Пример данных
// Пример данных
const pastGames = [
  {
    id: 1,
    tournament: 'Турнир Race Division',
    date: '05.11.2025',
    players: [
      { place: 1, title: '', name: 'Артём Волков', score: '+62.300.000' },
      { place: 2, title: '', name: 'Лейла Алиева', score: '+34.700.000' },
      { place: 3, title: '', name: 'Дмитрий Соколов', score: '+22.100.000' },
      { place: 4, title: '', name: 'Марина Кузнецова', score: '+17.800.000' }
    ]
  },
  {
    id: 2,
    tournament: 'Джокер',
    date: '05.11.2025',
    players: [
      { place: 1, title: '', name: 'Рустам Гусейнов', score: '+13.500.000' },
      { place: 2, title: '', name: 'Анна Петрова', score: '+6.200.000' }
    ]
  },
  {
    id: 3,
    tournament: 'Холдем',
    date: '05.11.2025',
    players: [
      { place: 1, title: '', name: 'Егор Морозов', score: '+9.800.000' },
      { place: 2, title: '', name: 'София Иванова', score: '+4.500.000' }
    ]
  }
];


  // Фильтрация
  const filteredGames = pastGames.filter(game => {
    if (!activeFilters.allTournaments) {
      return (
        (activeFilters.SixSex && game.tournament === 'SixSex') ||
        (activeFilters.WinTheButton && game.tournament === 'WinTheButton') ||
        (activeFilters.Ананас && game.tournament === 'Ананас') ||
        (activeFilters.Джокер && game.tournament === 'Джокер') ||
        (activeFilters.Микс && game.tournament === 'Микс') ||
        (activeFilters.Омаха && game.tournament === 'Омаха') ||
        (activeFilters.Холдем && game.tournament === 'Холдем')
      );
    }
    return true;
  });

  const handleFilterChange = (filterName) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const resetFilters = () => {
    setActiveFilters({
      allTournaments: true,
      SixSex: false,
      WinTheButton: false,
      Ананас: false,
      Джокер: false,
      Микс: false,
      Омаха: false,
      Холдем: false
    });
  };

  return (
    <div className="past-games-page">
  <h1 className="past-games-title">Прошедшие игры</h1>

  {/* Кнопки фильтров */}
  <div style={{ marginBottom: '20px' }}>
    <button
      onClick={() => setFiltersOpen(!filtersOpen)}
      className="btn-primary"
    >
      Фильтры
    </button>
    <button
      onClick={resetFilters}
      className="btn-secondary"
    >
      Сбросить
    </button>
  </div>

  {/* Фильтры */}
  {filtersOpen && (
    <div className="past-games-filters">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3>Фильтры</h3>
        <button
          onClick={() => setFiltersOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Дата турнира</label>
        <input
          type="text"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          placeholder="дд.мм.гггг"
          style={{
            width: '100%',
            padding: '8px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
      </div>

      <div style={{ marginTop: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Тип турнира</label>
        {Object.keys(activeFilters).map(filterName => (
          <div key={filterName} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <input
              type="checkbox"
              checked={activeFilters[filterName]}
              onChange={() => handleFilterChange(filterName)}
              style={{ marginRight: '10px' }}
            />
            <span>{filterName}</span>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* Список игр */}
  {filteredGames.map(game => (
    <div key={game.id} className="past-games-game">
      <div className="past-games-game-header">
        <h3>{game.tournament}</h3>
        <span>{game.date}</span>
      </div>

      <div className="past-games-players">
        <h4>Места</h4>
        {game.players.map(player => (
          <div key={player.place} className="past-games-player">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', marginRight: '10px' }}>{player.place}</span>
              <span className={`title-badge ${player.title === '' ? 'title-gm' : 'title-se'}`}>
                {player.title}
              </span>
              <span>{player.name}</span>
            </div>
            <span style={{ fontWeight: 'bold', color: '#4CAF50' }}>{player.score}</span>
          </div>
        ))}
      </div>
    </div>
  ))}

  {/* Кнопка "Назад" */}
  <button
    onClick={() => navigate('/user')}
    className="btn-back"
  >
    ← Назад
  </button>
</div>
  );
}

export default PastGamesPage;