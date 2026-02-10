// 路径:src/components/LiuYao/components/NavigationSidebar.jsx 时间:2026-01-28 11:30
// 功能:侧边导航组件，用于显示和选择起卦方式
import React from 'react';
import './NavigationSidebar.css';

const NavigationSidebar = ({ methods, selectedMethod, onMethodSelect }) => {
  return (
    <div className="method-sidebar">
      {methods.map((method) => (
        <div
          key={method}
          className={`method-item ${selectedMethod === method ? 'active' : ''}`}
          onClick={() => onMethodSelect(method)}
        >
          {method}
        </div>
      ))}
    </div>
  );
};

export default NavigationSidebar;