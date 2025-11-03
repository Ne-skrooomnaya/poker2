// server/controllers/rating.controller.js
const Rating = require('../models/rating.model');
const User = require('../models/user.model');

exports.getAllRatings = async (req, res) => {
  try {
    // Находим все записи рейтинга, сортируя по score
    const ratings = await Rating.find({})
      .sort({ score: -1 })
      .lean();

    // Создаем карту пользователей для быстрого поиска по telegramId
    // Это более эффективно, чем делать findOne в цикле для каждой записи рейтинга
    const usersMap = new Map();
    const allUsers = await User.find({}).lean(); // Получаем всех пользователей
    allUsers.forEach(user => {
      if (user.telegramId) { // Убеждаемся, что у пользователя есть telegramId
        usersMap.set(user.telegramId, user);
      }
    });

    const ratingsWithUsernames = ratings.map(rating => {
      const user = usersMap.get(rating.telegramId); // Ищем пользователя по telegramId из рейтинга
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

    res.status(200).json(ratingsWithUsernames);

  } catch (error) {
    console.error("Error fetching all ratings:", error);
    res.status(500).json({ message: 'Ошибка сервера при получении рейтинга.' });
  }
};
