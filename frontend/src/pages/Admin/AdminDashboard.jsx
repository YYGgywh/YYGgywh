/*
 * @file            frontend/src/pages/Admin/AdminDashboard.jsx
 * @description     后台管理首页/仪表板
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-01 10:00:00
 * @lastModified    2026-03-01 10:00:00
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStatistics } from '../../api/adminApi';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    panRecords: 0,
    comments: 0,
    pendingAudit: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await getStatistics();
      if (response.success || response.code === 200) {
        setStats({
          users: response.data.users || 0,
          panRecords: response.data.pan_records || 0,
          comments: response.data.comments || 0,
          pendingAudit: response.data.pending_audit || 0
        });
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const statCards = [
    {
      title: '用户总数',
      value: stats.users,
      icon: '👥',
      color: '#667eea',
      link: '/admin/users'
    },
    {
      title: '排盘记录',
      value: stats.panRecords,
      icon: '📜',
      color: '#764ba2',
      link: '/admin/pan-records'
    },
    {
      title: '评论总数',
      value: stats.comments,
      icon: '💬',
      color: '#f093fb',
      link: '/admin/comments'
    },
    {
      title: '待审核',
      value: stats.pendingAudit,
      icon: '⏳',
      color: '#f5576c',
      link: '/admin/pan-records'
    }
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-stats">
        {statCards.map((card, index) => (
          <Link key={index} to={card.link} className="stat-card">
            <div className="stat-icon" style={{ background: card.color }}>
              {card.icon}
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{card.value}</h3>
              <p className="stat-title">{card.title}</p>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="dashboard-welcome">
        <div className="welcome-card">
          <h2>欢迎使用圆运阁后台管理系统</h2>
          <p>请从左侧菜单选择功能模块进行管理</p>
          <div className="welcome-tips">
            <h3>快速开始</h3>
            <ul>
              <li>📋 <Link to="/admin/users">用户管理</Link> - 管理平台用户账户</li>
              <li>📜 <Link to="/admin/pan-records">排盘记录</Link> - 审核和管理排盘记录</li>
              <li>💬 <Link to="/admin/comments">评论管理</Link> - 审核用户评论</li>
              <li>📊 <Link to="/admin/logs">系统日志</Link> - 查看系统操作日志</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
