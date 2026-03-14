/*
 * @file            frontend/src/components/common/LikeButton/LikeButton.jsx
 * @description     点赞按钮组件，包含SVG心形图标和点赞计数
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-05 17:00:00
 * @lastModified    2026-03-07 14:29:04
 * Copyright © All rights reserved
*/

// 导入React核心库和useState钩子
import React, { useState } from 'react';
// 导入useNavigate钩子，用于页面跳转
import { useNavigate } from 'react-router-dom';
// 导入存储工具函数，用于检查用户是否已登录
import { isFrontendLoggedIn } from '../../../utils/storage';
// 导入API函数，用于处理点赞操作
import { toggleLike } from '../../../api/panApi';
// 导入CSS Modules样式文件（桌面端）
import styles from './LikeButton.desktop.module.css';

/*
 * 点赞按钮组件
 * @param {Object} props 组件属性
 * @param {number} props.panId 排盘记录ID（必填）
 * @param {boolean} props.isLiked 是否已点赞
 * @param {number} props.likeCount 点赞数量
 * @param {Function} props.onLikeSuccess 点赞成功回调函数
 * @param {string} props.loginPath 登录页面路径
 * @param {string} props.className 自定义类名
 * @returns {JSX.Element} 点赞按钮组件
 */
const LikeButton = ({
  panId,              // 排盘记录ID，用于后端API调用
  isLiked = false,    // 是否已点赞，默认值为false
  likeCount = 0,      // 点赞数量，默认值为0
  onLikeSuccess,      // 点赞成功后的回调函数
  loginPath = '/login', // 登录页面路径，默认值为'/login'
  className = ''      // 自定义类名，用于外部样式覆盖
}) => {
  // 获取导航对象，用于页面跳转
  const navigate = useNavigate();
  
  // 本地状态管理
  const [localLiked, setLocalLiked] = useState(isLiked);     // 本地点赞状态
  const [localCount, setLocalCount] = useState(likeCount);   // 本地点赞计数
  const [isAnimating, setIsAnimating] = useState(false);     // 动画状态
  const [isLoading, setIsLoading] = useState(false);         // 加载状态

  /*
   * 处理点赞点击事件
   * @param {Event} e 点击事件对象
   * @async 异步函数，因为需要调用API
   */
  const handleClick = async (e) => {
    // 阻止事件冒泡，避免触发父元素的点击事件
    e.stopPropagation();
    // 阻止默认行为，避免页面刷新
    e.preventDefault();

    // 检查用户是否已登录
    if (!isFrontendLoggedIn()) {
      // 未登录用户跳转到登录页面，并记录当前页面路径以便登录后返回
      navigate(loginPath, { state: { from: window.location.pathname } });
      return;
    }

    // 检查是否有排盘ID
    if (!panId) {
      // 缺少排盘ID时，输出错误信息并返回
      console.error('点赞失败：缺少排盘记录ID');
      return;
    }

    // 防止重复点击（加载状态时不处理点击）
    if (isLoading) {
      return;
    }

    // 设置加载状态
    setIsLoading(true);
    // 设置动画状态，触发点赞动画
    setIsAnimating(true);

    try {
      // 调用后端API进行点赞/取消点赞操作
      const response = await toggleLike(panId);
      
      // 检查API返回是否成功
      if (response.code === 200 || response.success) {
        // 从API响应中获取最新的点赞状态和数量
        const { is_liked, like_count } = response.data;
        // 更新本地状态
        setLocalLiked(is_liked);
        setLocalCount(like_count);
        
        // 如果提供了成功回调函数，调用它并传递最新状态
        if (onLikeSuccess) {
          onLikeSuccess(is_liked, like_count);
        }
      } else {
        // API返回错误，输出错误信息
        console.error('点赞失败:', response.msg);
        // 注意：这里不恢复状态，保持用户界面的即时反馈
      }
    } catch (error) {
      // 捕获API调用过程中的错误
      console.error('点赞操作失败:', error);
      // 发生错误时不改变状态，保持原样
    } finally {
      // 无论成功失败，都结束加载状态
      setIsLoading(false);
      // 300毫秒后结束动画状态（与CSS动画时长一致）
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      
      // 清除定时器
      return () => clearTimeout(timer);
    }
  };

  // 组件渲染部分
  return (
    <div
      // 组合类名：基础样式 + 状态样式 + 自定义类名
      className={`${styles.likeButton} ${localLiked ? styles.liked : ''} ${isAnimating ? styles.animating : ''} ${isLoading ? styles.loading : ''} ${className}`}
      // 点击事件处理
      onClick={handleClick}
      // 鼠标悬停提示文本
      title={isFrontendLoggedIn() ? (localLiked ? '取消点赞' : '点赞') : '请先登录'}
    >
      {/* SVG心形图标 */}
      <svg
        // 应用心形图标样式
        className={styles.heartIcon}
        // 图标尺寸
        width="16"
        height="16"
        //  viewBox属性定义了SVG的坐标系统
        viewBox="0 0 24 24"
        // SVG命名空间
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          // 应用心形路径样式
          className={styles.heartPath}
          // 心形路径的d属性，定义了心形的形状
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          // 描边宽度
          strokeWidth="2"
          // 描边端点样式
          strokeLinecap="round"
          // 描边连接样式
          strokeLinejoin="round"
        />
      </svg>

      {/* 点赞计数 */}
      <span className={styles.likeCount}>{localCount}</span>
    </div>
  );
};

// 导出LikeButton组件
export default LikeButton;