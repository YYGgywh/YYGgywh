/*
 * @file            frontend/src/components/common/ActionButtons/ActionButtons.jsx
 * @description     操作按钮组件，提供保存和发布功能
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-15 10:00:00
 * @lastModified    2026-03-16 15:21:38
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup } from '../Button';
import styles from './ActionButtons.desktop.module.css';
import mobileStyles from './ActionButtons.mobile.module.css';

const ActionButtons = React.memo(({ 
  onSave, 
  onPublish, 
  loading = false, 
  disabled = false 
}) => {
  // 移动端状态管理
  const [isMobile, setIsMobile] = useState(() => {
    return window.innerWidth < 768;
  });
  
  // 监听窗口大小变化，更新移动端状态
  useEffect(() => {
    const handleResize = () => {
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 100);
    };
    
    // 初始执行一次
    handleResize();
    // 添加窗口大小变化监听器
    window.addEventListener('resize', handleResize);
    // 组件卸载时移除监听器
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(window.resizeTimeout);
    };
  }, []);
  
  // 根据屏幕尺寸选择样式
  const currentStyles = isMobile ? mobileStyles : styles;
  
  const handleSave = () => {
    if (!loading && !disabled && onSave) {
      onSave();
    }
  };

  const handlePublish = () => {
    if (!loading && !disabled && onPublish) {
      onPublish();
    }
  };

  return (
    <ButtonGroup className={currentStyles.actionButtons} spacing="medium">
      <Button
        type="primary"
        size="small"
        onClick={handleSave}
        loading={loading}
        disabled={disabled}
        ariaLabel="保存排盘记录"
      >
        {loading ? '保存中...' : '保存'}
      </Button>
      <Button
        type="confirm"
        size="small"
        onClick={handlePublish}
        loading={loading}
        disabled={disabled}
        ariaLabel="发布排盘记录"
      >
        {loading ? '发布中...' : '发布'}
      </Button>
    </ButtonGroup>
  );
});

ActionButtons.propTypes = {
  onSave: PropTypes.func,
  onPublish: PropTypes.func,
  loading: PropTypes.bool,
  disabled: PropTypes.bool
};

// 为 ActionButtons 组件添加 displayName，便于在 React DevTools 中调试
ActionButtons.displayName = 'ActionButtons';

export default ActionButtons;