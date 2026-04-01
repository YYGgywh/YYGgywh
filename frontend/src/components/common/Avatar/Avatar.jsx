/*
 * @file            frontend/src/components/common/Avatar/Avatar.jsx
 * @description     统一的头像组件，支持自定义头像和默认头像
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-21 13:00:00
 * @lastModified    2026-03-26 11:56:48
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react';
import styles from './Avatar.desktop.module.css';
import mobileStyles from './Avatar.mobile.module.css';

const Avatar = ({ 
  src, 
  alt = '用户头像', 
  size = 'medium',
  nickname = '',
  className = '',
  onError 
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
  const currentStyles = isMobile ? mobileStyles : styles;
  
  const sizeClasses = {
    small: currentStyles.avatarSmall,
    medium: currentStyles.avatarMedium,
    large: currentStyles.avatarLarge,
    xlarge: currentStyles.avatarXLarge
  };

  const sizeClass = sizeClasses[size] || currentStyles.avatarMedium;

  // 生成基于昵称的默认头像
  const generateDefaultAvatar = () => {
    // 获取首字符
    let initial = 'U'; // 默认
    if (nickname && nickname.trim()) {
      const firstChar = nickname.trim()[0];
      initial = firstChar.toUpperCase();
    }

    // 生成颜色（基于昵称的哈希值）
    const getColorFromNickname = (name) => {
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      const hue = Math.abs(hash) % 360;
      return `hsl(${hue}, 70%, 60%)`;
    };

    const bgColor = getColorFromNickname(nickname || 'user');

    // 生成 SVG
    const svg = `
      <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="${bgColor}"/>
        <text x="20" y="27" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="white">${initial}</text>
      </svg>
    `;

    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  };

  const defaultAvatar = generateDefaultAvatar();

  const handleError = (e) => {
    e.target.src = defaultAvatar;
    if (onError) {
      onError(e);
    }
  };

  // 处理头像URL，将localhost地址替换为生产环境地址
  const processAvatarUrl = (url) => {
    if (!url) return defaultAvatar;
    
    // 检查是否包含localhost
    if (url.includes('localhost')) {
      // 替换为生产环境地址
      return url.replace('http://localhost:8000', 'http://115.191.48.226:8000');
    }
    return url;
  };

  const avatarSrc = processAvatarUrl(src) || defaultAvatar;

  return (
    <img 
      src={avatarSrc}
      alt={alt}
      className={`${currentStyles.avatar} ${sizeClass} ${className}`}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default Avatar;
