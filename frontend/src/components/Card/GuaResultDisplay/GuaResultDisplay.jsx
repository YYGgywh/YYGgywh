/*
 * @file            frontend/src/components/Card/GuaResultDisplay/GuaResultDisplay.jsx
 * @description     卦象结果显示组件，用于显示卦象：巽为风 → 艮为山
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-23 13:45:00
 * @lastModified    2026-03-23 13:45:15
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './GuaResultDisplay.desktop.module.css';
import mobileStyles from './GuaResultDisplay.mobile.module.css';

/**
 * 卦象结果显示组件
 * @param {Object} props - 组件属性
 * @param {Object} props.panResult - 卦象结果对象
 * @param {string} props.className - 自定义类名
 * @returns {JSX.Element} 卦象结果显示组件
 */
const GuaResultDisplay = ({ panResult, className = '' }) => {
  // 移动端状态管理
  const [isMobile, setIsMobile] = useState(() => {
    return window.innerWidth < 768;
  });
  
  // 监听窗口大小变化，更新移动端状态
  useEffect(() => {
    const handleResize = () => {
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 100);
    };
    
    // 初始执行一次
    handleResize();
    // 添加窗口大小变化监听器
    window.addEventListener('resize', handleResize);
    // 组件卸载时移除监听器
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(window.resizeTimeout);
    };
  }, []);
  
  // 根据屏幕尺寸选择样式
  const currentStyles = isMobile ? mobileStyles : styles;
  
  if (!panResult) {
    return null;
  }

  const benGuaName = panResult.ben_gua_head?.name || '未知';
  const bianGuaName = panResult.bian_gua_head?.name;

  return (
    <div className={`${currentStyles.guaResultDisplay} ${className}`}>
      <span className={currentStyles.resultLabel}>卦象：</span>
      <span className={currentStyles.resultValue}>
        {benGuaName}
        {bianGuaName && ` → ${bianGuaName}`}
      </span>
    </div>
  );
};

// 为 GuaResultDisplay 组件添加 PropTypes 类型定义
GuaResultDisplay.propTypes = {
  panResult: PropTypes.shape({
    ben_gua_head: PropTypes.shape({
      name: PropTypes.string
    }),
    bian_gua_head: PropTypes.shape({
      name: PropTypes.string
    })
  }),
  className: PropTypes.string
};

// 为 GuaResultDisplay 组件添加 displayName，便于在 React DevTools 中调试
GuaResultDisplay.displayName = 'GuaResultDisplay';

export default GuaResultDisplay;