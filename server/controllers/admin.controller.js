    // server/controllers/admin.controller.js (пример)
const Rating = require('../models/rating.model');

// --- НОВАЯ ФУНКЦИЯ: Сброс всех очков рейтинга ---
exports.resetRating = async (req, res) => {
    try {
        // Обновляем все документы в коллекции Rating, устанавливая score в 0
        const result = await Rating.updateMany({}, { score: 0 });

        res.status(200).json({
            message: 'Рейтинг успешно сброшен. Все очки установлены в 0.',
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Ошибка при сбросе рейтинга:', error);
        res.status(500).json({ message: 'Ошибка сервера при сбросе рейтинга.', error });
    }
};

    const adminController = {
      getDashboard: (req, res) => {
        // req.user содержит информацию о текущем аутентифицированном админе
        res.json({
          message: `Welcome to the admin dashboard, ${req.user.firstName}!`,
          user: req.user,
          // Здесь может быть логика для отображения статистики, пользователей и т.д.
        });
      },

      // Пример другой функции админки
      // createItem: async (req, res) => {
      //   try {
      //     // Логика создания нового элемента (игры, турнира и т.д.)
      //     res.status(201).json({ message: 'Item created successfully' });
      //   } catch (error) {
      //     console.error('Error creating item:', error);
      //     res.status(500).json({ message: 'Server error while creating item' });
      //   }
      // },
    };

    module.exports = adminController;
