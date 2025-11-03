// client/src/components/rating/AdminRatingPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RatingList from './RatingList'; // Путь к RatingList

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AdminRatingPage() {
  const [refreshRatingList, setRefreshRatingList] = useState(0); // Для обновления списка рейтинга
  const [usersForDeletion, setUsersForDeletion] = useState([]); // Список пользователей для выпадающего списка
  const [selectedRatingId, setSelectedRatingId] = useState(''); // ID выбранной записи рейтинга для удаления

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(null);

  const [adminActionLoading, setAdminActionLoading] = useState(false);
  const [adminActionError, setAdminActionError] = useState(null);
  const [adminActionSuccess, setAdminActionSuccess] = useState(null);

  // --- Загрузка пользователей для выпадающего списка ---
  useEffect(() => {
    const fetchUsersForDeletion = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/rating`);
        setUsersForDeletion(response.data);
        console.log("Пользователи для удаления (rating documents):", response.data); // Дебаг
      } catch (err) {
        console.error("Ошибка при загрузке пользователей для удаления:", err);
      }
    };

    fetchUsersForDeletion();
  }, [refreshRatingList]); // Перезагружаем список для удаления, если рейтинг обновился

  // --- Обработчик изменения выбора в выпадающем списке ---
  const handleUserSelectChange = (e) => {
    setSelectedRatingId(e.target.value);
    setDeleteError(null);
    setDeleteSuccess(null);
  };

  // --- Обработчик удаления пользователя ---
  const handleDeleteUser = async () => {
    if (!selectedRatingId) {
      alert("Пожалуйста, выберите пользователя для удаления.");
      return;
    }

    if (!window.confirm(`Вы уверены, что хотите удалить запись рейтинга с ID: ${selectedRatingId}?`)) {
      return;
    }

    setDeleteLoading(true);
    setDeleteError(null);
    setDeleteSuccess(null);

    try {
      console.log("Отправка DELETE запроса для ratingId:", selectedRatingId); // Дебаг
      // Используем selectedRatingId, который является _id документа рейтинга
      await axios.delete(`${BACKEND_URL}/rating/${selectedRatingId}`);
      setDeleteSuccess("Пользователь успешно удален из рейтинга.");
      setSelectedRatingId(''); // Сбросить выбор
      setRefreshRatingList(prev => prev + 1); // Обновить рейтинг и список для выбора
    } catch (err) {
      console.error("Ошибка при удалении пользователя:", err);
      const errorMessage = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : "Не удалось удалить пользователя. Возможно, такой записи нет или произошла ошибка на сервере.";
      setDeleteError(errorMessage);
    } finally {
      setDeleteLoading(false);
    }
  };

  // --- НОВАЯ ФУНКЦИЯ: Обновить список (просто перезагружает RatingList) ---
  const handleRefreshList = () => {
    setDeleteSuccess(null); // Сброс сообщений при обновлении
    setDeleteError(null);
    setRefreshRatingList(prev => prev + 1); // Принудительно обновить RatingList
    console.log("Список рейтинга обновлен!");
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>Управление Рейтингом (Админка)</h1>

      {/* Секция для управления рейтингом */}
      <div style={{
        marginBottom: '30px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
      }}>
        <h2 style={{ color: '#555', marginBottom: '15px' }}>Инструменты Администратора</h2>

          {/* Кнопка "Обновить Список" */}
        <p style={{ marginBottom: '15px' }}>Нажмите, чтобы принудительно обновить отображаемый список рейтинга:</p>
        <button
          onClick={handleRefreshList} // Новая функция
          style={{
            padding: '10px 15px',
            backgroundColor: '#28a745', // Зеленый цвет для обновления
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            marginRight: '10px',
            marginBottom: '20px'
          }}
        >
          Обновить Список
        </button>

        <hr style={{ margin: '20px 0', borderColor: '#eee' }} />

        {/* Секция для ДОБАВЛЕНИЯ ИГРОКОВ (заглушка для будущей реализации) */}
        <h3 style={{ color: '#555', marginBottom: '15px' }}>Добавить нового игрока в рейтинг</h3>
        <p style={{ marginBottom: '15px', fontSize: '0.9em', color: '#777' }}>
            Здесь будет форма для добавления новых игроков в рейтинг (например, поля для Username, Score, Telegram ID).
        </p>
        <button
          disabled // Пока кнопка неактивна, так как функционал не реализован
          style={{
            padding: '10px 15px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'not-allowed',
            fontSize: '16px',
            marginBottom: '20px'
          }}
        >
          Добавить Игрока (в разработке)
        </button>
        <hr style={{ margin: '20px 0', borderColor: '#eee' }} />
        {/* Форма для удаления игрока */}
        <h3 style={{ color: '#555', marginBottom: '15px' }}>Удалить игрока из рейтинга</h3>
        <select
          value={selectedRatingId}
          onChange={handleUserSelectChange}
          disabled={deleteLoading || !usersForDeletion.length}
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            marginRight: '10px',
            width: '250px',
            marginBottom: '10px'
          }}
>
          <option value="">-- Выберите пользователя --</option>
          {usersForDeletion.length > 0 ? (
            usersForDeletion.map(item => ( // item - это документ рейтинга
              <option key={item._id} value={item._id}>
                {item.username || item.firstName || `ID: ${item._id}`}
              </option>
            ))
          ) : (
            <option value="" disabled>Нет пользователей в рейтинге</option>
          )}
        </select>
        <button
          onClick={handleDeleteUser}
          disabled={!selectedRatingId || deleteLoading}
          style={{
            padding: '10px 15px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            opacity: (!selectedRatingId || deleteLoading) ? 0.6 : 1
          }}
        >
          {deleteLoading ? 'Удаление...' : 'Удалить игрока'}
        </button>

        {/* Сообщения об операции удаления */}
        {deleteLoading && <p style={{ color: '#007bff', marginTop: '10px' }}>Удаление пользователя...</p>}
        {deleteError && <p style={{ color: 'red', marginTop: '10px', fontWeight: 'bold' }}>{deleteError}</p>}
        {deleteSuccess && <p style={{ color: 'green', marginTop: '10px', fontWeight: 'bold' }}>{deleteSuccess}</p>}

      </div>

      <hr style={{ margin: '30px 0', borderColor: '#eee' }} />

      {/* Отображаемый список рейтинга для админов */}
      <RatingList
        title="Текущий Рейтинг Пользователей"
        refreshKey={refreshRatingList}
      />
    </div>
  );
}

export default AdminRatingPage;