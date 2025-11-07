// client/src/components/Menu/Menu.js

import React from 'react';
import image from '../images/image.png'; // путь к твоей картинке
import './Menu.css'; // опционально, если хочешь стилизовать

const Menu = () => {
  return (
    <div className="menu-container">
      <a
        href="https://t.me/your_channel" // ← замени на свою ссылку
        target="_blank"
        rel="noopener noreferrer"
        className="menu-link"
      >
        <img
          src={image}
          alt="Перейти в Telegram"
          className="menu-icon"
        />
      </a>
    </div>
  );
};

export default Menu;