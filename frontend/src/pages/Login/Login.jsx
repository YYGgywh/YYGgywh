/*
 * @file            frontend/src/pages/Login/Login.jsx
 * @description     登录/注册页面组件
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-27 10:00:00
 * @lastModified    2026-03-16 20:02:49
 * Copyright © All rights reserved
*/

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Login.desktop.module.css';
import { sendCode, sendEmailCode, register, registerByEmail, login as loginApi } from '../../api/userApi';
import { validateForm } from '../../utils/validate';
import { setToken, setUserInfo } from '../../utils/storage';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('login'); // 'login' 或 'register'
  const [loginMethod, setLoginMethod] = useState('password'); // 'code' 或 'password'
  const [registerMethod, setRegisterMethod] = useState('phone'); // 'phone' 或 'email'
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    loginName: '',
    account: '',
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
    const validation = validateForm(formData, activeTab, registerMethod, loginMethod);
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
        let phone = null;
        let loginName = null;
        
        let email = null;
        
        if (loginMethod === 'password') {
          // 密码登录，根据输入内容判断类型
          const account = formData.account.trim();
          if (/^1[3-9]\d{9}$/.test(account)) {
            // 手机号
            phone = account;
          } else if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(account)) {
            // 邮箱
            email = account;
          } else {
            // 登录名
            loginName = account;
          }
        } else {
          // 验证码登录
          phone = formData.phone;
        }
        
        const response = await loginApi(
          phone,
          loginName,
          loginMethod === 'code' ? formData.code : null,
          loginMethod === 'password' ? formData.password : null,
          email
        );
        // 存储token和用户信息
        setToken(response.data.token);
        setUserInfo({
          id: response.data.user_id,
          user_id: response.data.user_id,
          phone: response.data.phone,
          login_name: response.data.login_name,
          nickname: response.data.nickname,
          avatar: response.data.avatar,
          email: response.data.email,
          role: response.data.role,
          create_time: response.data.create_time,
          update_time: response.data.update_time,
          last_login_time: response.data.last_login_time,
          last_login_ip: response.data.last_login_ip,
          login_count: response.data.login_count
        });
        // 如果有来源页面，登录后返回原页面；否则跳转到首页
        const from = location.state?.from || '/';
        navigate(from);
      }
    } catch (err) {
      setError(err.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <h2>{activeTab === 'login' ? '登录' : '注册'}</h2>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        {/* 切换标签 */}
        <div className={styles.tabButtons}>
          <button 
            className={activeTab === 'login' ? styles.active : ''}
            onClick={() => setActiveTab('login')}
          >
            登录
          </button>
          <button 
            className={activeTab === 'register' ? styles.active : ''}
            onClick={() => setActiveTab('register')}
          >
            注册
          </button>
        </div>

        {/* 注册方式切换 */}
        {activeTab === 'register' && (
          <div className={styles.loginMethod}>
            <button 
              className={registerMethod === 'phone' ? styles.active : ''}
              onClick={() => setRegisterMethod('phone')}
            >
              手机号注册
            </button>
            <button 
              className={registerMethod === 'email' ? styles.active : ''}
              onClick={() => setRegisterMethod('email')}
            >
              邮箱注册
            </button>
          </div>
        )}

        {/* 登录方式切换 */}
        {activeTab === 'login' && (
          <div className={styles.loginMethod}>
            <button 
              className={loginMethod === 'code' ? styles.active : ''}
              onClick={() => setLoginMethod('code')}
            >
              验证码登录
            </button>
            <button 
              className={loginMethod === 'password' ? styles.active : ''}
              onClick={() => setLoginMethod('password')}
            >
              密码登录
            </button>
          </div>
        )}

        {/* 表单 */}
        <form onSubmit={handleSubmit}>
          {/* 账号输入（手机号/邮箱/登录名） */}
          {activeTab === 'register' && registerMethod === 'email' ? (
            <div className={styles.formGroup}>
              <label htmlFor="email">邮箱号</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="请输入邮箱号"
                required
              />
            </div>
          ) : activeTab === 'login' && loginMethod === 'password' ? (
            <div className={styles.formGroup}>
              <label htmlFor="account">账号</label>
              <input
                type="text"
                id="account"
                name="account"
                value={formData.account}
                onChange={handleInputChange}
                placeholder="请输入手机号、邮箱或登录名"
                required
              />
            </div>
          ) : (
            <div className={styles.formGroup}>
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

          {/* 验证码输入 */}
          {activeTab === 'register' || loginMethod === 'code' ? (
            <div className={styles.formGroup}>
              <label htmlFor="code">验证码</label>
              <div className={styles.codeInput}>
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
                  className={styles.sendCode}
                  onClick={handleSendCode}
                  disabled={countdown > 0 || loading || !(activeTab === 'register' && registerMethod === 'email' ? /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email) : /^1[3-9]\d{9}$/.test(formData.phone))}
                >
                  {countdown > 0 ? `${countdown}秒后重发` : '发送验证码'}
                </button>
              </div>
            </div>
          ) : null}


          {/* 登录名输入（仅注册时显示） */}
          {activeTab === 'register' && (
            <div className={styles.formGroup}>
              <label htmlFor="loginName">登录名</label>
              <input
                type="text"
                id="loginName"
                name="loginName"
                value={formData.loginName}
                onChange={handleInputChange}
                placeholder="4-20字符，允许字母、数字和下划线"
              />
            </div>
          )}
          {/* 密码输入（注册或密码登录时显示） */}
          {(activeTab === 'register' || loginMethod === 'password') && (
            <div className={styles.formGroup}>
              <label htmlFor="password">密码</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={activeTab === 'register' ? '至少6位，允许字母、数字和下划线' : '请输入密码'}
                required
              />
            </div>
          )}

          {activeTab === 'register' && (
            <div className={`${styles.formGroup} ${styles.agreement}`}>
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
            className={styles.submitBtn}
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
