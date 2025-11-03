// server/routes/rating.js
const express = require('express');
const router = express.Router();
const Rating = require('../models/rating.model');
const User = require('../models/user.model');
const { getAllRatings, deleteRating } = require('../controllers/rating.controller');

const mongoose = require('mongoose');
// GET /rating - Получить список рейтингов
// GET /api/rating - Получить все записи рейтинга
router.get('/', getAllRatings);
// --- НОВЫЙ МАРШРУТ: Удалить запись рейтинга по ID ---
router.delete('/:id', deleteRating);
router.get('/', async (req, res) => {
  try {
    // Получаем все записи рейтинга, сортируем по убыванию счета
    const ratings = await Rating.find()
      .populate('userId', 'username firstName lastName') // Присоединяем данные пользователя
      .sort({ score: -1 })
      .exec(); // exec() нужен после populate

    // Форматируем ответ, чтобы было удобнее отображать
    const formattedRatings = ratings.map(rating => ({
      _id: rating._id,
      score: rating.score,
      user: { // Объект user с нужными полями
        _id: rating.userId._id,
        username: rating.userId.username,
        firstName: rating.userId.firstName,
        lastName: rating.userId.lastName,
      }
    }));

    

    res.json(formattedRatings);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ message: 'Server error fetching ratings' });
  }
});

router.delete('/rating/:id', async (req, res) => {
  try {
    const userIdToDelete = req.params.id; // Получаем ID пользователя из URL

    // Находим и удаляем запись рейтинга, где user._id равен userIdToDelete
    // В зависимости от вашей схемы, это может быть Rating.findByIdAndDelete(userIdToDelete)
    // если ID записи рейтинга совпадает с ID пользователя,
    // или Rating.findOneAndDelete({ user: userIdToDelete }) если user - это ObjectId
    // или Rating.findOneAndDelete({ 'user._id': userIdToDelete }) если user - это вложенный объект
    const deletedRating = await Rating.findOneAndDelete({ _id: userIdToDelete }); // Предполагаем, что _id записи рейтинга - это и есть id пользователя, как в RatingList.js.
    // Если в вашей модели Rating user - это ссылка, то `await Rating.findOneAndDelete({ user: userIdToDelete });`
    // Если user - это вложенный объект, то `await Rating.findOneAndDelete({ 'user._id': userIdToDelete });`

    if (!deletedRating) {
      return res.status(404).json({ message: 'Запись рейтинга не найдена.' });
    }

    res.status(200).json({ message: 'Запись рейтинга успешно удалена.', deletedItem: deletedRating });
  } catch (error) {
    console.error('Ошибка при удалении записи рейтинга:', error);
    res.status(500).json({ message: 'Ошибка сервера при удалении записи рейтинга.' });
  }
});

module.exports = router;