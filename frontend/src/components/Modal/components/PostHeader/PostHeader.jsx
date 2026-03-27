/*
 * @file            frontend/src/components/common/PostHeader/PostHeader.jsx
 * @description     帖子头部组件，包含标题、标签和发布元数据
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-17 18:30:00
 * @lastModified    2026-03-18 10:12:45
 * Copyright © All rights reserved
*/

// 导入 React
import React, { useState, useEffect } from 'react';
// 导入时间格式化工具函数
import { formatStandardTime } from '../../../../utils';
// 导入样式文件
import desktopStyles from './PostHeader.desktop.module.css';
import mobileStyles from './PostHeader.mobile.module.css';

// 帖子头部组件，接收数据和配置参数作为 props
const PostHeader = ({ 
  data, // 帖子数据对象
  showTitle = true, // 是否显示标题，默认为 true
  showTags = true, // 是否显示标签，默认为 true
  showMeta = true, // 是否显示发布元数据，默认为 true
  isMobile = false // 是否为移动端
}) => {
  // 根据屏幕尺寸选择样式
  const styles = isMobile ? mobileStyles : desktopStyles;
  // 渲染组件
  return (
    <div className={styles.postHeader}>
      {/* 条件渲染：如果 showTitle 为 true，则显示标题 */}
      {showTitle && (
        <h2 className={styles.postTitle}>
          {/* 显示帖子标题，如果没有则显示 '未命名卦象' */}
          {data.title || "未命名卦象"}
        </h2>
      )}
      
      {/* 条件渲染：如果 showTags 为 true 且 data.tags 存在且长度大于 0，则显示标签 */}
      {showTags && data.tags && data.tags.length > 0 && (
        <div className={styles.tagsSection}>
          {/* 遍历 tags 数组，渲染每个标签 */}
          {data.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {/* 条件渲染：如果 showMeta 为 true，则显示发布元数据 */}
      {showMeta && (
        <div className={styles.postMeta}>
          {/* 显示发布时间，使用 formatStandardTime 函数格式化 */}
          <span className={styles.postTime}>{formatStandardTime(data.create_time)}</span>
          {/* 条件渲染：如果 data.location 存在，则显示发布地点 */}
          {data.location && <span className={styles.postLocation}>{data.location}</span>}
        </div>
      )}
    </div>
  );
};

// 设置组件的 displayName，便于在 React DevTools 中识别
PostHeader.displayName = 'PostHeader';
// 导出组件
export default PostHeader;