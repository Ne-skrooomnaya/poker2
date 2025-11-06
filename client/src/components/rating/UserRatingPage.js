// client/src/components/UserRatingPage.js
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import RatingList from './RatingList';

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function UserRatingPage() {
  const navigate = useNavigate();
  const [ratings, setRatings] = useState([]);
  const [users, setUsers] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch(`${BACKEND_URL}/rating`)
      .then(res => res.json())
      .then(setRatings);
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

  const filteredRatings = useMemo(() => {
    if (!searchTerm.trim()) return ratings;

    return ratings.filter(rating => {
      const user = users[rating.userId];
      if (!user) return false;

      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim().toLowerCase();
      const username = (user.username || '').toLowerCase();

      return fullName.includes(searchTerm.toLowerCase()) ||
             username.includes(searchTerm.toLowerCase());
    });
  }, [ratings, users, searchTerm]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Рейтинг участников</h2>
      <button onClick={() => navigate('/user')} style={{ marginBottom: '15px' }}>
        ← Назад
      </button>
      <input
        type="text"
        placeholder="Поиск по имени или username..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '15px' }}
      />
      <RatingList ratings={filteredRatings} users={users} />
    </div>
  );
}

export default UserRatingPage;