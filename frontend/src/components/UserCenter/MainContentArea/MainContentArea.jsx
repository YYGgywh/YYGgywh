/*
 * @file            frontend/src/components/UserCenter/MainContentArea/MainContentArea.jsx
 * @description     主要内容区域容器组件，负责内容切换和加载状态
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-03 20:45:00
 * @lastModified    2026-03-14 12:00:00
 * Copyright © All rights reserved
*/

import React from 'react';
import styles from './MainContentArea.desktop.module.css';

/**
 * 主要内容区域容器组件
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子内容
 * @param {boolean} props.loading - 是否加载中
 */
const MainContentArea = ({ children, loading = false }) => {
  return (
    <div className={styles.mainContentArea}>
      <div className={`${styles.mainContentBody} ${loading ? styles.mainContentBodyLoading : ''}`}>
        {loading ? (
          <div className={styles.mainContentLoading}>
            <div className={styles.loadingSpinner}></div>
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
