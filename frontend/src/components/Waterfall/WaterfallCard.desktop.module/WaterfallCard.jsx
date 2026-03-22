/*
 * @file            frontend/src/components/Waterfall/WaterfallCard.desktop.module/WaterfallCard.jsx
 * @description     瀑布流卡片组件，用于显示排盘记录
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-07 16:30:00
 * @lastModified    2026-03-13 12:40:00
 * Copyright © All rights reserved
*/

import React, { useState } from 'react';
import { useImageLazyLoad } from '../../../hooks';
import { formatRelativeTime } from '../../../utils';
import InteractionButtons from '../../Modal/components/InteractionButtons/InteractionButtons';
import styles from './WaterfallCard.desktop.module.css';

/**
 * 瀑布流卡片组件
 * @param {Object} props 组件属性
 * @param {Object} props.item 排盘记录数据
 * @param {Function} props.onClick 点击回调
 * @returns {JSX.Element} 瀑布流卡片组件
 */
const WaterfallCard = ({ item, onClick }) => {
  const [isLiked, setIsLiked] = useState(item.is_liked || false);
  const [likeCount, setLikeCount] = useState(item.like_count || 0);
  const [isCollected, setIsCollected] = useState(item.is_collected || false);
  
  // 使用图片懒加载
  const { imgRef, src, isLoaded, handleLoad } = useImageLazyLoad(
    item.hexagram_image || '',
    'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22 viewBox=%220 0 400 300%22%3E%3Crect width=%22400%22 height=%22300%22 fill=%22%23f0f0f0%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23ccc%22 font-size=%2214%22%3E六爻卦象%3C/text%3E%3C/svg%3E'
  );
  
  // 截断标题
  const truncateTitle = (text, maxLength = 20) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  return (
    <div className={styles.waterfallCard} onClick={onClick}>
      <div className={styles.cardImageContainer}>
        <img
          ref={imgRef}
          src={src}
          alt={item.title || '六爻卦象'}
          onLoad={handleLoad}
          className={isLoaded ? 'loaded' : 'loading'}
        />
        {!isLoaded && (
          <div className={styles.imageLoading}>
            <div className={styles.loadingSpinner}></div>
          </div>
        )}
      </div>
      
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>
          {truncateTitle(item.title || '未命名卦象')}
        </h3>
        
        <div className={styles.cardMeta}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <img
                src={item.user_avatar || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22 viewBox=%220 0 32 32%22%3E%3Ccircle cx=%2216%22 cy=%2216%22 r=%2216%22 fill=%22%23f0f0f0%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23ccc%22 font-size=%2212%22%3E用户%3C/text%3E%3C/svg%3E'}
                alt={item.user_nickname || '用户'}
              />
            </div>
            <span className={styles.userName}>
              {item.user_nickname || '匿名用户'}
            </span>
          </div>
          
          <span className="post-time">
            {formatRelativeTime(item.create_time)}
          </span>
        </div>
        
        <div className={styles.cardStats}>
          <InteractionButtons
            likeCount={likeCount}
            collectCount={item.collect_count || 0}
            commentCount={item.comment_count || 0}
            viewCount={item.view_count || 0}
            showViewCount={true}
            showShare={false}
            isLiked={isLiked}
            isCollected={isCollected}
            onLike={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
              setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
            }}
            onCollect={(e) => {
              e.stopPropagation();
              setIsCollected(!isCollected);
            }}
            onComment={(e) => {
              e.stopPropagation();
            }}
            onShare={(e) => {
              e.stopPropagation();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default WaterfallCard;