/*
 * @file            frontend/src/components/Modal/components/CommentInput/CommentInput.jsx
 * @description     评论输入组件，接入真实 API，实现评论发布功能
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-18 10:00:00
 * @lastModified    2026-03-21 17:13:04
 * Copyright © All rights reserved
*/

import React, { useState, useRef, useEffect } from 'react';
import { addComment } from '../../../../api/commentApi';
import { InteractionButtons } from '../index';
import Avatar from '../../../common/Avatar';
import EmojiPicker from '../../../common/EmojiPicker/EmojiPicker';
import { getFrontendUserInfo } from '../../../../utils/storage';
import SmilingFaceIcon from '../../../../assets/images/smiling face.svg';
import AtIcon from '../../../../assets/images/@.svg';
import desktopStyles from './CommentInput.desktop.module.css';
import mobileStyles from './CommentInput.mobile.module.css';

const MAX_LENGTH = 1000;

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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isMobile, setIsMobile] = useState(() => {
    return window.innerWidth < 768;
  });
  const commentInputRef = useRef(null);
  
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

  // 获取当前用户信息
  useEffect(() => {
    const userInfo = getFrontendUserInfo();
    setCurrentUser(userInfo);
  }, []);

  const handleCommentInputClick = (e) => {
    e.stopPropagation();
    
    // 检查用户是否登录
    if (!currentUser) {
      // 在新标签页打开登录页面
      window.open('/login', '_blank');
      return;
    }
    
    setShowCommentInput(true);
  };

  const handleCommentContentChange = (e) => {
    const value = e.target.value;
    const actualLength = Array.from(value).length;
    if (actualLength <= MAX_LENGTH) {
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

    const actualLength = Array.from(commentContent).length;
    if (actualLength > MAX_LENGTH) {
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
    setShowEmojiPicker(false);
  };

  const handleEmojiSelect = (emoji) => {
    const textarea = commentInputRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = commentContent.substring(0, start) + emoji + commentContent.substring(end);
      setCommentContent(newValue);
      
      // 设置光标位置到表情后面
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    }
  };

  return (
    <div className={styles.commentInputArea}>
      {!showCommentInput ? (
        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            <div className={styles.userAvatar}>
              <Avatar 
                size="small" 
                src={currentUser?.avatar}
                nickname={currentUser?.nickname}
              />
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
            showViewCount={false}
            showShare={true}
            isLiked={isLiked}
            isCollected={isCollected}
            onLike={onLike}
            onCollect={onCollect}
            onComment={handleCommentInputClick}
            onShare={onShare}
            isMobile={isMobile}
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
              {Array.from(commentContent).length}/{MAX_LENGTH}
            </span>
          </div>

          {/* 底部操作按钮 */}
          <div className={styles.commentInputFooter}>
            <div className={styles.footerLeft}>
              <button className={styles.footerButton} type="button" title="@提及用户">
                <img src={AtIcon} alt="@" width="16" height="16" />
              </button>
              <div className={styles.emojiButtonContainer}>
                <button
                  className={styles.footerButton}
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  title="添加表情"
                >
                  <img src={SmilingFaceIcon} alt="表情" width="16" height="16" />
                </button>
                {showEmojiPicker && (
                  <EmojiPicker
                    onSelect={handleEmojiSelect}
                    onClose={() => setShowEmojiPicker(false)}
                  />
                )}
              </div>
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
