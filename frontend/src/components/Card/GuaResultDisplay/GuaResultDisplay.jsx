/*
 * @file            frontend/src/components/Card/GuaResultDisplay/GuaResultDisplay.jsx
 * @description     卦象结果显示组件，用于显示卦象：巽为风 → 艮为山
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-23 13:45:00
 * @lastModified    2026-03-23 13:45:15
 * Copyright © All rights reserved
*/

import React from 'react';
import PropTypes from 'prop-types';
import styles from './GuaResultDisplay.desktop.module.css';

/**
 * 卦象结果显示组件
 * @param {Object} props - 组件属性
 * @param {Object} props.panResult - 卦象结果对象
 * @param {string} props.className - 自定义类名
 * @returns {JSX.Element} 卦象结果显示组件
 */
const GuaResultDisplay = ({ panResult, className = '' }) => {
  if (!panResult) {
    return null;
  }

  const benGuaName = panResult.ben_gua_head?.name || '未知';
  const bianGuaName = panResult.bian_gua_head?.name;

  return (
    <div className={`${styles.guaResultDisplay} ${className}`}>
      <span className={styles.resultLabel}>卦象：</span>
      <span className={styles.resultValue}>
        {benGuaName}
        {bianGuaName && ` → ${bianGuaName}`}
      </span>
    </div>
  );
};

// 为 GuaResultDisplay 组件添加 PropTypes 类型定义
GuaResultDisplay.propTypes = {
  panResult: PropTypes.shape({
    ben_gua_head: PropTypes.shape({
      name: PropTypes.string
    }),
    bian_gua_head: PropTypes.shape({
      name: PropTypes.string
    })
  }),
  className: PropTypes.string
};

// 为 GuaResultDisplay 组件添加 displayName，便于在 React DevTools 中调试
GuaResultDisplay.displayName = 'GuaResultDisplay';

export default GuaResultDisplay;