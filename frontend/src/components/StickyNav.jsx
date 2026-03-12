import React, { useState, useEffect } from 'react';
import { throttle } from '../utils';
import './StickyNav.css';

/**
 * 吸顶导航组件
 * @param {Object} props 组件属性
 * @param {Array} props.navItems 导航项数组，默认为['全部', '六爻', '四柱']
 * @param {string} props.activeItem 当前激活的导航项，默认为'all'
 * @param {Function} props.onNavClick 导航点击回调函数
 * @returns {JSX.Element} 吸顶导航组件
 */
const StickyNav = ({ 
  // 导航项数组，包含id和label属性
  navItems = [
    { id: 'all', label: '全部' },
    { id: 'liuyao', label: '六爻' },
    { id: 'fourpillars', label: '四柱' }
  ], 
  // 当前激活的导航项ID
  activeItem = 'all', 
  // 导航点击回调函数
  onNavClick 
}) => {
  // 吸顶状态，控制导航栏是否固定在顶部
  const [isSticky, setIsSticky] = useState(false);
  
  /**
   * 处理滚动事件
   * 使用throttle函数优化性能，避免滚动时频繁触发
   */
  const handleScroll = throttle(() => {
    // 当滚动距离超过100px时，设置为吸顶状态
    setIsSticky(window.scrollY > 100);
  }, 100); // 100ms的节流间隔
  
  /**
   * 监听滚动事件
   * 组件挂载时添加事件监听，卸载时移除事件监听
   */
  useEffect(() => {
    // 添加滚动事件监听
    window.addEventListener('scroll', handleScroll);
    // 返回清理函数，组件卸载时移除事件监听
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]); // 依赖于handleScroll函数
  
  /**
   * 处理导航点击事件
   * @param {string} itemId 导航项ID
   */
  const handleNavClick = (itemId) => {
    // 如果提供了点击回调函数，则调用它并传递导航项ID
    onNavClick && onNavClick(itemId);
  };
  
  // 渲染组件
  return (
    // 导航容器，根据isSticky状态添加sticky类
    <nav className={`sticky-nav ${isSticky ? 'sticky' : ''}`}>
      <div>
        {/* 遍历导航项数组，渲染每个导航按钮 */}
        {navItems.map((item) => (
          <button
            key={item.id} // 使用导航项ID作为key
            className={`nav-item ${activeItem === item.id ? 'active' : ''}`} // 根据activeItem添加active类
            onClick={() => handleNavClick(item.id)} // 点击时调用handleNavClick函数
          >
            {item.label} {/* 显示导航项标签 */}
          </button>
        ))}
      </div>
    </nav>
  );
};

// 导出StickyNav组件
export default StickyNav;