    // server/routes/admin.js
    const express = require('express');
    const router = express.Router();
    // const User = require('../models/user.model'); // Возможно, не понадобится, если работаем только с telegramId
    const Rating = require('../models/rating.model');
    // const { authenticateUser, authorizeAdmin } = require('../middleware/authMiddleware');
    // const adminController = require('../controllers/admin.controller'); // Если он не используется здесь

    // POST /admin/update-rating - Обновить рейтинг пользователя
    router.post('/update-rating', async (req, res) => {
      // Предполагаем, что с фронтенда приходит telegramId
      const { telegramId, score } = req.body; // ИЗМЕНЕНИЕ: userId -> telegramId

      if (!telegramId || score === undefined || score === null) { // ИЗМЕНЕНИЕ: userId -> telegramId
        return res.status(400).json({ message: 'Telegram ID and score are required' });
      }

      try {
        // ИЗМЕНЕНИЕ: Убираем проверку User.findById(userId)
        // Мы напрямую работаем с telegramId в таблице Rating

        // Обновляем или создаем запись в рейтинге по telegramId
        let rating = await Rating.findOne({ telegramId: telegramId }); // ИЗМЕНЕНИЕ: userId -> telegramId

        if (rating) {
          // Если запись существует, обновляем ее
          rating.score = score;
        } else {
          // Если записи нет, создаем новую
          rating = new Rating({
            telegramId: telegramId, // ИЗМЕНЕНИЕ: userId -> telegramId
            score: score,
          });
        }

        await rating.save();
        res.json({ message: 'Rating updated successfully', rating });

      } catch (error) {
        console.error("Error updating rating:", error);
        // Обработка ошибки дубликата ключа
        if (error.code === 11000 && error.message.includes('telegramId_1')) { // Проверяем на ошибку telegramId
          return res.status(400).json({ message: 'Этот пользователь уже есть в рейтинге.' });
        }
        res.status(500).json({ message: 'Server error updating rating' });
      }
    });

    // router.get('/dashboard', authenticateUser, authorizeAdmin, adminController.getDashboard)

    module.exports = router;
