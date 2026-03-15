/*
 * @file            frontend/src/components/FourPillarsDisplay/FourPillarsDisplay.jsx
 * @description     四柱显示组件，用于显示年、月、日、时四柱的干支和空亡信息
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-02-22 11:00:00
 * @lastModified    2026-03-14 16:10:46
 * Copyright © All rights reserved
*/

import React from 'react'; // 导入React核心库
import PropTypes from 'prop-types'; // 导入PropTypes库，用于组件props的类型检查
import { calculateHourGan } from '../../utils/fourPillarsUtils'; // 导入时干计算函数
import { getXunKongDisplay } from '../../utils/xunKongUtils'; // 导入旬空判断函数
import '../../styles/elementColors.css'; // 导入五行颜色样式

// 导入桌面端样式
import styles from "./FourPillarsDisplay.desktop.module.css";

// 默认显示配置
const defaultDisplayConfig = {
  // 行级别控制
  rows: {
    year: true,    // 年柱
    month: true,   // 月柱
    day: true,     // 日柱
    hour: true     // 时柱
  },
  
  // 列级别控制
  columns: {
    label: true,   // 标签列
    gan: true,     // 天干列
    zhi: true,     // 地支列
    vacancy: true  // 旬空列
  },
  
  // 元素级别控制（覆盖行列配置）
  elements: {
    year: { label: true, gan: true, zhi: true, vacancy: true },
    month: { label: true, gan: true, zhi: true, vacancy: true },
    day: { label: true, gan: true, zhi: true, vacancy: true },
    hour: { label: true, gan: true, zhi: true, vacancy: true }
  }
};

// 计算最终的显示状态
const calculateDisplayState = (config, rowKey, columnKey) => {
  // 优先级：元素配置 > 行配置 && 列配置
  
  // 1. 检查行级别
  if (config.rows[rowKey] === false) {
    return false; // 整行隐藏
  }
  
  // 2. 检查列级别
  if (config.columns[columnKey] === false) {
    return false; // 整列隐藏
  }
  
  // 3. 检查元素级别（最高优先级）
  const elementConfig = config.elements[rowKey];
  if (elementConfig && elementConfig[columnKey] !== undefined) {
    return elementConfig[columnKey];
  }
  
  // 4. 默认显示
  return true;
};

// 四柱显示组件，用于显示年、月、日、时四柱的干支和空亡信息
const Pillar = ({ label, gan, zhi, vacancy, className, displayConfig, rowKey }) => {
  const prefix = className;
  
  // 计算各元素的显示状态
  const showLabel = calculateDisplayState(displayConfig, rowKey, 'label');
  const showGan = calculateDisplayState(displayConfig, rowKey, 'gan');
  const showZhi = calculateDisplayState(displayConfig, rowKey, 'zhi');
  const showVacancy = calculateDisplayState(displayConfig, rowKey, 'vacancy');
  
  return (
    <div 
      className={styles[prefix]}
      role="listitem"
      aria-label={`${label}柱信息`}
    >
      {showLabel && <span className={styles[`${prefix}Label`]} aria-hidden="true">{label}</span>}
      {showGan && <span className={styles[`${prefix}Gan`]} aria-label={`${label}干`} data-element={gan}>{gan}</span>}
      {showZhi && <span className={styles[`${prefix}Zhi`]} aria-label={`${label}支`} data-element={zhi}>{zhi}</span>}
      {showVacancy && <span className={styles[`${prefix}Vacancy`]} aria-label={`${label}柱空亡`}>{vacancy}</span>}
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
  isColorMode = false, // 是否启用彩色模式
  displayConfig = defaultDisplayConfig // 显示配置
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

  // 构建行数据
  const rows = [
    { key: 'year', label: '年', gan: lunar_year_gan_exact, zhi: lunar_year_zhi_exact, vacancy: yearVacancy, className: 'yearPillarsInfo' },
    { key: 'month', label: '月', gan: lunar_month_gan_exact, zhi: lunar_month_zhi_exact, vacancy: monthVacancy, className: 'monthPillarsInfo' },
    { key: 'day', label: '日', gan: lunar_day_in_gan_exact, zhi: lunar_day_in_zhi_exact, vacancy: dayVacancy, className: 'dayPillarsInfo' },
    { key: 'hour', label: '时', gan: hourGan, zhi: lunar_time_in_zhi_exact, vacancy: hourKong, className: 'hourPillarsInfo' }
  ];

  // 过滤掉整行隐藏的行
  const visibleRows = rows.filter(row => displayConfig.rows[row.key] !== false);

  // 渲染四柱信息组件
  return (
    <div 
      className={`${styles.root} ${className} ${isColorMode ? 'color-mode' : ''}`}
      role="list"
      aria-label="四柱信息"
    >
      {visibleRows.map(row => (
        <Pillar 
          key={row.key}
          label={row.label}
          gan={row.gan}
          zhi={row.zhi}
          vacancy={row.vacancy}
          className={row.className}
          displayConfig={displayConfig}
          rowKey={row.key}
        />
      ))}
    </div>
  );
});

// 为 FourPillarsDisplay 组件添加 PropTypes 类型定义
FourPillarsDisplay.propTypes = {
  ganzhiInfo: PropTypes.object,
  hourPillarInfo: PropTypes.object,
  className: PropTypes.string,
  isColorMode: PropTypes.bool,
  displayConfig: PropTypes.shape({
    rows: PropTypes.shape({
      year: PropTypes.bool,
      month: PropTypes.bool,
      day: PropTypes.bool,
      hour: PropTypes.bool
    }),
    columns: PropTypes.shape({
      label: PropTypes.bool,
      gan: PropTypes.bool,
      zhi: PropTypes.bool,
      vacancy: PropTypes.bool
    }),
    elements: PropTypes.shape({
      year: PropTypes.shape({
        label: PropTypes.bool,
        gan: PropTypes.bool,
        zhi: PropTypes.bool,
        vacancy: PropTypes.bool
      }),
      month: PropTypes.shape({
        label: PropTypes.bool,
        gan: PropTypes.bool,
        zhi: PropTypes.bool,
        vacancy: PropTypes.bool
      }),
      day: PropTypes.shape({
        label: PropTypes.bool,
        gan: PropTypes.bool,
        zhi: PropTypes.bool,
        vacancy: PropTypes.bool
      }),
      hour: PropTypes.shape({
        label: PropTypes.bool,
        gan: PropTypes.bool,
        zhi: PropTypes.bool,
        vacancy: PropTypes.bool
      })
    })
  })
};

export default FourPillarsDisplay; // 导出四柱显示组件
export { defaultDisplayConfig }; // 导出默认显示配置
