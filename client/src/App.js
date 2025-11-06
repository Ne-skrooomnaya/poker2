// client/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useTelegram from './hooks/useTelegram'; // Убедитесь, что путь правильный
import UserPage from './components/UserPage';
import AdminPage from './components/AdminPage';
import HomePage from './components/HomePage'; // Ваша главная страница (где происходит вход/регистрация)
import RatingPage from './components/RatingPage'; // Ваша страница рейтинга
import AdminRatingPage from './components/rating/AdminRatingPage'; // Страница админки
import LoadingPage from './components/LoadingPage'; // Компонент для отображения загрузки
import MonthlyRacePage from './components/MonthlyRacePage/MonthlyRacePage'; // ← Добавь это
// Пример компонента-обертки для защищенных роутов
// Он будет перенаправлять пользователя, если он не авторизован
const ProtectedRoute = ({ element: Element, user, allowedRoles, fallbackPath = "/", ...rest }) => {
      if (!user) {
        return <Navigate to={fallbackPath} replace />;
      }
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.role)) {
          return <Navigate to={fallbackPath} replace />; // Перенаправляем, если роль не подходит
        }
      }
      return <Element user={user} {...rest} />;
    };

function App() {
  const { user, loading, telegramUser } = useTelegram();

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <Router>
      <Routes>
        {/* Главная страница - доступна для входа */}
        <Route path="/" element={<HomePage />} />

        {/* Перенаправление после логина */}
        {user && (
          <>
            <Route 
              path="/welcome" 
              element={<Navigate to={user.role === 'admin' ? '/admin' : '/user'} replace />} 
            />
          </>
        )}

        {/* Новые главные страницы */}
        <Route
          path="/user"
          element={<ProtectedRoute element={UserPage} user={user} fallbackPath="/" />}
        />
        <Route
          path="/admin"
          element={<ProtectedRoute element={AdminPage} user={user} allowedRoles={['admin']} fallbackPath="/" />}
        />
        <Route path="/monthly-race" element={<MonthlyRacePage />} />
        {/* Страница рейтинга - универсальная */}
        <Route
          path="/rating"
          element={<ProtectedRoute element={RatingPage} user={user} fallbackPath="/" />}
        />

        {/* Админский рейтинг — пока оставим (на случай прямого захода) */}
        <Route
          path="/admin/rating"
          element={<ProtectedRoute element={AdminRatingPage} user={user} allowedRoles={['admin']} fallbackPath="/" />}
        />

        {/* Fallback для авторизованных */}
        {user && (
          <Route path="*" element={<Navigate to={user.role === 'admin' ? '/admin' : '/user'} replace />} />
        )}

        {/* Fallback для неавторизованных */}
        {!user && (
          <Route path="*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;