// server/models/rating.model.js
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
        userId: { type: String, required: true, unique: true }, // <-- Добавить это поле
        telegramId: { type: String, required: true },
        score: { type: Number, required: true },
        username: { type: String }
    }, { timestamps: true });

module.exports = mongoose.model('Rating', ratingSchema);