import React from 'react';
import './LoadingDots.css';

/**
 * 加载动画组件
 * @param {Object} props 组件属性
 * @param {string} props.size 大小：small, medium, large
 * @param {string} props.color 颜色
 */
const LoadingDots = ({ size = 'medium', color = '#1890ff' }) => {
  return (
    <div className={`loading-dots ${size}`}>
      <div className="dot" style={{ backgroundColor: color }}></div>
      <div className="dot" style={{ backgroundColor: color }}></div>
      <div className="dot" style={{ backgroundColor: color }}></div>
    </div>
  );
};

export default LoadingDots;