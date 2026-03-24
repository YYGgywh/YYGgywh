/*
 * @file            frontend/src/components/Modal/PanDetailModal.jsx
 * @description     排盘详情弹窗组件，实现小红书式左右分栏布局
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-06 17:20:00
 * @lastModified    2026-03-24 16:15:07
 * Copyright © All rights reserved
*/

import React, { useState, useEffect, useRef } from "react";
import { useImageLazyLoad } from "../../hooks";
import { formatStandardTime } from "../../utils";
import { getFrontendUserInfo } from "../../utils/storage";
import { toggleLike, toggleCollect } from "../../api/panApi";
import { followUser, unfollowUser, checkFollowStatus } from "../../api/userApi";
import PanImageViewer from "../PanImageViewer/PanImageViewer";
import LiuYaoInfoContainer from "../LiuYao/LiuYaoReault/LiuYaoInfoContainer/LiuYaoInfoContainer";
import { UserInfo, PostHeader, CommentsSection, CommentInput, DivinationSupplementleInfo, EditSupplementModal } from "./components";
import styles from "./PanDetailModal.desktop.module.css";

const PanDetailModal = ({ isOpen, onClose, data }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isCollected, setIsCollected] = useState(false);
  const [collectCount, setCollectCount] = useState(0);
  const [isFollowed, setIsFollowed] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [activeButtons, setActiveButtons] = useState(['liuqin', 'fuchen', 'yinyang', 'colorChange']);
  const commentInputRef = useRef(null);
  const commentsSectionRef = useRef(null);
  
  // 使用 ref 存储最新状态，解决闭包问题
  const stateRef = useRef({
    isLiked,
    likeCount,
    isCollected,
    collectCount
  });

  const { imgRef, src, isLoaded, handleLoad } = useImageLazyLoad(
    data?.hexagram_image || "",
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNDUwIiB2aWV3Qm94PSIwIDAgNjAwIDQ1MCI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0NTAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2NjYyIgZm9udC1zaXplPSIxOCI+5rCR6Ieq5YirPC90ZXh0Pjwvc3ZnPg=="
  );

  // 当 data 变化时（包括外部实时更新），同步到内部状态
  useEffect(() => {
    if (data) {
      setIsLiked(data.is_liked || false);
      setLikeCount(data.like_count || 0);
      setIsCollected(data.is_collected || false);
      setCollectCount(data.collect_count || 0);
      setIsFollowed(data.is_followed || false);
      setCommentCount(data.comment_count || 0);
    }
  }, [data?.id, data?.is_liked, data?.like_count, data?.is_collected, data?.collect_count, data?.is_followed, data?.comment_count]);
  
  // 更新 ref 中的状态值
  useEffect(() => {
    stateRef.current = {
      isLiked,
      likeCount,
      isCollected,
      collectCount
    };
  }, [isLiked, likeCount, isCollected, collectCount]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    setShowCommentInput(false);
    setCommentContent("");
    
    // 返回更新后的数据，用于同步首页卡片状态
    // 使用 stateRef 获取最新状态，避免闭包问题
    const updatedData = {
      id: data?.id,
      is_liked: stateRef.current.isLiked,
      like_count: stateRef.current.likeCount,
      is_collected: stateRef.current.isCollected,
      collect_count: stateRef.current.collectCount
    };
    
    onClose && onClose(updatedData);
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

  const handleLike = async (e) => {
    e.stopPropagation();
    const newLiked = !isLiked;
    
    // 先更新 UI
    setIsLiked(newLiked);
    setLikeCount(newLiked ? likeCount + 1 : likeCount - 1);
    
    try {
      // 调用后端 API
      const response = await toggleLike(data.id);
      if (response.code === 200) {
        // API 调用成功，使用后端返回的数据
        setIsLiked(response.data.is_liked);
        setLikeCount(response.data.like_count);
      } else {
        // API 调用失败，回滚 UI
        setIsLiked(isLiked);
        setLikeCount(likeCount);
      }
    } catch (error) {
      console.error('点赞失败:', error);
      // API 调用失败，回滚 UI
      setIsLiked(isLiked);
      setLikeCount(likeCount);
    }
  };

  const handleCollect = async (e) => {
    e.stopPropagation();
    const newCollected = !isCollected;
    
    // 先更新 UI
    setIsCollected(newCollected);
    setCollectCount(newCollected ? collectCount + 1 : collectCount - 1);
    
    try {
      // 调用后端 API
      const response = await toggleCollect(data.id);
      if (response.code === 200) {
        // API 调用成功，使用后端返回的数据
        setIsCollected(response.data.is_collected);
        setCollectCount(response.data.collect_count);
      } else {
        // API 调用失败，回滚 UI
        setIsCollected(isCollected);
        setCollectCount(collectCount);
      }
    } catch (error) {
      console.error('收藏失败:', error);
      // API 调用失败，回滚 UI
      setIsCollected(isCollected);
      setCollectCount(collectCount);
    }
  };

  const handleFollow = async (e) => {
    e.stopPropagation();
    
    // 检查用户是否登录
    const currentUser = getFrontendUserInfo();
    if (!currentUser) {
      alert('请先登录');
      return;
    }
    
    const newFollowed = !isFollowed;
    
    try {
      if (newFollowed) {
        // 关注用户
        const response = await followUser(data.user_id);
        if (response.code === 200) {
          setIsFollowed(true);
        } else {
          alert(response.msg || '关注失败');
        }
      } else {
        // 取消关注
        const response = await unfollowUser(data.user_id);
        if (response.code === 200) {
          setIsFollowed(false);
        } else {
          alert(response.msg || '取消关注失败');
        }
      }
    } catch (error) {
      console.error('关注操作失败:', error);
      alert('网络错误，请稍后重试');
    }
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

  const isPostOwner = () => {
    const currentUser = getFrontendUserInfo();
    if (!currentUser || !data) return false;
    return currentUser.id === data.user_id;
  };

  const handleEditSupplement = (recordData) => {
    setEditData(recordData);
    setShowEditModal(true);
  };

  const handleEditSuccess = (newContent) => {
    if (data) {
      data.supplement = newContent;
    }
  };

  const handleCommentCountChange = (count) => {
    setCommentCount(count);
  };

  const handleCommentSuccess = () => {
    // 评论发布成功后，刷新评论列表
    if (commentsSectionRef.current) {
      commentsSectionRef.current.refresh();
    }
    console.log('评论发布成功');
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
              userAvatar={data.user?.avatar_url || data.user_avatar}
              userNickname={data.user?.nickname || data.user_nickname}
              isFollowed={isFollowed}
              onFollow={handleFollow}
              disabled={getFrontendUserInfo()?.id === data.user_id}
            />
          </div>

          {/* 右侧主体区域 - 评论列表 */}
          <div className={styles.modalRightBody}>
            <CommentsSection 
              ref={commentsSectionRef}
              panRecordId={data.id}
              onCommentCountChange={handleCommentCountChange}
            />
          </div>

          {/* 右侧底部区域 - 评论输入 */}
          <div className={styles.modalRightFooter}>
            <CommentInput
              panRecordId={data.id}
              isLiked={isLiked}
              isCollected={isCollected}
              likeCount={likeCount}
              collectCount={collectCount}
              commentCount={commentCount}
              onLike={handleLike}
              onCollect={handleCollect}
              onShare={() => console.log('分享')}
              onCommentSuccess={handleCommentSuccess}
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
