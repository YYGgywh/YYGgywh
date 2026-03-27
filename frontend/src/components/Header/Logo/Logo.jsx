/*
 * @file            frontend/src/components/Header/Logo/Logo.jsx
 * @description     圆运阁品牌Logo组件，显示Logo图片和品牌名称
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-01-27 16:30:00
 * @lastModified    2026-02-16 20:10:12
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react'; // 导入React核心库
import desktopStyles from './Logo.desktop.module.css'; // 导入Logo组件样式
import mobileStyles from './Logo.mobile.module.css'; // 导入Logo组件移动端样式
import logoImage from './Logo.png'; // 导入Logo图片资源

// 定义Logo组件
const Logo = () => {
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
  const styles = isMobile ? mobileStyles : desktopStyles;
  
  // 返回JSX
  return (
    <a href="/" className={styles.logo} aria-label="圆运阁首页"> {/* 渲染链接元素，设置类名和无障碍标签 */}
      {/* 渲染图片元素 */}
      <img
        className={styles.logoIcon} // 设置图片类名
        src={logoImage} // 设置图片源
        alt="圆运阁" // 设置图片替代文本
        width={isMobile ? "32" : "40"} // 根据屏幕尺寸设置图片宽度
        height={isMobile ? "32" : "40"} // 根据屏幕尺寸设置图片高度
      />
      {/* 渲染文字容器 */}
      <div className={styles.logoTextContainer}>
        <span className={styles.logoTextMain}>圆运阁</span> {/* 渲染主标题文字 */}
        <span className={styles.logoTextSub}>古易文化</span> {/* 渲染副标题文字 */}
      </div> {/* 结束文字容器 */}
    </a> // 结束链接元素
  ); // 结束return
}; // 结束组件定义

export default Logo; // 导出Logo组件作为默认导出
