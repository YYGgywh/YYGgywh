/*
 * @file            frontend/src/components/UserCenter/NavItem/NavItem.jsx
 * @description     导航项组件，支持图标和文字，带激活状态样式
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-03 20:42:00
 * @lastModified    2026-03-14 12:00:00
 * Copyright © All rights reserved
*/

import React from 'react';
import styles from './NavItem.desktop.module.css';

/**
 * 用户图标组件
 */
export const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.navItemIcon}>
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

/**
 * 记录图标组件
 */
export const RecordIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.navItemIcon}>
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 5a2 2 0 012-2h2a2 2 0 012 2v0H9v0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

/**
 * 导航项组件
 * @param {Object} props - 组件属性
 * @param {string} props.id - 导航项唯一标识
 * @param {string} props.label - 导航项文字标签
 * @param {React.ReactNode} props.icon - 导航项图标组件
 * @param {boolean} props.isActive - 是否为激活状态
 * @param {Function} props.onClick - 点击事件处理函数
 */
const NavItem = ({ id, label, icon: Icon, isActive, onClick }) => {
  return (
    <li className={styles.navItemWrapper}>
      <button
        className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
        onClick={onClick}
        aria-current={isActive ? 'page' : undefined}
      >
        {Icon && <Icon />}
        <span className={styles.navItemLabel}>{label}</span>
      </button>
    </li>
  );
};

export default NavItem;
