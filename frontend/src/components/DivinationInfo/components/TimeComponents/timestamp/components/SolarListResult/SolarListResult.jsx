/*
 * @file            frontend/src/components/DivinationInfo/components/TimeComponents/timestamp/components/SolarListResult/SolarListResult.jsx
 * @description     四柱计算结果列表显示组件
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-12 16:00:00
 * @lastModified    2026-03-12 16:00:00
 * Copyright © All rights reserved
*/

import React from 'react';
import desktopStyles from './SolarListResult.desktop.module.css';
import mobileStyles from './SolarListResult.mobile.module.css';

// 设备类型检测（简化版，实际项目中可能使用更复杂的检测方法）
const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;

// 根据设备类型选择样式
const styles = isDesktop ? desktopStyles : mobileStyles;

/**
 * 四柱计算结果列表显示组件
 * @param {Object} solarListResult - 计算结果数据
 * @param {number} selectedIndex - 选中项的索引
 * @param {function} onResultItemClick - 点击结果项的回调函数
 * @param {string} className - 额外类名
 */
const SolarListResult = ({
  solarListResult,
  selectedIndex,
  onResultItemClick,
  className = '',
}) => {
  // 如果没有计算结果，直接返回
  if (!solarListResult) {
    return null;
  }

  return (
    <div className={`${styles.solarListResult} ${className}`}>
      {/* 如果计算成功 */}
      {solarListResult.success ? (
        <div className={styles.resultList}>
          {/* 反转结果列表并遍历 */}
          {solarListResult.data.list.slice().reverse().map((solar, index) => {
            const reversedList = solarListResult.data.list.slice().reverse();
            const currentIndex = reversedList.indexOf(solar) + 1;
            const totalCount = solarListResult.data.count;
            const formattedIndex = String(currentIndex).padStart(2, '0');
            const formattedTotal = String(totalCount).padStart(2, '0');
            const isSelected = selectedIndex === index;

            return (
              <div
                key={solar.fullString}
                className={`${styles.resultItem} ${isSelected ? styles.selected : ''}`}
                onClick={() => onResultItemClick(solar, index)}
              >
                <span className={styles.resultIndex}>{formattedIndex}/{formattedTotal}</span>
                <span className={styles.resultContent}>{solar.fullString}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.resultError}>
          {/* 如果计算失败 */}
          <span>{solarListResult.error}</span>
        </div>
      )}
    </div>
  );
};

export default SolarListResult;
