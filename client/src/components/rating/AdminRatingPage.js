import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import RatingList from './RatingList';

function AdminRatingPage() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]); // Для списка всех пользователей (для добавления и для отображения имен при удалении)
    const [selectedUserToAdd, setSelectedUserToAdd] = useState(''); // Выбранный пользователь для добавления
    const [ratings, setRatings] = useState([]); // Текущий список рейтинга
    const [selectedUserToDelete, setSelectedUserToDelete] = useState(''); // НОВОЕ: Выбранный пользователь для удаления

    // --- Существующий useEffect для загрузки данных ---
    useEffect(() => {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const fetchUsers = async () => {
            try {
                const res = await axios.get('/api/admin/usersForRating', config);
                setUsers(res.data);
            } catch (error) {
                console.error('Error fetching users for rating:', error);
                if (error.response && error.response.status === 403) {
                    toast.error('Недостаточно прав для доступа к админ-панели.');
                    navigate('/');
                } else {
                    toast.error('Ошибка при загрузке пользователей для рейтинга.');
                }
            }
        };

        const fetchRatings = async () => {
            try {
                // Предполагаем, что /api/ratings возвращает весь список рейтинга
                const res = await axios.get('/api/ratings', config);
                setRatings(res.data);
            } catch (error) {
                console.error('Error fetching current ratings:', error);
                toast.error('Ошибка при загрузке текущего рейтинга.');
            }
        };

        // Запускаем обе загрузки
        fetchUsers();
        fetchRatings();
    }, [navigate]);

    // --- Существующая функция для добавления пользователя ---
    const handleAddUserToRating = async () => {
        if (!selectedUserToAdd) {
            toast.error('Выберите пользователя для добавления в рейтинг.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.post('/api/admin/ratings', { telegramId: selectedUserToAdd }, config);

            toast.success('Пользователь успешно добавлен в рейтинг!');
            setSelectedUserToAdd(''); // Сброс выбранного пользователя
            // Обновляем список рейтинга после добавления
            const updatedRatingsRes = await axios.get('/api/ratings', config);
            setRatings(updatedRatingsRes.data);

        } catch (error) {
            console.error('Error adding user to rating:', error);
            const errorMessage = error.response?.data?.message || 'Не удалось добавить пользователя в рейтинг.';
            toast.error(errorMessage);
        }
    };

    // --- НОВАЯ ФУНКЦИЯ: Обработка удаления пользователя из рейтинга ---
    const handleDeleteRating = async () => {
        if (!selectedUserToDelete) {
            toast.error('Выберите пользователя для удаления из рейтинга.');
            return;
        }

        // Добавим подтверждение для удаления
        if (!window.confirm('Вы уверены, что хотите удалить этого пользователя из рейтинга?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.delete(`/api/admin/ratings/${selectedUserToDelete}`, config);

            toast.success('Пользователь успешно удален из рейтинга!');
            setSelectedUserToDelete(''); // Сброс выбранного пользователя
            // Обновляем список рейтинга после удаления
            const updatedRatingsRes = await axios.get('/api/ratings', config);
            setRatings(updatedRatingsRes.data);

        } catch (error) {
            console.error('Error deleting rating:', error);
            const errorMessage = error.response?.data?.message || 'Не удалось удалить пользователя из рейтинга.';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="admin-page">
            <h1>Админ Панель Рейтинга</h1>

            {/* Секция "Добавить пользователя в рейтинг" (ВОССТАНОВЛЕНА) */}
            <div className="admin-section">
                <h2>Добавить пользователя в рейтинг</h2>
                <select
                    value={selectedUserToAdd}
                    onChange={(e) => setSelectedUserToAdd(e.target.value)}
                >
                    <option value="">Выберите пользователя</option>
                    {/* Используем 'users' для выбора пользователя для добавления */}
                    {Array.isArray(users) && users.map((user) => (
                        <option key={user._id} value={user.telegramId}>
                            {user.username || `ID: ${user.telegramId}`}
                        </option>
                    ))}
                </select>
                <button onClick={handleAddUserToRating}>Добавить в рейтинг</button>
            </div>

            {/* --- НОВАЯ СЕКЦИЯ: Удалить пользователя из рейтинга --- */}
            <div className="admin-section">
                <h2>Удалить пользователя из рейтинга</h2>
                <select
                    value={selectedUserToDelete}
                    onChange={(e) => setSelectedUserToDelete(e.target.value)}
                >
                    <option value="">Выберите пользователя</option>
                    {/* ОБНОВЛЕНО: Отображаем только тех, кто в рейтинге, но с username из 'users' */}
                    {Array.isArray(ratings) && Array.isArray(users) && ratings.map((ratingEntry) => {
                        // Ищем пользователя из общего списка 'users' по telegramId из текущей записи рейтинга
                        const userInAllUsers = users.find(u => u.telegramId === ratingEntry.telegramId);
                        return (
                            <option key={ratingEntry._id} value={ratingEntry.telegramId}>
                                {/* Если нашли username, используем его, иначе просто ID */}
                                {userInAllUsers ? userInAllUsers.username : `ID: ${ratingEntry.telegramId}`}
                            </option>
                        );
                    })}
                </select>
                <button onClick={handleDeleteRating}>Удалить из рейтинга</button>
            </div>

            {/* Секция "Текущий рейтинг" (существующая) */}
            <div className="admin-section">
                <h2>Текущий рейтинг</h2>
                {/* Убедитесь, что компонент RatingList получает актуальный список рейтинга */}
                {Array.isArray(ratings) && <RatingList ratings={ratings} />}
            </div>
        </div>
    );
}

export default AdminRatingPage;