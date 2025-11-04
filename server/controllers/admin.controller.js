    // server/controllers/admin.controller.js (пример)

   // Добавление пользователя в рейтинг
exports.addUserToRating = async (req, res) => {
    try {
        let { telegramId, score } = req.body;

        // --- ПРЕОБРАЗОВАНИЕ И ПРОВЕРКА ВХОДНЫХ ДАННЫХ ---

        // Убедимся, что score - это число
        score = parseInt(score);
        if (isNaN(score)) {
            return res.status(400).json({ message: "Score должен быть числом" });
        }

        // Убедимся, что telegramId - это строка, и очистим его от лишних пробелов
        telegramId = String(telegramId).trim();

        // --- ОСОБОЕ ВНИМАНИЕ ЗДЕСЬ ---
        // Проверяем, что telegramId НЕ пустой. Если он пустой, это вызовет DuplicateKeyError,
        // если есть запись с userId: null.
        if (!telegramId) {
            // Вместо того, чтобы просто вернуть ошибку, давайте проверим, есть ли уже запись с null userId.
            // Если есть, то мы не будем создавать новую, но и не будем обновлять (так как нет id для обновления).
            // Лучше всего, чтобы админка не позволяла отправлять пустой telegramId.
            // Но для защиты бэкенда:
            const nullIdRating = await Rating.findOne({ telegramId: null }); // Или { userId: null }, если индекс действительно на userId
            if (nullIdRating) {
                 return res.status(400).json({ message: "Невозможно добавить нового пользователя с пустым Telegram ID, так как такая запись уже существует." });
            } else {
                 // Если нет записи с null, и telegramId пустой, это новая ситуация,
                 // но мы не можем создать запись без Telegram ID.
                 return res.status(400).json({ message: "Telegram ID не может быть пустым для добавления нового пользователя." });
            }
        }
        // --- КОНЕЦ ОСОБОГО ВНИМАНИЯ ---


        // Ищем пользователя по telegramId
        const user = await User.findOne({ telegramId: telegramId });

        if (!user) {
            // Если пользователя нет, вернуть ошибку 404
            return res.status(404).json({ message: `Пользователь с Telegram ID "${telegramId}" не найден.` });
        }

        // Проверяем, есть ли уже запись в рейтинге для этого пользователя
        // **ВАЖНО:** Убедитесь, что поле, по которому вы ищете, соответствует полю в индексе MongoDB.
        // Если индекс называется `userId_1`, а поле в модели `telegramId`, то здесь должно быть:
        // const existingRating = await Rating.findOne({ userId: telegramId });
        // Но исходя из вашей модели, скорее всего, он должен быть по telegramId:
        const existingRating = await Rating.findOne({ telegramId: telegramId });


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
        // Предоставляем более детальную информацию об ошибке
        res.status(500).json({
            message: "Ошибка сервера при добавлении/обновлении рейтинга",
            error: error.message,
            // errorDetails: error // Если хотите передать полный объект ошибки (не рекомендуется для продакшена)
        });
    }
};