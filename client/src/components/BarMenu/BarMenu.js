// client/src/components/BarMenu/BarMenu.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BarMenu.css';

function BarMenu() {
  const navigate = useNavigate();

  return (
    <div className="menu-page">
      <h1 className="menu-title">Карта бара</h1>
      <button onClick={() => navigate('/user')} className="btn-back">← Назад</button>

      <div className="menu-card">
        <p style={{ fontSize: '1.2rem', textAlign: 'center', lineHeight: '1.8' }}>
          🍷 Здесь скоро появится меню напитков и закусок.<br />
          Подождите немного — мы готовим для вас что-то особенное!
        </p>
      </div>
    </div>
  );
}

export default BarMenu;