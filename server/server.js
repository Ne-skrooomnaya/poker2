// server/server.js

const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());

// API Routes
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const ratingRoutes = require('./routes/rating.routes');
const userRoutes = require('./routes/user.routes');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/rating', ratingRoutes);
app.use('/api/user', userRoutes);

// Обслуживание React App (SPA)
app.use(express.static(path.join(__dirname, '../../client/build')));

// Для SPA: если ни один из API-роутов не подошёл — отдать index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

// Запуск сервера
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});