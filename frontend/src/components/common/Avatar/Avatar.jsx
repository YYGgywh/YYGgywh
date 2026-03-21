/*
 * @file            frontend/src/components/common/Avatar/Avatar.jsx
 * @description     统一的头像组件，支持自定义头像和默认头像
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-21 13:00:00
 * @lastModified    2026-03-21 13:37:01
 * Copyright © All rights reserved
*/

import React from 'react';
import styles from './Avatar.module.css';

const Avatar = ({ 
  src, 
  alt = '用户头像', 
  size = 'medium',
  nickname = '',
  className = '',
  onError 
}) => {
  const sizeClasses = {
    small: styles.avatarSmall,
    medium: styles.avatarMedium,
    large: styles.avatarLarge,
    xlarge: styles.avatarXLarge
  };

  const sizeClass = sizeClasses[size] || styles.avatarMedium;

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

  const avatarSrc = src || defaultAvatar;

  return (
    <img 
      src={avatarSrc}
      alt={alt}
      className={`${styles.avatar} ${sizeClass} ${className}`}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default Avatar;
