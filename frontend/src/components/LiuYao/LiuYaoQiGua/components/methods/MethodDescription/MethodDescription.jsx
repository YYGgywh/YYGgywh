/*
 * @file            frontend/src/components/LiuYao/LiuYaoQiGua/components/methods/MethodDescription/MethodDescription.jsx
 * @description     起卦方法说明组件，用于显示起卦方法的标题、描述和操作步骤
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-28 10:00:00
 * @lastModified    2026-03-28 17:00:00
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react';
import desktopStyles from './MethodDescription.desktop.module.css';
import mobileStyles from './MethodDescription.mobile.module.css';

const MethodDescription = ({ title, description, steps, className = '' }) => {
  // 屏幕尺寸检测
  const [isMobile, setIsMobile] = useState(() => {
    return window.innerWidth < 768;
  });
  
  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 100);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(window.resizeTimeout);
    };
  }, []);
  
  // 根据屏幕尺寸选择样式
  const currentStyles = isMobile ? mobileStyles : desktopStyles;
  
  return (
    <div className={`${currentStyles.root} ${className}`}>
      <h3>{title}</h3>
      <p>{description}</p>
      <ol>
        {steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </div>
  );
};

export default MethodDescription;