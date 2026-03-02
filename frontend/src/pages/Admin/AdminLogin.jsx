/*
 * @file            frontend/src/pages/Admin/AdminLogin.jsx
 * @description     后台管理登录页面
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-01 10:00:00
 * @lastModified    2026-03-01 10:00:00
 * Copyright © All rights reserved
*/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { adminLogin } from '../../api/adminApi';
import './AdminLogin.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAdmin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await adminLogin(username, password);
      if (response.success) {
        login(response.data.token, response.data.user);
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.detail || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h1 className="admin-login-title">后台管理系统</h1>
        <h2 className="admin-login-subtitle">圆运阁古易文化</h2>
        
        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && <div className="admin-login-error">{error}</div>}
          
          <div className="admin-form-group">
            <label>用户名/手机号</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名或手机号"
              required
            />
          </div>
          
          <div className="admin-form-group">
            <label>密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
            />
          </div>
          
          <button type="submit" disabled={loading} className="admin-login-btn">
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
        
        <div className="admin-login-footer">
          <p>请使用管理员账户登录</p>
        </div>
      </div>
    </div>
  );
}
