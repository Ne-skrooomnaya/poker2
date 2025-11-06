// client/src/App.js

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserPage from './components/UserPage';
import AdminPage from './components/AdminPage';
import UserRatingPage from './components/rating/UserRatingPage';
import AdminRatingPage from './components/rating/AdminRatingPage';
import HomePage from './components/HomePage';
import LoadingPage from './components/LoadingPage';
import useTelegram from './hooks/useTelegram';
import { checkAuth } from './utils/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { tg } = useTelegram();

  useEffect(() => {
    const init = async () => {
      try {
        const userId = tg.initDataUnsafe?.user?.id;
        if (!userId) {
          setLoading(false);
          return; // останется на HomePage
        }
        const userData = await checkAuth(userId);
        setUser(userData);
      } catch (err) {
        console.error('Auth error:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading) return <LoadingPage />;

  // Не авторизован — показываем HomePage (вход/ошибка)
  if (!user) return <HomePage />;
// В useEffect после получения user:
console.log('User data:', user); // ← смотри, есть ли isAdmin?
  // Авторизован — роутим по ролям
  return (
    <Router>
      <Routes>
        {/* Главная страница */}
        <Route path="/" element={user.isAdmin ? <AdminPage /> : <UserPage />} />

        {/* Рейтинг */}
        <Route
          path="/rating"
          element={user.isAdmin ? <AdminRatingPage /> : <UserRatingPage />}
        />

        {/* Любые другие пути → на главную */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;