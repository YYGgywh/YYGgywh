import React, { useState, useEffect } from 'react';
import { throttle } from '../utils';
import './BackToTop.css';

/**
 * 返回顶部组件
 */
const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  
  // 处理滚动事件
  const handleScroll = throttle(() => {
    setVisible(window.scrollY > 300);
  }, 100);
  
  // 监听滚动事件
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
  
  // 处理返回顶部
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  if (!visible) return null;
  
  return (
    <button className="back-to-top" onClick={handleBackToTop}>
      ↑
    </button>
  );
};

export default BackToTop;