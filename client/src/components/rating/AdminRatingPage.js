// client/src/components/rating/AdminRatingPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RatingList from './RatingList';
import './AdminRatingPage.css';
import '../HomePage.css';


const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AdminRatingPage({ user }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [refreshRatingList, setRefreshRatingList] = useState(0);

  const filteredUsers = users.filter(user =>
    (user.username?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.firstName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/users`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setMessage("Не удалось загрузить список пользователей.");
      }
    };
    fetchUsers();
  }, []);

  const handleUpdateRating = async () => {
    if (!selectedUser || score === undefined || score === null) {
      setMessage("Пожалуйста, выберите пользователя и введите балл.");
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/admin/update-rating`, {
        userId: selectedUser._id,
        score: score,
      });
      setMessage(response.data.message);
      setRefreshRatingList(prev => prev + 1);
    } catch (error) {
      console.error("Error updating rating:", error);
      let errorMessage = "Ошибка при обновлении рейтинга.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.request) {
        errorMessage = "Сервер недоступен.";
      }
      setMessage(errorMessage);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) {
      alert('Пожалуйста, выберите пользователя');
      return;
    }

    if (!window.confirm(`Вы уверены, что хотите удалить ${selectedUser.username || selectedUser.firstName} из рейтинга?`)) {
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/rating/user/${selectedUser._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setMessage('✅ Пользователь успешно удален из рейтинга');
        setRefreshRatingList(prev => prev + 1);
        setSelectedUser(null);
        setSearchTerm('');
        setScore(0);
      } else {
        alert('❌ Ошибка при удалении пользователя из рейтинга');
      }
    } catch (error) {
      console.error('Ошибка при удалении:', error);
      alert('❌ Ошибка сети');
    }
  };

  return (
    <div className="admin-panel">
      <h1 className="admin-title">Панель Администратора</h1>
      {message && <p className="admin-message">{message}</p>}

      <div className="admin-section">
        <h2 className="section-title">Управление Рейтингом</h2>

        <button
          onClick={() => navigate('/admin')}
          className="btn-back"
        >
          ← Назад
        </button>

        {/* Поле поиска */}
        <div className="search-container">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            placeholder="введите имя или username..."
            className="search-input"
          />

          {showDropdown && (
            <ul className="dropdown-list">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <li
                    key={user._id}
                    onClick={() => {
                      setSelectedUser(user);
                      setSearchTerm(`${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || '');
                      setShowDropdown(false);
                    }}
                    className="dropdown-item"
                  >
                    <strong>{user.firstName || user.username || 'Без имени'}</strong>
                    {user.lastName && ` ${user.lastName}`}
                    {user.username && ` (@${user.username})`}
                  </li>
                ))
              ) : (
                <li className="dropdown-item no-match">
                  Нет совпадений
                </li>
              )}
            </ul>
          )}
        </div>

        <div className="score-input-container">
          <input
            type="number"
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            placeholder="Балл рейтинга"
            className="score-input"
          />
        </div>

        <div className="action-buttons">
          <button onClick={handleUpdateRating} className="btn-primary">
            Добавить в рейтинг или редактировать
          </button>
          <button onClick={handleDelete} className="btn-danger">
            Удалить из рейтинга
          </button>
        </div>
      </div>

      <hr className="divider" />

      <RatingList
        title="Текущий Рейтинг Пользователей"
        refreshKey={refreshRatingList}
      />
    </div>
  );
}

export default AdminRatingPage;