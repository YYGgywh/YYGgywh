/*
 * @file            frontend/src/components/Modal/components/InteractionButtons/InteractionButtons.jsx
 * @description     互动按钮组件，包含点赞、收藏、评论、分享、浏览量功能
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-18 11:40:14
 * @lastModified    2026-03-22 12:31:08
 * Copyright © All rights reserved
*/

import React from 'react';
import styles from './InteractionButtons.desktop.module.css';

/**
 * 互动按钮组件
 * @param {Object} props - 组件属性
 * @param {number} props.likeCount - 点赞数
 * @param {number} props.collectCount - 收藏数
 * @param {number} props.commentCount - 评论数
 * @param {number} props.viewCount - 浏览量
 * @param {boolean} props.showViewCount - 是否显示浏览量（默认 false）
 * @param {boolean} props.showShare - 是否显示分享按钮（默认 false）
 * @param {boolean} props.isLiked - 是否已点赞
 * @param {boolean} props.isCollected - 是否已收藏
 * @param {string} props.variant - 样式变体：'default' | 'card'（默认 'default'）
 * @param {Function} props.onLike - 点赞回调函数
 * @param {Function} props.onCollect - 收藏回调函数
 * @param {Function} props.onComment - 评论回调函数
 * @param {Function} props.onShare - 分享回调函数
 * @returns {JSX.Element} 互动按钮组件
 */
const InteractionButtons = ({
  likeCount = 0,
  collectCount = 0,
  commentCount = 0,
  viewCount = 0,
  showViewCount = false,
  showShare = false,
  isLiked = false,
  isCollected = false,
  variant = 'default',
  onLike = () => {},
  onCollect = () => {},
  onComment = () => {},
  onShare = () => {}
}) => {
  return (
    <div className={`${styles.interactionButtons} ${styles[variant]}`}>
      {/* 点赞按钮 */}
      <button 
        className={`${styles.interactionButton} ${isLiked ? styles.active : ''}`}
        onClick={onLike}
      >
        <svg className={styles.interactionIcon} width="20" height="20" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
        </svg>
        <span className={styles.interactionCount}>{likeCount}</span>
      </button>
      
      {/* 收藏按钮 */}
      <button 
        className={`${styles.interactionButton} ${isCollected ? styles.active : ''}`}
        onClick={onCollect}
      >
        <svg className={styles.interactionIcon} width="20" height="20" viewBox="0 0 24 24" fill={isCollected ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
        <span className={styles.interactionCount}>{collectCount}</span>
      </button>
      
      {/* 评论按钮 */}
      <button className={styles.interactionButton} onClick={onComment}>
        <svg className={styles.interactionIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span className={styles.interactionCount}>{commentCount}</span>
      </button>
      
      {/* 分享按钮（根据 showShare 控制） */}
      {showShare && (
        <button className={styles.interactionButton} onClick={onShare}>
          <svg className={styles.interactionIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        </button>
      )}
      
      {/* 浏览量显示（根据 showViewCount 控制） */}
      {showViewCount && (
        <div className={styles.viewCount}>
          <svg className={styles.interactionIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          <span className={styles.interactionCount}>{viewCount}</span>
        </div>
      )}
    </div>
  );
};

export default InteractionButtons;