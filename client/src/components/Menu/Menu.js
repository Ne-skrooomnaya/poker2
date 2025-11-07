// client/src/components/Menu/Menu.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import image from '../images/image.png';
import './Menu.css';

const Menu = () => {
  const navigate = useNavigate();

  return (
    <div className="menu-container">
      {/* Кнопка "Назад" */}
      <button onClick={() => navigate(-1)} className="menu-back-btn">
        ← Назад
      </button>

      {/* Кликабельная картинка */}
      <a
        href="https://fullhouselounge.taplink.ws/"
        target="_blank"
        rel="noopener noreferrer"
        className="menu-link"
      >
        <img
          src={image}
          alt="Перейти на сайт"
          className="menu-icon"
        />
      </a>
    </div>
  );
};

export default Menu;