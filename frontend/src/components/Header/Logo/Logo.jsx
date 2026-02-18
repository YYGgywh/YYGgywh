/*
 * @file            frontend/src/components/Header/Logo/Logo.jsx
 * @description     圆运阁品牌Logo组件，显示Logo图片和品牌名称
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-01-27 16:30:00
 * @lastModified    2026-02-16 20:10:12
 * Copyright © All rights reserved
*/

import React from 'react'; // 导入React核心库
import './Logo.css'; // 导入Logo组件样式
import logoImage from './Logo.png'; // 导入Logo图片资源

// 定义Logo组件
const Logo = () => {
  // 返回JSX
  return (
    <a href="/" className="logo" aria-label="圆运阁首页"> {/* 渲染链接元素，设置类名和无障碍标签 */}
      {/* 渲染图片元素 */}
      <img
        className="logo-icon" // 设置图片类名
        src={logoImage} // 设置图片源
        alt="圆运阁" // 设置图片替代文本
        width="40" // 设置图片宽度
        height="40" // 设置图片高度
      />
      {/* 渲染文字容器 */}
      <div className="logo-text-container">
        <span className="logo-text-main">圆运阁</span> {/* 渲染主标题文字 */}
        <span className="logo-text-sub">古易文化</span> {/* 渲染副标题文字 */}
      </div> {/* 结束文字容器 */}
    </a> // 结束链接元素
  ); // 结束return
}; // 结束组件定义

export default Logo; // 导出Logo组件作为默认导出
