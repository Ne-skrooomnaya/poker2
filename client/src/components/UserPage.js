// client/src/components/AdminPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserPage.css';
import { Link } from 'react-router-dom';
import './HomePage.css';
import logo from './images/logo.svg'; // Импортируйте ваш логотип

const UserPage = ({ onLogout }) => {
    const navigate = useNavigate();
  return (
    <>
    {/* Логотип */}
          <div className="logo-container">
            <img src={logo} alt="Poker Logo" />
          </div>
   {/* Верхний блок */}

           
           <div className="bottom-section">
             <button onClick={() => navigate('/rating')}>
  Рейтинг
</button>
             <Link to="/rating" className="t">
             <button className="bottom-section-button">Гонка месяца</button></Link>
             <Link to="/rating" className="t">
             <button className="bottom-section-button">Прошедшие игры</button></Link>
             
             
           </div>

             {/* Кнопка выхода */}
      <button className="logout-button" onClick={onLogout}>
        Выйти
      </button>
    </>
  );
};

export default UserPage;