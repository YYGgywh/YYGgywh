/*
 * @file            frontend/src/utils/formatTimeUtils.js
 * @description     时间格式化工具函数，提供西历、农历、节气等日期时间的格式化功能
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-21 22:00:00
 * @lastModified    2026-02-25 21:39:13
 * Copyright © All rights reserved
*/

/**
 * 格式化西历日期
 * @param {Object} solarInfo - 西历信息对象
 * @param {string} solarInfo.solar_year - 年份
 * @param {string} solarInfo.solar_month - 月份
 * @param {string} solarInfo.solar_day - 日期
 * @returns {string} 格式化后的日期，如"2025年08月10日"
 */
export function formatSolarDate(solarInfo) {
  if (!solarInfo) return ''; // 如果没有西历信息，返回空字符串
  const year = solarInfo.solar_year?.toString().padStart(4, '0') || ''; // 格式化年份，不足4位用0填充
  const month = solarInfo.solar_month?.toString().padStart(2, '0') || ''; // 格式化月份，不足2位用0填充
  const day = solarInfo.solar_day?.toString().padStart(2, '0') || ''; // 格式化日期，不足2位用0填充
  return `${year}年${month}月${day}日`; // 返回格式化后的日期字符串
}

/**
 * 格式化西历时间
 * @param {Object} solarInfo - 西历信息对象
 * @param {string} solarInfo.solar_hour - 小时
 * @param {string} solarInfo.solar_minute - 分钟
 * @param {string} solarInfo.solar_second - 秒
 * @returns {string} 格式化后的时间，如"12:05:17"
 */
export function formatSolarTime(solarInfo) {
  if (!solarInfo) return ''; // 如果没有西历信息，返回空字符串
  const hour = solarInfo.solar_hour?.toString().padStart(2, '0') || ''; // 格式化小时，不足2位用0填充
  const minute = solarInfo.solar_minute?.toString().padStart(2, '0') || ''; // 格式化分钟，不足2位用0填充
  const second = solarInfo.solar_second?.toString().padStart(2, '0') || ''; // 格式化秒，不足2位用0填充
  return `${hour}:${minute}:${second}`; // 返回格式化后的时间字符串
}

/**
 * 格式化农历日期
 * @param {Object} lunarInfo - 农历信息对象
 * @param {string} lunarInfo.lunar_year_in_GanZhi - 干支年
 * @param {string} lunarInfo.lunar_month_in_Chinese - 中文月
 * @param {string} lunarInfo.lunar_day_in_Chinese - 中文日
 * @returns {string} 格式化后的日期，如"乙巳年闰六月十七"
 */
export function formatLunarDate(lunarInfo) {
  if (!lunarInfo) return ''; // 如果没有农历信息，返回空字符串
  const year = lunarInfo.lunar_year_in_GanZhi || ''; // 获取干支年，没有则为空字符串
  const month = lunarInfo.lunar_month_in_Chinese || ''; // 获取中文月，没有则为空字符串
  const day = lunarInfo.lunar_day_in_Chinese || ''; // 获取中文日，没有则为空字符串
  return `${year}年${month}月${day}`; // 返回格式化后的日期字符串
}

/**
 * 格式化农历时间
 * @param {Object} lunarInfo - 农历信息对象
 * @param {string} lunarInfo.lunar_hour - 小时
 * @param {string} lunarInfo.lunar_time_Zhi - 地支时
 * @returns {string} 格式化后的时间，如"午时"或"早子时"/"晚子时"
 */
export function formatLunarTime(lunarInfo) {
  if (!lunarInfo) return ''; // 如果没有农历信息，返回空字符串
  const hour = parseInt(lunarInfo.lunar_hour || '0', 10); // 解析小时，没有则默认0
  if (lunarInfo.lunar_time_Zhi === '子') {
    return hour >= 23 ? '晚子时' : '早子时'; // 如果是子时，根据小时判断是早子时还是晚子时
  }
  return `${lunarInfo.lunar_time_Zhi}时`; // 返回格式化后的时间字符串，如"午时"
}

/**
 * 格式化节气日期
 * @param {string} time - 节气时间字符串，如"2025-08-07 12:00:00"
 * @returns {string} 格式化后的日期，如"2025年08月07日"
 */
export function formatJieqiDate(time) {
  if (!time) return ''; // 如果没有时间字符串，返回空字符串
  const [year, month, day] = time.split(' ')[0].split('-') || []; // 从时间字符串中提取年、月、日
  return `${year}年${month}月${day}日`; // 返回格式化后的日期字符串
}

/**
 * 格式化节气时间
 * @param {string} time - 节气时间字符串，如"2025-08-07 12:00:00"
 * @returns {string} 格式化后的时间，如"12:00:00"
 */
export function formatJieqiTime(time) {
  return time ? time.split(' ')[1] : ''; // 如果有时间字符串，返回时间部分，否则返回空字符串
}

/**
 * 格式化节气日期为农历
 * @param {string} time - 节气时间字符串，如"2025-08-07 12:00:00"
 * @returns {string} 格式化后的农历日期，如"乙巳年六月十七"
 */
export function formatJieqiDateToLunar(time) {
  if (!time) return ''; // 如果没有时间字符串，返回空字符串
  
  try {
    const [dateStr, timeStr] = time.split(' ') || []; // 分离日期和时间
    const [year, month, day] = dateStr.split('-') || []; // 分离年、月、日
    const [hour, minute, second] = timeStr.split(':') || []; // 分离时、分、秒
    
    const solarData = {
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
      hour: parseInt(hour),
      minute: parseInt(minute),
      second: parseInt(second)
    };
    
    const CalendarService = require('../services/calendarService').default; // 同步导入CalendarService
    const result = CalendarService.convertSolarToLunar(solarData); // 转换为农历
    
    if (result.success && result.data) {
      const lunarData = result.data;
      const year = lunarData.lunar_year_in_GanZhi || ''; // 干支年
      const month = lunarData.lunar_month_in_Chinese || ''; // 中文月
      const day = lunarData.lunar_day_in_Chinese || ''; // 中文日
      return `${year}年${month}月${day}`; // 返回格式化后的农历日期
    }
    
    return ''; // 转换失败返回空字符串
  } catch (error) {
    console.error('节气日期转农历失败:', error);
    return ''; // 出错返回空字符串
  }
}

/**
 * 格式化节气时间为农历
 * @param {string} time - 节气时间字符串，如"2025-08-07 12:00:00"
 * @returns {string} 格式化后的农历时间，如"午时"
 */
export function formatJieqiTimeToLunar(time) {
  if (!time) return ''; // 如果没有时间字符串，返回空字符串
  
  try {
    const [dateStr, timeStr] = time.split(' ') || []; // 分离日期和时间
    const [year, month, day] = dateStr.split('-') || []; // 分离年、月、日
    const [hour, minute, second] = timeStr.split(':') || []; // 分离时、分、秒
    
    const solarData = {
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
      hour: parseInt(hour),
      minute: parseInt(minute),
      second: parseInt(second)
    };
    
    const CalendarService = require('../services/calendarService').default; // 同步导入CalendarService
    const result = CalendarService.convertSolarToLunar(solarData); // 转换为农历
    
    if (result.success && result.data) {
      const lunarData = result.data;
      const timeZhi = lunarData.lunar_time_Zhi || ''; // 时辰
      const hourNum = parseInt(hour || '0', 10);
      
      if (timeZhi === '子') {
        return hourNum >= 23 ? '晚子时' : '早子时'; // 子时特殊处理
      }
      return `${timeZhi}时`; // 返回格式化后的农历时间
    }
    
    return ''; // 转换失败返回空字符串
  } catch (error) {
    console.error('节气时间转农历失败:', error);
    return ''; // 出错返回空字符串
  }
}
