// Предположим, у вас есть isAdminMiddleware
const isAdminMiddleware = require('../middleware/isAdminMiddleware'); // Пример пути

// ... другие импорты ...

router.get('/get-all-users', authMiddleware, isAdminMiddleware, adminController.getAllUsers);
router.get('/get-all-games', authMiddleware, isAdminMiddleware, adminController.getAllGames);
router.get('/get-user/:id', authMiddleware, isAdminMiddleware, adminController.getUserById);
router.get('/get-game/:id', authMiddleware, isAdminMiddleware, adminController.getGameById);
router.post('/create-game', authMiddleware, isAdminMiddleware, adminController.createGame);
router.put('/update-game/:id', authMiddleware, isAdminMiddleware, adminController.updateGame); // Лучше использовать PUT для обновлений
router.delete('/delete-game/:id', authMiddleware, isAdminMiddleware, adminController.deleteGame);
router.delete('/delete-user/:id', authMiddleware, isAdminMiddleware, adminController.deleteUser);
router.put('/update-user/:id', authMiddleware, isAdminMiddleware, adminController.updateUser); // Лучше использовать PUT для обновлений
