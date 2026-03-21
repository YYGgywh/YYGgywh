/*
 * @file            frontend/src/components/Modal/components/CommentsSection/CommentsSection.jsx
 * @description     评论区域组件，接入真实API，包含评论列表和互动功能
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-17 18:30:00
 * @lastModified    2026-03-21 14:00:00
 * Copyright © All rights reserved
*/

import React, { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import { listComment } from '../../../../api/commentApi';
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

  const pageSize = 10;

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

  const handleLoadMore = () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchComments(nextPage, true);
  };

  const handleRetry = () => {
    fetchComments(1, false);
  };

  const renderComment = (comment) => (
    <div key={comment.id} className={styles.commentItem}>
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
          <button className={styles.commentActionBtn}>
            <svg className={styles.actionIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
            </svg>
            <span className={styles.actionCount}>0</span>
          </button>
          <button className={styles.commentActionBtn}>
            <svg className={styles.actionIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span className={styles.actionCount}>0</span>
          </button>
        </div>
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
            {comments.map(renderComment)}
            {hasMore && (
              <div className={styles.loadMore}>
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className={styles.loadMoreBtn}
                >
                  {loading ? '加载中...' : '加载更多'}
                </button>
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
