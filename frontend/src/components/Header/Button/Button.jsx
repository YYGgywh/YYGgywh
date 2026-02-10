// 路径:src/components/Button/Button.jsx 时间:2026-01-27 16:33
// 功能:通用按钮组件，支持主按钮和次要按钮样式
import React from 'react';
import './Button.css';

const Button = ({ children, variant = 'primary', fullWidth = false, ...props }) => {
  const className = `button button-${variant} ${fullWidth ? 'button-full-width' : ''}`;
  
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
};

export default Button;