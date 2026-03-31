/*
 * @file            frontend/src/components/UserCenter/MobileUserCenter/MobileUserCenterLayout/MobileUserCenterLayout.jsx
 * @description     移动端用户中心布局容器组件，整合个人信息头部、内容标签栏和类型标签栏
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-30 12:57:00
 * @lastModified    2026-03-30 19:16:05
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './MobileUserCenterLayout.desktop.module.css';
import mobileStyles from './MobileUserCenterLayout.mobile.module.css';
import MobileUserProfileHeader from '../MobileUserProfileHeader/MobileUserProfileHeader';
import CardTags from '../../../Card/CardTags/CardTags.jsx';
import PanRecordsContent from '../../PanRecordsContent/PanRecordsContent.jsx';

/**
 * 移动端用户中心布局容器组件
 * 整合个人信息头部、内容标签栏和类型标签栏
 * 
 * @param {Object} props 组件属性
 * @param {Object} props.userInfo 用户信息
 * @param {string} props.activeContentTab 当前激活的内容标签
 * @param {string} props.activeRecordType 当前激活的记录类型
 * @param {Array} props.records 排盘记录列表
 * @param {Function} props.onContentTabChange 内容标签切换回调
 * @param {Function} props.onRecordTypeChange 记录类型切换回调
 * @param {Function} props.onAvatarUpload 头像上传回调
 * @param {Function} props.onProfileUpdate 个人信息更新回调
 * @param {Function} props.onRecordAction 记录操作回调
 * @returns {JSX.Element} 移动端用户中心布局
 */
const MobileUserCenterLayout = ({
  userInfo = {},
  activeContentTab = '记录',
  activeRecordType = '六爻',
  records = [],
  onContentTabChange,
  onRecordTypeChange,
  onAvatarUpload,
  onProfileUpdate,
  onRecordAction
}) => {
  // 移动端状态管理
  const [isMobile, setIsMobile] = useState(() => {
    return window.innerWidth < 768;
  });
  
  // 内容标签配置
  const contentTabs = [
    { id: '记录', label: '记录' },
    { id: '收藏', label: '收藏', disabled: true },
    { id: '喜欢', label: '喜欢', disabled: true }
  ];
  
  // 记录类型配置
  const recordTypes = [
    { id: '六爻', label: '六爻' },
    { id: '梅花', label: '梅花', disabled: true },
    { id: '八字', label: '八字', disabled: true },
    { id: '奇门', label: '奇门', disabled: true }
  ];
  
  // 监听窗口大小变化
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
  
  // 根据屏幕尺寸选择样式
  const currentStyles = isMobile ? mobileStyles : styles;
  
  // 处理内容标签点击
  const handleContentTabClick = (tabId) => {
    if (onContentTabChange) {
      onContentTabChange(tabId);
    }
  };
  
  // 处理记录类型标签点击
  const handleRecordTypeClick = (typeId) => {
    if (onRecordTypeChange) {
      onRecordTypeChange(typeId);
    }
  };
  
  // 渲染内容区域
  const renderContent = () => {
    switch (activeContentTab) {
      case '记录':
        return (
          <div className={currentStyles.contentArea}>
            <PanRecordsContent
              records={records}
              loading={false}
              currentPage={1}
              totalPages={1}
              onPageChange={() => {}}
              onViewDetail={(record) => {
                if (onRecordAction) {
                  onRecordAction('view', record);
                }
              }}
              onLike={() => {}}
              onCollect={() => {}}
              onComment={() => {}}
              onShare={() => {}}
              onDelete={(recordId) => {
                if (onRecordAction) {
                  onRecordAction('delete', recordId);
                }
              }}
              onRefresh={() => {}}
              formatTime={(timestamp) => {
                if (!timestamp) return '2026-03-30';
                return new Date(timestamp * 1000).toLocaleDateString('zh-CN');
              }}
              panTypeToChinese={(type) => {
                const typeMap = {
                  'liuyao': '六爻',
                  'sizhu': '八字',
                  'bagua': '八卦'
                };
                return typeMap[type] || '六爻';
              }}
              activeRecordType={activeRecordType}
              onRecordTypeChange={handleRecordTypeClick}
            />
          </div>
        );
      case '收藏':
      case '喜欢':
        return (
          <div className={currentStyles.contentArea}>
            <div className={currentStyles.placeholderContent}>
              <h3>{activeContentTab}内容</h3>
              <div className={currentStyles.emptyState}>
                <p>功能开发中...</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className={currentStyles.mobileUserCenterLayout}>
      {/* 个人信息头部 */}
      <MobileUserProfileHeader
        userInfo={userInfo}
        onAvatarUpload={onAvatarUpload}
        onProfileUpdate={onProfileUpdate}
      />
      
      {/* 内容标签栏 */}
      <div className={currentStyles.contentTabs}>
        {contentTabs.map((tab) => (
          <button
            key={tab.id}
            className={`${currentStyles.contentTab} ${activeContentTab === tab.id ? currentStyles.activeContentTab : ''} ${tab.disabled ? currentStyles.disabledTab : ''}`}
            onClick={() => !tab.disabled && handleContentTabClick(tab.id)}
            disabled={tab.disabled}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* 记录类型标签栏 */}
      <div className={currentStyles.recordTypeSection}>
        <CardTags
          tags={recordTypes.filter(t => !t.disabled).map(t => t.label)}
          activeTag={activeRecordType}
          onTagClick={handleRecordTypeClick}
          interactive={true}
          maxTags={4}
        />
      </div>
      
      {/* 内容区域 */}
      {renderContent()}
    </div>
  );
};

// PropTypes 类型定义
MobileUserCenterLayout.propTypes = {
  userInfo: PropTypes.object,
  activeContentTab: PropTypes.string,
  activeRecordType: PropTypes.string,
  records: PropTypes.array,
  onContentTabChange: PropTypes.func,
  onRecordTypeChange: PropTypes.func,
  onAvatarUpload: PropTypes.func,
  onProfileUpdate: PropTypes.func,
  onRecordAction: PropTypes.func
};

// 组件显示名称
MobileUserCenterLayout.displayName = 'MobileUserCenterLayout';

export default MobileUserCenterLayout;