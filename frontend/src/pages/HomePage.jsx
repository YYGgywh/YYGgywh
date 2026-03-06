/*
 * @file            frontend/src/pages/HomePage.jsx
 * @description     
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-05 13:38:55
 * @lastModified    2026-03-06 16:00:00
 * Copyright © All rights reserved
*/

/* eslint-disable */
import React, { useState, useEffect } from 'react';
import Navigation from '../components/Header/Navigation/Navigation';
import BackToTop from '../components/BackToTop';
import { getPublicPanList } from '../api/panApi';
import hexagram1 from '../assets/images/hexagram-1.svg';
import hexagram2 from '../assets/images/hexagram-2.svg';
import hexagram3 from '../assets/images/hexagram-3.svg';
import hexagram4 from '../assets/images/hexagram-4.svg';
import avatar1 from '../assets/images/avatar-1.svg';
import avatar2 from '../assets/images/avatar-2.svg';
import avatar3 from '../assets/images/avatar-3.svg';
import avatar4 from '../assets/images/avatar-4.svg';
import avatar5 from '../assets/images/avatar-5.svg';
import avatar6 from '../assets/images/avatar-6.svg';
import avatar7 from '../assets/images/avatar-7.svg';
import avatar8 from '../assets/images/avatar-8.svg';
import avatar9 from '../assets/images/avatar-9.svg';
import avatar10 from '../assets/images/avatar-10.svg';
import './HomePage.css';
import LikeButton from '../components/common/LikeButton';
import { getUserInfo } from '../utils/storage';
import CompactLiuYaoDisplay from '../components/common/CompactLiuYaoDisplay';
import PanDetailModal from '../components/Modal/PanDetailModal';

/**
 * 首页组件
 */
const HomePage = () => {
  // 状态管理
  const [panRecords, setPanRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPanData, setSelectedPanData] = useState(null);

  // 处理卡片点击事件
  const handleCardClick = (item) => {
    setSelectedPanData(item);
    setShowModal(true);
  };

  // 处理弹窗关闭事件
  const handleModalClose = () => {
    setShowModal(false);
    setSelectedPanData(null);
  };

  // 头像和卦象图片资源
  const avatarImages = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8, avatar9, avatar10];
  const hexagramImages = [hexagram1, hexagram2, hexagram3, hexagram4];

  // 标签数据
  const availableTags = ["学习", "心得", "实例", "解析", "八卦", "详解", "梅花易数", "技巧", "风水", "居家", "八字", "命理", "奇门遁甲", "教程", "面相", "运势", "姓名学", "起名", "塔罗牌", "占卜"];

  // 获取公开排盘记录
  const fetchPanRecords = async () => {
    try {
      setLoading(true);
      // 获取当前登录用户信息
      const userInfo = getUserInfo();
      const userId = userInfo?.id || userInfo?.user_id;
      
      const response = await getPublicPanList({
        page: 1,
        size: 12,
        sort: "newest",
        pan_type: "liuyao",
        user_id: userId
      });

      if (response.code === 200 || response.success) {
        // 处理API返回的数据
        const records = response.data || [];
        
        // 格式化数据，确保与组件期望的结构一致
        const formattedRecords = records.map((record, index) => {
          // 解析排盘参数和结果
          let panParams = {};
          let panResult = {};
          try {
            panParams = typeof record.pan_params === 'string' ? JSON.parse(record.pan_params) : record.pan_params || {};
            panResult = typeof record.pan_result === 'string' ? JSON.parse(record.pan_result) : record.pan_result || {};
          } catch (e) {
            console.error('解析排盘数据失败:', e);
          }

          // 生成随机标签
          const randomTags = [];
          const tagCount = Math.floor(Math.random() * 2) + 1; // 1-2个标签
          for (let i = 0; i < tagCount; i++) {
            const randomTag = availableTags[Math.floor(Math.random() * availableTags.length)];
            if (!randomTags.includes(randomTag)) {
              randomTags.push(randomTag);
            }
          }

          return {
            id: record.id,
            title: record.supplement || panParams.question || "未填写标题",
            tags: randomTags,
            user_nickname: record.user?.nickname || "匿名用户",
            user_avatar: record.user?.avatar_url || avatarImages[index % avatarImages.length],
            create_time: record.create_time,
            hexagram_image: hexagramImages[index % hexagramImages.length],
            like_count: record.like_count || 0,
            collect_count: record.collect_count || 0,
            view_count: record.view_count || 0,
            comment_count: record.comment_count || 0,
            is_liked: record.is_liked || false,
            pan_result: panResult
          };
        });

        setPanRecords(formattedRecords);
      } else {
        throw new Error(response.msg || "获取排盘记录失败");
      }
    } catch (error) {
      console.error('获取排盘记录失败:', error);
      setError(error.message || "网络错误，请稍后重试");
      
      // 备用方案：使用静态数据
      const fallbackRecords = [
        {
          id: 1,
          title: "学习易经心得分享，如何快速入门",
          tags: ["学习", "心得"],
          user_nickname: "易经爱好者",
          user_avatar: avatar1,
          create_time: new Date(Date.now() - 3600000).toISOString(),
          hexagram_image: hexagram1,
          like_count: 234,
          collect_count: 156,
          view_count: 3500,
          comment_count: 67,
          is_liked: false
        },
        {
          id: 2,
          title: "六爻排盘实例解析，初学者必看",
          tags: ["实例", "解析"],
          user_nickname: "易学大师",
          user_avatar: avatar2,
          create_time: new Date(Date.now() - 7200000).toISOString(),
          hexagram_image: hexagram2,
          like_count: 567,
          collect_count: 342,
          view_count: 8900,
          comment_count: 123,
          is_liked: false
        }
      ];
      setPanRecords(fallbackRecords);
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时获取数据
  useEffect(() => {
    fetchPanRecords();
  }, []);

  // 渲染排盘记录
  const renderPanRecords = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>加载中...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <p>{error}</p>
          <button className="retry-button" onClick={fetchPanRecords}>
            重试
          </button>
        </div>
      );
    }

    if (panRecords.length === 0) {
      return (
        <div className="empty-container">
          <p>暂无排盘记录</p>
        </div>
      );
    }

    return (
      <div className="waterfall-container">
        <div className="waterfall-grid">
          {panRecords.map((item) => (
            <div 
              key={item.id} 
              className="waterfall-card"
              onClick={() => handleCardClick(item)}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-image-container">
                {/* 六爻排盘结果可视化展示 */}
                <div className="hexagram-display">
                  {item.pan_result?.ben_gua_body ? (
                    <CompactLiuYaoDisplay panResult={item.pan_result} />
                  ) : (
                    <div className="hexagram-placeholder">
                      <div className="placeholder-content">
                        <span>六爻卦象</span>
                      </div>
                    </div>
                  )}
                </div>
                {item.tags && item.tags.length > 0 && (
                  <div className="card-tags">
                    {item.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="card-tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="card-content">
                <h3 className="card-title">{item.title}</h3>
                
                <div className="card-meta">
                  <div className="user-info">
                    <div className="user-avatar">
                      <img src={item.user_avatar} alt={item.user_nickname} />
                    </div>
                    <span className="user-name">{item.user_nickname}</span>
                  </div>
                  
                  <span className="post-time">2小时前</span>
                </div>
                
                <div className="card-stats">
                  <LikeButton
                    panId={item.id}
                    isLiked={item.is_liked || false}
                    likeCount={item.like_count || 0}
                    onLikeSuccess={(newLiked, newCount) => {
                      // 点赞成功后的回调，可以更新本地数据
                      console.log('点赞成功 - 状态:', newLiked, '数量:', newCount);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <Navigation />
      </header>
      
      <main className="app-main">
        <div className="home-container">
          {/* 推荐标签 */}
          <div className="recommended-tags">
            <div className="tag-item active">全部</div>
            <div className="tag-item">六爻</div>
            <div className="tag-item">四柱</div>
            <div className="tag-item">风水</div>
            <div className="tag-item">命理</div>
            <div className="tag-item">占卜</div>
          </div>
          
          {/* 瀑布流容器 */}
          {renderPanRecords()}
        </div>
      </main>
      
      <BackToTop />
      
      {/* 排盘详情弹窗 */}
      <PanDetailModal
        isOpen={showModal}
        onClose={handleModalClose}
        data={selectedPanData}
      />
    </div>
  );
};

export default HomePage;
