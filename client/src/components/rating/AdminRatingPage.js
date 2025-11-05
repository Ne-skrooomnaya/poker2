// client/src/pages/AdminRatingPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RatingList from './RatingList'; // Или где у тебя находится компонент

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AdminRatingPage({ user }) {
  const [users, setUsers] = useState([]); // Список всех пользователей
  const [selectedUserId, setSelectedUserId] = useState('');
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [refreshRatingList, setRefreshRatingList] = useState(0);

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
    if (!selectedUserId || score === undefined || score === null) {
      setMessage("Пожалуйста, выберите пользователя и введите балл.");
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/admin/update-rating`, {
        userId: selectedUserId,
        score: score,
      });

      setMessage(response.data.message);
    } catch (error) {
      console.error("Error updating rating:", error);
      let errorMessage = "Ошибка при обновлении рейтинга.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.request) {
        errorMessage = "Сервер недоступен.";
      }
      setMessage(errorMessage);
    }
  };

  // Функция удаления по telegramId
  const handleDelete = async () => {
  if (!selectedUserId) {
    alert('Пожалуйста, выберите пользователя');
    return;
  }

  if (!window.confirm(`Вы уверены, что хотите удалить этого пользователя из рейтинга?`)) {
    return;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/ratings/user/${selectedUserId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      setUsers(prev => prev.filter(user => user._id !== selectedUserId));
      setSelectedUserId('');
      setScore(0);
      setRefreshRatingList(prev => prev + 1);
      alert('Пользователь успешно удален из рейтинга');
    } else {
      alert('Ошибка при удалении пользователя из рейтинга');
    }
  } catch (error) {
    console.error('Ошибка при удалении:', error);
    alert('Ошибка сети');
  }
};

  return (
    <div style={{ padding: '20px' }}>
      <h1>Панель Администратора</h1>
      {message && <p>{message}</p>}

      <div>
        <h2>Управление Рейтингом</h2>
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          style={{ marginRight: '10px', padding: '8px' }}
        >
          <option value="">-- Выберите пользователя --</option>
          {users.map(u => (
            <option key={u._id} value={u._id}>
              {u.username || u.firstName} ({u.telegramId})
            </option>
          ))}
        </select>

        <input
          type="number"
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          placeholder="Балл рейтинга"
          style={{ marginRight: '10px', padding: '8px' }}
        />

        <button onClick={handleUpdateRating} style={{ padding: '8px 15px' }}>
          Добавить в рейтинг или редактировать
        </button>

        <button onClick={handleDelete} style={{ marginLeft: '10px', padding: '8px 15px' }}>
          Удалить из рейтинга
        </button>
      </div>

      <hr style={{ margin: '30px 0', borderColor: '#eee' }} />

      <RatingList
        title="Текущий Рейтинг Пользователей"
        refreshTrigger={[refreshRatingList]}
      />
    </div>
  );
}

export default AdminRatingPage;