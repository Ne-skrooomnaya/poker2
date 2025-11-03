const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    score: { type: Number, default: 0 },
    username: { type: String, required: true },
    firstName: { type: String },
    telegramId: { type: String, required: true, unique: true },
}, { timestamps: true });

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;


module.exports = mongoose.model('Rating', ratingSchema);
