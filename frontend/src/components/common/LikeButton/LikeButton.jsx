/*
 * @file            frontend/src/components/common/LikeButton/LikeButton.jsx
 * @description     点赞按钮组件，包含SVG心形图标和点赞计数
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-05 17:00:00
 * @lastModified    2026-03-05 17:00:00
 * Copyright © All rights reserved
*/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isFrontendLoggedIn } from '../../../utils/storage';
import { toggleLike } from '../../../api/panApi';
import './LikeButton.css';

/**
 * 点赞按钮组件
 * @param {Object} props 组件属性
 * @param {number} props.panId 排盘记录ID（必填）
 * @param {boolean} props.isLiked 是否已点赞
 * @param {number} props.likeCount 点赞数量
 * @param {Function} props.onLikeSuccess 点赞成功回调函数
 * @param {string} props.loginPath 登录页面路径
 * @param {string} props.className 自定义类名
 */
const LikeButton = ({
  panId,
  isLiked = false,
  likeCount = 0,
  onLikeSuccess,
  loginPath = '/login',
  className = ''
}) => {
  const navigate = useNavigate();
  const [localLiked, setLocalLiked] = useState(isLiked);
  const [localCount, setLocalCount] = useState(likeCount);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 处理点赞点击
  const handleClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    // 检查用户是否已登录
    if (!isFrontendLoggedIn()) {
      // 未登录用户跳转到登录页面，并记录当前页面路径以便登录后返回
      navigate(loginPath, { state: { from: window.location.pathname } });
      return;
    }

    // 检查是否有排盘ID
    if (!panId) {
      console.error('点赞失败：缺少排盘记录ID');
      return;
    }

    // 防止重复点击
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setIsAnimating(true);

    try {
      // 调用后端API进行点赞/取消点赞
      const response = await toggleLike(panId);
      
      if (response.code === 200 || response.success) {
        // 使用后端返回的最新数据
        const { is_liked, like_count } = response.data;
        setLocalLiked(is_liked);
        setLocalCount(like_count);
        
        // 调用成功回调
        if (onLikeSuccess) {
          onLikeSuccess(is_liked, like_count);
        }
      } else {
        // API返回错误，恢复原始状态
        console.error('点赞失败:', response.msg);
      }
    } catch (error) {
      console.error('点赞操作失败:', error);
      // 发生错误时不改变状态，保持原样
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
  };

  return (
    <div
      className={`like-button ${localLiked ? 'liked' : ''} ${isAnimating ? 'animating' : ''} ${isLoading ? 'loading' : ''} ${className}`}
      onClick={handleClick}
      title={isFrontendLoggedIn() ? (localLiked ? '取消点赞' : '点赞') : '请先登录'}
    >
      {/* SVG心形图标 */}
      <svg
        className="heart-icon"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="heart-path"
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* 点赞计数 */}
      <span className="like-count">{localCount}</span>
    </div>
  );
};

export default LikeButton;
