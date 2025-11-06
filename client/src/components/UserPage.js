// client/src/components/AdminPage.js
import React from 'react';
import './UserPage.css';
import { Link } from 'react-router-dom';
import './HomePage.css';
import logo from './images/logo.svg'; // Импортируйте ваш логотип

const UserPage = ({ onLogout }) => {
  return (
    <>
    {/* Логотип */}
          <div className="logo-container">
            <img src={logo} alt="Poker Logo" />
          </div>
   {/* Верхний блок */}

           
           <div className="bottom-section">
             <Link to="/rating">📊 Посмотреть рейтинг</Link>
             <button className="bottom-section-button">Гонка месяца</button>
             <button className="bottom-section-button">Прошедшие игры</button>
             
             
           </div>

             {/* Кнопка выхода */}
      <button className="logout-button" onClick={onLogout}>
        Выйти
      </button>
    </>
  );
};

export default UserPage;