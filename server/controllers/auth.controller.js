// server/controllers/auth.controller.js

const User = require('../models/user.model');

const checkAuth = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const user = await User.findOne({ telegramId: userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Определяем isAdmin по полю role
    const isAdmin = user.role === 'admin';

    res.json({
      id: user._id,
      telegramId: user.telegramId,
      isAdmin, // ← теперь правильно
    });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { checkAuth };