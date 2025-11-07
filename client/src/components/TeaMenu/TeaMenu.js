// client/src/components/TeaMenu/TeaMenu.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TeaMenu.css';

function TeaMenu() {
  const navigate = useNavigate();

  return (
    <div className="menu-page">
      <h1 className="menu-title">Ароматный дым</h1>
      <button onClick={() => navigate('/user')} className="btn-back">← Назад</button>

      <div className="menu-card">
        <img src="https://via.placeholder.com/200x200?text=Ароматный+дым" alt="Ароматный дым" className="menu-image" />
        <div className="menu-content">
          <p>Понедельник и вторник — <strong>1200₽</strong></p>
          <p>Среда, четверг и воскресенье — <strong>1500₽</strong></p>
          <p>Пятница и суббота — <strong>1700₽</strong></p>
        </div>
      </div>
    </div>
  );
}

export default TeaMenu;