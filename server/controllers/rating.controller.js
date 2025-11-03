// server/controllers/rating.controller.js
const Rating = require('../models/rating.model');
const User = require('../models/user.model');

const ratingController = async (req, res) => {
  try {
    // Получаем все записи рейтинга
    // Сортируем по убыванию очков
    // В модели Rating у нас поле telegramId, а не userId.
    // Нам нужно найти пользователя по telegramId из записи рейтинга.

    // Находим все записи рейтинга, сортируя по score
    const ratings = await Rating.find({})
      .sort({ score: -1 })
      .lean(); // lean() для получения чистых объектов JS, без Mongoose-документов (ускоряет)

    // Теперь для каждой записи рейтинга находим пользователя по telegramId
    const ratingsWithUsernames = await Promise.all(ratings.map(async (rating) => {
      const user = await User.findOne({ telegramId: rating.telegramId });
      return {
        _id: rating._id,
        telegramId: rating.telegramId,
        score: rating.score,
        // Возвращаем имя пользователя, если найдено, иначе "Неизвестный пользователь"
        firstName: user ? user.firstName : 'Неизвестный',
        lastName: user ? user.lastName : '',
        username: user ? user.username : 'Неизвестный',
      };
    }));

    res.status(200).json(ratingsWithUsernames);

  } catch (error) {
    console.error("Error fetching all ratings:", error);
    res.status(500).json({ message: 'Ошибка сервера при получении рейтинга.' });
  }
};

    module.exports = ratingController;