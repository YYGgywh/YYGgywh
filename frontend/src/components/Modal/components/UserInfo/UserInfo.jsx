/*
 * @file            frontend/src/components/Modal/components/UserInfo/UserInfo.jsx
 * @description     用户信息展示组件，包含头像、用户名和关注按钮
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-17 18:30:00
 * @lastModified    2026-03-24 16:14:11
 * Copyright © All rights reserved
*/

// 导入 React
import React, { useState, useEffect } from 'react';
// 导入样式文件
import desktopStyles from './UserInfo.desktop.module.css';
import mobileStyles from './UserInfo.mobile.module.css';
// 导入返回按钮图标
import goBackSvg from '../../../../assets/images/go back.svg';

// 用户信息组件，接收用户信息和配置参数作为 props
const UserInfo = ({ 
  userAvatar, // 用户头像 URL
  userNickname, // 用户昵称
  isFollowed = false, // 是否已关注，默认为 false
  onFollow, // 关注/取消关注回调函数
  onClose, // 关闭回调函数
  disabled = false, // 是否禁用关注按钮，默认为 false
  showAvatar = true, // 是否显示头像，默认为 true
  showUsername = true, // 是否显示用户名，默认为 true
  showFollowButton = true, // 是否显示关注按钮，默认为 true
  className = '', // 自定义类名
  variant = 'default' // 显示风格，默认为 'default'
}) => {
  // 移动端状态管理
  const [isMobile, setIsMobile] = useState(() => {
    return window.innerWidth < 768;
  });
  
  // 监听窗口大小变化，更新移动端状态
  useEffect(() => {
    const handleResize = () => {
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 100);
    };
    
    // 初始执行一次
    handleResize();
    // 添加窗口大小变化监听器
    window.addEventListener('resize', handleResize);
    // 组件卸载时移除监听器
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(window.resizeTimeout);
    };
  }, []);
  
  // 根据屏幕尺寸选择样式
  const styles = isMobile ? mobileStyles : desktopStyles;
  // 渲染组件
  return (
    <div className={`${styles.userInfoSection} ${styles[`userInfoSection${variant.charAt(0).toUpperCase() + variant.slice(1)}`]} ${className}`}>
      {/* 移动端返回按钮 */}
      {isMobile && onClose && (
        <button 
          className={styles.backButton}
          onClick={onClose}
          aria-label="关闭"
        >
          <img 
            src={goBackSvg} 
            alt="返回"
            className={styles.backIcon}
          />
        </button>
      )}
      
      {/* 条件渲染：如果 showAvatar 为 true，则显示头像 */}
      {showAvatar && (
        <div className={styles.userAvatar}>
          {/* 条件渲染：如果提供了 userAvatar，则显示头像图片 */}
          {userAvatar ? (
            <img 
              src={userAvatar} 
              alt={userNickname || '用户'} 
              className={styles.avatarImg}
            />
          ) : (
            /* 如果没有提供 userAvatar，则显示默认头像占位符 */
            <div className={styles.avatarPlaceholder}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="#999"/>
              </svg>
            </div>
          )}
        </div>
      )}
      
      {/* 条件渲染：如果 showUsername 为 true，则显示用户名 */}
      {showUsername && (
        <div className={styles.userDetails}>
          <span className={styles.userName}>
            {/* 显示用户昵称，如果没有则显示 '匿名用户' */}
            {userNickname || '匿名用户'}
          </span>
        </div>
      )}
      
      {/* 条件渲染：如果 showFollowButton 为 true 且提供了 onFollow 回调，则显示关注按钮 */}
      {showFollowButton && onFollow && (
        <button
          className={`${styles.followButton} ${isFollowed ? styles.followed : ''} ${disabled ? styles.disabled : ''}`}
          onClick={onFollow}
          disabled={disabled}
        >
          {/* 根据 isFollowed 状态显示不同的按钮文本 */}
          {isFollowed ? '已关注' : '关注'}
        </button>
      )}
    </div>
  );
};

// 设置组件的 displayName，便于在 React DevTools 中识别
UserInfo.displayName = 'UserInfo';
// 导出组件
export default UserInfo;