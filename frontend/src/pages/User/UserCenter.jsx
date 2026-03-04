/*
 * @file            frontend/src/pages/User/UserCenter.jsx
 * @description     用户中心页面组件，重构后采用两栏布局结构
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-27 10:00:00
 * @lastModified    2026-03-03 20:58:00
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserCenter.css';
import Navigation from '../../components/Header/Navigation/Navigation';
import {
  UserCenterLayout,
  SidebarNav,
  MainContentArea,
  UserProfileContent,
  PanRecordsContent,
  UserIcon,
  RecordIcon
} from '../../components/UserCenter';
import { listPan } from '../../api/panApi';
import { isLoggedIn, removeToken, getUserInfo, setUserInfo as saveUserInfo } from '../../utils/storage';
import {
  updateUserInfo,
  uploadAvatar,
  getNicknameLimitInfo,
  getLoginNameLimitInfo,
  updateLoginName
} from '../../api/userApi';
import PanRecordDetail from '../../components/PanRecordDetail';
import { panTypeToChinese } from '../../utils/methodMapping';

// 导航项配置
const NAV_ITEMS = [
  { id: 'userCenter', label: '用户中心', icon: UserIcon },
  { id: 'panRecords', label: '排盘记录', icon: RecordIcon }
];

const UserCenter = () => {
  const navigate = useNavigate();

  // 导航状态
  const [activeNav, setActiveNav] = useState('userCenter');

  // 用户数据状态
  const [userInfo, setUserInfo] = useState(null);
  const [panRecords, setPanRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // 编辑状态
  const [editingNickname, setEditingNickname] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [editingLoginName, setEditingLoginName] = useState(false);
  const [newLoginName, setNewLoginName] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);

  // 限制信息状态
  const [nicknameLimitInfo, setNicknameLimitInfo] = useState(null);
  const [loginNameLimitInfo, setLoginNameLimitInfo] = useState(null);

  // 详情弹窗状态
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  // 检查登录状态并初始化
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    const user = getUserInfo();
    if (user) {
      setUserInfo(user);
      setNewNickname(user.nickname || '');
      setNewLoginName(user.login_name || '');
      fetchNicknameLimitInfo();
      fetchLoginNameLimitInfo();
    }
  }, [navigate]);

  // 获取排盘记录
  useEffect(() => {
    if (isLoggedIn()) {
      fetchPanRecords();
    }
  }, [currentPage, pageSize]);

  // 获取昵称限制信息
  const fetchNicknameLimitInfo = async () => {
    try {
      const response = await getNicknameLimitInfo();
      setNicknameLimitInfo(response.data);
    } catch (err) {
      console.error('获取昵称修改限制信息失败:', err);
    }
  };

  // 获取登录名限制信息
  const fetchLoginNameLimitInfo = async () => {
    try {
      const response = await getLoginNameLimitInfo();
      setLoginNameLimitInfo(response.data);
    } catch (err) {
      console.error('获取登录名修改限制信息失败:', err);
    }
  };

  // 获取排盘记录
  const fetchPanRecords = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await listPan('liuyao', currentPage, pageSize);
      setPanRecords(response.data);
      setTotalPages(Math.ceil(response.data.length / pageSize) || 1);
    } catch (err) {
      setError(err.message || '获取排盘记录失败');
      setPanRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // 退出登录
  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  // 昵称编辑处理
  const handleNicknameEdit = () => setEditingNickname(true);
  const handleNicknameCancel = () => {
    setNewNickname(userInfo?.nickname || '');
    setEditingNickname(false);
  };
  const handleNicknameSave = async () => {
    try {
      await updateUserInfo({ nickname: newNickname });
      const updatedUserInfo = { ...userInfo, nickname: newNickname };
      setUserInfo(updatedUserInfo);
      saveUserInfo(updatedUserInfo);
      setEditingNickname(false);
      fetchNicknameLimitInfo();
    } catch (err) {
      setError(err.message || '修改昵称失败');
    }
  };

  // 登录名编辑处理
  const handleLoginNameEdit = () => setEditingLoginName(true);
  const handleLoginNameCancel = () => {
    setNewLoginName(userInfo?.login_name || '');
    setEditingLoginName(false);
  };
  const handleLoginNameSave = async () => {
    try {
      await updateLoginName(newLoginName);
      const updatedUserInfo = { ...userInfo, login_name: newLoginName };
      setUserInfo(updatedUserInfo);
      saveUserInfo(updatedUserInfo);
      setEditingLoginName(false);
      fetchLoginNameLimitInfo();
    } catch (err) {
      setError(err.message || '修改登录名失败');
    }
  };

  // 头像处理
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) setAvatarFile(file);
  };
  const handleAvatarUpload = async () => {
    try {
      const response = await uploadAvatar(avatarFile);
      const updatedUserInfo = { ...userInfo, avatar: response.data.avatar };
      setUserInfo(updatedUserInfo);
      saveUserInfo(updatedUserInfo);
      setAvatarFile(null);
    } catch (err) {
      setError(err.message || '头像上传失败');
    }
  };

  // 排盘记录处理
  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setShowDetail(true);
  };
  const handleRecordUpdate = (updatedRecord) => {
    setPanRecords(prev =>
      prev.map(record => (record.id === updatedRecord.id ? updatedRecord : record))
    );
  };
  const handleRecordDelete = (recordId) => {
    setPanRecords(prev => prev.filter(record => record.id !== recordId));
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 时间格式化
  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString('zh-CN');
  };

  // 处理用户信息更新
  const handleUserInfoUpdate = (updatedUserInfo) => {
    setUserInfo(updatedUserInfo);
    saveUserInfo(updatedUserInfo);
  };

  // 渲染内容区域
  const renderContent = () => {
    switch (activeNav) {
      case 'userCenter':
        return (
          <UserProfileContent
            userInfo={userInfo}
            editingNickname={editingNickname}
            editingLoginName={editingLoginName}
            newNickname={newNickname}
            newLoginName={newLoginName}
            nicknameLimitInfo={nicknameLimitInfo}
            loginNameLimitInfo={loginNameLimitInfo}
            avatarFile={avatarFile}
            onNicknameEdit={handleNicknameEdit}
            onNicknameSave={handleNicknameSave}
            onNicknameCancel={handleNicknameCancel}
            onLoginNameEdit={handleLoginNameEdit}
            onLoginNameSave={handleLoginNameSave}
            onLoginNameCancel={handleLoginNameCancel}
            onNicknameChange={setNewNickname}
            onLoginNameChange={setNewLoginName}
            onAvatarChange={handleAvatarChange}
            onAvatarUpload={handleAvatarUpload}
            onUserInfoUpdate={handleUserInfoUpdate}
          />
        );
      case 'panRecords':
        return (
          <PanRecordsContent
            records={panRecords}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onViewDetail={handleViewDetail}
            formatTime={formatTime}
            panTypeToChinese={panTypeToChinese}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="user-center-page">
      <header className="user-center-header">
        <Navigation />
      </header>

      <div className="user-center-body">
        <UserCenterLayout
          sidebar={
            <SidebarNav
              items={NAV_ITEMS}
              activeId={activeNav}
              onNavClick={setActiveNav}
              onLogout={handleLogout}
            />
          }
          mainContent={
            <MainContentArea>
              {error && <div className="user-center-error">{error}</div>}
              {renderContent()}
            </MainContentArea>
          }
        />
      </div>

      {/* 排盘详情弹窗 */}
      {showDetail && selectedRecord && (
        <PanRecordDetail
          record={selectedRecord}
          onClose={() => setShowDetail(false)}
          onUpdate={handleRecordUpdate}
          onDelete={handleRecordDelete}
        />
      )}
    </div>
  );
};

export default UserCenter;
