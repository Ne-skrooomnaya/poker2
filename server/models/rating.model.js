// server/models/rating.model.js
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, 
  telegramId: {
    type: String,
    required: true,
    unique: true,
  },
  username: { // 👈 Новое поле
    type: String,
    required: true, // Обязательное для поиска
    trim: true,     // Убирает пробелы в начале и конце
  },
  score: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});
ratingSchema.index({ username: 1 });
module.exports = mongoose.model('Rating', ratingSchema);