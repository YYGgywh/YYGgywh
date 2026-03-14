/*
 * @file            frontend/src/components/Waterfall/WaterfallContainer/WaterfallContainer.jsx
 * @description     瀑布流容器组件，负责管理瀑布流布局、无限滚动和卡片渲染
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-07 17:30:00
 * @lastModified    2026-03-13 12:40:00
 * Copyright © All rights reserved
*/

import React, { useState, useEffect, useCallback } from 'react'; // 导入React核心库和Hooks：useState用于状态管理，useEffect用于副作用处理，useCallback用于函数缓存优化
import { useWaterfallLayout, useInfiniteScroll } from '../../../hooks'; // 导入自定义Hooks：useWaterfallLayout用于瀑布流布局管理，useInfiniteScroll用于无限滚动功能
import WaterfallCard from '../WaterfallCard.desktop.module/WaterfallCard'; // 导入瀑布流卡片组件，用于显示单个排盘记录
import LoadingDots from '../../common/LoadingDots/LoadingDots'; // 导入加载动画组件，用于显示加载状态
import EmptyState from '../../common/EmptyState/EmptyState'; // 导入空状态组件，用于显示无数据时的提示
import styles from './WaterfallContainer.desktop.module.css'; // 导入瀑布流容器样式文件

/**
 * 瀑布流容器组件
 * 负责管理瀑布流布局、无限滚动加载和卡片渲染
 * 
 * @param {Object} props 组件属性对象
 * @param {Array} props.initialItems 初始数据数组，组件挂载时显示的排盘记录列表
 * @param {Function} props.loadMore 加载更多数据的异步函数，当滚动到底部时调用
 * @param {boolean} props.hasMore 是否还有更多数据可加载，控制是否显示加载更多触发器
 * @param {string} props.panType 排盘类型，默认为'liuyao'（六爻），用于区分不同类型的排盘
 * @param {Function} props.onCardClick 卡片点击回调函数，当用户点击卡片时触发，传递卡片数据
 * @returns {JSX.Element} 返回瀑布流容器的JSX元素
 */
const WaterfallContainer = ({ 
  initialItems = [],    // 初始数据数组，默认为空数组
  loadMore,             // 加载更多数据的函数，由父组件传入
  hasMore = false,      // 是否还有更多数据，默认为false
  panType = 'liuyao',  // 排盘类型，默认为六爻
  onCardClick           // 卡片点击回调函数，可选参数
}) => {
  // ===== 状态管理 =====
  const [loading, setLoading] = useState(false);    // 加载状态：控制是否显示加载动画，初始为false
  const [error, setError] = useState(null);        // 错误状态：存储加载失败时的错误信息，初始为null
  const [items, setItems] = useState([]);         // 数据状态：存储当前显示的排盘记录列表，初始为空数组
  
  // ===== 自定义Hooks使用 =====
  // 使用瀑布流布局Hook，管理瀑布流的布局计算和渲染
  const { 
    addItems,      // 添加项目到瀑布流布局的函数
    resetLayout    // 重置瀑布流布局的函数，用于重新计算布局
  } = useWaterfallLayout({ 
    columnCount: 2,  // 瀑布流列数：设置为2列，适合桌面端显示
    gap: 20          // 卡片之间的间距：20像素，确保卡片之间有适当的间隔
  });
  
  // ===== 回调函数定义 =====
  
  // 处理加载更多数据的回调函数
  // 必须在useInfiniteScroll之前定义，因为useInfiniteScroll依赖这个函数
  const handleLoadMore = useCallback(async () => {
    // 防止重复加载：如果正在加载或没有更多数据，直接返回
    if (loading || !hasMore) return;
    
    // 设置加载状态为true，显示加载动画
    setLoading(true);
    try {
      // 调用父组件传入的loadMore函数，加载更多数据
      await loadMore();
    } catch (err) {
      // 加载失败时的错误处理
      setError('加载失败，请重试');  // 设置错误提示信息
      console.error('加载更多数据失败:', err);  // 在控制台输出错误详情，便于调试
    } finally {
      // 无论成功或失败，都重置加载状态
      setLoading(false);
    }
  }, [loading, hasMore, loadMore]);  // 依赖项：当这些值变化时重新创建函数
  
  // 使用无限滚动Hook - 在handleLoadMore定义之后
  // 监听滚动事件，当滚动到页面底部时自动触发加载更多
  const { loadMoreRef } = useInfiniteScroll({
    loadMore: handleLoadMore,  // 滚动到底部时调用的函数
    hasMore,                  // 是否还有更多数据可加载
    loading                   // 当前是否正在加载
  });
  
  // 处理卡片点击的回调函数
  // 当用户点击瀑布流卡片时触发
  const handleCardClick = useCallback((item) => {
    // 如果父组件传入了onCardClick回调函数，则调用它并传递卡片数据
    onCardClick && onCardClick(item);
  }, [onCardClick]);  // 依赖项：当onCardClick函数变化时重新创建函数
  
  // ===== 副作用处理 =====
  
  // 初始加载数据的副作用
  // 当initialItems变化时，重新加载和布局数据
  useEffect(() => {
    // 检查是否有初始数据
    if (initialItems.length > 0) {
      // 重置瀑布流布局，清除之前的布局计算
      resetLayout();
      // 更新组件状态中的数据列表
      setItems(initialItems);
      // 将新数据添加到瀑布流布局中，触发重新计算
      addItems(initialItems);
    }
  }, [initialItems, resetLayout, addItems]);  // 依赖项：当这些值变化时重新执行副作用
  
  // ===== 条件渲染逻辑 =====
  
  // 加载状态渲染：首次加载时显示加载动画
  // 条件：正在加载且没有已加载的数据
  if (loading && items.length === 0) {
    return (
      <div className={styles.waterfallContainer}>
        <div className={styles.loadingContainer}>
          <LoadingDots />  {/* 显示加载动画 */}
          <p>加载中...</p>  {/* 显示加载提示文本 */}
        </div>
      </div>
    );
  }
  
  // 错误状态渲染：加载失败时显示错误信息和重试按钮
  // 条件：有错误信息且没有已加载的数据
  if (error && items.length === 0) {
    return (
      <div className={styles.waterfallContainer}>
        <div className={styles.errorContainer}>
          <p>{error}</p>  {/* 显示错误信息 */}
          <button 
            className={styles.retryButton}
            onClick={() => {
              setError(null);      // 清除错误状态
              loadMore && loadMore();  // 重新尝试加载数据
            }}
          >
            重试  {/* 重试按钮文本 */}
          </button>
        </div>
      </div>
    );
  }
  
  // 空状态渲染：没有数据时显示空状态提示
  // 条件：没有错误且没有数据
  if (items.length === 0) {
    return (
      <div className={styles.waterfallContainer}>
        <EmptyState 
          message="暂无排盘记录"  // 空状态提示信息
          actionText="去排盘"     // 操作按钮文本
          onAction={() => {
            // 点击操作按钮时跳转到排盘页面
            window.location.href = '/divination';
          }}
        />
      </div>
    );
  }
  
  // ===== 主渲染逻辑 =====
  // 返回瀑布流容器的JSX结构
  return (
    <div className={styles.waterfallContainer}>  {/* 瀑布流容器外层，控制整体布局 */}
      <div className={styles.waterfallGrid}>  {/* 瀑布流网格，使用CSS Grid或Flex布局实现瀑布流效果 */}
        {/* 遍历数据列表，渲染每个瀑布流卡片 */}
        {items.map((item) => (
          <WaterfallCard
            key={item.id}  // 使用卡片ID作为唯一标识，确保React能正确识别和更新组件
            item={item}  // 传递卡片数据对象，包含标题、图片、用户信息等
            onClick={() => handleCardClick(item)}  // 绑定点击事件，传递当前卡片数据
          />
        ))}
        
        {/* 加载更多触发点：无限滚动的关键元素 */}
        {hasMore && (  // 条件渲染：只有当还有更多数据时才显示触发点
          <div className={styles.loadMoreTrigger} ref={loadMoreRef}>  {/* 滚动触发器，绑定ref用于监听滚动位置 */}
            {loading && (  // 条件渲染：正在加载时显示加载动画
              <div className={styles.loadingMore}>
                <LoadingDots size="small" />  {/* 显示小型加载动画 */}
                <span>加载中...</span>  {/* 显示加载提示文本 */}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );  // 结束return语句
};  // 结束组件定义

export default WaterfallContainer;  // 导出WaterfallContainer组件作为默认导出
