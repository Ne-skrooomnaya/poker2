// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- Переменные окружения ---
const PORT = process.env.PORT || 3000; // Railway сам подставит PORT
const mongoURI = process.env.MONGODB_URI;

// --- Подключение к MongoDB ---
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // критическая ошибка — завершаем процесс
  });

// --- Middleware ---
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://poker2-olive.vercel.app', // ← URL с Vercel
  credentials: true
}));

// --- API Routes ---
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const ratingRoutes = require('./routes/rating.routes');
const adminRoutes = require('./routes/admin.routes');

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/rating', ratingRoutes);
app.use('/admin', adminRoutes);

// --- Health check ---
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// --- Запуск сервера ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});