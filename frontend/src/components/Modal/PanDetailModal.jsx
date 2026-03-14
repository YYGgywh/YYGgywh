/*
 * @file            frontend/src/components/Modal/PanDetailModal.jsx
 * @description     排盘详情弹窗组件，实现小红书式左右分栏布局
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-06 17:20:00
 * @lastModified    2026-03-14 12:00:00
 * Copyright © All rights reserved
*/

import React, { useState, useEffect, useRef } from "react";
import { useImageLazyLoad } from "../../hooks";
import { formatStandardTime } from "../../utils";
import PanImageViewer from "../PanImageViewer/PanImageViewer";
import CombinedLiuYaoDisplay from "../common/CombinedLiuYaoDisplay/CombinedLiuYaoDisplay";
import styles from "./PanDetailModal.desktop.module.css";

const PanDetailModal = ({ isOpen, onClose, data }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isCollected, setIsCollected] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const commentInputRef = useRef(null);
  
  const { imgRef, src, isLoaded, handleLoad } = useImageLazyLoad(
    data?.hexagram_image || "",
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNDUwIiB2aWV3Qm94PSIwIDAgNjAwIDQ1MCI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0NTAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2NjYyIgZm9udC1zaXplPSIxOCI+5rCR6Ieq5YirPC90ZXh0Pjwvc3ZnPg=="
  );
  
  useEffect(() => {
    if (data) {
      setIsLiked(data.is_liked || false);
      setLikeCount(data.like_count || 0);
      setIsCollected(data.is_collected || false);
      setIsFollowed(data.is_followed || false);
    }
  }, [data]);
  
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };
  
  const handleClose = () => {
    setShowCommentInput(false);
    setCommentContent("");
    onClose && onClose();
  };
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);
  
  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };
  
  const handleCollect = (e) => {
    e.stopPropagation();
    setIsCollected(!isCollected);
  };
  
  const handleFollow = (e) => {
    e.stopPropagation();
    setIsFollowed(!isFollowed);
  };
  
  const handleCommentInputClick = (e) => {
    e.stopPropagation();
    setShowCommentInput(!showCommentInput);
  };
  
  const handleCommentContentChange = (e) => {
    setCommentContent(e.target.value);
  };
  
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setCommentContent("");
      setShowCommentInput(false);
      setIsSubmitting(false);
    }, 1000);
  };
  
  const handleImageClick = (e) => {
    e.stopPropagation();
    setShowImageViewer(true);
  };
  
  if (!isOpen || !data) return null;
  
  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}></div>
          <div className={styles.headerRight}>
            <button className={styles.closeButton} onClick={handleClose}>

            </button>
          </div>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalLeftContent}>
            <div className="liu-yao-display-container">
              {data.pan_result ? (
                <CombinedLiuYaoDisplay panResult={data.pan_result} />
              ) : (
                <div className="no-data-placeholder">
                  暂无排盘数据
                </div>
              )}
            </div>
          </div>

          <div className={styles.modalRightContent}>
            <div className={styles.userInfoSection}>
              <div className={styles.userAvatar}>
                <img
                  src={data.user_avatar || "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjY2NjIiBmb250LXNpemU9IjE2Ij7lm688L3RleHQ+PC9zdmc+"}
                  alt={data.user_nickname || "用户"}
                />
              </div>
              <div className={styles.userDetails}>
                <span className={styles.userName}>{data.user_nickname || "匿名用户"}</span>
              </div>
              <button
                className={`${styles.followButton} ${isFollowed ? styles.followed : ""}`}
                onClick={handleFollow}
              >
                {isFollowed ? "已关注" : "关注"}
              </button>
            </div>

            <div className={styles.contentSection}>
              <h2 className={styles.postTitle}>{data.title || "未命名卦象"}</h2>

              {data.tags && data.tags.length > 0 && (
                <div className={styles.tagsSection}>
                  {data.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className={styles.postMeta}>
                <span className={styles.postTime}>{formatStandardTime(data.create_time)}</span>
                {data.location && <span className={styles.postLocation}>{data.location}</span>}
              </div>

              <div className={styles.divinationInfo}>
                <h3>排盘信息</h3>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>排盘类型：</span>
                  <span className={styles.infoValue}>{data.pan_type === "liuyao" ? "六爻" : data.pan_type}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>起卦方式：</span>
                  <span className={styles.infoValue}>{data.method || "未知"}</span>
                </div>
                {data.question && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>占问事项：</span>
                    <span className={styles.infoValue}>{data.question}</span>
                  </div>
                )}
                {data.hexagram_name && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>卦名：</span>
                    <span className={styles.infoValue}>{data.hexagram_name}</span>
                  </div>
                )}
              </div>

              <div className={styles.commentsSection}>
                <h3>评论 ({data.comment_count || 0})</h3>

                <div className={styles.commentInputSection}>
                  {!showCommentInput ? (
                    <div
                      className={styles.commentInputPlaceholder}
                      onClick={handleCommentInputClick}
                    >
                      说点什么...
                    </div>
                  ) : (
                    <form className={styles.commentInputForm} onSubmit={handleCommentSubmit}>
                      <input
                        ref={commentInputRef}
                        type="text"
                        className={styles.commentInputField}
                        value={commentContent}
                        onChange={handleCommentContentChange}
                        placeholder="说点什么..."
                        disabled={isSubmitting}
                        autoFocus
                      />
                      <button
                        type="submit"
                        className={styles.commentSubmitButton}
                        disabled={!commentContent.trim() || isSubmitting}
                      >
                        {isSubmitting ? "发布中..." : "发布"}
                      </button>
                    </form>
                  )}
                </div>

                <div className={styles.commentsList}>
                  {data.comments && data.comments.length > 0 ? (
                    data.comments.map((comment) => (
                      <div key={comment.id} className={styles.commentItem}>
                        <div className={styles.commentUserAvatar}>
                          <img
                            src={comment.user_avatar || "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjY2NjIiBmb250LXNpemU9IjE2Ij7lm688L3RleHQ+PC9zdmc+"}
                            alt={comment.user_nickname}
                          />
                        </div>
                        <div className={styles.commentContentSection}>
                          <div className={styles.commentHeader}>
                            <span className={styles.commentUserName}>{comment.user_nickname}</span>
                            <span className={styles.commentTime}>{formatStandardTime(comment.create_time)}</span>
                          </div>
                          <div className={styles.commentText}>{comment.content}</div>
                          <div className={styles.commentActions}>
                            <span className={styles.commentLike}>
                               {comment.like_count || 0}
                            </span>
                            <span className={styles.commentReply}>回复 ({comment.reply_count || 0})</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.noComments}>
                      暂无评论，快来抢沙发吧！
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.interactionSection}>
              <div className={styles.interactionLeft}>
                <div
                  className={`${styles.interactionItem} ${isLiked ? styles.liked : ""}`}
                  onClick={handleLike}
                >
                  <span className={styles.interactionIcon}></span>
                  <span className={styles.interactionCount}>{likeCount}</span>
                </div>
                <div
                  className={`${styles.interactionItem} ${isCollected ? styles.collected : ""}`}
                  onClick={handleCollect}
                >
                  <span className={styles.interactionIcon}></span>
                  <span className={styles.interactionCount}>{data.collect_count || 0}</span>
                </div>
                <div className={styles.interactionItem}>
                  <span className={styles.interactionIcon}></span>
                  <span className={styles.interactionCount}>{data.view_count || 0}</span>
                </div>
              </div>
              <div className={styles.interactionRight}>
                <div className={`${styles.interactionItem} ${styles.shareButton}`}>
                  <span className={styles.interactionIcon}></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <div className="footer-content">
            <span className="footer-text"> 2026 圆运阁古易文化</span>
          </div>
        </div>
      </div>
      
      {showImageViewer && (
        <PanImageViewer
          images={[data.hexagram_image]}
          initialIndex={0}
          onClose={() => setShowImageViewer(false)}
        />
      )}
    </div>
  );
};

export default PanDetailModal;
