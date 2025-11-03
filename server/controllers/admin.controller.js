// server/controllers/admin.controller.js

const User = require('../models/user.model');
const Rating = require('../models/rating.model');
// const bcrypt = require('bcryptjs'); // Не используется здесь, если не нужен для других функций

// --- УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ ---
exports.getAllUsers = async (req, res) => {
    try {
        // Запрашиваем только нужные поля для выпадающего списка
        const users = await User.find({}, '_id telegramId username');
        res.status(200).json(users);
    } catch (error) {
        console.error('Ошибка при получении всех пользователей:', error);
        res.status(500).json({ message: 'Ошибка сервера при получении пользователей.' });
    }
};

// ... (остальные функции для управления пользователями, если они есть) ...

// --- УПРАВЛЕНИЕ РЕЙТИНГОМ ---

// Эта функция, кажется, не используется в admin.routes.js
// Если она нужна для чего-то другого, оставьте.
// exports.updateRating = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { wins, losses, score } = req.body;

//         const updatedRating = await Rating.findByIdAndUpdate(
//             id,
//             { wins, losses, score },
//             { new: true, runValidators: true }
//         );

//         if (!updatedRating) {
//             return res.status(404).json({ message: 'Запись рейтинга не найдена.' });
//         }

//         res.status(200).json({ message: 'Запись рейтинга успешно обновлена.', rating: updatedRating });
//     } catch (error) {
//         console.error('Ошибка при обновлении записи рейтинга:', error);
//         res.status(500).json({ message: 'Ошибка сервера при обновлении записи рейтинга.' });
//     }
// };

// Ваша функция updateRatingEntry, которая используется в admin.routes.js
exports.updateRatingEntry = async (req, res) => {
    try {
        const { id } = req.params; // ID записи рейтинга
        const { playerName, wins, losses, score } = req.body;

        const updatedRating = await Rating.findByIdAndUpdate(
            id,
            { playerName, wins, losses, score }, // Обновляем все поля
            { new: true, runValidators: true }
        );

        if (!updatedRating) {
            return res.status(404).json({ message: 'Запись рейтинга не найдена.' });
        }

        res.status(200).json({ message: 'Запись рейтинга успешно обновлена.', rating: updatedRating });
    } catch (error) {
        console.error('Ошибка при обновлении записи рейтинга:', error);
        res.status(500).json({ message: 'Ошибка сервера при обновлении записи рейтинга.' });
    }
};

// Ваша функция deleteRatingEntry, которая используется в admin.routes.js
exports.deleteRatingEntry = async (req, res) => {
    try {
        const { id } = req.params; // ID записи рейтинга
        const deletedRating = await Rating.findByIdAndDelete(id);

        if (!deletedRating) {
            return res.status(404).json({ message: 'Запись рейтинга не найдена.' });
        }

        res.status(200).json({ message: 'Запись рейтинга успешно удалена.' });
    } catch (error) {
        console.error('Ошибка при удалении записи рейтинга:', error);
        res.status(500).json({ message: 'Ошибка сервера при удалении записи рейтинга.' });
    }
};

// НОВАЯ ФУНКЦИЯ: Добавление игрока в рейтинг
// Эта функция должна получать playerName
exports.addPlayerToRating = async (req, res) => {
    try {
        const { playerName } = req.body; // Ожидаем имя игрока

        if (!playerName || playerName.trim() === '') {
            return res.status(400).json({ message: 'Имя игрока не может быть пустым.' });
        }

        const existingPlayer = await Rating.findOne({ playerName: { $regex: new RegExp(`^${playerName.trim()}$`, 'i') } });
        if (existingPlayer) {
            return res.status(409).json({ message: `Игрок с именем "${playerName.trim()}" уже существует в рейтинге.` });
        }

        // Создаем новую запись рейтинга
        const newPlayerRating = new Rating({
            playerName: playerName.trim(),
            wins: 0,
            losses: 0,
            score: 0
        });

        await newPlayerRating.save();

        res.status(201).json({ message: 'Игрок успешно добавлен в рейтинг.', player: newPlayerRating });

    } catch (error) {
        console.error('Ошибка при добавлении игрока в рейтинг:', error);
        res.status(500).json({ message: 'Ошибка сервера при добавлении игрока в рейтинг.' });
    }
};


// ===============================================
// !!! ВАЖНО: ЭКСПОРТ ВСЕХ ФУНКЦИЙ !!!
// ===============================================
// Убедитесь, что здесь перечислены ВСЕ функции, которые
// используются в ваших роутах (admin.routes.js)
module.exports = {
    getAllUsers: exports.getAllUsers,
    // updateRating: exports.updateRating, // Если эта функция используется где-то еще
    updateRatingEntry: exports.updateRatingEntry,
    deleteRatingEntry: exports.deleteRatingEntry,
    addPlayerToRating: exports.addPlayerToRating
};
