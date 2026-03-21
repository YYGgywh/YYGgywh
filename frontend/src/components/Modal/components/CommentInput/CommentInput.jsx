/*
 * @file            frontend/src/components/Modal/components/CommentInput/CommentInput.jsx
 * @description     评论输入组件，接入真实 API，实现评论发布功能
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-18 10:00:00
 * @lastModified    2026-03-21 18:30:00
 * Copyright © All rights reserved
*/

import React, { useState, useRef } from 'react';
import { addComment } from '../../../../api/commentApi';
import { InteractionButtons } from '../index';
import Avatar from '../../../common/Avatar';
import styles from './CommentInput.desktop.module.css';

const MAX_LENGTH = 500;

const CommentInput = ({ 
  panRecordId,
  isLiked, 
  isCollected = false,
  likeCount, 
  collectCount, 
  commentCount, 
  onLike, 
  onCollect, 
  onShare,
  onCommentSuccess
}) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const commentInputRef = useRef(null);

  const handleCommentInputClick = (e) => {
    e.stopPropagation();
    setShowCommentInput(true);
  };

  const handleCommentContentChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_LENGTH) {
      setCommentContent(value);
      setError(null);
    }
    
    // 自动调整 textarea 高度
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentContent.trim()) {
      setError('请输入评论内容');
      return;
    }

    if (commentContent.length > MAX_LENGTH) {
      setError(`评论内容不能超过 ${MAX_LENGTH} 字`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await addComment(panRecordId, commentContent.trim(), true);
      
      // 清空输入
      setCommentContent('');
      setShowCommentInput(false);
      
      // 通知父组件刷新列表
      if (onCommentSuccess) {
        onCommentSuccess();
      }
    } catch (err) {
      console.error('发布评论失败:', err);
      setError(err.message || '发布失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setCommentContent('');
    setError(null);
    setShowCommentInput(false);
  };

  return (
    <div className={styles.commentInputArea}>
      {!showCommentInput ? (
        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            <div className={styles.userAvatar}>
              <Avatar size="small" />
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
                  maxLength={MAX_LENGTH}
                />
              </form>
            </div>
          </div>
          
          {/* 字数统计和错误提示 */}
          <div className={styles.inputMeta}>
            {error && (
              <span className={styles.errorText}>{error}</span>
            )}
            <span className={styles.charCount}>
              {commentContent.length}/{MAX_LENGTH}
            </span>
          </div>

          {/* 底部操作按钮 */}
          <div className={styles.commentInputFooter}>
            <div className={styles.footerLeft}>
              <button className={styles.footerButton} type="button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </button>
              <button className={styles.footerButton} type="button">
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
