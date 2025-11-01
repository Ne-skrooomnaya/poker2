    // server/models/rating.model.js (ПРОШУ ПРЕДОСТАВИТЬ СОДЕРЖИМОЕ ЭТОГО ФАЙЛА, ЕСЛИ ОНО ОТЛИЧАЕТСЯ ОТ ПРЕДЫДУЩЕГО)
    const mongoose = require('mongoose');

    const ratingSchema = new mongoose.Schema({
      telegramId: { // Используем telegramId как уникальный идентификатор
        type: String, // Telegram ID обычно строки
        required: true,
        unique: true, // Гарантирует, что у каждого пользователя будет только одна запись в рейтинге
      },
      score: {
        type: Number,
        default: 0,
      },
      // Можно добавить другие поля, например, для времени достижения лучшего результата
    }, {
      timestamps: true,
    });

    // Если у тебя есть какая-то связь с моделью User, которая тебе нужна
    // ratingSchema.virtual('user', {
    //   ref: 'User',
    //   localField: 'telegramId', // Убедись, что это правильное поле для связи
    //   foreignField: 'telegramId', // Или какое там поле в User
    //   justOne: true
    // });
    // mongoose.set('useCreateIndex', true); // Для поддержки unique в старых версиях mongoose

    module.exports = mongoose.model('Rating', ratingSchema);
