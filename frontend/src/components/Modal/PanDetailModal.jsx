/*
 * @file            frontend/src/components/Modal/PanDetailModal.jsx
 * @description     排盘详情弹窗组件，实现小红书式左右分栏布局
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-06 17:20:00
 * @lastModified    2026-03-06 17:20:00
 * Copyright  All rights reserved
*/

import React, { useState, useEffect, useRef } from "react";
import { useImageLazyLoad } from "../../hooks";
import { formatStandardTime } from "../../utils";
import PanImageViewer from "../PanImageViewer";
import CombinedLiuYaoDisplay from "../common/CombinedLiuYaoDisplay";
import "./PanDetailModal.css";

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
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <div className="header-left"></div>
          <div className="header-right">
            <button className="close-button" onClick={handleClose}>
              
            </button>
          </div>
        </div>
        
        <div className="modal-body">
          <div className="modal-left-content">
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
          
          <div className="modal-right-content">
            <div className="user-info-section">
              <div className="user-avatar">
                <img
                  src={data.user_avatar || "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjY2NjIiBmb250LXNpemU9IjE2Ij7lm688L3RleHQ+PC9zdmc+"}
                  alt={data.user_nickname || "用户"}
                />
              </div>
              <div className="user-details">
                <span className="user-name">{data.user_nickname || "匿名用户"}</span>
              </div>
              <button 
                className={`follow-button ${isFollowed ? "followed" : ""}`}
                onClick={handleFollow}
              >
                {isFollowed ? "已关注" : "关注"}
              </button>
            </div>
            
            <div className="content-section">
              <h2 className="post-title">{data.title || "未命名卦象"}</h2>
              
              {data.tags && data.tags.length > 0 && (
                <div className="tags-section">
                  {data.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="post-meta">
                <span className="post-time">{formatStandardTime(data.create_time)}</span>
                {data.location && <span className="post-location">{data.location}</span>}
              </div>
              
              <div className="divination-info">
                <h3>排盘信息</h3>
                <div className="info-row">
                  <span className="info-label">排盘类型：</span>
                  <span className="info-value">{data.pan_type === "liuyao" ? "六爻" : data.pan_type}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">起卦方式：</span>
                  <span className="info-value">{data.method || "未知"}</span>
                </div>
                {data.question && (
                  <div className="info-row">
                    <span className="info-label">占问事项：</span>
                    <span className="info-value">{data.question}</span>
                  </div>
                )}
                {data.hexagram_name && (
                  <div className="info-row">
                    <span className="info-label">卦名：</span>
                    <span className="info-value">{data.hexagram_name}</span>
                  </div>
                )}
              </div>
              
              <div className="comments-section">
                <h3>评论 ({data.comment_count || 0})</h3>
                
                <div className="comment-input-section">
                  {!showCommentInput ? (
                    <div 
                      className="comment-input-placeholder"
                      onClick={handleCommentInputClick}
                    >
                      说点什么...
                    </div>
                  ) : (
                    <form className="comment-input-form" onSubmit={handleCommentSubmit}>
                      <input
                        ref={commentInputRef}
                        type="text"
                        className="comment-input-field"
                        value={commentContent}
                        onChange={handleCommentContentChange}
                        placeholder="说点什么..."
                        disabled={isSubmitting}
                        autoFocus
                      />
                      <button 
                        type="submit" 
                        className="comment-submit-button"
                        disabled={!commentContent.trim() || isSubmitting}
                      >
                        {isSubmitting ? "发布中..." : "发布"}
                      </button>
                    </form>
                  )}
                </div>
                
                <div className="comments-list">
                  {data.comments && data.comments.length > 0 ? (
                    data.comments.map((comment) => (
                      <div key={comment.id} className="comment-item">
                        <div className="comment-user-avatar">
                          <img
                            src={comment.user_avatar || "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjY2NjIiBmb250LXNpemU9IjE2Ij7lm688L3RleHQ+PC9zdmc+"}
                            alt={comment.user_nickname}
                          />
                        </div>
                        <div className="comment-content-section">
                          <div className="comment-header">
                            <span className="comment-user-name">{comment.user_nickname}</span>
                            <span className="comment-time">{formatStandardTime(comment.create_time)}</span>
                          </div>
                          <div className="comment-text">{comment.content}</div>
                          <div className="comment-actions">
                            <span className="comment-like">
                               {comment.like_count || 0}
                            </span>
                            <span className="comment-reply">回复 ({comment.reply_count || 0})</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-comments">
                      暂无评论，快来抢沙发吧！
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="interaction-section">
              <div className="interaction-left">
                <div 
                  className={`interaction-item ${isLiked ? "liked" : ""}`}
                  onClick={handleLike}
                >
                  <span className="interaction-icon"></span>
                  <span className="interaction-count">{likeCount}</span>
                </div>
                <div 
                  className={`interaction-item ${isCollected ? "collected" : ""}`}
                  onClick={handleCollect}
                >
                  <span className="interaction-icon"></span>
                  <span className="interaction-count">{data.collect_count || 0}</span>
                </div>
                <div className="interaction-item">
                  <span className="interaction-icon"></span>
                  <span className="interaction-count">{data.view_count || 0}</span>
                </div>
              </div>
              <div className="interaction-right">
                <div className="interaction-item share-button">
                  <span className="interaction-icon"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
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
