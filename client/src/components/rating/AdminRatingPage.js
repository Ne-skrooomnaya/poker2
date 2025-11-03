// client/src/pages/AdminRatingPage;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Убедитесь, что toastify установлен и настроен
import RatingList from './RatingList'; // Убедитесь, что импорт RatingList есть

function AdminRatingPage() {
    const navigate = useNavigate();
    const [allUsers, setAllUsers] = useState([]); // Все пользователи для добавления
    const [selectedUserToAdd, setSelectedUserToAdd] = useState(''); // Для добавления
    const [selectedUserToDelete, setSelectedUserToDelete] = useState(''); // <--- НОВОЕ: Для удаления
    const [ratings, setRatings] = useState([]); // <--- Убедитесь, что этот стейт используется для текущего рейтинга

    // --- ОБНОВЛЕННЫЙ useEffect для загрузки данных ---
    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // Загрузка всех пользователей (для выбора как в добавлении, так и в удалении)
                const usersRes = await axios.get('/api/users', config);
                setAllUsers(usersRes.data);

                // Загрузка текущего рейтинга
                // Используем /api/ratings, который должен возвращать весь рейтинг (для админа)
                const ratingsRes = await axios.get('/api/ratings', config);
                setRatings(ratingsRes.data);

            } catch (error) {
                console.error('Error fetching admin data:', error);
                if (error.response && error.response.status === 403) {
                    toast.error('Недостаточно прав для доступа к админ-панели.');
                    navigate('/'); // Перенаправляем, если нет прав
                } else {
                    toast.error('Ошибка при загрузке данных администратора.');
                }
            }
        };
        fetchAdminData();
    }, [navigate]); // navigate в зависимостях, так как он используется внутри useEffect

    // --- СУЩЕСТВУЮЩАЯ функция для добавления пользователя (без изменений) ---
    const handleUpdateRating = async () => {
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

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Отправляем DELETE запрос на новый эндпоинт
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

            {/* Секция "Добавить пользователя в рейтинг" (существующая) */}
            <div className="admin-section">
                <h2>Добавить пользователя в рейтинг</h2>
                <select
                    value={selectedUserToAdd}
                    onChange={(e) => setSelectedUserToAdd(e.target.value)}
                >
                    <option value="">Выберите пользователя</option>
                    {allUsers.map((user) => (
                        <option key={user._id} value={user.telegramId}>
                            {user.username || `ID: ${user.telegramId}`} {/* Отображаем username или ID */}
                        </option>
                    ))}
                </select>
                <button onClick={handleUpdateRating}>Добавить в рейтинг</button>
            </div>

            {/* --- НОВАЯ СЕКЦИЯ: Удалить пользователя из рейтинга --- */}
            <div className="admin-section">
                <h2>Удалить пользователя из рейтинга</h2>
                <select
                    value={selectedUserToDelete}
                    onChange={(e) => setSelectedUserToDelete(e.target.value)}
                >
                    <option value="">Выберите пользователя</option>
                    {/* Отображаем только тех пользователей, которые УЖЕ есть в рейтинге */}
                    {ratings.map((ratingEntry) => {
                        // Поиск username пользователя по telegramId из списка allUsers
                        const userInRating = allUsers.find(u => u.telegramId === ratingEntry.telegramId);
                        return (
                            <option key={ratingEntry._id} value={ratingEntry.telegramId}>
                                {userInRating ? userInRating.username : `ID: ${ratingEntry.telegramId}`}
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
                <RatingList ratings={ratings} />
            </div>
        </div>
    );
}

export default AdminRatingPage;