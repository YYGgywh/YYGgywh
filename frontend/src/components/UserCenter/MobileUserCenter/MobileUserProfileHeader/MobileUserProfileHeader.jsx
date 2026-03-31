/*
 * @file            frontend/src/components/UserCenter/MobileUserCenter/MobileUserProfileHeader/MobileUserProfileHeader.jsx
 * @description     移动端用户中心个人信息头部组件，包含头像上传、个人信息展示和数据统计
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-30 12:55:00
 * @lastModified    2026-03-30 17:18:11
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './MobileUserProfileHeader.desktop.module.css';
import mobileStyles from './MobileUserProfileHeader.mobile.module.css';
import StatsSection from '../StatsSection/StatsSection.jsx';
import Avatar from '../../../common/Avatar/Avatar.jsx';

/**
 * 移动端用户中心个人信息头部组件
 * 包含头像上传、个人信息展示、数据统计等功能
 * 
 * @param {Object} props 组件属性
 * @param {Object} props.userInfo 用户信息
 * @param {Function} props.onAvatarUpload 头像上传回调
 * @param {Function} props.onProfileUpdate 个人信息更新回调
 * @returns {JSX.Element} 个人信息头部组件
 */
const MobileUserProfileHeader = ({ 
  userInfo = {}, 
  onAvatarUpload, 
  onProfileUpdate 
}) => {
  // 移动端状态管理
  const [isMobile, setIsMobile] = useState(() => {
    return window.innerWidth < 768;
  });
  
  // 本地状态
  const [avatarFile, setAvatarFile] = useState(null);
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState((userInfo?.bio) || '点击添加介绍，让大家认识你...');
  
  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 100);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(window.resizeTimeout);
    };
  }, []);
  
  // 监听 userInfo 变化
  useEffect(() => {
    setBio((userInfo?.bio) || '点击添加介绍，让大家认识你...');
  }, [userInfo]);
  
  // 根据屏幕尺寸选择样式
  const currentStyles = isMobile ? mobileStyles : styles;
  
  // 处理头像选择
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      if (onAvatarUpload) {
        onAvatarUpload(file);
      }
    }
  };
  
  // 处理简介编辑
  const handleBioClick = () => {
    setEditingBio(true);
  };
  
  const handleBioSave = () => {
    if (onProfileUpdate) {
      onProfileUpdate({ bio });
    }
    setEditingBio(false);
  };
  
  // 处理简介取消
  const handleBioCancel = () => {
    setBio(userInfo.bio || '点击添加介绍，让大家认识你...');
    setEditingBio(false);
  };
  
  return (
    <div className={currentStyles.userProfileHeader}>
      {/* 汉堡菜单 */}
      <div className={currentStyles.menuSection}>
        <svg className={currentStyles.menuIcon} viewBox="0 0 1024 1024" width="24" height="24">
          <path d="M736 352H288a32 32 0 1 1 0-64h448a32 32 0 0 1 0 64z m0 192H288a32 32 0 1 1 0-64h448a32 32 0 0 1 0 64z m0 192H288a32 32 0 0 1 0-64h448a32 32 0 0 1 0 64z" fill="#202425"></path>
        </svg>
      </div>
      
      {/* 头像区域 */}
      <div className={currentStyles.avatarSection}>
        <div className={currentStyles.avatarContainer}>
          <div className={currentStyles.avatarWrapper}>
            <Avatar 
              src={userInfo?.avatar}
              alt="用户头像"
              size="large"
              nickname={userInfo?.nickname || userInfo?.login_name}
              className={currentStyles.avatar}
            />
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleAvatarChange}
              className={currentStyles.avatarInput}
            />
            <div className={currentStyles.avatarUploadOverlay}>
              <span className={currentStyles.avatarUploadText}>上传头像</span>
            </div>
          </div>
        </div>
        
        {/* 个人信息 */}
        <div className={currentStyles.userInfo}>
          <h2 className={currentStyles.nickname}>{userInfo?.nickname || '昵称'}</h2>
          <p className={currentStyles.loginName}>登录名: {userInfo?.login_name || '未设置'}</p>
        </div>
      </div>
      
      {/* 数据统计和操作区域 */}
      <div className={currentStyles.statsAndActionSection}>
        {/* 数据统计 */}
        <StatsSection 
          stats={{
            likes: userInfo?.likes || 0,
            mutualFollows: userInfo?.mutual_follows || 0,
            follows: userInfo?.follows || 0,
            followers: userInfo?.followers || 0
          }} 
        />
        
        {/* 编辑主页按钮 */}
        <div className={currentStyles.actionSection}>
          <button className={currentStyles.editButton}>
            编辑主页
          </button>
        </div>
      </div>
      
      {/* 个人简介 */}
      <div className={currentStyles.bioSection}>
        {editingBio ? (
          <div className={currentStyles.bioEdit}>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={currentStyles.bioTextarea}
              placeholder="添加个人介绍..."
              maxLength={150}
            />
            <div className={currentStyles.bioEditActions}>
              <button 
                className={currentStyles.bioCancelButton}
                onClick={handleBioCancel}
              >
                取消
              </button>
              <button 
                className={currentStyles.bioSaveButton}
                onClick={handleBioSave}
              >
                保存
              </button>
            </div>
          </div>
        ) : (
          <p 
            className={currentStyles.bioText}
            onClick={handleBioClick}
          >
            {bio}
          </p>
        )}
      </div>
      
      {/* 性别年龄和所在地 */}
      <div className={currentStyles.infoSection}>
        <div className={currentStyles.infoItem}>
          <span className={currentStyles.infoLabel}>
            {userInfo?.gender === 'male' ? '男' : '女'}
            {userInfo?.age ? `-${userInfo.age}岁` : ''}
          </span>
        </div>
        <div className={currentStyles.infoItem}>
          <button className={currentStyles.locationButton}>
            添加所在地等标签
          </button>
        </div>
      </div>
    </div>
  );
};

// PropTypes 类型定义
MobileUserProfileHeader.propTypes = {
  userInfo: PropTypes.object,
  onAvatarUpload: PropTypes.func,
  onProfileUpdate: PropTypes.func
};

// 组件显示名称
MobileUserProfileHeader.displayName = 'MobileUserProfileHeader';

export default MobileUserProfileHeader;