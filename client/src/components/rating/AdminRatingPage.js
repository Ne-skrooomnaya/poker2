// client/src/components/rating/AdminRatingPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useTelegram from '../../../../client/src/hooks/useTelegram';
// import RatingList from './RatingList'; // Если RatingList используется для отображения, убедитесь, что он импортирован

const AdminRatingPage = () => {
    const { user, token } = useTelegram();
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(null); // { _id: '...', playerName: '...', wins: 0, losses: 0, score: 0 }
    const [editFormData, setEditFormData] = useState({});

    // НОВЫЕ СОСТОЯНИЯ для добавления игрока
    const [newPlayerName, setNewPlayerName] = useState('');
    const [addPlayerError, setAddPlayerError] = useState('');
    const [addPlayerSuccess, setAddPlayerSuccess] = useState('');


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
            const response = await axios.get(`${API_URL}/rating`, config);
            setRatings(response.data);
        } catch (err) {
            console.error('Ошибка при загрузке рейтинга:', err);
            setError('Не удалось загрузить рейтинг.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.isAdmin) {
            fetchRatings();
        }
    }, [user, token]); // Зависимости для useEffect

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
            await axios.put(`${API_URL}/admin/rating/${id}`, editFormData, config);
            setEditMode(null);
            fetchRatings(); // Перезагружаем рейтинг для отображения обновленных данных
        } catch (err) {
            console.error('Ошибка при обновлении записи рейтинга:', err);
            setError('Не удалось обновить запись.');
        }
    };

    const handleDeleteRating = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить эту запись рейтинга?')) {
            try {
                await axios.delete(`${API_URL}/admin/rating/${id}`, config);
                fetchRatings(); // Перезагружаем рейтинг для отображения обновленных данных
            } catch (err) {
                console.error('Ошибка при удалении записи рейтинга:', err);
                setError('Не удалось удалить запись.');
            }
        }
    };

    // НОВАЯ ФУНКЦИЯ: Обработчик добавления нового игрока
    const handleAddPlayer = async (e) => {
        e.preventDefault(); // Предотвращаем стандартную отправку формы
        setAddPlayerError(''); // Очищаем предыдущие ошибки
        setAddPlayerSuccess(''); // Очищаем предыдущие сообщения об успехе

        if (!newPlayerName.trim()) {
            setAddPlayerError('Имя игрока не может быть пустым.');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/admin/rating/add`, { playerName: newPlayerName }, config);
            setAddPlayerSuccess(response.data.message);
            setNewPlayerName(''); // Очищаем поле ввода
            fetchRatings(); // Перезагружаем список рейтинга, чтобы включить нового игрока
        } catch (err) {
            console.error('Ошибка при добавлении игрока:', err);
            if (err.response && err.response.data && err.response.data.message) {
                setAddPlayerError(err.response.data.message);
            } else {
                setAddPlayerError('Не удалось добавить игрока. Попробуйте снова.');
            }
        }
    };


    if (!user || !user.isAdmin) {
        return <p>У вас нет прав доступа к этой странице.</p>;
    }

    if (loading) {
        return <p>Загрузка рейтинга...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="admin-rating-page">
            <h1>Администрирование Рейтинга</h1>

            {/* НОВАЯ СЕКЦИЯ: Добавление нового игрока */}
            <div className="add-player-section" style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                <h3>Добавить нового игрока в рейтинг</h3>
                <form onSubmit={handleAddPlayer}>
                    <input
                        type="text"
                        placeholder="Имя нового игрока"
                        value={newPlayerName}
                        onChange={(e) => setNewPlayerName(e.target.value)}
                        style={{ padding: '8px', marginRight: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '200px' }}
                    />
                    <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Добавить игрока
                    </button>
                </form>
                {addPlayerError && <p style={{ color: 'red', marginTop: '10px' }}>{addPlayerError}</p>}
                {addPlayerSuccess && <p style={{ color: 'green', marginTop: '10px' }}>{addPlayerSuccess}</p>}
            </div>

            {/* Существующая таблица для отображения и редактирования рейтинга */}
            {ratings.length > 0 ? (
                <table className="rating-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Имя игрока</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Победы</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Поражения</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Очки</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ratings.map((ratingEntry) => (
                            <tr key={ratingEntry._id}>
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
                                            <button onClick={() => handleDeleteRating(ratingEntry._id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Удалить</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>В рейтинге пока нет игроков.</p>
            )}
        </div>
    );
};

export default AdminRatingPage;
