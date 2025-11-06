// client/src/components/UserRatingPage.js

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import RatingList from './rating/RatingList';
import './UserRatingPage.css';
import '../HomePage.css';

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function UserRatingPage() {
  const navigate = useNavigate();
  const [ratings, setRatings] = useState([]);
  const [users, setUsers] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Статичные игроки
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
    fetch(`${BACKEND_URL}/rating`)
      .then(res => res.json())
      .then(data => setRatings(data));
  }, []);

  useEffect(() => {
    fetch(`${BACKEND_URL}/users`)
      .then(res => res.json())
      .then(data => {
        const map = {};
        data.forEach(u => map[u._id] = u);
        setUsers(map);
      });
  }, []);

  // Объединяем данные
  const combinedList = useMemo(() => {
    return [
      ...staticPlayers.map((p, i) => ({
        id: `static-${i}`,
        name: p.name,
        score: p.score,
        isStatic: true
      })),
      ...ratings.map(r => ({
        id: r._id,
        userId: r.userId,
        score: r.score,
        isStatic: false
      }))
    ];
  }, [ratings, staticPlayers]);

  // Фильтрация по поиску
  const filteredList = useMemo(() => {
    if (!searchTerm.trim()) return combinedList;

    const term = searchTerm.toLowerCase();
    return combinedList.filter(item => {
      if (item.isStatic) {
        return item.name.toLowerCase().includes(term);
      } else {
        const user = users[item.userId];
        if (!user) return false;
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim().toLowerCase();
        const username = (user.username || '').toLowerCase();
        return fullName.includes(term) || username.includes(term);
      }
    });
  }, [combinedList, users, searchTerm]);

  return (
    <div className="user-rating-page">
      <h1 className="page-title">Рейтинг Участников</h1>

      <button onClick={() => navigate('/user')} className="btn-back">
        ← Назад
      </button>

      <div className="search-container">
        <input
          type="text"
          placeholder="Поиск по имени или username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <RatingList
        title="Рейтинг участников"
        combinedList={filteredList}
        users={users}
      />
    </div>
  );
}

export default UserRatingPage;