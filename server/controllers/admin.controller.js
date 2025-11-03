// server/controllers/admin.controller.js
const User = require('../models/user.model');
const Rating = require('../models/rating.model'); // Убедитесь, что модель Rating импортирована

// ... (существующие функции, например, getAllUsers, updateUserRole, deleteUser) ...

// Функция для обновления записи рейтинга (уже должна быть)
exports.updateRatingEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const { playerName, wins, losses, score } = req.body;

        const updatedRating = await Rating.findByIdAndUpdate(
            id,
            { playerName, wins, losses, score },
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

// Функция для удаления записи рейтинга (уже должна быть)
exports.deleteRatingEntry = async (req, res) => {
    try {
        const { id } = req.params;
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
exports.addPlayerToRating = async (req, res) => {
    try {
        const { playerName } = req.body;

        // Проверка на пустое имя
        if (!playerName || playerName.trim() === '') {
            return res.status(400).json({ message: 'Имя игрока не может быть пустым.' });
        }

        // Проверка, существует ли игрок с таким именем (регистронезависимая)
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

// Убедитесь, что все функции экспортируются.
// Если у вас используется module.exports = { ... }, то добавьте addPlayerToRating туда.
// Например:
// module.exports = {
//     getAllUsers,
//     updateUserRole,
//     deleteUser,
//     updateRatingEntry,
//     deleteRatingEntry,
//     addPlayerToRating // Добавлено
// };
