/*
 * @file            frontend/src/components/Modal/components/CommentsSection/CommentsSection.jsx
 * @description     评论区域组件，接入真实API，包含评论列表和互动功能
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-17 18:30:00
 * @lastModified    2026-03-21 20:04:02
 * Copyright © All rights reserved
*/

import React, { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import { listComment, toggleCommentLike, replyComment } from '../../../../api/commentApi';
import { formatStandardTime } from '../../../../utils';
import Avatar from '../../../common/Avatar';
import styles from './CommentsSection.desktop.module.css';

// 骨架屏组件
const CommentSkeleton = () => (
  <div className={styles.commentItem}>
    <div className={styles.commentUserAvatar}>
      <div className={styles.skeletonAvatar} />
    </div>
    <div className={styles.commentContentSection}>
      <div className={styles.skeletonLine} style={{ width: '30%', height: '14px' }} />
      <div className={styles.skeletonLine} style={{ width: '100%', height: '14px' }} />
      <div className={styles.skeletonLine} style={{ width: '60%', height: '14px' }} />
    </div>
  </div>
);

const CommentsSection = forwardRef(({ panRecordId, onCommentCountChange }, ref) => {
  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [replyToUser, setReplyToUser] = useState(null);  // 回复目标用户信息

  const pageSize = 10;
  const observerRef = useRef(null);
  const lastCommentRef = useRef(null);
  const replyInputRef = useRef(null);

  const fetchComments = useCallback(async (pageNum = 1, isLoadMore = false) => {
    if (!panRecordId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await listComment(panRecordId, pageNum, pageSize);
      
      console.log('评论列表响应:', response);
      
      const data = response.data || {};
      const list = data.list || [];

      if (isLoadMore) {
        setComments(prev => [...prev, ...list]);
      } else {
        setComments(list);
      }

      setTotal(data.total || 0);
      setHasMore(list.length === pageSize);

      if (onCommentCountChange) {
        onCommentCountChange(data.total || 0);
      }
    } catch (err) {
      console.error('加载评论失败:', err);
      setError(err.message || '加载评论失败');
    } finally {
      setLoading(false);
    }
  }, [panRecordId, onCommentCountChange]);

  useImperativeHandle(ref, () => ({
    refresh: () => {
      fetchComments(1, false);
    }
  }));

  useEffect(() => {
    fetchComments(1, false);
  }, [fetchComments]);

  useEffect(() => {
    if (loading || !hasMore || comments.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          console.log('触发加载更多，当前页:', page);
          handleLoadMore();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px'  // 提前100px触发加载
      }
    );

    if (lastCommentRef.current) {
      observer.observe(lastCommentRef.current);
      console.log('观察最后一个元素:', lastCommentRef.current);
    }

    return () => observer.disconnect();
  }, [loading, hasMore, comments.length, page]);

  const handleLoadMore = () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchComments(nextPage, true);
  };

  const handleRetry = () => {
    fetchComments(1, false);
  };

  const handleLike = async (commentId) => {
    try {
      const response = await toggleCommentLike(commentId);
      const data = response.data || {};
      
      // 更新评论列表中的点赞状态
      setComments(prevComments =>
        prevComments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              is_liked: data.is_liked,
              like_count: data.like_count
            };
          }
          // 更新回复中的点赞状态
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map(reply => {
                if (reply.id === commentId) {
                  return {
                    ...reply,
                    is_liked: data.is_liked,
                    like_count: data.like_count
                  };
                }
                return reply;
              })
            };
          }
          return comment;
        })
      );
    } catch (err) {
      console.error('点赞失败:', err);
    }
  };

  const handleReplyClick = (commentId, targetUser = null) => {
    if (replyingTo === commentId) {
      setReplyingTo(null);
      setReplyContent('');
      setReplyToUser(null);
    } else {
      setReplyingTo(commentId);
      setReplyContent('');
      setReplyToUser(targetUser);  // 设置回复目标用户
      setTimeout(() => {
        replyInputRef.current?.focus();
      }, 100);
    }
  };

  const handleReplySubmit = async (parentId) => {
    if (!replyContent.trim() || replySubmitting) return;

    setReplySubmitting(true);
    try {
      await replyComment(
        panRecordId, 
        parentId, 
        replyContent.trim(), 
        true, 
        replyToUser?.id  // 传递回复目标用户ID
      );
      setReplyContent('');
      setReplyingTo(null);
      setReplyToUser(null);
      // 刷新评论列表
      fetchComments(1, false);
    } catch (err) {
      console.error('回复失败:', err);
    } finally {
      setReplySubmitting(false);
    }
  };

  const handleReplyCancel = () => {
    setReplyingTo(null);
    setReplyContent('');
    setReplyToUser(null);
  };

  const renderReply = (reply, parentComment) => (
    <div key={reply.id} className={styles.replyItem}>
      <div className={styles.replyUserAvatar}>
        <Avatar
          src={reply.user_avatar}
          alt={reply.user_nickname}
          size="small"
          nickname={reply.user_nickname}
        />
      </div>
      <div className={styles.replyContentSection}>
        <div className={styles.replyHeader}>
          <span className={styles.replyUserName}>{reply.user_nickname}</span>
          {reply.is_author && <span className={styles.authorBadgeSmall}>作者</span>}
          {reply.reply_to_user_nickname && (
            <>
              <span className={styles.replyArrow}>回复</span>
              <span className={styles.replyToUser}>@{reply.reply_to_user_nickname}</span>
            </>
          )}
          <span className={styles.replyTime}>{formatStandardTime(reply.create_time)}</span>
        </div>
        <div className={styles.replyText}>{reply.content}</div>
        <div className={styles.replyActions}>
          <button 
            className={`${styles.replyActionBtn} ${reply.is_liked ? styles.liked : ''}`}
            onClick={() => handleLike(reply.id)}
          >
            <svg className={styles.actionIconSmall} width="14" height="14" viewBox="0 0 24 24" fill={reply.is_liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
            </svg>
            <span>{reply.like_count || 0}</span>
          </button>
          <button 
            className={styles.replyActionBtn}
            onClick={() => handleReplyClick(parentComment.id, { id: reply.user_id, nickname: reply.user_nickname })}
          >
            <svg className={styles.actionIconSmall} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  const renderComment = (comment, index, isLast) => (
    <div 
      key={comment.id} 
      ref={isLast ? lastCommentRef : null}
      className={styles.commentItem}
    >
      <div className={styles.commentUserAvatar}>
        <Avatar
          src={comment.user_avatar}
          alt={comment.user_nickname}
          size="medium"
          nickname={comment.user_nickname}
        />
      </div>
      <div className={styles.commentContentSection}>
        <div className={styles.commentHeader}>
          <div className={styles.commentHeaderLeft}>
            <span className={styles.commentUserName}>{comment.user_nickname}</span>
            {comment.is_author && <span className={styles.authorBadge}>作者</span>}
          </div>
          <div className={styles.commentHeaderRight}>
            <span className={styles.commentTime}>{formatStandardTime(comment.create_time)}</span>
          </div>
        </div>
        <div className={styles.commentText}>{comment.content}</div>
        <div className={styles.commentActions}>
          <button 
            className={`${styles.commentActionBtn} ${comment.is_liked ? styles.liked : ''}`}
            onClick={() => handleLike(comment.id)}
          >
            <svg className={styles.actionIcon} width="16" height="16" viewBox="0 0 24 24" fill={comment.is_liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
            </svg>
            <span className={styles.actionCount}>{comment.like_count || 0}</span>
          </button>
          <button 
            className={`${styles.commentActionBtn} ${replyingTo === comment.id ? styles.active : ''}`}
            onClick={() => handleReplyClick(comment.id)}
          >
            <svg className={styles.actionIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span className={styles.actionCount}>{comment.reply_count || 0}</span>
          </button>
        </div>
        
        {/* 回复列表 */}
        {comment.replies && comment.replies.length > 0 && (
          <div className={styles.repliesSection}>
            {comment.replies.map(reply => renderReply(reply, comment))}
          </div>
        )}
        
        {/* 回复输入框 */}
        {replyingTo === comment.id && (
          <div className={styles.replyInputSection}>
            <div className={styles.replyInputHeader}>
              {replyToUser ? (
                <span className={styles.replyToHint}>回复 @{replyToUser.nickname}</span>
              ) : (
                <span className={styles.replyToHint}>回复评论</span>
              )}
            </div>
            <textarea
              ref={replyInputRef}
              className={styles.replyInput}
              placeholder="写下你的回复..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={2}
              maxLength={1000}
            />
            <div className={styles.replyInputActions}>
              <button 
                className={styles.replyCancelBtn}
                onClick={handleReplyCancel}
              >
                取消
              </button>
              <button 
                className={styles.replySubmitBtn}
                onClick={() => handleReplySubmit(comment.id)}
                disabled={!replyContent.trim() || replySubmitting}
              >
                {replySubmitting ? '发送中...' : '回复'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderEmpty = () => (
    <div className={styles.noComments}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <p>暂无评论，快来抢沙发吧！</p>
    </div>
  );

  const renderError = () => (
    <div className={styles.errorState}>
      <p>加载失败：{error}</p>
      <button onClick={handleRetry} className={styles.retryBtn}>重试</button>
    </div>
  );

  return (
    <div className={styles.commentsSection}>
      <div className={styles.commentsList}>
        <h3>评论 ({total})</h3>
        {loading && comments.length === 0 ? (
          <>
            <CommentSkeleton />
            <CommentSkeleton />
            <CommentSkeleton />
          </>
        ) : error ? (
          renderError()
        ) : comments.length === 0 ? (
          renderEmpty()
        ) : (
          <>
            {comments.map((comment, index) => renderComment(comment, index, index === comments.length - 1))}
            {/* 加载更多触发元素 */}
            {hasMore && (
              <div 
                ref={loading ? null : lastCommentRef}
                className={styles.loadMoreTrigger}
              >
                {loading && (
                  <div className={styles.loadingMore}>
                    <div className={styles.loadingSpinner}></div>
                    <span>加载中...</span>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

CommentsSection.displayName = 'CommentsSection';
export default CommentsSection;
