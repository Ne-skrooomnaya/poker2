// server/routes/admin.js (Вносим изменения в этот файл)
const express = require('express');
const router = express.Router();
// const User = require('../models/user.model'); // Возможно, этот импорт больше не нужен
const Rating = require('../models/rating.model');
// const { authenticateUser, authorizeAdmin } = require('../middleware/authMiddleware');
// const adminController = require('../controllers/admin.controller');

// POST /admin/update-rating - Обновить рейтинг пользователя
// router.post('/update-rating', async (req, res) => { // Защищаем роут
router.post('/update-rating', async (req, res) => { // Пока без защиты
  // ИЗМЕНЕНИЕ: Принимаем telegramId с фронтенда, а не userId
  const { telegramId, score } = req.body;

  // ИЗМЕНЕНИЕ: Проверяем telegramId
  if (!telegramId || score === undefined || score === null) {
    return res.status(400).json({ message: 'Telegram ID and score are required' });
  }

  // Дополнительная проверка, что текущий пользователь (из токена) является админом
  // if (req.user.role !== 'admin') {
  //   return res.status(403).json({ message: 'Forbidden: Only admins can update ratings' });
  // }

  try {
    // ИЗМЕНЕНИЕ: Теперь ищем запись в Rating напрямую по telegramId
    // Нам больше не нужно искать пользователя по userId, так как telegramId сам по себе уникален
    let rating = await Rating.findOne({ telegramId: telegramId });

    if (rating) {
      // Если запись существует, обновляем ее
      rating.score = score;
    } else {
      // Если записи нет, создаем новую
      rating = new Rating({
        telegramId: telegramId, // ИСПОЛЬЗУЕМ telegramId
        score: score,
      });
    }

    await rating.save();
    res.json({ message: 'Rating updated successfully', rating });

  } catch (error) {
    console.error("Error updating rating:", error);
    // Обработка ошибки дубликата ключа для telegramId
    if (error.code === 11000 && error.message.includes('telegramId_1')) {
      return res.status(400).json({ message: 'Этот пользователь уже есть в рейтинге.' });
    }
    res.status(500).json({ message: 'Server error updating rating' });
  }
});

// router.get('/dashboard', authenticateUser, authorizeAdmin, adminController.getDashboard)

module.exports = router;
