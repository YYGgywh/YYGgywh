/*
 * @file            frontend/src/components/Modal/components/CommentInput.jsx
 * @description     评论输入组件，包含评论输入框和互动按钮
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-18 10:00:00
 * @lastModified    2026-03-18 10:00:00
 * Copyright © All rights reserved
*/

import React, { useState, useRef } from 'react';
import { InteractionButtons } from '../index';
import styles from './CommentInput.desktop.module.css';

const CommentInput = ({ 
  isLiked, 
  isCollected = false,
  likeCount, 
  collectCount, 
  commentCount, 
  onLike, 
  onCollect, 
  onShare, 
  onSubmit 
}) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const commentInputRef = useRef(null);

  const handleCommentInputClick = (e) => {
    e.stopPropagation();
    setShowCommentInput(true);
  };

  const handleCommentContentChange = (e) => {
    setCommentContent(e.target.value);
    // 自动调整 textarea 高度
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(commentContent);
      setCommentContent('');
      setShowCommentInput(false);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleCancel = () => {
    setCommentContent('');
    setShowCommentInput(false);
  };

  return (
    <div className={styles.commentInputArea}>
      {!showCommentInput ? (
        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            <div className={styles.userAvatar}>
              <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=current%20user%20avatar&image_size=square" alt="用户头像" />
            </div>
            <span
              className={styles.commentInputPlaceholder}
              onClick={handleCommentInputClick}
            >
              说点什么...
            </span>
          </div>
          <InteractionButtons
            likeCount={likeCount}
            collectCount={collectCount}
            commentCount={commentCount}
            isLiked={isLiked}
            isCollected={isCollected}
            onLike={onLike}
            onCollect={onCollect}
            onComment={handleCommentInputClick}
            onShare={onShare}
          />
        </div>
      ) : (
        <div className={styles.commentInputWrapper}>
          {/* 输入区域 */}
          <div className={styles.commentInputHeader}>
            <div className={styles.commentInputMain}>
              <form id="commentForm" className={styles.commentInputForm} onSubmit={handleCommentSubmit}>
                <textarea
                  ref={commentInputRef}
                  className={styles.commentInputField}
                  value={commentContent}
                  onChange={handleCommentContentChange}
                  placeholder="说点什么..."
                  disabled={isSubmitting}
                  autoFocus
                  rows={1}
                  style={{ resize: 'none' }}
                />
              </form>
            </div>
          </div>
          {/* 底部操作按钮 */}
          <div className={styles.commentInputFooter}>
            <div className={styles.footerLeft}>
              <button className={styles.footerButton}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </button>
              <button className={styles.footerButton}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
            </div>
            <div className={styles.footerRight}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                取消
              </button>
              <button
                type="submit"
                form="commentForm"
                className={styles.sendButton}
                disabled={!commentContent.trim() || isSubmitting}
              >
                {isSubmitting ? "发送中..." : "发送"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

CommentInput.displayName = 'CommentInput';
export default CommentInput;