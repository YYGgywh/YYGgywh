/*
 * @file            frontend/src/utils/avatarUtils.js
 * @description     头像工具函数，提供默认头像生成等功能
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-21 18:30:00
 * @lastModified    2026-03-21 18:30:00
 * Copyright © All rights reserved
*/

/**
 * 生成基于昵称的默认头像
 * @param {string} nickname - 用户昵称
 * @returns {string} - Base64编码的SVG头像
 */
export const generateDefaultAvatar = (nickname = '') => {
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

/**
 * 获取用户头像，优先使用自定义头像，否则使用默认头像
 * @param {string} avatarUrl - 用户自定义头像URL
 * @param {string} nickname - 用户昵称
 * @returns {string} - 头像URL
 */
export const getUserAvatar = (avatarUrl, nickname = '') => {
  if (avatarUrl && avatarUrl.trim()) {
    return avatarUrl;
  }
  return generateDefaultAvatar(nickname);
};
