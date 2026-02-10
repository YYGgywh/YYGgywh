// 路径:src/components/Logo/Logo.jsx 时间:2026-01-27 16:30
// 功能:圆运阁品牌Logo组件，显示Logo图片和品牌名称
import React from 'react';
import './Logo.css';
import logoImage from './Logo.png';

const Logo = () => {
  return (
    <a href="/" className="logo" aria-label="圆运阁首页">
      <img 
        className="logo-icon" 
        src={logoImage} 
        alt="圆运阁" 
        width="40" 
        height="40"
      />
      <div className="logo-text-container">
        <span className="logo-text-main">圆运阁</span>
        <span className="logo-text-sub">古易文化</span>
      </div>
    </a>
  );
};

export default Logo;