/*
 * @file            frontend/src/components/Modal/PanDetailModal.jsx
 * @description     排盘详情弹窗组件，实现小红书式左右分栏布局
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-06 17:20:00
 * @lastModified    2026-03-20 13:15:06
 * Copyright © All rights reserved
*/

import React, { useState, useEffect, useRef } from "react";
import { useImageLazyLoad } from "../../hooks";
import { formatStandardTime } from "../../utils";
import { getFrontendUserInfo } from "../../utils/storage";
import PanImageViewer from "../PanImageViewer/PanImageViewer";
import LiuYaoInfoContainer from "../LiuYao/LiuYaoReault/LiuYaoInfoContainer/LiuYaoInfoContainer";
import { UserInfo, PostHeader, CommentsSection, CommentInput, DivinationSupplementleInfo, EditSupplementModal } from "./components";
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [activeButtons, setActiveButtons] = useState(['liuqin', 'fuchen', 'yinyang', 'colorChange']);
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

  const handleDisplayControlClick = (buttonId) => {
    setActiveButtons(prev => {
      if (prev.includes(buttonId)) {
        return prev.filter(id => id !== buttonId);
      } else {
        return [...prev, buttonId];
      }
    });
  };

  // 判断当前用户是否是发帖主
  const isPostOwner = () => {
    const currentUser = getFrontendUserInfo();
    if (!currentUser || !data) return false;
    return currentUser.id === data.user_id;
  };

  // 处理编辑补充信息
  const handleEditSupplement = (recordData) => {
    setEditData(recordData);
    setShowEditModal(true);
  };

  // 处理编辑成功
  const handleEditSuccess = (newContent) => {
    if (data) {
      data.supplement = newContent;
    }
  };

  if (!isOpen || !data) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        {/* 左侧区域 */}
        <div className={styles.modalLeftContent}>
          {/* 左侧头部区域 */}
          <div className={styles.modalLeftHeader}>
            <PostHeader data={data} showTitle={false} />
          </div>

          {/* 左侧主体区域 - 上下垂直分栏 */}
          <div className={styles.modalLeftBody}>
            {/* 左侧主体区域上部 - 六爻排盘信息 */}
            <div className={styles.modalLeftBodyTop}>
              {data.pan_result ? (
                <LiuYaoInfoContainer
                  divinationData={data.pan_result}
                  formData={data.pan_params?.form_data || {
                    question: data.question,
                    method: data.method
                  }}
                  activeButtons={activeButtons}
                  onButtonClick={handleDisplayControlClick}
                  isColorMode={activeButtons.includes('colorChange')}
                />
              ) : (
                <div className="no-data-placeholder">
                  暂无排盘数据
                </div>
              )}
            </div>

            {/* 左侧主体区域下部 - 占卜补充信息 */}
            <div className={styles.modalLeftBodyBottom}>
              <DivinationSupplementleInfo
                data={data}
                showMethod={false}
                showSupplement={true}
                showSupplementTime={true}
                canEdit={isPostOwner()}
                onEditSupplement={handleEditSupplement}
              />
            </div>
          </div>

          {/* 左侧底部区域 - 版权信息 */}
          <div className={styles.modalLeftFooter}>
            <span className={styles.footerText}>© 2026 圆运阁古易文化</span>
          </div>
        </div>

        {/* 右侧区域 */}
        <div className={styles.modalRightContent}>
          {/* 右侧头部区域 - 用户信息 */}
          <div className={styles.modalRightHeader}>
            <UserInfo
              userAvatar={data.user_avatar}
              userNickname={data.user_nickname}
              isFollowed={isFollowed}
              onFollow={handleFollow}
            />
          </div>

          {/* 右侧主体区域 - 评论列表 */}
          <div className={styles.modalRightBody}>
            <CommentsSection data={data} />
          </div>

          {/* 右侧底部区域 - 评论输入 */}
          <div className={styles.modalRightFooter}>
            <CommentInput
              isLiked={isLiked}
              isCollected={isCollected}
              likeCount={likeCount}
              collectCount={data.collect_count || 0}
              commentCount={data.comment_count || 0}
              onLike={handleLike}
              onCollect={handleCollect}
              onShare={() => console.log('分享')}
              onSubmit={(content) => console.log('提交评论:', content)}
            />
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

      {showEditModal && (
        <EditSupplementModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          data={editData}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default PanDetailModal;