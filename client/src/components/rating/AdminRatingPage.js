// client/src/components/rating/AdminRatingPage.js

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram'; // Убедитесь, что путь правильный
import RatingList from './RatingList';
import '../AdminPage.css';

const AdminRatingPage = () => {
    const { user, webApp } = useTelegram(); // useTelegram теперь должен сам обрабатывать ready() и expand()
    const navigate = useNavigate();

    const [allUsers, setAllUsers] = useState([]); // Все пользователи из коллекции 'users'
    const [ratingUsers, setRatingUsers] = useState([]); // Пользователи, которые находятся в рейтинге, с их счетами
    const [selectedUserToAdd, setSelectedUserToAdd] = useState('');
    const [scoreToAdd, setScoreToAdd] = useState(0);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const [selectedUserToDelete, setSelectedUserToDelete] = useState('');

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

    // РЕФАКТОРИНГ: fetchUsers теперь принимает токен в качестве аргумента
    const fetchUsers = useCallback(async (token) => {
        setLoading(true);
        setError('');
        try {
            // Запросы выполняются только если токен передан
            const [usersRes, ratingRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${API_BASE_URL}/rating`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setAllUsers(usersRes.data);

            // ИСПРАВЛЕННАЯ ЛОГИКА: Комбинируем детали пользователя со счетами из рейтинга
            const combinedRatingUsers = ratingRes.data.map(ratingEntry => {
                const userDetails = usersRes.data.find(u => u.telegramId === ratingEntry.telegramId);
                if (userDetails) {
                    return {
                        ...userDetails, // Распространяем детали пользователя (username, firstName и т.д.)
                        score: ratingEntry.score, // Добавляем счет из записи рейтинга
                    };
                }
                return null; // Пользователь не найден в allUsers (не должно происходить при согласованных данных)
            }).filter(Boolean); // Отфильтровываем любые null-записи

            setRatingUsers(combinedRatingUsers);

        } catch (err) {
            console.error('Ошибка при загрузке пользователей или рейтинга:', err);
            setError('Не удалось загрузить данные. Пожалуйста, попробуйте снова.');
            if (err.response && err.response.status === 401) {
                localStorage.removeItem('token'); // Очищаем недействительный токен
                navigate('/admin'); // Перенаправляем на страницу логина/админа
            }
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL, navigate]); // Зависимости для useCallback

    // useEffect для начальной загрузки данных и проверки токена
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/admin'); // Перенаправляем, если токен не найден
            return; // Прекращаем выполнение этого эффекта
        }
        fetchUsers(token); // Вызываем fetchUsers с токеном
    }, [fetchUsers, navigate]); // Зависимости для useEffect

    const handleAddUserToRating = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        if (!selectedUserToAdd) {
            setError('Пожалуйста, выберите пользователя для добавления.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) { // Повторная проверка токена перед вызовом API
                navigate('/admin');
                return;
            }
            const userToAdd = allUsers.find(u => u.telegramId === selectedUserToAdd);

            if (!userToAdd) {
                setError('Выбранный пользователь не найден.');
                return;
            }

            await axios.post(`${API_BASE_URL}/admin/rating/add`, {
                telegramId: userToAdd.telegramId,
                score: scoreToAdd
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage(`Пользователь ${userToAdd.username || userToAdd.firstName} добавлен в рейтинг со счетом ${scoreToAdd}.`);
            setSelectedUserToAdd('');
            setScoreToAdd(0);
            fetchUsers(token); // Повторно загружаем все данные после успешного добавления
        } catch (err) {
            console.error('Ошибка при добавлении пользователя в рейтинг:', err);
            setError(err.response?.data?.message || 'Не удалось добавить пользователя в рейтинг.');
            if (err.response && err.response.status === 401) {
                localStorage.removeItem('token');
                navigate('/admin');
            }
        }
    };

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
            if (!token) { // Повторная проверка токена перед вызовом API
                navigate('/admin');
                return;
            }
            await axios.delete(`${API_BASE_URL}/admin/rating/delete/${selectedUserToDelete}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage(`Пользователь с Telegram ID: ${selectedUserToDelete} успешно удален из рейтинга.`);
            setSelectedUserToDelete('');
            fetchUsers(token); // Повторно загружаем все данные после успешного удаления
        } catch (err) {
            console.error('Ошибка при удалении пользователя из рейтинга:', err);
            setError(err.response?.data?.message || 'Не удалось удалить пользователя из рейтинга.');
            if (err.response && err.response.status === 401) {
                localStorage.removeItem('token');
                navigate('/admin');
            }
        }
    };

    if (loading) {
        return <div className="admin-page-container">Загрузка...</div>;
    }

    if (!user || user.role !== 'admin') {
        return <div className="admin-page-container">Доступ запрещен. Вы не администратор.</div>;
    }

    // Фильтруем пользователей, которых нет в рейтинге, для выпадающего списка "Добавить"
    const usersNotInRating = allUsers.filter(u =>
        !ratingUsers.some(ratingUser => ratingUser.telegramId === u.telegramId)
    );

    // console.log("AdminRatingPage - ratingUsers:", ratingUsers); // Раскомментируйте для отладки
    // console.log("AdminRatingPage - allUsers:", allUsers); // Раскомментируйте для отладки

    return (
        <div className="admin-page-container">
            <h1>Админ-панель Рейтинга</h1>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}

            {/* Секция "Добавить пользователя" */}
            <div className="admin-section">
                <h2>Добавить пользователя в рейтинг</h2>
                <form onSubmit={handleAddUserToRating}>
                    <div className="form-group">
                        <label htmlFor="userSelectAdd">Выберите пользователя:</label>
                        <select
                            id="userSelectAdd"
                            value={selectedUserToAdd}
                            onChange={(e) => setSelectedUserToAdd(e.target.value)}
                            required
                        >
                            <option value="">-- Выберите пользователя --</option>
                            {usersNotInRating.map((u) => {
                                // Улучшенная логика отображения имени
                                const displayName = u.username ? `@${u.username}` : (u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.firstName || u.telegramId);
                                return (
                                    <option key={u.telegramId} value={u.telegramId}>
                                        {displayName} ({u.telegramId})
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="scoreInput">Начальный счет:</label>
                        <input
                            id="scoreInput"
                            type="number"
                            value={scoreToAdd}
                            onChange={(e) => setScoreToAdd(Number(e.target.value))}
                            required
                        />
                    </div>
                    <button type="submit" className="admin-button">Добавить в рейтинг</button>
                </form>
            </div>

            {/* Секция "Удалить пользователя" */}
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
                        {ratingUsers.map((u) => {
                            // Улучшенная логика отображения имени для выпадающего списка
                            const displayName = u.username ? `@${u.username}` : (u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.firstName || u.telegramId);
                            return (
                                <option key={u.telegramId} value={u.telegramId}>
                                    {displayName} ({u.telegramId})
                                </option>
                            );
                        })}
                    </select>
                </div>
                <button
                    onClick={handleDeleteUserFromRating}
                    className="admin-button delete-button"
                >
                    Удалить из рейтинга
                </button>
            </div>

            {/* Секция "Текущий Рейтинг" */}
            <div className="admin-section">
                <h2>Текущий Рейтинг</h2>
                {ratingUsers.length > 0 ? (
                    <RatingList users={ratingUsers} title="Пользователи в рейтинге" />
                ) : (
                    <p>В рейтинге пока нет пользователей.</p>
                )}
            </div>
        </div>
    );
};

export default AdminRatingPage;