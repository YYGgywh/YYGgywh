/*
 * @file            frontend/src/components/BackToTop/BackToTop.jsx
 * @description     返回顶部按钮组件，当页面滚动超过一定距离时显示
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-11 10:00:00
 * @lastModified    2026-03-14 12:00:00
 * Copyright © All rights reserved
*/

// 导入 React 核心库和必要的 hooks
import React, { useState, useEffect } from 'react';
// 导入节流函数，用于优化滚动事件处理
import { throttle } from '../../utils';
// 导入组件样式文件
import styles from './BackToTop.desktop.module.css';

/**
 * 返回顶部组件
 * 功能：当页面滚动超过300px时显示返回顶部按钮，点击后平滑滚动到页面顶部
 */
const BackToTop = () => {
  // 状态管理：控制返回顶部按钮的显示/隐藏
  const [visible, setVisible] = useState(false);
  
  // 处理滚动事件的函数，使用节流优化性能
  // 当页面滚动距离超过300px时显示按钮，否则隐藏
  const handleScroll = throttle(() => {
    setVisible(window.scrollY > 300);
  }, 100); // 100ms的节流间隔，避免频繁触发
  
  // 副作用：监听页面滚动事件
  useEffect(() => {
    // 添加滚动事件监听器
    window.addEventListener('scroll', handleScroll);
    
    // 清理函数：组件卸载时移除事件监听器并取消定时器，避免内存泄漏
    return () => {
      window.removeEventListener('scroll', handleScroll);
      handleScroll.cancel();
    };
  }, [handleScroll]); // 依赖项：handleScroll函数
  
  // 处理返回顶部的点击事件
  const handleBackToTop = () => {
    // 使用平滑滚动效果回到页面顶部
    window.scrollTo({
      top: 0, // 滚动到页面顶部
      behavior: 'smooth' // 平滑滚动效果
    });
  };
  
  // 如果按钮不可见，返回null不渲染任何内容
  if (!visible) return null;
  
  // 渲染返回顶部按钮
  return (
    // 按钮元素，点击时触发返回顶部功能
    <button className={styles.backToTop} onClick={handleBackToTop}>
      ↑ {/* 向上箭头符号 */}
    </button>
  );
};

// 导出返回顶部组件
export default BackToTop;
