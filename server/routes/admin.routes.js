// server/routes/admin.js (ПОДТВЕРЖДЕНИЕ ИЗМЕНЕНИЙ)
const express = require('express');
const router = express.Router();
const Rating = require('../models/rating.model');
// ...

router.post('/update-rating', async (req, res) => {
  // ИЗМЕНЕНИЕ: Теперь мы ожидаем telegramId
  const { telegramId, score } = req.body;

  if (!telegramId || score === undefined || score === null) {
    return res.status(400).json({ message: 'Telegram ID and score are required' }); // <-- Теперь это сообщение соответствует реальности
  }

  try {
    let rating = await Rating.findOne({ telegramId: telegramId });

    if (rating) {
      rating.score = score;
    } else {
      rating = new Rating({
        telegramId: telegramId,
        score: score,
      });
    }

    await rating.save();
    res.json({ message: 'Rating updated successfully', rating });

  } catch (error) {
    console.error("Error updating rating:", error);
    if (error.code === 11000 && error.message.includes('telegramId_1')) {
      return res.status(400).json({ message: 'Этот пользователь уже есть в рейтинге.' });
    }
    res.status(500).json({ message: 'Server error updating rating' });
  }
});

// ...
module.exports = router;
