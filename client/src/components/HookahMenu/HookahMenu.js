// client/src/components/HookahMenu/HookahMenu.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HookahMenu.css';
import dym from '../images/dym.png';
function HookahMenu() {
  const navigate = useNavigate();

  return (
    <div className="menu-page">
      <h1 className="menu-title">Паркур</h1>
      <button onClick={() => navigate('/user')} className="btn-back">← Назад</button>

      <div className="menu-card">
        <img src={dym} alt="Паркур" className="menu-image" />
        <div className="menu-content">
          <p>Понедельник и вторник — <strong>1000₽</strong></p>
          <p>Среда, четверг<br></br>и воскресенье — <strong>1300₽</strong></p>
          <p>Пятница и суббота — <strong>1500₽</strong></p>
        </div>
      </div>
    </div>
  );
}

export default HookahMenu;