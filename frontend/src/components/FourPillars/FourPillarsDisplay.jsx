/*
 * @file            frontend/src/components/FourPillars/FourPillarsDisplay.jsx
 * @description     四柱显示组件，用于显示年、月、日、时四柱的干支和空亡信息
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-22 11:00:00
 * @lastModified    2026-02-22 15:51:39
 * Copyright © All rights reserved
*/

import React from 'react'; // 导入React核心库
import PropTypes from 'prop-types'; // 导入PropTypes库，用于组件props的类型检查
import { calculateHourGan } from '../../utils/fourPillarsUtils'; // 导入时干计算函数
import { getXunKongDisplay } from '../../utils/xunKongUtils'; // 导入旬空判断函数
import './FourPillarsDisplay.css'; // 导入组件样式文件
import '../../styles/elementColors.css'; // 导入五行颜色样式

// 四柱显示组件，用于显示年、月、日、时四柱的干支和空亡信息
const Pillar = ({ label, gan, zhi, vacancy, className }) => {
  const prefix = className.split('-')[0];
  
  return (
    <div 
      className={className}
      role="listitem"
      aria-label={`${label}柱信息`}
    >
      <span className={`${prefix}-label`} aria-hidden="true">{label}</span>
      <span className={`${prefix}-gan`} aria-label={`${label}干`} data-element={gan}>{gan}</span>
      <span className={`${prefix}-zhi`} aria-label={`${label}支`} data-element={zhi}>{zhi}</span>
      <span className={`${prefix}-vacancy`} aria-label={`${label}柱空亡`}>{vacancy}</span>
    </div>
  );
};

/**
 * 获取时柱信息（时干和时柱空亡）
 * @param {string} dayGan - 日柱的干支
 * @param {string} hourZhi - 时柱的地支
 * @returns {object} - 时柱信息对象，包含时干、时柱地支和时柱空亡
 */
const getHourPillarInfo = (dayGan, hourZhi) => {
  if (!dayGan || !hourZhi) {
    return {
      hourGan: '',
      hourZhi: hourZhi,
      hourKong: ''
    };
  }
  
  try {
    const hourGan = calculateHourGan(dayGan, hourZhi);
    const hourKong = hourGan ? getXunKongDisplay(hourGan, hourZhi) : '';
    
    return {
      hourGan: hourGan || '',
      hourZhi: hourZhi,
      hourKong: hourKong
    };
  } catch (error) {
    console.error('计算时柱信息失败:', error);
    return {
      hourGan: '',
      hourZhi: hourZhi,
      hourKong: ''
    };
  }
};

// 四柱显示组件，用于显示年、月、日、时四柱的干支和空亡信息
const FourPillarsDisplay = React.memo(({ 
  ganzhiInfo = {},  // 四柱信息对象，包含年、月、日、时四柱的干支和地支
  hourPillarInfo = {}, // 时柱信息对象，包含时干、时柱地支和时柱空亡
  className = '', // 自定义类名，用于添加额外的样式
  isColorMode = false // 是否启用彩色模式
}) => {
  // 从ganzhiInfo中解构出所有四柱信息
  const {
    lunar_year_gan_exact = '', // 年柱的干支
    lunar_year_zhi_exact = '', // 年柱的地支
    lunar_month_gan_exact = '', // 月柱的干支
    lunar_month_zhi_exact = '', // 月柱的地支
    lunar_day_in_gan_exact = '', // 日柱的干支
    lunar_day_in_zhi_exact = '', // 日柱的地支
    lunar_time_in_zhi_exact = '' // 时柱的地支
  } = ganzhiInfo;

  // 如果没有传入完整的时柱信息，则自动计算时干和时柱空亡
  const shouldCalculateHourPillar = !hourPillarInfo.hourGan && lunar_day_in_gan_exact && lunar_time_in_zhi_exact; // 是否需要计算时干和时柱空亡
  // 如果需要计算时干和时柱空亡，则调用getHourPillarInfo函数计算
  const calculatedHourPillarInfo = shouldCalculateHourPillar 
    ? getHourPillarInfo(lunar_day_in_gan_exact, lunar_time_in_zhi_exact)
    : hourPillarInfo;
  
  // 从props中解构出时柱的干支和旬空信息
  const {
    hourGan = '', // 时柱的干支
    hourKong = '' // 时柱的旬空信息
  } = calculatedHourPillarInfo;

  // 使用 useMemo 缓存各柱的空亡计算结果
  const yearVacancy = React.useMemo(
    () => getXunKongDisplay(lunar_year_gan_exact, lunar_year_zhi_exact),
    [lunar_year_gan_exact, lunar_year_zhi_exact]
  );
  
  const monthVacancy = React.useMemo(
    () => getXunKongDisplay(lunar_month_gan_exact, lunar_month_zhi_exact),
    [lunar_month_gan_exact, lunar_month_zhi_exact]
  );
  
  const dayVacancy = React.useMemo(
    () => getXunKongDisplay(lunar_day_in_gan_exact, lunar_day_in_zhi_exact),
    [lunar_day_in_gan_exact, lunar_day_in_zhi_exact]
  );

  // 渲染四柱信息组件
  return (
    <div 
      className={`four-pillars-info ${className} ${isColorMode ? 'color-mode' : ''}`}
      role="list"
      aria-label="四柱信息"
    >
      <Pillar 
        label="年"
        gan={lunar_year_gan_exact}
        zhi={lunar_year_zhi_exact}
        vacancy={yearVacancy}
        className="year-pillars-info"
      />
      <Pillar 
        label="月"
        gan={lunar_month_gan_exact}
        zhi={lunar_month_zhi_exact}
        vacancy={monthVacancy}
        className="month-pillars-info"
      />
      <Pillar 
        label="日"
        gan={lunar_day_in_gan_exact}
        zhi={lunar_day_in_zhi_exact}
        vacancy={dayVacancy}
        className="day-pillars-info"
      />
      <Pillar 
        label="时"
        gan={hourGan}
        zhi={lunar_time_in_zhi_exact}
        vacancy={hourKong}
        className="hour-pillars-info"
      />
    </div>
  );
});

// 为 FourPillarsDisplay 组件添加 PropTypes 类型定义
FourPillarsDisplay.propTypes = {
  ganzhiInfo: PropTypes.object,
  hourPillarInfo: PropTypes.object,
  className: PropTypes.string,
  isColorMode: PropTypes.bool
};

export default FourPillarsDisplay; // 导出四柱显示组件
