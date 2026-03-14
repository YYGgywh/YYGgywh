/*
 * @file            frontend/src/components/UserCenter/SidebarNav/SidebarNav.jsx
 * @description     用户中心左侧导航栏组件，包含导航项列表和退出登录按钮
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-03 20:40:00
 * @lastModified    2026-03-14 12:00:00
 * Copyright © All rights reserved
*/

import React from 'react';
import NavItem from '../NavItem/NavItem';
import styles from './SidebarNav.desktop.module.css';

/**
 * 侧边栏导航组件
 * @param {Object} props - 组件属性
 * @param {Array} props.items - 导航项配置数组
 * @param {string} props.activeId - 当前激活的导航项ID
 * @param {Function} props.onNavClick - 导航项点击回调函数
 * @param {Function} props.onLogout - 退出登录回调函数
 */
const SidebarNav = ({ items, activeId, onNavClick, onLogout }) => {
  return (
    <nav className={styles.sidebarNav}>
      <ul className={styles.sidebarNavList}>
        {items.map((item) => (
          <NavItem
            key={item.id}
            id={item.id}
            label={item.label}
            icon={item.icon}
            isActive={activeId === item.id}
            onClick={() => onNavClick(item.id)}
          />
        ))}
      </ul>
      <div className={styles.sidebarNavFooter}>
        <button className={styles.sidebarLogoutBtn} onClick={onLogout}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.logoutIcon}>
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>退出登录</span>
        </button>
      </div>
    </nav>
  );
};

export default SidebarNav;
