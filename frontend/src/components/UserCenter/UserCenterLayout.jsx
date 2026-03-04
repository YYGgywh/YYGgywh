/*
 * @file            frontend/src/components/UserCenter/UserCenterLayout.jsx
 * @description     用户中心布局容器组件，负责整体两栏布局结构
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-03 20:38:00
 * @lastModified    2026-03-03 20:38:00
 * Copyright © All rights reserved
*/

import React from 'react';
import './UserCenterLayout.css';

/**
 * 用户中心布局容器组件
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.sidebar - 左侧导航栏内容
 * @param {React.ReactNode} props.mainContent - 右侧主要内容区域
 */
const UserCenterLayout = ({ sidebar, mainContent }) => {
  return (
    <div className="user-center-layout">
      <aside className="user-center-sidebar">
        {sidebar}
      </aside>
      <main className="user-center-main">
        {mainContent}
      </main>
    </div>
  );
};

export default UserCenterLayout;
