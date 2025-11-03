    // server/controllers/admin.controller.js (пример)

   // Добавление пользователя в рейтинг
exports.addUserToRating = async (req, res) => {
    try {
        let { telegramId, score } = req.body; // Используем let, чтобы можно было изменить

        // --- ПРЕОБРАЗОВАНИЕ И ПРОВЕРКА ВХОДНЫХ ДАННЫХ ---

        // Убедимся, что score - это число
        score = parseInt(score);
        if (isNaN(score)) {
            return res.status(400).json({ message: "Score должен быть числом" });
        }

        // Убедимся, что telegramId - это строка, и очистим его от лишних пробелов
        telegramId = String(telegramId).trim();
        if (!telegramId) {
            return res.status(400).json({ message: "Telegram ID не может быть пустым" });
        }

        // --- КОНЕЦ ПРЕОБРАЗОВАНИЯ И ПРОВЕРКИ ---

        // Ищем пользователя по telegramId
        // Важно: Если в базе telegramId может быть, например, числом, а приходит строкой,
        // то нужно убедиться, что и поиск, и данные в базе сопоставимы.
        // Судя по скриншотам, telegramId в базе - строка, поэтому String(telegramId).trim() должен работать.
        const user = await User.findOne({ telegramId: telegramId });

        if (!user) {
            // Если пользователя нет, вернуть ошибку 404
            return res.status(404).json({ message: `Пользователь с Telegram ID "${telegramId}" не найден.` });
        }

        // Проверяем, есть ли уже запись в рейтинге для этого пользователя
        const existingRating = await Rating.findOne({ telegramId: telegramId }); // Ищем по такому же telegramId

        if (existingRating) {
            // Если есть, обновляем его score
            existingRating.score = score;
            await existingRating.save();
            console.log(`Рейтинг пользователя ${telegramId} обновлен на ${score}`);
            return res.status(200).json(existingRating);
        } else {
            // Если нет, создаем новую запись
            const newRating = new Rating({
                telegramId: telegramId, // Используем уже очищенный telegramId
                score: score,
                username: user.username // Берем username из найденного пользователя
            });
            await newRating.save();
            console.log(`Пользователь ${telegramId} добавлен в рейтинг со score ${score}`);
            return res.status(201).json(newRating);
        }
    } catch (error) {
        console.error("Ошибка при добавлении/обновлении рейтинга:", error);
        // Предоставляем более детальную информацию об ошибке, если это не связано с чувствительными данными
        res.status(500).json({
            message: "Ошибка сервера при добавлении/обновлении рейтинга",
            error: error.message,
            // Можно добавить stack trace для отладки, но не в продакшене
            // stack: error.stack
        });
    }
};