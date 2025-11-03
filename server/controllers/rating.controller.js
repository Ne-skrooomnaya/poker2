const Rating = require('../models/Rating'); // Предполагается путь к модели
const Game = require('../models/Game'); // Предполагается путь к модели игры

// Пример валидации (можно использовать библиотеку типа express-validator)
const validateSubmitRating = (userId, gameId, score) => {
    if (!userId) return { success: false, message: 'Необходимо аутентифицироваться для выставления рейтинга.' };
    if (!gameId) return { success: false, message: 'ID игры обязателен.' };
    if (score === undefined || score === null) return { success: false, message: 'Оценка обязательна.' };
    if (typeof score !== 'number' || score < 1 || score > 5) return { success: false, message: 'Оценка должна быть числом от 1 до 5.' };
    return { success: true };
};

exports.submitRating = async (req, res) => {
    try {
        const { gameId, score } = req.body;
        const userId = req.user?.id; // Безопасное получение userId

        const validation = validateSubmitRating(userId, gameId, score);
        if (!validation.success) {
            return res.status(400).json({ message: validation.message });
        }

        // Проверка существования игры (опционально, но рекомендуется)
        const gameExists = await Game.findById(gameId);
        if (!gameExists) {
            return res.status(404).json({ message: 'Игра не найдена.' });
        }

        // Проверка на дублирование рейтинга
        const existingRating = await Rating.findOne({ userId: userId, gameId: gameId });
        if (existingRating) {
            // Можно либо вернуть ошибку, либо обновить существующий рейтинг
            // return res.status(409).json({ message: 'Вы уже оценили эту игру.' });
            existingRating.score = score;
            await existingRating.save();
            return res.status(200).json({ message: 'Рейтинг обновлен.', rating: existingRating });
        }

        const newRating = new Rating({
            userId: userId,
            gameId: gameId,
            score: score
        });

        await newRating.save();
        res.status(201).json({ message: 'Рейтинг успешно добавлен.', rating: newRating });

    } catch (error) {
        console.error("Ошибка при добавлении рейтинга:", error);
        res.status(500).json({ message: 'Ошибка при добавлении рейтинга.', error: error.message });
    }
};

exports.getGameRatings = async (req, res) => {
    try {
        const { gameId } = req.params;

        if (!gameId) {
            return res.status(400).json({ message: 'ID игры обязателен.' });
        }

        // Проверка существования игры (опционально, но рекомендуется)
        const gameExists = await Game.findById(gameId);
        if (!gameExists) {
            return res.status(404).json({ message: 'Игра не найдена.' });
        }

        const ratings = await Rating.find({ gameId: gameId }).populate('userId', 'username'); // Пример: подгружаем имя пользователя

        if (!ratings || ratings.length === 0) {
            return res.status(404).json({ message: 'Рейтинги для этой игры не найдены.' });
        }

        res.json(ratings);

    } catch (error) {
        console.error("Ошибка при получении рейтингов игры:", error);
        res.status(500).json({ message: 'Ошибка при получении рейтингов игры.', error: error.message });
    }
};
