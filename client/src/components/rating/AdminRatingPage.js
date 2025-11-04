// client/src/pages/AdminRatingPage;
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import RatingList from './RatingList'; // Или 
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import '../AdminPage.css';

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AdminRatingPage({ user }) { // Предполагается, что user передается из App.js
  const [users, setUsers] = useState([]); // Список всех пользователей
  const [selectedUserId, setSelectedUserId] = useState('');
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
 const [refreshRatingList, setRefreshRatingList] = useState(0);

//  const { user, webApp } = useTelegram();
    const navigate = useNavigate();

    const [allUsers, setAllUsers] = useState([]);
    const [ratingUsers, setRatingUsers] = useState([]);
    const [selectedUserToAdd, setSelectedUserToAdd] = useState('');
    const [scoreToAdd, setScoreToAdd] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
  
  // НОВОЕ СОСТОЯНИЕ: Для выбранного пользователя для удаления
    const [selectedUserToDelete, setSelectedUserToDelete] = useState('');

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/admin'); // Перенаправляем на страницу админа/логина, если нет токена
                return;
            }

            const [usersRes, ratingRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${API_BASE_URL}/rating`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setAllUsers(usersRes.data);
            setRatingUsers(usersRes.data.filter(u => ratingRes.data.some(r => r.telegramId === u.telegramId))); // Фильтруем, чтобы получить полные данные пользователей, которые в рейтинге

        } catch (err) {
            console.error('Failed to fetch users or rating:', err);
            setError('Не удалось загрузить данные. Пожалуйста, попробуйте снова.');
            if (err.response && err.response.status === 401) {
                navigate('/admin'); // Перенаправляем на логин, если не авторизован
            }
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL, navigate]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);
  
    useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Предполагается, что у вас есть эндпоинт для получения списка всех пользователей
        const response = await axios.get(`${BACKEND_URL}/users`); // Например, GET /users
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setMessage("Не удалось загрузить список пользователей.");
      }
    };
    fetchUsers();
  }, []);

//  const handleAdminAction = () => {
//     // Здесь будет ваша логика для админского действия, например, сброс рейтинга
//     console.log("Админское действие выполнено!");
//     // После успешного выполнения действия, инкрементируем refreshRatingList
//     // Это заставит RatingList перезагрузить свои данные
//     setRefreshRatingList(prev => prev + 1);
//   };


  const handleUpdateRating = async () => {
  if (!selectedUserId || score === undefined || score === null) {
    setMessage("Пожалуйста, выберите пользователя и введите балл.");
    return;
  }

  try {
    const response = await axios.post(`${BACKEND_URL}/admin/update-rating`, {
      userId: selectedUserId, // <-- Это должно быть ObjectId, что соответствует логике
      score: score,
    });

    setMessage(response.data.message);
    // Возможно, здесь нужно обновить список пользователей или сбросить форму
    // fetchUsers(); // Если есть такая функция
    // setScore(0);
    // setSelectedUserId(null);

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

 // НОВАЯ ЛОГИКА: Функция для обработки удаления пользователя из рейтинга
    const handleDeleteUserFromRating = async () => {
        setMessage('');
        setError('');
        if (!selectedUserToDelete) {
            setError('Пожалуйста, выберите пользователя для удаления из рейтинга.');
            return;
        }

        // Окно подтверждения перед удалением
        if (!window.confirm(`Вы уверены, что хотите удалить пользователя с Telegram ID: ${selectedUserToDelete} из рейтинга?`)) {
            return; // Если пользователь отменил, ничего не делаем
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/admin/rating/delete/${selectedUserToDelete}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage(`Пользователь с Telegram ID: ${selectedUserToDelete} успешно удален из рейтинга.`);
            setSelectedUserToDelete(''); // Сбрасываем выбранного пользователя
            fetchUsers(); // Обновляем список рейтинга
        } catch (err) {
            console.error('Ошибка при удалении пользователя из рейтинга:', err);
            setError(err.response?.data?.message || 'Не удалось удалить пользователя из рейтинга.');
        }
    };

    if (loading) {
        return <div className="admin-page-container">Загрузка...</div>;
    }

    if (!user || user.role !== 'admin') {
        return <div className="admin-page-container">Доступ запрещен. Вы не администратор.</div>;
    }

    // Фильтруем пользователей, которые еще не в рейтинге, для формы добавления
    const usersNotInRating = allUsers.filter(user =>
        !ratingUsers.some(ratingUser => ratingUser.telegramId === user.telegramId)
    );

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
              {u.username || u.firstName} ({u._id})
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
          добавить в рейтинг или редактировать игрока 
        </button>
      </div>
 {/* НОВЫЙ РАЗДЕЛ: Удаление пользователя из рейтинга */}
            <div className="admin-section">
                <h2>Удалить пользователя из рейтинга</h2>
                <div className="form-group">
                    <label htmlFor="userSelectDelete">Выберите пользователя для удаления:</label>
                    <select
                        id="userSelectDelete"
                        value={selectedUserToDelete}
                        onChange={(e) => setSelectedUserToDelete(e.target.value)}
                        required
                    >
                        <option value="">-- Выберите пользователя --</option>
                        {ratingUsers.map((u) => (
                            <option key={u.telegramId} value={u.telegramId}>
                                {u.username ? `@${u.username}` : `${u.firstName} ${u.lastName}`} ({u.telegramId})
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={handleDeleteUserFromRating}
                    className="admin-button delete-button" // Добавил класс delete-button для возможного стилизования
                >
                    Удалить из рейтинга
                </button>
            </div>
      

      <hr style={{ margin: '30px 0', borderColor: '#eee' }} />

      {/* Отображаемый список рейтинга для админов */}
      {/* Передаем title и refreshTrigger */}
      <RatingList
        title="Текущий Рейтинг Пользователей"
        refreshTrigger={[refreshRatingList]}
      />
    </div>
  );
}

export default AdminRatingPage;

// {/* <div style={{
//         marginBottom: '30px',
//         padding: '20px',
//         border: '1px solid #ddd',
//         borderRadius: '8px',
//         backgroundColor: '#f9f9f9'
//       }}>
//         <h2 style={{ color: '#555', marginBottom: '15px' }}>Инструменты Администратора</h2>
//         <p style={{ marginBottom: '15px' }}>Здесь будут ваши формы и кнопки для управления рейтингом:</p>
//         <button
//           onClick={handleAdminAction}
//           style={{
//             padding: '10px 15px',
//             backgroundColor: '#007bff',
//             color: 'white',
//             border: 'none',
//             borderRadius: '5px',
//             cursor: 'pointer',
//             fontSize: '16px',
//             marginRight: '10px'
//           }}
//         >
//           Выполнить админское действие (обновить/сбросить)
//         </button>
//         {/* Другие кнопки или формы для управления рейтингом */}
//         <p style={{ marginTop: '15px', fontSize: '0.9em', color: '#777' }}>
//           Например: добавление/удаление пользователей из рейтинга, изменение очков.
//         </p>
//       </div> */}