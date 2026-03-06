import { useState, useEffect, useRef } from 'react';

/**
 * 瀑布流布局Hook
 * @param {Object} options 配置选项
 * @param {number} options.columnCount 列数
 * @param {number} options.gap 间距
 * @returns {Object} 瀑布流布局相关数据和方法
 */
export const useWaterfallLayout = ({ columnCount = 2, gap = 20 }) => {
  const [columns, setColumns] = useState(Array(columnCount).fill(0));
  const [items, setItems] = useState([]);
  const containerRef = useRef(null);
  
  /**
   * 计算新元素的位置
   * @param {Object} item 元素数据
   * @param {number} item.height 元素高度
   * @returns {Object} 元素位置信息
   */
  const calculatePosition = (item) => {
    // 找到高度最小的列
    const minHeight = Math.min(...columns);
    const columnIndex = columns.indexOf(minHeight);
    
    // 计算元素位置
    const position = {
      top: minHeight,
      left: columnIndex * (100 / columnCount) + '%',
      width: `${100 / columnCount - gap / 2}%`,
      columnIndex
    };
    
    // 更新列高度
    const newColumns = [...columns];
    newColumns[columnIndex] = minHeight + item.height + gap;
    setColumns(newColumns);
    
    return position;
  };
  
  /**
   * 添加新元素
   * @param {Array} newItems 新元素数组
   */
  const addItems = (newItems) => {
    const itemsWithPositions = newItems.map(item => ({
      ...item,
      ...calculatePosition(item)
    }));
    setItems(prev => [...prev, ...itemsWithPositions]);
  };
  
  /**
   * 重置布局
   */
  const resetLayout = () => {
    setColumns(Array(columnCount).fill(0));
    setItems([]);
  };
  
  /**
   * 获取容器高度
   */
  const getContainerHeight = () => {
    return Math.max(...columns);
  };
  
  // 监听窗口大小变化，重新计算布局
  useEffect(() => {
    const handleResize = () => {
      resetLayout();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [columnCount, gap]);
  
  return {
    items,
    columns,
    containerRef,
    addItems,
    resetLayout,
    getContainerHeight
  };
};