    // server/controllers/admin.controller.js (пример)

   // Добавление пользователя в рейтинг
exports.addUserToRating = async (req, res) => {
    try {
        const { telegramId, username, score } = req.body;

        // 1. Более строгая валидация входных данных
        if (!telegramId || !username || score === undefined || score === null) {
            return res.status(400).json({ error: 'Missing required fields: telegramId, username, score' });
        }

        // Преобразуем score в число и проверяем, что это действительно число
        const parsedScore = parseInt(score, 10);
        if (isNaN(parsedScore)) {
            return res.status(400).json({ error: 'Invalid score format. Score must be a number.' });
        }

        // Опционально: добавить проверку на отрицательный score, если это нежелательно
        // if (parsedScore < 0) {
        //     return res.status(400).json({ error: 'Score cannot be negative.' });
        // }

        // 2. Проверяем, существует ли пользователь с таким telegramId в коллекции users
        const existingUser = await User.findOne({ telegramId });
        if (!existingUser) {
            return res.status(404).json({ error: 'User with this telegramId not found in the users collection.' });
        }

        // 3. Проверяем, есть ли уже запись в рейтинге для этого пользователя
        const existingRating = await Rating.findOne({ telegramId });
        if (existingRating) {
            // Если пользователь уже есть в рейтинге, то это уже не "добавление", а "обновление".
            // Чтобы не ломать логику добавления, вернем ошибку.
            // Если админ захочет изменить, это будет отдельная функция "updateUserRating".
            return res.status(409).json({ error: 'User already exists in the rating. Use the update function for changes.' });
        }

        // 4. Создаем новую запись в рейтинге
        const newRating = new Rating({
            telegramId: telegramId,
            username: username,
            score: parsedScore, // Используем распарсенное число
            addedAt: new Date(),
            updatedAt: new Date(),
        });

        await newRating.save();
        res.status(201).json(newRating); // Успешное добавление

    } catch (error) {
        console.error('Error adding user to rating:', error);
        // Отправляем более информативную ошибку, если это возможно,
        // но для начала просто вернем общий 500 Internal Server Error.
        // Если проблема была в некорректных данных, мы уже вернули 400.
        // Если проблема в базе данных или другой логике, то 500.
        res.status(500).json({ error: 'Failed to add user to rating. Please try again later.', details: error.message });
    }
};
    module.exports = adminController;