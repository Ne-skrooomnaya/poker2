// client/src/App.js
import React from 'react';
import useTelegram from './hooks/useTelegram';
import UserPage from './components/UserPage';
import AdminPage from './components/AdminPage';

function App() {
  const { user, loading } = useTelegram();

  if (loading) return <div>Загрузка...</div>;

  if (!user) {
    return <div>Не удалось авторизоваться. Пожалуйста, перезапустите мини-апп.</div>;
  }

  // Перенаправляем на главные страницы
  if (user.isAdmin) {
    return <AdminPage user={user} />;
  } else {
    return <UserPage user={user} />;
  }
}

export default App;