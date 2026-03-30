/*
 * @file            frontend/src/components/UserCenter/MainContentArea/MainContentArea.jsx
 * @description     主要内容区域容器组件，负责内容切换和加载状态
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-03 20:45:00
 * @lastModified    2026-03-14 12:00:00
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react';
import styles from './MainContentArea.desktop.module.css';
import mobileStyles from './MainContentArea.mobile.module.css';

/**
 * 主要内容区域容器组件
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子内容
 * @param {boolean} props.loading - 是否加载中
 */
const MainContentArea = ({ children, loading = false }) => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentStyles = isMobile ? mobileStyles : styles;

  return (
    <div className={currentStyles.mainContentArea}>
      <div className={`${currentStyles.mainContentBody} ${loading ? currentStyles.mainContentBodyLoading : ''}`}>
        {loading ? (
          <div className={currentStyles.mainContentLoading}>
            <div className={currentStyles.loadingSpinner}></div>
            <span>加载中...</span>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default MainContentArea;
