/*
 * @file            frontend/src/pages/Admin/AdminLayout.jsx
 * @description     后台管理主布局组件
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-01 10:00:00
 * @lastModified    2026-03-02 12:15:48
 * Copyright © All rights reserved
*/

import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import './AdminLayout.css';

export default function AdminLayout() {
  const { adminUser, logout } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin', label: '首页', icon: '📊' },
    { path: '/admin/users', label: '用户管理', icon: '👥' },
    { path: '/admin/pan-records', label: '排盘记录', icon: '📜' },
    { path: '/admin/comments', label: '评论管理', icon: '💬' },
    { path: '/admin/sensitive-words', label: '敏感词管理', icon: '🔇' },
    { path: '/admin/logs', label: '系统日志', icon: '📋' },
    { path: '/admin/config', label: '系统配置', icon: '⚙️' },
  ];

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="admin-sidebar-header">
          <h1 className="admin-logo">
            <span className="admin-logo-icon">☯️</span>
            <span className="admin-logo-text">圆运阁</span>
          </h1>
        </div>
        
        <nav className="admin-sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="admin-nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>
        
        <div className="admin-sidebar-footer">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="admin-toggle-btn"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
      </aside>
      
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <h2 className="admin-page-title">
              {menuItems.find(item => item.path === location.pathname)?.label || '后台管理'}
            </h2>
          </div>
          <div className="admin-header-right">
            <div className="admin-user-info">
              <span className="admin-user-avatar">
                {adminUser?.nickname?.[0] || '管'}
              </span>
              <span className="admin-user-name">{adminUser?.nickname || '管理员'}</span>
              <span className="admin-user-role">
                {adminUser?.role === 99 ? '超级管理员' : '管理员'}
              </span>
            </div>
            <button onClick={handleLogout} className="admin-logout-btn">
              退出登录
            </button>
          </div>
        </header>
        
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
