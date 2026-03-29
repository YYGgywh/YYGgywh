/*
 * @file            frontend/src/components/common/MobileTopNavigation/MobileTopNavigation.jsx
 * @description     移动端顶部导航组件，包含返回按钮、页面标题和占位符
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-28 21:00:00
 * @lastModified    2026-03-28 21:15:00
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react';
import desktopStyles from './MobileTopNavigation.desktop.module.css';
import mobileStyles from './MobileTopNavigation.mobile.module.css';

const MobileTopNavigation = ({ title, onBack, showBackButton = true, iconColor = '#111111' }) => {
  const [isMobile, setIsMobile] = useState(() => {
    return window.innerWidth < 768;
  });
  
  useEffect(() => {
    const handleResize = () => {
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 100);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(window.resizeTimeout);
    };
  }, []);
  
  const currentStyles = isMobile ? mobileStyles : desktopStyles;
  
  if (!isMobile) {
    return null;
  }
  
  return (
    <div className={currentStyles.topNavigation}>
      {showBackButton && onBack && (
        <div className={currentStyles.backButton} onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 1024 1024">
            <path 
              d="M631.04 161.941333a42.666667 42.666667 0 0 1 63.061333 57.386667l-2.474666 2.730667-289.962667 292.245333 289.706667 287.402667a42.666667 42.666667 0 0 1 2.730666 57.6l-2.474666 2.752a42.666667 42.666667 0 0 1-57.6 2.709333l-2.752-2.474667-320-317.44a42.666667 42.666667 0 0 1-2.709334-57.6l2.474667-2.752 320-322.56z" 
              fill={iconColor} 
            />
          </svg>
        </div>
      )}
      {!showBackButton && (
        <div className={currentStyles.placeholder}></div>
      )}
      <h2 className={currentStyles.pageTitle}>{title}</h2>
      <div className={currentStyles.placeholder}></div>
    </div>
  );
};

export default MobileTopNavigation;