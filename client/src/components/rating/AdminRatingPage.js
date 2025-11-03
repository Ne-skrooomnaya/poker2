// client/src/components/rating/AdminRatingPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { loginUser } from '../../hooks/useTelegram'; // Убедитесь, что этот файл существует!

const AdminRatingPage = () => {
    const { user, token } = loginUser();
    const [ratings, setRatings] = useState([]);
    const [usersForSelect, setUsersForSelect] = useState([]); // Список всех пользователей для выбора
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Состояния для редактирования
    const [editMode, setEditMode] = useState(null); // _id записи рейтинга
    const [editFormData, setEditFormData] = useState({});

    // Состояния для добавления игрока в рейтинг
    const [selectedUserForAdd, setSelectedUserForAdd] = useState(''); // Выбранный пользователь (объект user) для добавления
    const [newPlayerWins, setNewPlayerWins] = useState(0);
    const [newPlayerLosses, setNewPlayerLosses] = useState(0);
    const [newPlayerScore, setNewPlayerScore] = useState(0);
    const [addPlayerError, setAddPlayerError] = useState('');
    const [addPlayerSuccess, setAddPlayerSuccess] = useState('');

    // Состояния для удаления игрока из рейтинга
    const [selectedPlayerForDelete, setSelectedPlayerForDelete] = useState(''); // Имя игрока из рейтинга для удаления
    const [deleteError, setDeleteError] = useState('');
    const [deleteSuccess, setDeleteSuccess] = useState('');

    // !!! ВАЖНО: Убедитесь, что API_URL настроен правильно для продакшена !!!
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const fetchRatings = async () => {
        setLoading(true);
        setError(null);
        try {
            // GET /api/rating (из rating.controller.js)
            const response = await axios.get(`${API_URL}/rating`, config); // Добавлен config, если рейтинг только для админа
            setRatings(response.data);
        } catch (err) {
            console.error('Ошибка при загрузке рейтинга:', err);
            setError('Не удалось загрузить рейтинг.');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            // GET /api/admin/users (из admin.controller.js)
            const response = await axios.get(`${API_URL}/admin/users`, config);
            setUsersForSelect(response.data);
        } catch (err) {
            console.error('Ошибка при загрузке пользователей:', err);
            // Не выводим глобальную ошибку, чтобы админка работала, если список пользователей недоступен
        }
    };

    useEffect(() => {
        if (user && user.isAdmin) {
            fetchRatings();
            fetchUsers(); // Загружаем пользователей при загрузке страницы
        }
    }, [user, token]); // Зависимости useEffect

    const handleEditClick = (ratingEntry) => {
        setEditMode(ratingEntry._id);
        setEditFormData({
            playerName: ratingEntry.playerName,
            wins: ratingEntry.wins,
            losses: ratingEntry.losses,
            score: ratingEntry.score
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveEdit = async (id) => {
        try {
            // PUT /api/admin/rating/:id
            await axios.put(`${API_URL}/admin/rating/${id}`, editFormData, config);
            setEditMode(null);
            fetchRatings(); // Перезагружаем рейтинг
        } catch (err) {
            console.error('Ошибка при обновлении записи рейтинга:', err);
            setError('Не удалось обновить запись.');
        }
    };

    // Удаление записи из РЕЙТИНГА (по ID записи рейтинга)
    const handleDeleteRatingEntry = async (ratingId, playerName) => {
        if (window.confirm(`Вы уверены, что хотите удалить игрока "${playerName}" из рейтинга?`)) {
            try {
                // DELETE /api/admin/rating/:id
                await axios.delete(`${API_URL}/admin/rating/${ratingId}`, config);
                fetchRatings(); // Перезагружаем рейтинг
            } catch (err) {
                console.error('Ошибка при удалении записи рейтинга:', err);
                setError('Не удалось удалить запись.');
            }
        }
    };

    // ----- ЛОГИКА ДОБАВЛЕНИЯ ИГРОКА В РЕЙТИНГ -----
    const handleAddPlayerToRating = async (e) => {
        e.preventDefault();
        setAddPlayerError('');
        setAddPlayerSuccess('');

        if (!selectedUserForAdd) {
            setAddPlayerError('Выберите пользователя из списка.');
            return;
        }
        if (isNaN(newPlayerWins) || isNaN(newPlayerLosses) || isNaN(newPlayerScore)) {
            setAddPlayerError('Победы, поражения и очки должны быть числами.');
            return;
        }

        // Проверяем, есть ли уже такой игрок в текущем отображаемом рейтинге
        const playerExistsInCurrentRating = ratings.some(r => r.playerName.toLowerCase() === selectedUserForAdd.username.toLowerCase());
        if (playerExistsInCurrentRating) {
            setAddPlayerError(`Игрок "${selectedUserForAdd.username}" уже есть в рейтинге.`);
            return;
        }

        try {
            // POST /api/admin/rating/add
            const response = await axios.post(`${API_URL}/admin/rating/add`, {
                playerName: selectedUserForAdd.username, // Отправляем имя пользователя
                wins: newPlayerWins,
                losses: newPlayerLosses,
                score: newPlayerScore
            }, config);

            setAddPlayerSuccess(response.data.message);
            setSelectedUserForAdd(''); // Сбрасываем выбор
            setNewPlayerWins(0);
            setNewPlayerLosses(0);
            setNewPlayerScore(0);
            fetchRatings(); // Перезагружаем список рейтинга
        } catch (err) {
            console.error('Ошибка при добавлении игрока в рейтинг:', err);
            if (err.response && err.response.data && err.response.data.message) {
                setAddPlayerError(err.response.data.message);
            } else {
                setAddPlayerError('Не удалось добавить игрока. Проверьте консоль или логи сервера.');
            }
        }
    };

    // ----- ЛОГИКА УДАЛЕНИЯ ИГРОКА ИЗ РЕЙТИНГА -----
    const handleDeletePlayerFromRating = async () => {
        setDeleteError('');
        setDeleteSuccess('');

        if (!selectedPlayerForDelete) {
            setDeleteError('Выберите игрока для удаления из рейтинга.');
            return;
        }

        // Находим ID записи рейтинга по имени игрока
        const playerEntryToDelete = ratings.find(r => r.playerName.toLowerCase() === selectedPlayerForDelete.toLowerCase());

        if (!playerEntryToDelete) {
            setDeleteError(`Игрок "${selectedPlayerForDelete}" не найден в текущем рейтинге.`);
            return;
        }

        // Вызываем функцию удаления записи рейтинга, передавая ее _id
        handleDeleteRatingEntry(playerEntryToDelete._id, playerEntryToDelete.playerName);

        // Сбрасываем выбор после вызова, чтобы избежать повторных удалений
        setSelectedPlayerForDelete('');
    };


    if (!user || !user.isAdmin) {
        return <p>У вас нет прав доступа к этой странице.</p>;
    }

    if (loading) {
        return <p>Загрузка...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="admin-rating-page" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Панель Администратора</h1>
            <h2>Управление Рейтингом</h2>

            {/* --------- Секция добавления игрока в рейтинг --------- */}
            <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '30px', backgroundColor: '#f9f9f9' }}>
                <h3>Добавить нового игрока в рейтинг</h3>
                <form onSubmit={handleAddPlayerToRating} style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                    {/* Выпадающий список пользователей */}
                    <select
                        value={selectedUserForAdd ? selectedUserForAdd.username : ''} // Отображаем имя выбранного пользователя
                        onChange={(e) => {
                            const selectedUsername = e.target.value;
                            const user = usersForSelect.find(u => u.username === selectedUsername);
                            setSelectedUserForAdd(user || null); // Устанавливаем весь объект user или null

                            // При выборе пользователя, попробуем найти его данные в рейтинге
                            if (user) {
                                const existingRating = ratings.find(r => r.playerName.toLowerCase() === user.username.toLowerCase());
                                if (existingRating) {
                                    setNewPlayerWins(existingRating.wins);
                                    setNewPlayerLosses(existingRating.losses);
                                    setNewPlayerScore(existingRating.score);
                                } else { // Если пользователя еще нет в рейтинге
                                    setNewPlayerWins(0);
                                    setNewPlayerLosses(0);
                                    setNewPlayerScore(0);
                                }
                            } else { // Если "Выберите пользователя"
                                setNewPlayerWins(0);
                                setNewPlayerLosses(0);
                                setNewPlayerScore(0);
                            }
                        }}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                        <option value="">-- Выберите пользователя --</option>
                        {usersForSelect.map((user) => (
                            // Указываем value как username, чтобы потом по нему найти объект user
                            <option key={user.telegramId} value={user.username}>
                                {user.username} ({user.telegramId})
                            </option>
                        ))}
                    </select>

                    {/* Поля для побед, поражений, очков */}
                    <input
                        type="number"
                        placeholder="Победы"
                        value={newPlayerWins}
                        onChange={(e) => setNewPlayerWins(parseInt(e.target.value) || 0)}
                        min="0"
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', width: '100px' }}
                    />
                    <input
                        type="number"
                        placeholder="Поражения"
                        value={newPlayerLosses}
                        onChange={(e) => setNewPlayerLosses(parseInt(e.target.value) || 0)}
                        min="0"
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', width: '100px' }}
                    />
                    <input
                        type="number"
                        placeholder="Очки"
                        value={newPlayerScore}
                        onChange={(e) => setNewPlayerScore(parseInt(e.target.value) || 0)}
                        min="0"
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', width: '100px' }}
                    />

                    <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Добавить в Рейтинг
                    </button>
                </form>
                {addPlayerError && <p style={{ color: 'red', marginTop: '10px' }}>{addPlayerError}</p>}
                {addPlayerSuccess && <p style={{ color: 'green', marginTop: '10px' }}>{addPlayerSuccess}</p>}
            </div>

            {/* --------- Секция удаления игрока из рейтинга --------- */}
            <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '30px', backgroundColor: '#f9f9f9' }}>
                <h3>Удалить игрока из рейтинга</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                    <select
                        value={selectedPlayerForDelete}
                        onChange={(e) => setSelectedPlayerForDelete(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                        <option value="">-- Выберите игрока для удаления --</option>
                        {ratings.map(rating => (
                            <option key={rating._id} value={rating.playerName}>{rating.playerName}</option>
                        ))}
                    </select>
                    <button onClick={handleDeletePlayerFromRating} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Удалить игрока
                    </button>
                </div>
                {deleteError && <p style={{ color: 'red', marginTop: '10px' }}>{deleteError}</p>}
                {deleteSuccess && <p style={{ color: 'green', marginTop: '10px' }}>{deleteSuccess}</p>}
            </div>


            {/* --------- Текущий Рейтинг Пользователей --------- */}
            {ratings.length > 0 ? (
                <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
                    <h3>Текущий Рейтинг Пользователей</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>#</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Имя игрока</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Победы</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Поражения</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Очки</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ratings.map((ratingEntry, index) => (
                                <tr key={ratingEntry._id}>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{index + 1}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        {editMode === ratingEntry._id ? (
                                            <input
                                                type="text"
                                                name="playerName"
                                                value={editFormData.playerName}
                                                onChange={handleEditFormChange}
                                                style={{ width: '100%', padding: '5px' }}
                                            />
                                        ) : (
                                            ratingEntry.playerName
                                        )}
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        {editMode === ratingEntry._id ? (
                                            <input
                                                type="number"
                                                name="wins"
                                                value={editFormData.wins}
                                                onChange={handleEditFormChange}
                                                min="0"
                                                style={{ width: '60px', padding: '5px' }}
                                            />
                                        ) : (
                                            ratingEntry.wins
                                        )}
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        {editMode === ratingEntry._id ? (
                                            <input
                                                type="number"
                                                name="losses"
                                                value={editFormData.losses}
                                                onChange={handleEditFormChange}
                                                min="0"
                                                style={{ width: '60px', padding: '5px' }}
                                            />
                                        ) : (
                                            ratingEntry.losses
                                        )}
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        {editMode === ratingEntry._id ? (
                                            <input
                                                type="number"
                                                name="score"
                                                value={editFormData.score}
                                                onChange={handleEditFormChange}
                                                min="0"
                                                style={{ width: '60px', padding: '5px' }}
                                            />
                                        ) : (
                                            ratingEntry.score
                                        )}
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        {editMode === ratingEntry._id ? (
                                            <>
                                                <button onClick={() => handleSaveEdit(ratingEntry._id)} style={{ marginRight: '5px', padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Сохранить</button>
                                                <button onClick={() => setEditMode(null)} style={{ padding: '5px 10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Отмена</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEditClick(ratingEntry)} style={{ marginRight: '5px', padding: '5px 10px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Редактировать</button>
                                                <button onClick={() => handleDeleteRatingEntry(ratingEntry._id, ratingEntry.playerName)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Удалить</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>В рейтинге пока нет игроков.</p>
            )}
        </div>
    );
};

export default AdminRatingPage;
