import React, { useState, useEffect, useCallback } from 'react';
import { useWaterfallLayout, useInfiniteScroll } from '../../hooks';
import WaterfallCard from './WaterfallCard';
import LoadingDots from '../common/LoadingDots';
import EmptyState from '../common/EmptyState';
import './WaterfallContainer.css';

/**
 * 瀑布流容器组件
 * @param {Object} props 组件属性
 * @param {Array} props.initialItems 初始数据
 * @param {Function} props.loadMore 加载更多数据的函数
 * @param {boolean} props.hasMore 是否还有更多数据
 * @param {string} props.panType 排盘类型
 * @param {Function} props.onCardClick 卡片点击回调
 */
const WaterfallContainer = ({ 
  initialItems = [], 
  loadMore, 
  hasMore = false, 
  panType = 'liuyao',
  onCardClick 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  
  // 使用瀑布流布局Hook
  const { 
    addItems, 
    resetLayout 
  } = useWaterfallLayout({ 
    columnCount: 2, 
    gap: 20 
  });
  
  // 处理加载更多数据 - 必须在useInfiniteScroll之前定义
  const handleLoadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      await loadMore();
    } catch (err) {
      setError('加载失败，请重试');
      console.error('加载更多数据失败:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, loadMore]);
  
  // 使用无限滚动Hook - 在handleLoadMore定义之后
  const { loadMoreRef } = useInfiniteScroll({
    loadMore: handleLoadMore,
    hasMore,
    loading
  });
  
  // 处理卡片点击
  const handleCardClick = useCallback((item) => {
    onCardClick && onCardClick(item);
  }, [onCardClick]);
  
  // 初始加载数据
  useEffect(() => {
    if (initialItems.length > 0) {
      resetLayout();
      setItems(initialItems);
      addItems(initialItems);
    }
  }, [initialItems, resetLayout, addItems]);
  
  // 加载状态
  if (loading && items.length === 0) {
    return (
      <div className="waterfall-container">
        <div className="loading-container">
          <LoadingDots />
          <p>加载中...</p>
        </div>
      </div>
    );
  }
  
  // 错误状态
  if (error && items.length === 0) {
    return (
      <div className="waterfall-container">
        <div className="error-container">
          <p>{error}</p>
          <button 
            className="retry-button"
            onClick={() => {
              setError(null);
              loadMore && loadMore();
            }}
          >
            重试
          </button>
        </div>
      </div>
    );
  }
  
  // 空状态
  if (items.length === 0) {
    return (
      <div className="waterfall-container">
        <EmptyState 
          message="暂无排盘记录"
          actionText="去排盘"
          onAction={() => {
            window.location.href = '/divination';
          }}
        />
      </div>
    );
  }
  
  return (
    <div className="waterfall-container">
      <div className="waterfall-grid">
        {items.map((item) => (
          <WaterfallCard
            key={item.id}
            item={item}
            onClick={() => handleCardClick(item)}
          />
        ))}
        
        {/* 加载更多触发点 */}
        {hasMore && (
          <div className="load-more-trigger" ref={loadMoreRef}>
            {loading && (
              <div className="loading-more">
                <LoadingDots size="small" />
                <span>加载中...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WaterfallContainer;
