/*
 * @file            frontend/src/utils/validationUtils.js
 * @description     提供统一的输入验证逻辑，用于处理时间输入框的验证，包括错误信息获取、输入验证、日期计算等功能
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-04 14:00
 * @lastModified    2026-02-19 15:55:52
 * Copyright © All rights reserved
*/

// 导入lunar-javascript库中的工具类，用于历法计算
import { SolarUtil, LunarMonth, LunarYear } from 'lunar-javascript';

/**
 * 获取错误信息
 * @param {string} fieldName - 字段名称
 * @param {string|number} value - 输入值
 * @param {number} maxValue - 最大值（可选，用于日期验证）
 * @param {boolean} isLunar - 是否为农历日期（可选）
 * @returns {string|null} 错误信息或null
 */
export const getErrorMessage = (fieldName, value, maxValue = null, isLunar = false) => {
  // 根据字段名称进行不同的验证
  switch (fieldName) {
    // 处理年份验证
    case 'year': // 公历年份
    case 'lunar_year': // 农历年份
      // 实时动态检查年份是否为 '0000'，但可以是"0"、"00"、"000"
      if (value === '0000') return '年份值请输入0001~9999';
      break;
    // 处理月份验证
    case 'month': // 公历月份
    case 'lunar_month': // 农历月份
      // 月份不能为00或大于12，对于"0"不作要求
      if (value === '00' || (parseInt(value) > 12)) return '月份值请输入1~12';
      break;
    // 处理日期验证
    case 'day': // 公历日期
    case 'lunar_day': // 农历日期
      // 日期不能为00（实时验证）
      if (value === '00') return `${isLunar ? '农历' : ''}日期值请输入1~${maxValue || (isLunar ? 30 : 31)}`;
      // 如果没有指定最大值（即没有同时指定年份与月份），只验证格式，不作范围验证
      if (!maxValue) {
        // 只验证是否为00
        break;
      }
      // 日期不能大于最大值（当同时指定年份与月份时）
      if (parseInt(value) > maxValue) return `${isLunar ? '农历' : ''}日期值请输入1~${maxValue}`;
      break;
    // 处理小时验证
    case 'hour':
      // 小时必须在0-23之间
      if (parseInt(value) < 0 || parseInt(value) > 23) return '小时值请输入0~23';
      break;
    // 处理分钟验证
    case 'minute':
      // 分钟必须在0-59之间
      if (parseInt(value) < 0 || parseInt(value) > 59) return '分钟值请输入0~59';
      break;
    // 处理秒验证
    case 'second':
      // 秒必须在0-59之间
      if (parseInt(value) < 0 || parseInt(value) > 59) return '秒值请输入0~59';
      break;
    // 默认情况
    default:
      break;
  }
  // 验证通过，返回null
  return null;
};

/**
 * 处理输入验证
 * @param {string} name - 字段名称
 * @param {string|number} value - 输入值
 * @param {function} setAlertMessage - 设置错误信息的函数
 * @param {function} setShowAlert - 设置显示错误提示的函数
 * @param {function} setTimeData - 设置时间数据的函数
 * @param {number} maxValue - 最大值（可选，用于日期验证）
 * @param {boolean} isLunar - 是否为农历日期（可选）
 * @returns {boolean} 验证是否通过
 */
export const handleInputValidation = (name, value, setAlertMessage, setShowAlert, setTimeData, maxValue = null, isLunar = false) => {
  // 只有当值长度大于等于1时才进行验证，避免空值触发不必要的验证
  if (value.length >= 1) {
    // 调用getErrorMessage函数获取当前输入值的错误信息
    // 根据字段名称、值、最大值和是否为农历日期进行验证
    const errorMessage = getErrorMessage(name, value, maxValue, isLunar);
    // 如果存在错误信息，说明输入不符合要求
    if (errorMessage) {
      // 设置错误提示信息，告知用户具体的错误原因
      setAlertMessage(errorMessage);
      // 显示错误提示组件，让用户注意到输入错误
      setShowAlert(true);
      // 清空当前输入框的值，强制用户重新输入
      setTimeData(prev => ({
        ...prev,
        [name]: ''
      }));
      
      return false; // 返回false表示验证失败，阻止后续操作
    }
  }
  
  return true; // 验证通过，返回true允许继续处理输入
};

/**
 * 计算公历月份的天数
 * @param {number} year - 公历年
 * @param {number} month - 公历月
 * @returns {number} 天数
 */
export const getSolarMonthDays = (year, month) => {
  try {
    
    return SolarUtil.getDaysOfMonth(year, month); // 调用SolarUtil工具类获取指定年月的天数
  }
  // 捕获并打印错误信息
  catch (error) {
    console.error('计算公历月份天数失败:', error); // 捕获并打印错误信息
    
    return 31; // 返回默认值31天
  }
};

/**
 * 计算农历月份的天数
 * @param {number} year - 农历年
 * @param {number} month - 农历月
 * @param {boolean} isLeapMonth - 是否为闰月
 * @returns {number} 天数
 */
export const getLunarMonthDays = (year, month, isLeapMonth = false) => {
  try {
    // 根据API文档，闰月通过负数月份值表示，如闰2月为-2
    const lunarMonthValue = isLeapMonth ? -month : month;
    // 使用LunarMonth工具类创建农历月对象
    const lunarMonth = LunarMonth.fromYm(year, lunarMonthValue);
    // 返回该农历月的天数
    return lunarMonth.getDayCount();
  } catch (error) {
    // 捕获并打印错误信息
    console.error('计算农历月份天数失败:', error);
    
    return 30; // 返回默认值30天
  }
};

/**
 * 获取指定农历年的闰月
 * @param {number} lunarYear - 农历年份
 * @returns {number} 闰月数字（1-12，0表示无闰月）
 */
export const getLeapMonth = (lunarYear) => {
  try {
    // 使用LunarYear工具类创建农历年对象
    const lunarYearObj = LunarYear.fromYear(lunarYear);
    // 返回该农历年的闰月（0表示无闰月）
    return lunarYearObj.getLeapMonth();
  } catch (error) {
    // 捕获并打印错误信息
    console.error('获取闰月失败:', error);
    
    return 0; // 返回默认值0，表示无闰月
  }
};

/**
 * 判断指定农历年是否有闰月
 * @param {number} lunarYear - 农历年份
 * @returns {boolean} 是否有闰月
 */
export const hasLeapMonth = (lunarYear) => {
  // 调用getLeapMonth函数获取闰月，判断是否大于0
  return getLeapMonth(lunarYear) > 0;
};

/**
 * 判断指定农历年和月份是否为闰月组合
 * @param {number} lunarYear - 农历年份
 * @param {number} lunarMonth - 农历月份
 * @returns {boolean} 是否为闰月组合
 */
export const isLeapMonthCombination = (lunarYear, lunarMonth) => {
  // 调用getLeapMonth函数获取闰月，判断是否等于当前月份
  return getLeapMonth(lunarYear) === lunarMonth;
};

/**
 * 验证输入数据的完整性和有效性
 * @param {Object} timeData - 时间数据
 * @param {boolean} isLunar - 是否为农历日期
 * @returns {Object} 验证结果
 */
export const validateInputData = (timeData, isLunar = false) => {
  // 根据是否为农历日期，获取对应的年、月、日字段名并解析为整数
  const year = parseInt(timeData[isLunar ? 'lunar_year' : 'year']);
  const month = parseInt(timeData[isLunar ? 'lunar_month' : 'month']);
  const day = parseInt(timeData[isLunar ? 'lunar_day' : 'day']);
  // 解析小时、分钟、秒的值
  const hour = timeData.hour ? parseInt(timeData.hour) : null;
  const minute = parseInt(timeData.minute || 0);
  const second = parseInt(timeData.second || 0);
  
  // 检查必要字段是否为有效数字
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return { valid: false, data: null };
  }
  
  // 验证年份是否有效（必须为正数）- 用于失去焦点时的检查
  if (year <= 0) {
    return { valid: false, data: null };
  }
  
  // 验证月份是否有效（必须在1-12之间）
  if (month < 1 || month > 12) {
    return { valid: false, data: null };
  }
  
  // 根据历法类型计算该月的最大天数
  let maxDays = 31;
  if (isLunar) {
    // 农历：调用getLunarMonthDays函数计算天数
    maxDays = getLunarMonthDays(year, month, timeData.is_leap_month || false);
  } else {
    // 公历：调用getSolarMonthDays函数计算天数
    maxDays = getSolarMonthDays(year, month);
  }
  
  // 验证日期是否有效（必须在1到最大天数之间）
  if (day < 1 || day > maxDays) {
    return { valid: false, data: null };
  }
  
  // 验证小时是否有效（必须在0-23之间）
  if (hour !== null && (hour < 0 || hour > 23)) {
    return { valid: false, data: null };
  }
  
  // 验证分钟是否有效（必须在0-59之间）
  if (minute < 0 || minute > 59) {
    return { valid: false, data: null };
  }
  
  // 验证秒是否有效（必须在0-59之间）
  if (second < 0 || second > 59) {
    return { valid: false, data: null };
  }
  
  // 验证通过，返回验证结果和格式化后的数据
  return {
    valid: true,
    data: {
      // 根据历法类型设置年、月、日字段
      [isLunar ? 'lunar_year' : 'year']: year,
      [isLunar ? 'lunar_month' : 'month']: month,
      [isLunar ? 'lunar_day' : 'day']: day,
      hour,
      minute,
      second,
      // 如果是农历日期，添加闰月标志
      ...(isLunar && { is_leap_month: timeData.is_leap_month || false })
    }
  };
};

/**
 * 格式化输入值（限制长度，只允许数字）
 * @param {string} value - 输入值
 * @param {string} fieldName - 字段名称
 * @returns {string} 格式化后的值
 */
export const formatInputValue = (value, fieldName) => {
  // 使用正则表达式移除所有非数字字符（只允许数字0-9）
  const numericValue = value.replace(/[^0-9]/g, '');
  
  // 根据字段类型进行长度限制
  if (fieldName === 'year' || fieldName === 'lunar_year') {
    // 年份字段限制为4位
    return numericValue.slice(0, 4);
  } else {
    // 其他字段（月、日、时、分、秒）限制为2位
    return numericValue.slice(0, 2);
  }
};

/**
 * 自动补零函数
 * @param {string|number} value - 输入值
 * @param {number} length - 目标长度
 * @returns {string} 补零后的值
 */
export const padValue = (value, length) => {
  // 将值转换为字符串并在前面补零到指定长度
  return value.toString().padStart(length, '0');
};

/**
 * 处理数字输入框的键盘事件，阻止非数字字符的输入
 * @param {Event} event - 键盘事件对象
 * @returns {boolean} 是否允许输入
 */
export const handleNumberInputKeyDown = (event) => {
  // 定义允许的按键列表：数字键（0-9）、退格键、删除键、方向键、Tab键、Home键、End键
  const allowedKeys = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'
  ];
  
  // 检查是否按下了允许的键
  if (!allowedKeys.includes(event.key) && !event.ctrlKey && !event.metaKey) {
    // 阻止默认行为，不允许输入非数字字符
    event.preventDefault();
    // 返回false表示不允许输入
    return false;
  }
  
  // 返回true表示允许输入
  return true;
};
