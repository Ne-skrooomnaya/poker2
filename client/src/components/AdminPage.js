// client/src/components/AdminPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';
import { Link } from 'react-router-dom';
import './HomePage.css';
import logo from './images/logo.svg'; // Импортируйте ваш логотип

function AdminPage({ user }) {
  const navigate = useNavigate();
    return (
    <>
    <p>Привет, {user.firstName || user.username || 'Админ'}!</p>
    {/* Логотип */}
          <div className="logo-container">
            <img src={logo} alt="Poker Logo" />
          </div>
   {/* Верхний блок */}

           
           <div className="bottom-section">
              <button onClick={() => navigate('/rating')} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Перейти к рейтингу
      </button>
      <div style={{ marginTop: '20px' }}>
        <a href="/admin-rating" style={{ textDecoration: 'underline' }}>
          Админка рейтинга
        </a>
      </div>
             <Link to="/rating" className="t">
             <button className="bottom-section-button">Гонка месяца</button></Link>
             <Link to="/rating" className="t">
             <button className="bottom-section-button">Прошедшие игры</button></Link>
             
             
           </div>

             
    </>
  );
};

export default AdminPage;