import React, { useState, useEffect } from 'react';
import { throttle } from '../utils';
import './StickyNav.css';

/**
 * 吸顶导航组件
 * @param {Object} props 组件属性
 * @param {Array} props.navItems 导航项数组
 * @param {string} props.activeItem 当前激活的导航项
 * @param {Function} props.onNavClick 导航点击回调
 */
const StickyNav = ({ 
  navItems = [
    { id: 'all', label: '全部' },
    { id: 'liuyao', label: '六爻' },
    { id: 'fourpillars', label: '四柱' }
  ], 
  activeItem = 'all', 
  onNavClick 
}) => {
  const [isSticky, setIsSticky] = useState(false);
  
  // 处理滚动事件
  const handleScroll = throttle(() => {
    setIsSticky(window.scrollY > 100);
  }, 100);
  
  // 监听滚动事件
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
  
  // 处理导航点击
  const handleNavClick = (itemId) => {
    onNavClick && onNavClick(itemId);
  };
  
  return (
    <nav className={`sticky-nav ${isSticky ? 'sticky' : ''}`}>
      <div>
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
            onClick={() => handleNavClick(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default StickyNav;