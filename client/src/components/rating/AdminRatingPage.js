// client/src/pages/AdminRatingPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ← Добавь это
import axios from 'axios';
import RatingList from './RatingList'; // Или где у тебя находится компонент

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AdminRatingPage({ user }) {
    const navigate = useNavigate(); 
  const [users, setUsers] = useState([]); // Список всех пользователей
  const [selectedUserId, setSelectedUserId] = useState('');
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [refreshRatingList, setRefreshRatingList] = useState(0);
const [searchTerm, setSearchTerm] = useState('');
const [selectedUser, setSelectedUser] = useState(null);
const [showDropdown, setShowDropdown] = useState(false);

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
    const response = await fetch(`${BACKEND_URL}/rating/user/${selectedUser._id}`, {
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
        {/* Кнопка "Назад" */}
      <button
        onClick={() => navigate('/admin')}
        style={{
          marginBottom: '20px',
          padding: '8px 16px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        ← Назад
      </button>
        <div style={{ position: 'relative', marginBottom: '15px' }}>
  <input
    type="text"
    value={searchTerm}
    onChange={(e) => {
      setSearchTerm(e.target.value);
      setShowDropdown(true);
    }}
    placeholder="Начните вводить имя или username..."
    style={{
      width: '100%',
      padding: '10px',
      fontSize: '16px',
      border: '1px solid #493f3fff',
      borderRadius: '4px'
    }}
    onFocus={() => filteredUsers.length > 0 && setShowDropdown(true)}
    onBlur={() => setTimeout(() => setShowDropdown(false), 150)} // задержка для клика
  />

  {showDropdown && (
    <ul className='spisok'
      style={{
        position: 'absolute',
        zIndex: 1000,
        left: 0,
        right: 0,
        top: '100%',
        background: 'white',
        border: '1px solid #704141ff',

        borderRadius: '4px',
        maxHeight: '200px',
        overflowY: 'auto',
        listStyle: 'none',
        padding: 0,
        margin: 0,
      }}
    >
      {filteredUsers.length > 0 ? (
        filteredUsers.map(user => (
          <li
            key={user._id}
            onClick={() => {
              setSelectedUser(user);
              setSearchTerm(`${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || '');
              setShowDropdown(false);
            }}className='spisok'
            style={{
              padding: '10px',
              cursor: 'pointer',
              backgroundColor: '#7c4949ff',
              
              borderBottom: '1px solid #f0f0f0'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f9f9f9'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
          >
            <strong className='spisok'>{user.firstName || user.username || 'Без имени'}</strong>
            {user.lastName && ` ${user.lastName}`}
            {user.username && ` (@${user.username})`}
          </li>
        ))
      ) : (
        <li style={{ padding: '10px', color: '#373131ff' }}>
          Нет совпадений
        </li>
      )}
    </ul>
  )}
</div>

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