// client/src/pages/AdminRatingPage.js

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Добавляем useNavigate для перенаправления
import RatingList from './RatingList'; // Проверьте путь, если он отличается

// Изменяем BACKEND_URL на API_BASE_URL для согласованности и правильного порта
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

function AdminRatingPage({ user }) { // user передается как проп
    const navigate = useNavigate();

    const [allUsers, setAllUsers] = useState([]); // Все пользователи из коллекции 'users'
    const [ratingEntries, setRatingEntries] = useState([]); // Сырые записи из коллекции 'ratings'
    const [selectedUserToAdd, setSelectedUserToAdd] = useState(''); // Для добавления/редактирования
    const [scoreToAdd, setScoreToAdd] = useState(0); // Для добавления/редактирования
    const [selectedUserToDelete, setSelectedUserToDelete] = useState(''); // Для удаления
    const [message, setMessage] = useState('');
    const [error, setError] = useState(''); // Для вывода ошибок
    const [loading, setLoading] = useState(true);

    // Функция для получения всех данных
    const fetchData = useCallback(async () => {
    console.log('fetchData called at', new Date().toISOString());
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token, redirect to /admin');
        navigate('/admin');
        return;
      }

      const [usersRes, ratingRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/rating`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      console.log('usersRes.data:', usersRes.data);
      console.log('ratingRes.data:', ratingRes.data);

      setAllUsers(usersRes.data || []);
      setRatingEntries(ratingRes.data || []);
    } catch (err) {
      console.error('fetchData error', err);
      setError(err.response?.data?.message || 'Ошибка загрузки данных');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/admin');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

    // Загружаем данные при монтировании компонента
   // ВАЖНО: вызвать fetchData ровно 1 раз при маунте
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // пустой массив — fetchData вызовется один раз

    // Вычисляем список пользователей, которые УЖЕ в рейтинге (для отображения и удаления)
    const usersInRatingForDisplay = useMemo(() => {
        return ratingEntries.map(ratingEntry => {
            const userDetails = allUsers.find(u => u.telegramId === ratingEntry.telegramId);
            return userDetails ? { ...userDetails, score: ratingEntry.score } : null;
        }).filter(Boolean); // Отфильтровываем null, если пользователь не найден
    }, [allUsers, ratingEntries]);

    // Вычисляем список пользователей, которых ЕЩЕ НЕТ в рейтинге (для добавления)
    const usersNotInRatingForAdd = useMemo(() => {
        const telegramIdsInRating = new Set(ratingEntries.map(entry => entry.telegramId));
        return allUsers.filter(u => !telegramIdsInRating.has(u.telegramId));
    }, [allUsers, ratingEntries]);

    // Обработчик для добавления/редактирования пользователя в рейтинг
    const handleAddOrUpdateRating = async () => {
        setMessage('');
        setError('');
        if (!selectedUserToAdd || (scoreToAdd === undefined || scoreToAdd === null)) {
            setError("Пожалуйста, выберите пользователя и введите балл.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) { navigate('/admin'); return; }

            const userSelected = allUsers.find(u => u.telegramId === selectedUserToAdd);
            if (!userSelected) {
                setError('Выбранный пользователь не найден.');
                return;
            }

            // Предполагаем, что /admin/rating/add обрабатывает как добавление, так и обновление
            await axios.post(`${API_BASE_URL}/admin/rating/add`, {
                telegramId: selectedUserToAdd, // Используем telegramId
                score: scoreToAdd,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage(`Пользователь ${userSelected.username || userSelected.firstName} обновлен/добавлен в рейтинг со счетом ${scoreToAdd}.`);
            setSelectedUserToAdd('');
            setScoreToAdd(0);
            fetchData(); // Обновляем данные после операции
        } catch (err) {
            console.error("Ошибка при добавлении/обновлении рейтинга:", err);
            setError(err.response?.data?.message || "Ошибка при добавлении/обновлении рейтинга.");
            if (err.response?.status === 401) { localStorage.removeItem('token'); navigate('/admin'); }
        }
    };

    // НОВАЯ ЛОГИКА: Обработчик для удаления пользователя из рейтинга
    const handleDeleteUserFromRating = async () => {
        setMessage('');
        setError('');
        if (!selectedUserToDelete) {
            setError('Пожалуйста, выберите пользователя для удаления из рейтинга.');
            return;
        }

        if (!window.confirm(`Вы уверены, что хотите удалить пользователя с Telegram ID: ${selectedUserToDelete} из рейтинга?`)) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) { navigate('/admin'); return; }

            await axios.delete(`${API_BASE_URL}/admin/rating/delete/${selectedUserToDelete}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage(`Пользователь с Telegram ID: ${selectedUserToDelete} успешно удален из рейтинга.`);
            setSelectedUserToDelete('');
            fetchData(); // Обновляем данные после удаления
        } catch (err) {
            console.error('Ошибка при удалении пользователя из рейтинга:', err);
            setError(err.response?.data?.message || 'Не удалось удалить пользователя из рейтинга.');
            if (err.response?.status === 401) { localStorage.removeItem('token'); navigate('/admin'); }
        }
    };

    if (loading) {
        return <div style={{ padding: '20px' }}>Загрузка...</div>;
    }

    // Проверка роли администратора
    if (!user || user.role !== 'admin') {
        return <div style={{ padding: '20px', color: 'red' }}>Доступ запрещен. Вы не администратор.</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Панель Администратора Рейтинга</h1>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Секция "Добавить/Редактировать пользователя" */}
            <div style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                <h2>Добавить или редактировать игрока в рейтинге</h2>
                <select
  value={selectedUserToAdd}
  onChange={e => setSelectedUserToAdd(e.target.value)}
  disabled={loading || usersNotInRatingForAdd.length === 0}
>
  <option value="">{loading ? 'Загрузка...' : '-- Выберите пользователя --'}</option>
  {usersNotInRatingForAdd.length === 0 && !loading
    ? <option value="">Нет пользователей</option>
    : usersNotInRatingForAdd.map(u => (
        <option key={u.telegramId || u._id} value={u.telegramId || u._id}>
          {u.username || u.firstName || `ID:${u.telegramId || u._id}`} ({u.telegramId || u._id})
        </option>
      ))}
</select>

                <input
                    type="number"
                    value={scoreToAdd}
                    onChange={(e) => setScoreToAdd(Number(e.target.value))}
                    placeholder="Балл рейтинга"
                    style={{ marginRight: '10px', padding: '8px' }}
                />

                <button onClick={handleAddOrUpdateRating} style={{ padding: '8px 15px' }}>
                    Добавить/Редактировать
                </button>
            </div>

            {/* НОВАЯ СЕКЦИЯ: Удаление пользователя из рейтинга */}
            <div style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                <h2>Удалить пользователя из рейтинга</h2>
                <select
                    value={selectedUserToDelete}
                    onChange={(e) => setSelectedUserToDelete(e.target.value)}
                    style={{ marginRight: '10px', padding: '8px' }}
                >
                    <option value="">-- Выберите пользователя --</option>
                    {usersInRatingForDisplay.map(u => (
                        <option key={u.telegramId} value={u.telegramId}>
                            {u.username || u.firstName || `ID: ${u.telegramId}`} ({u.telegramId})
                        </option>
                    ))}
                </select>
                <button onClick={handleDeleteUserFromRating} style={{ padding: '8px 15px', backgroundColor: 'red', color: 'white' }}>
                    Удалить из рейтинга
                </button>
            </div>

            <hr style={{ margin: '30px 0', borderColor: '#eee' }} />

            {/* Отображаемый список рейтинга для админов */}
            <RatingList
                title="Текущий Рейтинг Пользователей"
                users={usersInRatingForDisplay} // Передаем отфильтрованный и обогащенный список
                // refreshTrigger больше не нужен, так как данные управляются здесь
            />
        </div>
    );
}

export default AdminRatingPage;