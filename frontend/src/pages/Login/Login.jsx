/*
 * @file            frontend/src/pages/Login/Login.jsx
 * @description     登录/注册页面组件
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-27 10:00:00
 * @lastModified    2026-02-28 18:00:00
 * Copyright © All rights reserved
*/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { sendCode, sendEmailCode, register, registerByEmail, login as loginApi } from '../../api/userApi';
import { validateForm } from '../../utils/validate';
import { setToken, setUserInfo } from '../../utils/storage';

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login'); // 'login' 或 'register'
  const [loginMethod, setLoginMethod] = useState('code'); // 'code' 或 'password'
  const [registerMethod, setRegisterMethod] = useState('phone'); // 'phone' 或 'email'
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    loginName: '',
    code: '',
    password: ''
  });
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreement, setAgreement] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSendCode = async () => {
    // 验证手机号或邮箱
    if (activeTab === 'register' && registerMethod === 'email') {
      if (!formData.email) {
        setError('请输入邮箱');
        return;
      }
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
        setError('请输入正确的邮箱');
        return;
      }
    } else {
      if (!formData.phone) {
        setError('请输入手机号');
        return;
      }
      if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
        setError('请输入正确的手机号');
        return;
      }
    }

    try {
      setLoading(true);
      if (activeTab === 'register' && registerMethod === 'email') {
        await sendEmailCode(formData.email);
      } else {
        await sendCode(formData.phone);
      }
      // 开始倒计时
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err.message || '发送验证码失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 验证表单
    const validation = validateForm(formData, activeTab, registerMethod);
    if (!validation.isValid) {
      setError(Object.values(validation.errors)[0]);
      return;
    }

    // 注册时需要同意协议
    if (activeTab === 'register' && !agreement) {
      setError('请阅读并同意用户隐私协议');
      return;
    }

    try {
      setLoading(true);
      if (activeTab === 'register') {
        // 注册
        if (registerMethod === 'phone') {
          await register(formData.phone, formData.code, formData.password, formData.loginName);
        } else {
          await registerByEmail(formData.email, formData.code, formData.password, formData.loginName);
        }
        alert('注册成功，请登录');
        setActiveTab('login');
      } else {
        // 登录
        const response = await loginApi(
          formData.phone,
          formData.loginName,
          loginMethod === 'code' ? formData.code : null,
          loginMethod === 'password' ? formData.password : null
        );
        // 存储token和用户信息
        setToken(response.data.token);
        setUserInfo({
          user_id: response.data.user_id,
          phone: response.data.phone,
          login_name: response.data.login_name,
          nickname: response.data.nickname,
          avatar: response.data.avatar,
          email: response.data.email
        });
        // 跳转到用户中心
        navigate('/user');
      }
    } catch (err) {
      setError(err.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>{activeTab === 'login' ? '登录' : '注册'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        {/* 切换标签 */}
        <div className="tab-buttons">
          <button 
            className={activeTab === 'login' ? 'active' : ''}
            onClick={() => setActiveTab('login')}
          >
            登录
          </button>
          <button 
            className={activeTab === 'register' ? 'active' : ''}
            onClick={() => setActiveTab('register')}
          >
            注册
          </button>
        </div>

        {/* 注册方式切换 */}
        {activeTab === 'register' && (
          <div className="register-method">
            <button 
              className={registerMethod === 'phone' ? 'active' : ''}
              onClick={() => setRegisterMethod('phone')}
            >
              手机号注册
            </button>
            <button 
              className={registerMethod === 'email' ? 'active' : ''}
              onClick={() => setRegisterMethod('email')}
            >
              邮箱注册
            </button>
          </div>
        )}

        {/* 登录方式切换 */}
        {activeTab === 'login' && (
          <div className="login-method">
            <button 
              className={loginMethod === 'code' ? 'active' : ''}
              onClick={() => setLoginMethod('code')}
            >
              验证码登录
            </button>
            <button 
              className={loginMethod === 'password' ? 'active' : ''}
              onClick={() => setLoginMethod('password')}
            >
              密码登录
            </button>
          </div>
        )}

        {/* 表单 */}
        <form onSubmit={handleSubmit}>
          {/* 手机号或邮箱输入 */}
          {activeTab === 'register' && registerMethod === 'email' ? (
            <div className="form-group">
              <label htmlFor="email">邮箱</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="请输入邮箱"
                required
              />
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="phone">手机号</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="请输入手机号"
                required
              />
            </div>
          )}

          {/* 登录名输入（仅注册时显示） */}
          {activeTab === 'register' && (
            <div className="form-group">
              <label htmlFor="loginName">登录名（可选）</label>
              <input
                type="text"
                id="loginName"
                name="loginName"
                value={formData.loginName}
                onChange={handleInputChange}
                placeholder="请输入登录名（4-20字符）"
              />
            </div>
          )}

          {/* 验证码输入 */}
          {activeTab === 'register' || loginMethod === 'code' ? (
            <div className="form-group">
              <label htmlFor="code">验证码</label>
              <div className="code-input">
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="请输入验证码"
                  required
                />
                <button 
                  type="button" 
                  className="send-code"
                  onClick={handleSendCode}
                  disabled={countdown > 0 || loading}
                >
                  {countdown > 0 ? `${countdown}秒后重发` : '发送验证码'}
                </button>
              </div>
            </div>
          ) : null}

          {/* 密码输入 */}
          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={activeTab === 'register' ? '请设置密码（至少6位，允许字母、数字和下划线）' : '请输入密码'}
              required
            />
          </div>

          {activeTab === 'register' && (
            <div className="form-group agreement">
              <input 
                type="checkbox" 
                id="agreement" 
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)}
                required 
              />
              <label htmlFor="agreement">我已阅读并同意用户隐私协议</label>
            </div>
          )}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? '处理中...' : (activeTab === 'login' ? '登录' : '注册')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
