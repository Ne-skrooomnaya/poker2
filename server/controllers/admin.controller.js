// server/controllers/admin.controller.js

const Rating = require('../models/rating.model');
const User = require('../models/user.model');

const addUserToRating = async (req, res) => {
  try {
    let { telegramId, score } = req.body;

    // --- Проверка и преобразование ---
    score = parseInt(score);
    if (isNaN(score)) {
      return res.status(400).json({ message: "Score должен быть числом" });
    }

    telegramId = String(telegramId).trim();
    if (!telegramId) {
      return res.status(400).json({ message: "Telegram ID не может быть пустым." });
    }

    // --- Найти пользователя ---
    const user = await User.findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ message: `Пользователь с Telegram ID "${telegramId}" не найден.` });
    }

    // --- Найти или создать запись в рейтинге ---
    const existingRating = await Rating.findOne({ telegramId });

    if (existingRating) {
      // Обновляем и score, и username (на случай смены username)
      existingRating.score = score;
      existingRating.username = user.username; // 👈 Ключевое обновление
      await existingRating.save();
      console.log(`Рейтинг пользователя ${telegramId} обновлён на ${score}, username: ${user.username}`);
      return res.status(200).json(existingRating);
    } else {
      // Создаём новую запись с username
      const newRating = new Rating({
        telegramId,
        userId: user.userId || telegramId, // если userId есть в User — используем, иначе telegramId
        username: user.username,           // 👈 Обязательно!
        score,
      });
      await newRating.save();
      console.log(`Пользователь ${telegramId} добавлен в рейтинг со score ${score}`);
      return res.status(201).json(newRating);
    }
  } catch (error) {
    console.error("Ошибка при добавлении/обновлении рейтинга:", error);
    res.status(500).json({ message: "Ошибка сервера при обработке рейтинга" });
  }
};

module.exports = { addUserToRating };