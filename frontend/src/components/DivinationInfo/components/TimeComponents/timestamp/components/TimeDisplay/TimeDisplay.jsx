/*
 * @file            frontend/src/components/DivinationInfo/components/TimeComponents/timestamp/components/TimeDisplay/TimeDisplay.jsx
 * @description     通用时间显示组件，支持显示公历和农历时间信息
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-11 18:00:00
 * @lastModified    2026-03-11 19:26:38
 * Copyright © All rights reserved
*/

import React from 'react';
import desktopStyles from './TimeDisplay.desktop.module.css';

const TimeDisplay = ({
  solarDate,      // 公历日期
  solarTime,      // 公历时间
  lunarDate,      // 农历日期
  lunarTime,      // 农历时间
  solarFirst = true, // 是否公历在前
  showLabels = true, // 是否显示标签
  showTime = true,    // 是否显示时间部分
  className = ''  // 额外类名
}) => {
  // 使用桌面端样式
  const styles = desktopStyles;
  
  // 构建网格数据
  const rows = solarFirst 
    ? [
        { type: 'solar', date: solarDate, time: solarTime },
        { type: 'lunar', date: lunarDate, time: lunarTime }
      ]
    : [
        { type: 'lunar', date: lunarDate, time: lunarTime },
        { type: 'solar', date: solarDate, time: solarTime }
      ];

  return (
    <div className={`${styles.timestampDisplay} ${className}`}>
      <div className={styles.gridContainer}>
        {rows.map((row, index) => (
          <React.Fragment key={index}>
            {/* 标签列 */}
            {showLabels && (
              <div className={`${styles.gridCell} ${styles.labelCell}`}>
                <span className={
                  row.type === 'solar' ? styles.solarLabel : styles.lunarLabel
                }>
                  {row.type === 'solar' ? '公历：' : '农历：'}
                </span>
              </div>
            )}
            
            {/* 日期列 */}
            <div className={`${styles.gridCell} ${styles.dateCell}`}>
              <span className={styles.dateValue}>{row.date}</span>
            </div>
            
            {/* 时间列 */}
            {showTime && (
              <div className={`${styles.gridCell} ${styles.timeCell}`}>
                {row.time && (
                  <span className={styles.timeValue}>{row.time}</span>
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default TimeDisplay;