import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * 无限滚动Hook
 * @param {Object} options 配置选项
 * @param {Function} options.loadMore 加载更多数据的函数
 * @param {boolean} options.hasMore 是否还有更多数据
 * @param {boolean} options.loading 是否正在加载
 * @param {number} options.threshold 触发加载的阈值
 * @returns {Object} 无限滚动相关数据和方法
 */
export const useInfiniteScroll = ({
  loadMore,
  hasMore = false,
  loading = false,
  threshold = 100
}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);
  
  // 处理交叉观察
  const handleIntersect = useCallback((entries) => {
    const entry = entries[0];
    if (entry.isIntersecting && hasMore && !loading) {
      setIsIntersecting(true);
      loadMore && loadMore();
    }
  }, [hasMore, loading, loadMore]);
  
  // 初始化交叉观察器
  useEffect(() => {
    if (loadMoreRef.current) {
      observerRef.current = new IntersectionObserver(handleIntersect, {
        rootMargin: `0px 0px ${threshold}px 0px`,
        threshold: 0.1
      });
      observerRef.current.observe(loadMoreRef.current);
    }
    
    return () => {
      if (observerRef.current && loadMoreRef.current) {
        observerRef.current.unobserve(loadMoreRef.current);
      }
    };
  }, [handleIntersect, threshold]);
  
  return {
    loadMoreRef,
    isIntersecting
  };
};