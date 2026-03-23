/*
 * @file            frontend/src/components/Card/PointsInfo/PointsInfo.jsx
 * @description     积分信息组件，用于显示卡片中的积分信息
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-22 16:46:00
 * @lastModified    2026-03-22 19:36:33
 * Copyright © All rights reserved
*/

import React from 'react';
import PropTypes from 'prop-types';
import styles from './PointsInfo.desktop.module.css';

/**
 * 积分信息组件
 * 显示卡片中的积分信息，使用橙色背景突出显示
 * 
 * @param {Object} props 组件属性
 * @param {number} props.points 积分数值
 * @param {string} props.className 自定义类名
 * @returns {JSX.Element|null} 返回积分信息的 JSX 元素，无积分时返回 null
 */
const PointsInfo = ({ points, className = '' }) => {
  // 如果没有积分，不渲染任何内容
  if (points === undefined || points === null || points <= 0) {
    return null;
  }

  return (
    <div className={`${styles.pointsInfo} ${className}`}>
      <span className={styles.pointsText}>悬赏积分 {points}分</span>
    </div>
  );
};

// 为 PointsInfo 组件添加 PropTypes 类型定义
PointsInfo.propTypes = {
  points: PropTypes.number,
  className: PropTypes.string
};

// 为 PointsInfo 组件添加 displayName，便于在 React DevTools 中调试
PointsInfo.displayName = 'PointsInfo';

export default PointsInfo;