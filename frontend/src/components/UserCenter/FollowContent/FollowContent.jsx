/*
 * @file            frontend/src/components/UserCenter/FollowContent/FollowContent.jsx
 * @description     关注列表页面组件，显示用户关注的对象和关注用户的对象列表
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-24 20:00:00
 * @lastModified    2026-03-24 20:00:00
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react';
import styles from './FollowContent.desktop.module.css';
import mobileStyles from './FollowContent.mobile.module.css';

// 根据设备类型选择样式
const isMobile = window.innerWidth < 768;
const style = isMobile ? mobileStyles : styles;
import { getFollowingList, getFollowersList, unfollowUser } from '../../../api/userApi';
import { isLoggedIn, getUserInfo } from '../../../utils/storage';
import { getUserAvatar } from '../../../utils/avatarUtils';

/**
 * 关注列表页面组件
 */
const FollowContent = () => {
  const [activeTab, setActiveTab] = useState('following'); // 'following' 或 'followers'
  const [followingList, setFollowingList] = useState([]);
  const [followersList, setFollowersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 加载关注列表
  const loadFollowingList = async (reset = false) => {
    if (!isLoggedIn()) {
      setError('请先登录');
      return;
    }

    if (loading || (!hasMore && !reset)) return;

    setLoading(true);
    setError(null);

    try {
      const currentPage = reset ? 1 : page;
      const skip = (currentPage - 1) * 20;
      const response = await getFollowingList(skip, 20);
      
      if (response.code === 200) {
        const newList = response.data || [];
        setFollowingList(prev => reset ? newList : [...prev, ...newList]);
        setHasMore(newList.length === 20);
        setPage(prev => reset ? 2 : prev + 1);
      } else {
        setError(response.msg || '加载关注列表失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error('加载关注列表失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 加载粉丝列表
  const loadFollowersList = async (reset = false) => {
    if (!isLoggedIn()) {
      setError('请先登录');
      return;
    }

    if (loading || (!hasMore && !reset)) return;

    setLoading(true);
    setError(null);

    try {
      const currentPage = reset ? 1 : page;
      const skip = (currentPage - 1) * 20;
      const response = await getFollowersList(skip, 20);
      
      if (response.code === 200) {
        const newList = response.data || [];
        setFollowersList(prev => reset ? newList : [...prev, ...newList]);
        setHasMore(newList.length === 20);
        setPage(prev => reset ? 2 : prev + 1);
      } else {
        setError(response.msg || '加载粉丝列表失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error('加载粉丝列表失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 取消关注
  const handleUnfollow = async (userId) => {
    if (!isLoggedIn()) {
      setError('请先登录');
      return;
    }

    try {
      const response = await unfollowUser(userId);
      if (response.code === 200) {
        // 更新关注列表
        setFollowingList(prev => prev.filter(item => item.user_id !== userId));
      } else {
        setError(response.msg || '取消关注失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error('取消关注失败:', err);
    }
  };

  // 切换标签时重新加载数据
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setError(null);
    
    if (activeTab === 'following') {
      setFollowingList([]);
      loadFollowingList(true);
    } else {
      setFollowersList([]);
      loadFollowersList(true);
    }
  }, [activeTab]);

  // 初始加载
  useEffect(() => {
    loadFollowingList(true);
  }, []);

  // 加载更多
  const handleLoadMore = () => {
    if (activeTab === 'following') {
      loadFollowingList();
    } else {
      loadFollowersList();
    }
  };

  // 渲染用户项
  const renderUserItem = (user) => (
    <div key={user.user_id} className={style.userItem}>
      <div className={style.userAvatar}>
        <img 
          src={getUserAvatar(user.avatar, user.nickname)} 
          alt={user.nickname} 
          className={style.avatarImage}
        />
      </div>
      <div className={style.userInfo}>
        <div className={style.userNickname}>{user.nickname || '未设置昵称'}</div>
        {user.follow_time && (
          <div className={style.followTime}>
            关注时间：{new Date(user.follow_time * 1000).toLocaleString('zh-CN')}
          </div>
        )}
      </div>
      {activeTab === 'following' && (
        <button 
          className={style.unfollowButton}
          onClick={() => handleUnfollow(user.user_id)}
        >
          取消关注
        </button>
      )}
    </div>
  );

  return (
    <div className={style.followContent}>
      <div className={style.followHeader}>
        <h2 className={style.followTitle}>关注管理</h2>
        <div className={style.tabContainer}>
          <button
            className={`${style.tabButton} ${activeTab === 'following' ? style.activeTab : ''}`}
            onClick={() => setActiveTab('following')}
          >
            我关注的
          </button>
          <button
            className={`${style.tabButton} ${activeTab === 'followers' ? style.activeTab : ''}`}
            onClick={() => setActiveTab('followers')}
          >
            关注我的
          </button>
        </div>
      </div>

      {error && (
        <div className={style.errorMessage}>
          {error}
        </div>
      )}

      <div className={style.userList}>
        {activeTab === 'following' ? (
          followingList.length > 0 ? (
            followingList.map(user => renderUserItem(user))
          ) : (
            <div className={style.emptyState}>
              {loading ? '加载中...' : '您还没有关注任何人'}
            </div>
          )
        ) : (
          followersList.length > 0 ? (
            followersList.map(user => renderUserItem(user))
          ) : (
            <div className={style.emptyState}>
              {loading ? '加载中...' : '还没有人关注您'}
            </div>
          )
        )}
      </div>

      {hasMore && !loading && (
        <div className={style.loadMoreContainer}>
          <button 
            className={style.loadMoreButton}
            onClick={handleLoadMore}
          >
            加载更多
          </button>
        </div>
      )}

      {loading && (
        <div className={style.loadingState}>
          加载中...
        </div>
      )}
    </div>
  );
};

export default FollowContent;