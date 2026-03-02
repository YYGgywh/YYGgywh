/*
 * @file            frontend/src/pages/User/UserCenter.jsx
 * @description     用户中心页面组件
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-27 10:00:00
 * @lastModified    2026-03-01 17:18:47
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserCenter.css';
import Navigation from '../../components/Header/Navigation/Navigation';
import { listPan } from '../../api/panApi';
import { isLoggedIn, removeToken, getUserInfo, setUserInfo as saveUserInfo } from '../../utils/storage';
import { updateUserInfo, uploadAvatar, getNicknameLimitInfo, getLoginNameLimitInfo, updateLoginName } from '../../api/userApi';

const UserCenter = () => {
  const navigate = useNavigate();
  const [panRecords, setPanRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [userInfo, setUserInfo] = useState(null);
  const [editingNickname, setEditingNickname] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [editingLoginName, setEditingLoginName] = useState(false);
  const [newLoginName, setNewLoginName] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [nicknameLimitInfo, setNicknameLimitInfo] = useState(null);
  const [loginNameLimitInfo, setLoginNameLimitInfo] = useState(null);

  // 检查登录状态
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    const user = getUserInfo();
    if (user) {
      setUserInfo(user);
      if (user.nickname) {
        setNewNickname(user.nickname);
      }
      if (user.login_name) {
        setNewLoginName(user.login_name);
      }
      // 获取昵称修改限制信息
      fetchNicknameLimitInfo();
      // 获取登录名修改限制信息
      fetchLoginNameLimitInfo();
    }
  }, [navigate]);

  const fetchNicknameLimitInfo = async () => {
    try {
      const response = await getNicknameLimitInfo();
      setNicknameLimitInfo(response.data);
    } catch (err) {
      console.error('获取昵称修改限制信息失败:', err);
    }
  };

  const fetchLoginNameLimitInfo = async () => {
    try {
      const response = await getLoginNameLimitInfo();
      setLoginNameLimitInfo(response.data);
    } catch (err) {
      console.error('获取登录名修改限制信息失败:', err);
    }
  };

  // 获取排盘记录
  useEffect(() => {
    if (isLoggedIn()) {
      fetchPanRecords();
    }
  }, [currentPage, pageSize]);

  const fetchPanRecords = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await listPan('liuyao', currentPage, pageSize);
      setPanRecords(response.data);
      // 计算总页数（假设后端返回总记录数，这里简化处理
      setTotalPages(Math.ceil(response.data.length / pageSize));
    } catch (err) {
      setError(err.message || '获取排盘记录失败');
      setPanRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  const handleNicknameEdit = () => {
    setEditingNickname(true);
  };

  const handleNicknameSave = async () => {
    try {
      const response = await updateUserInfo({
        nickname: newNickname
      });
      // 更新本地用户信息
      const updatedUserInfo = {
        ...userInfo,
        nickname: newNickname
      };
      setUserInfo(updatedUserInfo);
      saveUserInfo(updatedUserInfo);
      setEditingNickname(false);
      // 更新昵称修改限制信息
      fetchNicknameLimitInfo();
    } catch (err) {
      setError(err.message || '修改昵称失败');
    }
  };

  const handleNicknameCancel = () => {
    setNewNickname(userInfo.nickname);
    setEditingNickname(false);
  };

  const handleLoginNameEdit = () => {
    setEditingLoginName(true);
  };

  const handleLoginNameSave = async () => {
    try {
      const response = await updateLoginName(newLoginName);
      // 更新本地用户信息
      const updatedUserInfo = {
        ...userInfo,
        login_name: newLoginName
      };
      setUserInfo(updatedUserInfo);
      saveUserInfo(updatedUserInfo);
      setEditingLoginName(false);
      // 更新登录名修改限制信息
      fetchLoginNameLimitInfo();
    } catch (err) {
      setError(err.message || '修改登录名失败');
    }
  };

  const handleLoginNameCancel = () => {
    setNewLoginName(userInfo.login_name);
    setEditingLoginName(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const handleAvatarUpload = async () => {
    try {
      const response = await uploadAvatar(avatarFile);
      // 更新本地用户信息
      const updatedUserInfo = {
        ...userInfo,
        avatar: response.data.avatar
      };
      setUserInfo(updatedUserInfo);
      saveUserInfo(updatedUserInfo);
      setAvatarFile(null);
    } catch (err) {
      setError(err.message || '头像上传失败');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('zh-CN');
  };

  return (
    <div className="user-center-container">
      <header className="user-header">
        <Navigation />
      </header>
      <main className="user-main">
        <div className="user-content">
          <div className="user-header-info">
            <h2>用户中心</h2>
            {userInfo && (
              <div className="user-details">
                {/* 用户头像 */}
                <div className="user-avatar">
                  {userInfo.avatar ? (
                    <img 
                      src={userInfo.avatar} 
                      alt="用户头像" 
                      className="avatar-img"
                    />
                  ) : (
                    <div className="default-avatar avatar-img">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="8" r="4" fill="#ccc"/>
                        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="#ccc" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                  )}
                  <div className="avatar-actions">
                    <input 
                      type="file" 
                      id="avatarInput" 
                      accept="image/*"
                      onChange={handleAvatarChange}
                      style={{ display: 'none' }}
                    />
                    <button 
                      className="avatar-upload-btn"
                      onClick={() => document.getElementById('avatarInput').click()}
                    >
                      更换头像
                    </button>
                    {avatarFile && (
                      <button 
                        className="avatar-save-btn"
                        onClick={handleAvatarUpload}
                      >
                        保存头像
                      </button>
                    )}
                  </div>
                </div>
                
                {/* 用户昵称 */}
                <div className="user-nickname">
                  <label>昵称：</label>
                  {editingNickname ? (
                    <div className="nickname-edit">
                      <input
                        type="text"
                        value={newNickname}
                        onChange={(e) => setNewNickname(e.target.value)}
                        className="nickname-input"
                        maxLength="20"
                      />
                      <button className="save-btn" onClick={handleNicknameSave}>
                        保存
                      </button>
                      <button className="cancel-btn" onClick={handleNicknameCancel}>
                        取消
                      </button>
                    </div>
                  ) : (
                    <div className="nickname-display">
                      <span className="nickname-text">{userInfo.nickname}</span>
                      <button 
                        className="edit-btn" 
                        onClick={handleNicknameEdit}
                        disabled={nicknameLimitInfo?.remaining_count === 0}
                      >
                        修改
                      </button>
                    </div>
                  )}
                  {/* 昵称修改限制信息 */}
                  {nicknameLimitInfo && (
                    <div className="nickname-limit-info">
                      <span className={`limit-text ${nicknameLimitInfo.remaining_count === 0 ? 'limit-exceeded' : ''}`}>
                        年度修改次数：{nicknameLimitInfo.nickname_modify_count}/12次
                        {nicknameLimitInfo.remaining_count === 0 && '（已达上限）'}
                      </span>
                      <span className="remaining-count">
                        剩余次数：{nicknameLimitInfo.remaining_count}次
                      </span>
                    </div>
                  )}
                </div>
                
                {/* 用户信息 */}
                <div className="user-info">
                  <span className="user-phone">手机号：{userInfo.phone}</span>
                  {userInfo.email && (
                    <span className="user-email">邮箱：{userInfo.email}</span>
                  )}
                  <div className="user-login-name">
                    <label>登录名：</label>
                    {editingLoginName ? (
                      <div className="login-name-edit">
                        <input
                          type="text"
                          value={newLoginName}
                          onChange={(e) => setNewLoginName(e.target.value)}
                          className="login-name-input"
                          maxLength="20"
                        />
                        <button className="save-btn" onClick={handleLoginNameSave}>
                          保存
                        </button>
                        <button className="cancel-btn" onClick={handleLoginNameCancel}>
                          取消
                        </button>
                      </div>
                    ) : (
                      <div className="login-name-display">
                        <span className="login-name-text">{userInfo.login_name}</span>
                        <button 
                          className="edit-btn" 
                          onClick={handleLoginNameEdit}
                          disabled={loginNameLimitInfo?.remaining_count === 0}
                        >
                          修改
                        </button>
                      </div>
                    )}
                    {/* 登录名修改限制信息 */}
                    {loginNameLimitInfo && (
                      <div className="login-name-limit-info">
                        <span className={`limit-text ${loginNameLimitInfo.remaining_count === 0 ? 'limit-exceeded' : ''}`}>
                          年度修改次数：{loginNameLimitInfo.login_name_modify_count}/4次
                          {loginNameLimitInfo.remaining_count === 0 && '（已达上限）'}
                        </span>
                        <span className="remaining-count">
                          剩余次数：{loginNameLimitInfo.remaining_count}次
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <button className="logout-btn" onClick={handleLogout}>
                  退出登录
                </button>
              </div>
              )}
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <section className="pan-records">
            <h3>排盘记录</h3>
            {loading ? (
              <div className="loading">加载中...</div>
            ) : panRecords.length === 0 ? (
              <div className="no-records">暂无排盘记录</div>
            ) : (
              <div className="records-list">
                {panRecords.map(record => (
                  <div key={record.id} className="record-item">
                    <div className="record-header">
                      <span className="record-type">{record.pan_type === 'liuyao' ? '六爻' : record.pan_type}</span>
                      <span className="record-time">{formatTime(record.create_time)}</span>
                    </div>
                    <div className="record-content">
                      <div className="record-result">
                        卦象：{record.pan_result.gua || '未知'} {record.pan_result.yao || ''}
                      </div>
                      {record.supplement && (
                        <div className="record-supplement">
                          补充说明：{record.supplement}
                        </div>
                      )}
                      <div className="record-actions">
                        <button className="action-btn">查看详情</button>
                        <button className="action-btn">评论({record.comment_count || 0})</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* 分页 */}
            <div className="pagination">
              <button 
                className="page-btn" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                上一页
              </button>
              <span className="page-info">
                第 {currentPage} 页，共 {totalPages} 页
              </span>
              <button 
                className="page-btn" 
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                下一页
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default UserCenter;
