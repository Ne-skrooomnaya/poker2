const jwt = require('jsonwebtoken');
// const User = require('../models/User'); // Если вы хотите загрузить пользователя полностью, а не только ID

module.exports = (req, res, next) => {
    try {
        const authHeader = req.get('Authorization'); // Более надежный способ получения заголовка

        if (!authHeader) {
            return res.status(401).json({ message: 'Отсутствует заголовок авторизации.' });
        }

        const token = authHeader.split(' ')[1]; // Извлекаем токен после "Bearer "

        if (!token) {
            return res.status(401).json({ message: 'Токен авторизации не найден.' });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Используем переменную окружения

        // decodedToken содержит данные, которые были помещены в токен при его создании
        // Обычно это { userId: ... }
        req.user = {
            id: decodedToken.userId,
            // role: decodedToken.role // Если роль хранится в токене
        };

        // Если нужно загрузить полного пользователя из БД (менее распространенный подход для middleware):
        // User.findById(decodedToken.userId)
        //     .then(user => {
        //         if (!user) {
        //             return res.status(401).json({ message: 'Пользователь не найден (токен действителен, но пользователь удален).' });
        //         }
        //         req.user = user; // Можно передать всего пользователя, если нужно
        //         next();
        //     })
        //     .catch(err => {
        //         console.error("Ошибка при поиске пользователя в middleware:", err);
        //         res.status(500).json({ message: 'Ошибка сервера при аутентификации.' });
        //     });

        next(); // Передаем управление дальше

    } catch (error) {
        let errorMessage = 'Ошибка аутентификации.';
        if (error.name === 'TokenExpiredError') {
            errorMessage = 'Срок действия токена истек. Пожалуйста, войдите снова.';
        } else if (error.name === 'JsonWebTokenError') {
            errorMessage = 'Неверный токен.';
        }
        console.error("Ошибка в authMiddleware:", error.message);
        res.status(401).json({ message: errorMessage, error: error.message });
    }
};
