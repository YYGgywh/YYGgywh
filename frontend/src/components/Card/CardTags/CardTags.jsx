/*
 * @file            frontend/src/components/Card/CardTags/CardTags.jsx
 * @description     卡片标签组件，用于显示卡片顶部的标签列表
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-22 16:45:00
 * @lastModified    2026-03-22 17:05:11
 * Copyright © All rights reserved
*/

import React from 'react';
import PropTypes from 'prop-types';
import styles from './CardTags.desktop.module.css';

/**
 * 卡片标签组件
 * 显示卡片顶部的标签列表，支持最多3个标签
 * 
 * @param {Object} props 组件属性
 * @param {Array} props.tags 标签数组
 * @param {string} props.className 自定义类名
 * @returns {JSX.Element|null} 返回标签列表的 JSX 元素，无标签时返回 null
 */
const CardTags = ({ tags = [], className = '' }) => {
  // 如果没有标签，不渲染任何内容
  if (!tags || tags.length === 0) {
    return null;
  }

  // 最多显示3个标签
  const displayTags = tags.slice(0, 3);

  return (
    <div className={`${styles.cardTags} ${className}`}>
      {displayTags.map((tag, index) => (
        <span key={index} className={styles.tagItem}>
          {tag}
        </span>
      ))}
    </div>
  );
};

// 为 CardTags 组件添加 PropTypes 类型定义
CardTags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string
};

// 为 CardTags 组件添加 displayName，便于在 React DevTools 中调试
CardTags.displayName = 'CardTags';

export default CardTags;