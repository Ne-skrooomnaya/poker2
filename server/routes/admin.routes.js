// server/routes/admin.js
const express = require('express');
const router = express.Router();
const User = require('../models/user.model'); // Нужен для поиска telegramId по userId (ObjectId)
const Rating = require('../models/rating.model');
const mongoose = require('mongoose'); // Для валидации ObjectId
const { authenticateUser, authorizeAdmin  } = require('../middleware/authMiddleware')
const  { addUserToRating, deleteUserFromRating }  = require('../controllers/admin.controller')
const  { getAllRatings, getAllUsers }  = require('../controllers/rating.controller')

const { verifyToken } = require('../utils/auth');

router.post('/update-rating', async (req, res) => {
  // Фронтенд отправляет userId (который является ObjectId из User) и score
  const { userId, score } = req.body;

  // Валидация входных данных: проверяем наличие и корректность userId как ObjectId
  if (!userId || !mongoose.Types.ObjectId.isValid(userId) || score === undefined || score === null) {
    return res.status(400).json({ message: 'Требуется действительный ID пользователя и балл.' });
  }

  try {
    // 1. Находим пользователя в коллекции User по переданному ObjectId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден по указанному ObjectId.' });
    }

    // 2. Из найденного пользователя получаем его telegramId
    const telegramIdToUse = user.telegramId;
    if (!telegramIdToUse) {
      return res.status(400).json({ message: 'У пользователя нет связанного Telegram ID.' });
    }

    // 3. Используем findOneAndUpdate с upsert: true для создания/обновления записи рейтинга по telegramId
    const updatedRating = await Rating.findOneAndUpdate(
      { telegramId: telegramIdToUse, userId: userId }, // Критерий поиска: по telegramId
      { score: score },                 // Данные для обновления
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    res.json({ message: 'Рейтинг успешно обновлен', rating: updatedRating });

  } catch (error) {
    console.error("Error updating rating:", error);
    if (error.code === 11000 && error.message.includes('telegramId_1')) {
      return res.status(400).json({ message: 'Этот пользователь уже есть в рейтинге.' });
    }
    // Обработка ошибок приведения типов от Mongoose (если бы был ObjectId)
    if (error instanceof mongoose.Error.CastError) {
        return res.status(400).json({ message: 'Неверный формат идентификатора пользователя.' });
    }
    res.status(500).json({ message: 'Ошибка сервера при обновлении рейтинга.' });
  }
});
router.get('/users', verifyToken, authorizeAdmin, getAllRatings);
router.get('/dashboard', authenticateUser, authorizeAdmin, addUserToRating)
router.delete('/rating/delete/:telegramId', verifyToken, authorizeAdmin, deleteUserFromRating);
module.exports = router;