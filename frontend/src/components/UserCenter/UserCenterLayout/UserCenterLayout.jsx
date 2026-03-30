/*
 * @file            frontend/src/components/UserCenter/UserCenterLayout/UserCenterLayout.jsx
 * @description     用户中心布局容器组件，负责整体两栏布局结构
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-03 20:38:00
 * @lastModified    2026-03-29 17:45:23
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react';
import styles from './UserCenterLayout.desktop.module.css';
import mobileStyles from './UserCenterLayout.mobile.module.css';

/**
 * 用户中心布局容器组件
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.sidebar - 左侧导航栏内容
 * @param {React.ReactNode} props.mainContent - 右侧主要内容区域
 */
const UserCenterLayout = ({ sidebar, mainContent }) => {
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
    <div className={currentStyles.userCenterLayout}>
      <aside className={currentStyles.userCenterSidebar}>
        {sidebar}
      </aside>
      <main className={currentStyles.userCenterMain}>
        {mainContent}
      </main>
    </div>
  );
};

export default UserCenterLayout;
