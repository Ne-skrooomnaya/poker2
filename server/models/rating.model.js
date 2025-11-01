// server/models/rating.model.js
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  // УДАЛЯЕМ userId, так как его нет в базе и он не используется.
  // Вместо этого используем telegramId как основной уникальный идентификатор.
  telegramId: {
    type: String, // Telegram ID - это строка, как видно из базы
    required: true,
    unique: true, // Это соответствует индексу telegramId_1 в MongoDB
  },
  score: {
    type: Number,
    default: 0,
  },
  // Можно добавить ссылку на User._id, если это нужно для связей,
  // но для уникальности будем использовать telegramId
  // Например:
  // userRef: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true // Если каждый рейтинг должен быть привязан к существующему пользователю
  // }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Rating', ratingSchema);
