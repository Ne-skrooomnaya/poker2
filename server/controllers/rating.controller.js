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