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
        <div class="top-section">
            <div class="top-section-img">
                <object data="/images/chip.svg"type="image/svg+xml"><img src="/images/chip.svg" alt="chip" /></object>
            </div>
            <div class="top-buttons">
             <button onClick={() => navigate('/rating')} className="bottom-section-button">Рейтинг</button>
             <button onClick={() => navigate('/monthly-race')} className="bottom-section-button">Гонка месяца</button>
             <button onClick={() => navigate('/')} className="bottom-section-button">Прошедшие игры</button>
            </div>
        </div>
        <div class="bottom-section">
            <button class="bottom-section-button" onClick={() => navigate('/')}>Меню</button>
            <button class="bottom-section-button" onClick={() => navigate('/')}>Чайная карта</button>
            <button class="bottom-section-button" onClick={() => navigate('/')}>Паркур</button>
            <button class="bottom-section-button" onClick={() => navigate('/')}>Карта бара</button>
        </div>
    </>
  );
};

export default UserPage;