const checkAuth = async (req, res) => {
  const { userId } = req.query;
  const user = await User.findOne({ telegramId: userId });
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({
    id: user._id,
    telegramId: user.telegramId,
    isAdmin: Boolean(user.isAdmin), // важно!
  });
};