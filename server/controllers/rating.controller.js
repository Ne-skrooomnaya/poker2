// server/controllers/rating.controller.js

const Rating = require('../models/rating.model');

// Функция для получения всех записей рейтинга
exports.getAllRatings = async (req, res) => {
    try {
        // Получаем все записи, сортируем по убыванию очков (или как вам нужно)
        const ratings = await Rating.find({}).sort({ score: -1 }); // Пример сортировки
        res.status(200).json(ratings);
    } catch (error) {
        console.error('Ошибка при получении всех записей рейтинга:', error);
        res.status(500).json({ message: 'Ошибка сервера при получении рейтинга.' });
    }
};

// ===============================================
// !!! ВАЖНО: ЭКСПОРТ ФУНКЦИЙ !!!
// ===============================================
module.exports = {
    getAllRatings: exports.getAllRatings
};
