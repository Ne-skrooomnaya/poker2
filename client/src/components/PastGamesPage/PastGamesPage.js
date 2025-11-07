// client/src/components/PastGamesPage/PastGamesPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PastGamesPage.css';

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function PastGamesPage() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch(`${BACKEND_URL}/past-games`)
      .then(res => res.json())
      .then(data => setGames(data))
      .catch(err => console.error("Ошибка загрузки прошедших игр:", err));
  }, []);

  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.players.some(p => p.username?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="monthly-race-page">
      <h1 className="monthly-race-title">Прошедшие игры</h1>
      <button onClick={() => navigate('/user')} className="btn-backg">← Назад</button>

      <div className="monthly-race-search">
        <input
          type="text"
          placeholder="Имя турнира или игрока"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button>Найти</button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        {filteredGames.length > 0 ? (
          filteredGames.map((game, index) => (
            <div key={game._id || index} className="past-game-card">
              <div className="past-game-header">
                <h3>{game.name}</h3>
                <span className="game-date">{game.date}</span>
              </div>
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
                  {game.players.map((player, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>
                        <span className={`title-badge ${player.title === 'GM' ? 'title-gm' : player.title === 'SE' ? 'title-se' : 'title-default'}`}>
                          {player.title || ''}
                        </span>
                      </td>
                      <td>{player.username || 'Неизвестный'}</td>
                      <td style={{ textAlign: 'right' }}>{player.score?.toLocaleString() || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <p className="rating-empty">Игры не найдены.</p>
        )}
      </div>
    </div>
  );
}

export default PastGamesPage;