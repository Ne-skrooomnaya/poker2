// client/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthPage from './components/AuthPage';
import RatingPage from './components/RatingPage';
import AdminRatingPage from './components/AdminRatingPage';
import UserPage from './components/UserPage';
import AdminPage from './components/AdminPage';

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`${BACKEND_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div>Загрузка...</div>;

  if (!user) return <AuthPage onLogin={setUser} />;

  // Изменение: теперь редиректим на UserPage или AdminPage
  if (user.isAdmin) {
    return <AdminPage user={user} />;
  } else {
    return <UserPage user={user} />;
  }
}

export default App;