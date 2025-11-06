// client/src/components/AdminPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';
import './HomePage.css';
import logo from './images/logo.svg'; // Импортируйте ваш логотип

const AdminPage = ({ onLogout }) => {
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
             <button onClick={() => navigate('/')} className="bottom-section-button">Гонка месяца</button>
             <button onClick={() => navigate('/')} className="bottom-section-button">Прошедшие игры</button>
            </div>
        </div>
    </>
  );
};

export default AdminPage;