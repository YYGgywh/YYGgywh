/*
 * @file            frontend/src/utils/fourPillarsUtils.js
 * @description     提供四柱排盘相关的工具函数，包括天干地支验证、五虎遁月干计算、五鼠遁时干计算等功能
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-06 10:00
 * @lastModified    2026-02-19 15:41:34
 * Copyright © All rights reserved
*/

// 导入干支基础数据
import { YANG_GANS, YIN_GANS, YANG_ZHIS, YIN_ZHIS, ALL_GANS, ALL_ZHIS } from '../data/ganZhiData';
// 导入五虎遁月干表数据
import { yearGetMonthTable } from '../data/yearGetMonthData';
// 导入五鼠遁时干表数据
import { dayGetHourTable } from '../data/dayGetHourData';

/**
 * 验证天干输入
 * @param {string} value - 输入值
 * @returns {boolean} 是否有效
 */
export const validateGanInput = (value) => {
  const validGans = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']; // 定义有效的天干列表
  
  return validGans.includes(value); // 检查输入值是否在有效天干列表中
};

/**
 * 验证地支输入
 * @param {string} value - 输入值
 * @returns {boolean} 是否有效
 */
export const validateZhiInput = (value) => {
  const validZhis = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']; // 定义有效的地支列表
  
  return validZhis.includes(value); // 检查输入值是否在有效地支列表中
};

/**
 * 获取天干列表
 * @returns {Array<Array<string>>} 天干列表，第一行为阳干，第二行为阴干
 */
export const getTianGanList = () => {

  // 返回二维数组，第一行为阳干，第二行为阴干
  return [
    ['甲', '丙', '戊', '庚', '壬'], // 阳干
    ['乙', '丁', '己', '辛', '癸']  // 阴干
  ];
};

/**
 * 获取地支列表
 * @returns {Array<string>} 地支列表
 */
export const getDiZhiList = () => {

  // 返回十二地支数组
  return ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
};

/**
 * 验证年干输入
 * @param {string} value - 输入值
 * @param {string} yearZhi - 年支值
 * @returns {boolean} 是否有效
 */
export const validateYearGanInput = (value, yearZhi) => {
  // 允许空字符串通过验证，以便用户可以删除输入值
  if (value === '') {
    return true; // 允许空字符串通过验证
  }
  
  // 如果没有年支，检查是否为所有天干之一
  if (!yearZhi) {
    return ALL_GANS.includes(value); // 如果年支为空，检查是否为所有天干之一
  }
  // 如果年支是阳支，检查年干是否为阳干
  else if (YANG_ZHIS.includes(yearZhi)) {
    return YANG_GANS.includes(value); // 如果年支是阳支，检查年干是否为阳干
  }
  // 如果年支是阴支，检查年干是否为阴干
  else if (YIN_ZHIS.includes(yearZhi)) {
    return YIN_GANS.includes(value); // 如果年支是阴支，检查年干是否为阴干
  }
  
  return false; // 其他情况返回无效
};

/**
 * 验证年支输入
 * @param {string} value - 输入值
 * @param {string} yearGan - 年干值
 * @returns {boolean} 是否有效
 */
export const validateYearZhiInput = (value, yearGan) => {
  // 允许空字符串通过验证，以便用户可以删除输入值
  if (value === '') {
    return true; // 允许空字符串通过验证
  }
  
  // 如果没有年干，检查是否为所有地支之一
  if (!yearGan) {
    return ALL_ZHIS.includes(value); // 如果年干为空，检查是否为所有地支之一
  }
  // 如果年干是阳干，检查年支是否为阳支
  else if (YANG_GANS.includes(yearGan)) {
    return YANG_ZHIS.includes(value);// 如果年干是阳干，检查年支是否为阳支
  
  }
  // 如果年干是阴干，检查年支是否为阴支
  else if (YIN_GANS.includes(yearGan)) {
    return YIN_ZHIS.includes(value); // 如果年干是阴干，检查年支是否为阴支
  }
  
  return false; // 其他情况返回无效
};

/**
 * 验证日干输入
 * @param {string} value - 输入值
 * @param {string} dayZhi - 日支值
 * @returns {boolean} 是否有效
 */
export const validateDayGanInput = (value, dayZhi) => {
  // 允许空字符串通过验证，以便用户可以删除输入值
  if (value === '') {
    return true; // 允许空字符串通过验证
  }
  
  // 如果没有日支，检查是否为所有天干之一
  if (!dayZhi) {
    return ALL_GANS.includes(value); // 如果日支为空，检查是否为所有天干之一
  }
  // 如果日支是阳支，检查日干是否为阳干
  else if (YANG_ZHIS.includes(dayZhi)) {
    return YANG_GANS.includes(value); // 如果日支是阳支，检查日干是否为阳干
  } 
  // 如果日支是阴支，检查日干是否为阴干
  else if (YIN_ZHIS.includes(dayZhi)) {
    return YIN_GANS.includes(value); // 如果日支是阴支，检查日干是否为阴干
  }
  
  return false; // 其他情况返回无效
};

/**
 * 验证日支输入
 * @param {string} value - 输入值
 * @param {string} dayGan - 日干值
 * @returns {boolean} 是否有效
 */
export const validateDayZhiInput = (value, dayGan) => {
  // 允许空字符串通过验证，以便用户可以删除输入值
  if (value === '') {
    return true; // 允许空字符串通过验证
  }
  
  // 如果没有日干，检查是否为所有地支之一
  if (!dayGan) {
    return ALL_ZHIS.includes(value); // 如果日干为空，检查是否为所有地支之一
  }
  // 如果日干是阳干，检查日支是否为阳支
  else if (YANG_GANS.includes(dayGan)) {
    return YANG_ZHIS.includes(value); // 如果日干是阳干，检查日支是否为阳支
  } 
  // 如果日干是阴干，检查日支是否为阴支
  else if (YIN_GANS.includes(dayGan)) {
    return YIN_ZHIS.includes(value); // 如果日干是阴干，检查日支是否为阴支
  }
  
  return false; // 其他情况返回无效
};

/**
 * 验证月支输入
 * @param {string} value - 输入值
 * @returns {boolean} 是否有效
 */
export const validateMonthZhiInput = (value) => {
  // 允许空字符串通过验证，以便用户可以删除输入值
  if (value === '') {
    return true; // 允许空字符串通过验证
  }
    
  return ALL_ZHIS.includes(value); // 检查输入值是否为所有地支之一
};

/**
 * 验证时支输入
 * @param {string} value - 输入值
 * @returns {boolean} 是否有效
 */
export const validateHourZhiInput = (value) => {
  // 允许空字符串通过验证，以便用户可以删除输入值
  if (value === '') {
    return true; // 允许空字符串通过验证
  }
  
  return ALL_ZHIS.includes(value); // 检查输入值是否为所有地支之一
};

/**
 * 根据年干和月支计算月干（五虎遁规则）
 * @param {string} yearGan - 年干
 * @param {string} monthZhi - 月支
 * @returns {string} 月干
 */
export const calculateMonthGan = (yearGan, monthZhi) => {
  // 查找对应月干
  if (yearGan && monthZhi && yearGetMonthTable[yearGan] && yearGetMonthTable[yearGan][monthZhi]) {
    
    return yearGetMonthTable[yearGan][monthZhi]; // 返回查找到的月干
  }
  
  return ''; // 如果找不到对应的月干，返回空字符串
};

/**
 * 根据日干和时支计算时干（五鼠遁规则）
 * @param {string} dayGan - 日干
 * @param {string} hourZhi - 时支
 * @returns {string} 时干
 */
export const calculateHourGan = (dayGan, hourZhi) => {
  // 查找对应时干
  if (dayGan && hourZhi && dayGetHourTable[dayGan] && dayGetHourTable[dayGan][hourZhi]) {
    
    return dayGetHourTable[dayGan][hourZhi]; // 返回查找到的时干
  }
  
  return ''; // 如果找不到对应的时干，返回空字符串
};

/**
 * 验证四柱组合是否有效
 * @param {Object} fourPillars - 四柱数据
 * @returns {boolean} 是否有效
 */
export const validateFourPillars = (fourPillars) => {
  
  const { yearGan, monthGan, dayGan, hourGan, yearZhi, monthZhi, dayZhi, hourZhi } = fourPillars; // 解构赋值获取四柱的干支数据
  
  // 验证所有天干是否有效（空字符串或有效天干）
  const gansValid = [yearGan, monthGan, dayGan, hourGan].every(gan => 
    gan === '' || validateGanInput(gan)
  );
  
  // 验证所有地支是否有效（空字符串或有效地支）
  const zhisValid = [yearZhi, monthZhi, dayZhi, hourZhi].every(zhi => 
    zhi === '' || validateZhiInput(zhi)
  );
  
  return gansValid && zhisValid; // 返回天干和地支是否都有效
};

/**
 * 格式化四柱数据
 * @param {Object} fourPillars - 四柱数据
 * @returns {Object} 格式化后的四柱数据
 */
export const formatFourPillars = (fourPillars) => {
  // 返回格式化后的四柱数据，确保空值被转换为空字符串
  return {
    yearGan: fourPillars.yearGan || '',   // 年干
    monthGan: fourPillars.monthGan || '', // 月干
    dayGan: fourPillars.dayGan || '',     // 日干
    hourGan: fourPillars.hourGan || '',   // 时干
    yearZhi: fourPillars.yearZhi || '',   // 年支
    monthZhi: fourPillars.monthZhi || '', // 月支
    dayZhi: fourPillars.dayZhi || '',     // 日支
    hourZhi: fourPillars.hourZhi || ''    // 时支
  };
};