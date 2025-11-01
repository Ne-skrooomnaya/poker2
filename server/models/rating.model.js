// server/models/rating.model.js
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  // Замени userId на telegramId, который теперь будет уникальным
  telegramId: {
    type: String, // Telegram ID - это строка
    required: true,
    unique: true, // Гарантирует, что у каждого пользователя будет только одна запись в рейтинге
  },
  score: {
    type: Number,
    default: 0,
  },
  // Другие поля, если есть
}, {
  timestamps: true,
});

// Если ранее был создан индекс telegramId_1 вручную, то Mongoose может его игнорировать.
// Проверь индексы в MongoDB Atlas. Если там есть telegramId_1, и ты хочешь его использовать,
// то эта схема будет работать.

module.exports = mongoose.model('Rating', ratingSchema);
