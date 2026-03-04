/*
 * @file            frontend/src/components/UserCenter/MainContentArea.jsx
 * @description     主要内容区域容器组件，负责内容切换和加载状态
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-03 20:45:00
 * @lastModified    2026-03-03 21:06:33
 * Copyright © All rights reserved
*/

import React from 'react';
import './MainContentArea.css';

/**
 * 主要内容区域容器组件
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子内容
 * @param {boolean} props.loading - 是否加载中
 */
const MainContentArea = ({ children, loading = false }) => {
  return (
    <div className="main-content-area">
      <div className={`main-content-body ${loading ? 'main-content-body--loading' : ''}`}>
        {loading ? (
          <div className="main-content-loading">
            <div className="loading-spinner"></div>
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
