// server/routes/admin.routes.js (пример улучшения)
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller'); // Предполагается, что контроллеры находятся здесь
const authMiddleware = require('../middleware/authMiddleware'); // Предполагается, что middleware находится здесь
const isAdminMiddleware = require('../middleware/isAdminMiddleware'); // Пример middleware для админов

// Маршруты для управления пользователями
router.get('/users', authMiddleware, isAdminMiddleware, adminController.getAllUsers);
router.get('/users/:id', authMiddleware, isAdminMiddleware, adminController.getUserById);
router.put('/users/:id', authMiddleware, isAdminMiddleware, adminController.updateUser); // PUT для полного обновления
router.delete('/users/:id', authMiddleware, isAdminMiddleware, adminController.deleteUser);

// Маршруты для управления играми
router.get('/games', authMiddleware, isAdminMiddleware, adminController.getAllGames);
router.get('/games/:id', authMiddleware, isAdminMiddleware, adminController.getGameById);
router.post('/games', authMiddleware, isAdminMiddleware, adminController.createGame); // POST для создания
router.put('/games/:id', authMiddleware, isAdminMiddleware, adminController.updateGame); // PUT для полного обновления
router.delete('/games/:id', authMiddleware, isAdminMiddleware, adminController.deleteGame);

module.exports = router;

// server/routes/rating.routes.js (пример улучшения)
const express = require('express');
const ratingController = require('../controllers/rating.controller');
const authMiddleware = require('../middleware/authMiddleware');

// Отправка рейтинга (предполагается, что пользователя аутентифицирован)
// POST /api/ratings
router.post('/ratings', authMiddleware, ratingController.submitRating);

// Получение рейтингов для игры
// GET /api/ratings/games/:gameId
router.get('/ratings/games/:gameId', ratingController.getGameRatings); // Возможно, не требует аутентификации для просмотра

module.exports = router;
