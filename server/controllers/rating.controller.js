// server/controllers/rating.controller.js
const Rating = require('../models/rating.model');
const User = require('../models/user.model');

exports.getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({})
      .sort({ score: -1 })
      .lean();

    const usersMap = new Map();
    const allUsers = await User.find({}).lean();
    allUsers.forEach(user => {
      if (user.telegramId) {
        usersMap.set(user.telegramId, user);
      }
    });

    const ratingsWithUsernames = ratings.map(rating => {
      const user = usersMap.get(rating.telegramId);
      // Добавляем логирование здесь, чтобы увидеть, найден ли пользователь
      console.log(`Rating Telegram ID: ${rating.telegramId}, User Found: ${!!user}, Username: ${user ? user.username : 'N/A'}`);

      return {
        _id: rating._id,
        telegramId: rating.telegramId,
        score: rating.score,
        // Возвращаем имя пользователя, если найдено, иначе "Неизвестный пользователь"
        firstName: user ? user.firstName : 'Неизвестный',
        lastName: user ? user.lastName : '',
        username: user ? user.username : 'Неизвестный',
      };
    });

    // Логируем финальный массив, который отправляется на фронтенд
    console.log("Final ratings sent to frontend:", ratingsWithUsernames);

    res.status(200).json(ratingsWithUsernames);

  } catch (error) {
    console.error("Error fetching all ratings:", error);
    res.status(500).json({ message: 'Ошибка сервера при получении рейтинга.' });
  }
};

// --- НОВАЯ ФУНКЦИЯ: Удаление записи рейтинга ---
exports.deleteRating = async (req, res) => {
    try {
        const ratingIdToDelete = req.params.id; // Получаем _id документа рейтинга из URL

        // Находим и удаляем документ рейтинга по его _id
        const deletedRating = await Rating.findByIdAndDelete(ratingIdToDelete);

        if (!deletedRating) {
            return res.status(404).json({ message: 'Запись рейтинга не найдена.' });
        }

        res.status(200).json({ message: 'Запись рейтинга успешно удалена.', deletedItem: deletedRating });
    } catch (error) {
        console.error('Ошибка при удалении записи рейтинга:', error);
        res.status(500).json({ message: 'Ошибка сервера при удалении записи рейтинга.', error });
    }
};
