/*
 * @file            frontend/src/components/DivinationInfo/timestamp/SolarTime.jsx
 * @description     公历时间输入和显示组件，支持公历转农历转换
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-17 10:00:00
 * @lastModified    2026-02-18 21:12:32
 * Copyright © All rights reserved
*/

import React, { useState, useEffect, useRef, useCallback } from 'react'; // 导入React核心库和钩子函数
import CalendarService from '../../../services/calendarService'; // 导入日历服务模块
import { formatInputValue, handleInputValidation, validateInputData, padValue, handleNumberInputKeyDown } from '../../../utils/validationUtils'; // 导入输入验证工具函数
import AlertMessage from './shared/AlertMessage'; // 导入错误提示组件

/**
 * 公历时间输入和显示组件
 * @param {Function} onTimeChange - 时间数据变化时的回调函数
 * @param {Object} confirmedTime - 确认的时间数据（用于初始化）
 */

// 定义公历时间组件，接收props参数
const SolarTime = ({ onTimeChange, confirmedTime }) => {
  // 定义时间数据状态，存储用户输入的时间值
  const [timeData, setTimeData] = useState({
    year: '',  // 年份字段
    month: '', // 月份字段
    day: '',   // 日期字段
    hour: '',  // 小时字段
    minute: '', // 分钟字段
    second: ''  // 秒字段
  });
  
  // 当前时间状态（用于分、秒未输入时显示）
  const [currentTime, setCurrentTime] = useState({
    minute: '', // 当前分钟
    second: ''  // 当前秒
  });
  
  
  const skipNotifyRef = useRef(false); // 使用ref存储跳过通知的标记，避免不必要的父组件更新
  
  const [lunarDate, setLunarDate] = useState(''); // 定义农历日期状态，存储转换后的农历日期
  const [lunarTime, setLunarTime] = useState(''); // 定义农历时辰状态，存储转换后的农历时辰
  
  const [solarDate, setSolarDate] = useState(''); // 定义公历日期状态，存储格式化后的公历日期
  const [solarTime, setSolarTime] = useState(''); // 定义公历时间状态，存储格式化后的公历时间
  
  const [showAlert, setShowAlert] = useState(false); // 定义错误提示显示状态
  const [alertMessage, setAlertMessage] = useState(''); // 定义错误提示信息状态
  
  const [hadPreviousValue, setHadPreviousValue] = useState(false); // 跟踪之前是否有值，用于判断是否需要通知父组件
  
  // 定义输入框禁用状态对象
  const [disabledFields, setDisabledFields] = useState({
    year: false,   // 年份输入框禁用状态
    month: false,  // 月份输入框禁用状态
    day: false,    // 日期输入框禁用状态
    hour: false,   // 小时输入框禁用状态
    minute: false, // 分钟输入框禁用状态
    second: false  // 秒输入框禁用状态
  });
  
  // 输入框引用，用于同步浏览器自动填充的值（直接操作DOM元素）
  const inputRefs = useRef({
    year: null,   // 年份输入框引用
    month: null,  // 月份输入框引用
    day: null,    // 日期输入框引用
    hour: null,   // 小时输入框引用
    minute: null, // 分钟输入框引用
    second: null  // 秒输入框引用
  });

  /**
   * 当confirmedTime变化时，初始化时间数据
   * @param {Object} confirmedTime - 确认的时间数据
   */

  // 定义副作用钩子，监听confirmedTime变化
  useEffect(() => {
    // 如果确认时间不为空
    if (confirmedTime !== null) {
      skipNotifyRef.current = true; // 设置跳过通知标记，避免触发父组件更新
      setTimeData(confirmedTime); // 设置时间数据为确认的时间
      // 设置所有输入框为可用状态
      setDisabledFields({
        year: false,   // 年份输入框可用
        month: false,  // 月份输入框可用
        day: false,    // 日期输入框可用
        hour: false,   // 小时输入框可用
        minute: false, // 分钟输入框可用
        second: false  // 秒输入框可用
      });
      skipNotifyRef.current = false; // 重置跳过通知标记
    }
  }, [confirmedTime]); // 依赖数组：监听confirmedTime变化
  
  /**
   * 初始化时同步浏览器自动填充的值
   * 浏览器自动填充不会触发onChange事件，需要手动同步
   */

  // 定义副作用钩子，处理浏览器自动填充
  useEffect(() => {
    // 检查并同步浏览器自动填充的值
    // 定义同步自动填充值的函数
    const syncAutofilledValues = () => {
      // 检查是否有自动填充的值
      const hasAutofilledValues = Object.keys(inputRefs.current).some(fieldName => {
        const input = inputRefs.current[fieldName]; // 获取输入框引用
        return input && input.value && input.value !== timeData[fieldName]; // 检查输入框值是否与状态不一致
      });

      // 如果有自动填充的值
      if (hasAutofilledValues) {
        // 构建自动填充数据对象
        const autofilledData = {
          year: inputRefs.current.year?.value || '',    // 获取年份输入框的值
          month: inputRefs.current.month?.value || '',  // 获取月份输入框的值
          day: inputRefs.current.day?.value || '',    // 获取日期输入框的值
          hour: inputRefs.current.hour?.value || '',   // 获取小时输入框的值
          minute: inputRefs.current.minute?.value || '', // 获取分钟输入框的值
          second: inputRefs.current.second?.value || ''  // 获取秒输入框的值
        };
        
        skipNotifyRef.current = true; // 设置跳过通知标记
        setTimeData(autofilledData); // 更新时间数据状态
        skipNotifyRef.current = false; // 重置跳过通知标记
      }
    };
    
    const timer = setTimeout(syncAutofilledValues, 100); // 设置100ms延迟执行同步函数
    
    return () => clearTimeout(timer); // 清除定时器，避免内存泄漏
  }, []); // 故意使用空依赖数组，只需在组件挂载时执行一次同步浏览器自动填充值

  /**
   * 当timeData变化时，通知父组件
   * 通知父组件的条件：
   * 1. 当前有值，无论之前是否有值
   * 2. 当前无值，但之前有值（从有值变为无值的情况）
   */

  // 定义副作用钩子，监听timeData变化
  useEffect(() => {
    // 如果没有跳过通知标记
    if (!skipNotifyRef.current) { 
      const hasCurrentValue = Object.values(timeData).some(value => value !== ''); // 检查当前是否有值
      // 如果当前有值或之前有值
      if (hasCurrentValue || hadPreviousValue) {
        onTimeChange(timeData); // 调用父组件的时间变化回调函数
        
        setHadPreviousValue(hasCurrentValue); // 更新之前是否有值的状态
      }
    }
  }, [timeData, onTimeChange, hadPreviousValue]); // 依赖数组：监听timeData、onTimeChange和hadPreviousValue变化

  // 更新当前时间，用于分、秒未输入时显示
  // 定义副作用钩子，更新当前时间
  useEffect(() => {
    const updateCurrentTime = () => { // 定义更新当前时间的函数
      const now = new Date(); // 获取当前时间对象
      // 更新当前时间状态
      setCurrentTime({
        minute: now.getMinutes().toString().padStart(2, '0'), // 获取当前分钟并格式化为两位数
        second: now.getSeconds().toString().padStart(2, '0')  // 获取当前秒并格式化为两位数
      });
    };
    
    updateCurrentTime(); // 立即更新一次当前时间
    
    const intervalId = setInterval(updateCurrentTime, 1000); // 设置1000ms间隔的定时器
    
    return () => clearInterval(intervalId); // 清除定时器，避免内存泄漏
  }, []); // 空依赖数组，只在组件挂载时执行一次

  // 处理输入变化
  // 定义输入变化处理函数
  const handleChange = (e) => {
    const { name, value } = e.target; // 从事件对象中获取输入框名称和值
    
    const validatedValue = formatInputValue(value, name); // 调用格式化函数处理输入值
    
    // 验证输入值
    let maxValue = null; // 定义最大值变量
    // 如果是日期输入框
    if (name === 'day') {
      maxValue = getDaysInMonth(timeData.year, timeData.month); // 获取当月的最大天数
    }
    // 验证输入值是否有效
    if (!handleInputValidation(name, validatedValue, setAlertMessage, setShowAlert, setTimeData, maxValue)) { 
      return; // 如果验证失败，直接返回
    }
    
    // 实时更新输入框显示值
    // 更新时间数据状态
    setTimeData(prev => ({
      ...prev, // 保留其他字段的值
      [name]: validatedValue // 更新当前字段的值
    }));
  };
  
  // 定义获取月天数的函数
  const getDaysInMonth = (year, month) => { 
    if (!year || !month) return 31; // 如果年份或月份为空，返回默认值31
    return CalendarService.getDaysInMonth(year, month); // 调用日历服务获取指定年月的天数
  };

  // 处理失去焦点事件
  // 定义失去焦点处理函数
  const handleBlur = (e) => {
    const { name, value } = e.target; // 从事件对象中获取输入框名称和值
    // 如果输入框有值
    if (value.length > 0) {
      let paddedValue; // 定义补零后的值变量
      if (name === 'year') { // 如果是年份输入框
        // 自动补零到4位
        paddedValue = padValue(value, 4); // 调用补零函数，补齐到4位
        
        // 失去焦点验证：验证值是否小于等于0（仅对年有效）
        if (parseInt(paddedValue) <= 0) {
          setAlertMessage('年份值请输入0001~9999'); // 设置错误提示信息
          setShowAlert(true); // 显示错误提示弹窗
          // 清空输入框
          // 更新时间数据状态
          setTimeData(prev => ({
            ...prev, // 保留其他字段的值
            [name]: '' // 清空当前字段的值
          }));
          return; // 直接返回
        }
      }
      // 如果是其他输入框
      else {
        // 自动补零到2位
        paddedValue = padValue(value, 2); // 调用补零函数，补齐到2位
        
        // 失去焦点验证：验证值是否小于等于0（仅对月、日有效）
        // 如果是月份或日期且值小于等于0
        if ((name === 'month' || name === 'day') && parseInt(paddedValue) <= 0) {
          setAlertMessage(`${name === 'month' ? '月份' : '日期'}值请输入1~${name === 'month' ? '12' : getDaysInMonth(timeData.year, timeData.month)}`); // 设置错误提示信息
          setShowAlert(true); // 显示错误提示弹窗
          // 清空输入框
          // 更新时间数据状态
          setTimeData(prev => ({
            ...prev, // 保留其他字段的值
            [name]: '' // 清空当前字段的值
          }));
          return; // 直接返回
        }
        
        // 对于日值，当同时指定年份与月份时，验证日值不能大于当月实际天数
        // 如果是日期输入框且年份和月份都有值
        if (name === 'day' && timeData.year && timeData.month) {
          const maxDays = getDaysInMonth(timeData.year, timeData.month); // 获取当月的最大天数
          // 如果日期值大于当月最大天数
          if (parseInt(paddedValue) > maxDays) {
            setAlertMessage(`日期值请输入1~${maxDays}`); // 设置错误提示信息
            setShowAlert(true); // 显示错误提示弹窗
            // 清空输入框
            // 更新时间数据状态
            setTimeData(prev => ({
              ...prev, // 保留其他字段的值
              [name]: '' // 清空当前字段的值
            }));
            return; // 直接返回
          }
        }
      }
      // 更新时间数据状态
      setTimeData(prev => ({
        ...prev, // 保留其他字段的值
        [name]: paddedValue // 设置当前字段的补零后的值
      }));
    }
  };
  
  // 双击清空输入框
  // 定义双击处理函数
  const handleDoubleClick = (e, fieldName) => {
    // 阻止浏览器默认的全选行为
    e.preventDefault(); // 阻止默认事件
    // 清空输入框值
    // 更新时间数据状态
    setTimeData(prev => ({
      ...prev, // 保留其他字段的值
      [fieldName]: '' // 清空指定字段的值
    }));
    // 直接操作DOM确保清空，处理浏览器自动填充的情况
    // 如果输入框引用存在
    if (inputRefs.current[fieldName]) {
      inputRefs.current[fieldName].value = ''; // 直接清空输入框的DOM值
    }
  };

  // 关闭弹窗
  // 定义关闭弹窗处理函数
  const closeAlert = () => {
    // 根据错误信息重置对应的输入框
    let fieldToReset = ''; // 定义需要重置的字段名
    // 如果错误信息包含"年份"
    if (alertMessage.includes('年份')) {
      fieldToReset = 'year'; // 设置重置字段为年份
    }
    // 如果错误信息包含"月份"
    else if (alertMessage.includes('月份')) {
      fieldToReset = 'month'; // 设置重置字段为月份
    }
    // 如果错误信息包含"日期"
    else if (alertMessage.includes('日期')) {
      fieldToReset = 'day'; // 设置重置字段为日期
    }
    // 如果错误信息包含"小时"
    else if (alertMessage.includes('小时')) {
      fieldToReset = 'hour'; // 设置重置字段为小时
    }
    // 如果错误信息包含"分钟"
    else if (alertMessage.includes('分钟')) {
      fieldToReset = 'minute'; // 设置重置字段为分钟
    }
    // 如果错误信息包含"秒"
    else if (alertMessage.includes('秒')) {
      fieldToReset = 'second'; // 设置重置字段为秒
    }

    // 如果确定了需要重置的字段
    if (fieldToReset) {
      // 更新时间数据状态
      setTimeData(prev => {
        // 创建新的数据对象
        const newData = {
          ...prev, // 保留其他字段的值
          [fieldToReset]: '' // 清空指定字段的值
        };
        return newData; // 返回新的数据对象
      });
      
      // 在下一个渲染周期后将焦点设置回触发警告的输入框
      // 设置延迟执行
      setTimeout(() => {
        // 如果输入框引用存在
        if (inputRefs.current[fieldToReset]) {
          inputRefs.current[fieldToReset].focus(); // 将焦点设置回输入框
        }
      }, 0); // 延迟0ms，在下一个渲染周期执行
    }
    
    setShowAlert(false); // 隐藏错误提示弹窗
  };

  // 定义构建农历日期字符串的函数
  const buildLunarDateString = (lunarData) => {
    let lunarDateString = ''; // 定义农历日期字符串变量
    
    // 如果有农历干支年，提取农历年信息
    if (lunarData.lunar_year_in_GanZhi) {
      lunarDateString += lunarData.lunar_year_in_GanZhi + '年'; // 拼接农历干支年
    }
    
    // 如果有农历中文月，提取农历月信息
    if (lunarData.lunar_month_in_Chinese) {
      lunarDateString += lunarData.lunar_month_in_Chinese + '月'; // 拼接农历中文月
    }
    
    // 如果有农历中文日，提取农历日信息
    if (lunarData.lunar_day_in_Chinese) {
      lunarDateString += lunarData.lunar_day_in_Chinese; // 拼接农历中文日
    }
    
    return lunarDateString || ''; // 返回农历日期字符串，如果为空则返回空字符串
  };

  // 构建时辰字符串
  // 定义构建时辰字符串的函数
  const buildLunarTimeString = (hour, minute, second, lunarData) => {
    // 如果小时为空或没有时辰数据
    if (hour === null || !lunarData.lunar_time_Zhi) {
      return ''; // 返回空字符串
    }
    
    // 判断是否为子时，并区分早子时和晚子时
    // 如果是子时
    if (lunarData.lunar_time_Zhi === '子') {
      const hourNum = parseInt(hour); // 将小时转换为整数
      const minuteNum = parseInt(minute || 0); // 将分钟转换为整数，默认为0
      const secondNum = parseInt(second || 0); // 将秒转换为整数，默认为0
      
      // 23:00:00~23:59:59 → 晚子时
      // 如果是23点且分钟或秒大于0
      if (hourNum === 23 && (minuteNum > 0 || secondNum > 0)) {
        return '晚子时'; // 返回晚子时
      }
      // 如果是23:00:00
      else if (hourNum === 23 && minuteNum === 0 && secondNum === 0) {
        return '晚子时'; // 返回晚子时
      }
      // 如果是0点
      else if (hourNum === 0) {
        // 00:00:00~00:59:59 → 早子时
        return '早子时'; // 返回早子时
      }
      // 其他情况
      else { 
        return `${lunarData.lunar_time_Zhi}时`; // 返回时辰名称
      }
    }
    // 如果不是子时
    else {
      return `${lunarData.lunar_time_Zhi}时`; // 返回时辰名称
    }
  };

  // 使用前端CalendarService将公历时间转换为农历
  // 定义公历转农历的回调函数
  const convertToLunar = useCallback((timeData) => {
    // 尝试执行转换逻辑
    try {
      const hour = timeData.hour ? parseInt(timeData.hour) : null; // 检查小时值是否存在，获取小时值，如果不存在则为null
      const minute = timeData.minute ? parseInt(timeData.minute) : parseInt(currentTime.minute); // 当未输入分钟或秒时，使用当前时间的分钟和秒，如果不存在则使用当前时间
      const second = timeData.second ? parseInt(timeData.second) : parseInt(currentTime.second); // 获取秒值，如果不存在则使用当前时间
      
      const hasCompleteDate = timeData.year && timeData.month && timeData.day; // 检查年月日是否都有值
      // 如果年、月、日完整，执行完整的阳历到农历转换
      if (hasCompleteDate) {
        const validationResult = validateInputData(timeData, false); // 验证输入数据
        // 如果验证失败
        if (!validationResult.valid) {
          // 输入无效，清空所有信息
          setLunarDate(''); // 清空农历日期
          setLunarTime(''); // 清空农历时辰
          setSolarDate(''); // 清空公历日期
          setSolarTime(''); // 清空公历时间
          return; // 直接返回
        }
        
        const { year, month, day } = validationResult.data; // 从验证结果中获取年月日
        
        // 使用前端CalendarService进行转换
        // 调用日历服务转换公历为农历
        const result = CalendarService.convertSolarToLunar({
          year, // 年份
          month, // 月份
          day, // 日期
          hour: hour || 0, // 小时，如果不存在则为0
          minute, // 分钟
          second // 秒
        });
        // 如果转换成功
        if (result.success && result.data) {
          const lunarDateString = buildLunarDateString(result.data); // 调用构建农历日期字符串函数
          const lunarTimeString = buildLunarTimeString(hour, minute, second, result.data); // 调用构建时辰字符串函数
          
          // 构建公历日期字符串
          const solarDateString = `${result.data.solar_year.toString().padStart(4, '0')}年${result.data.solar_month.toString().padStart(2, '0')}月${result.data.solar_day.toString().padStart(2, '0')}日`; // 格式化公历日期

          // 构建公历时间字符串
          const solarTimeString = `${result.data.solar_hour.toString().padStart(2, '0')}:${result.data.solar_minute.toString().padStart(2, '0')}:${result.data.solar_second.toString().padStart(2, '0')}`; // 格式化公历时间
          
          // 更新农历信息
          setLunarDate(lunarDateString); // 设置农历日期
          setLunarTime(lunarTimeString); // 设置农历时辰
          // 更新公历信息
          setSolarDate(solarDateString); // 设置公历日期
          setSolarTime(solarTimeString); // 设置公历时间
        }
        // 如果转换失败
        else {
          console.error('转换为农历失败:', result.error || '未知错误'); // 转换失败，只打印日志，不显示错误提示
        }
      }
      // 如果年月日不完整
      else {
        // 如果有小时值
        if (hour !== null) {
          const timeResult = CalendarService.getLunarTimeByHms(hour, minute, second); // 有小时值，只计算时辰，调用日历服务获取时辰
          // 如果获取成功
          if (timeResult.success && timeResult.data) {
            const { lunar_time_Zhi, solar_hour, solar_minute, solar_second } = timeResult.data; // 解构获取时辰和时间数据
              
            // 构建时辰字符串
            const lunarTimeString = buildLunarTimeString(hour, minute, second, { lunar_time_Zhi }); // 调用构建时辰字符串函数
              
            // 更新农历时辰信息，清空日期信息
            setLunarDate(''); // 清空农历日期
            setLunarTime(lunarTimeString); // 设置农历时辰
              
            // 构建公历时间字符串
            const solarTimeString = `${solar_hour.toString().padStart(2, '0')}:${solar_minute.toString().padStart(2, '0')}:${solar_second.toString().padStart(2, '0')}`; // 格式化公历时间
            setSolarDate(''); // 清空公历日期
            setSolarTime(solarTimeString); // 设置公历时间
          }
        }
        // 如果没有小时值
        else {
          // 没有小时值，清空所有时间相关信息
          setLunarDate(''); // 清空农历日期
          setLunarTime(''); // 清空农历时辰
          setSolarDate(''); // 清空公历日期
          setSolarTime(''); // 清空公历时间
        }
      }
    } catch (error) { // 捕获异常
      console.error('转换为农历失败:', error); // 输出错误日志
      // 错误时只打印日志，不显示提示
    }
  }, [currentTime.minute, currentTime.second]); // 依赖数组：监听当前时间的分钟和秒变化

  // 监听键盘事件，支持回车键关闭弹窗
  useEffect(() => { // 定义副作用钩子，监听键盘事件
    const handleKeyPress = (event) => { // 定义键盘事件处理函数
      if (event.key === 'Enter' && showAlert) { // 如果按下回车键且显示警告弹窗
        // 直接实现关闭弹窗的逻辑，避免依赖closeAlert函数
        // 根据错误信息重置对应的输入框
        let fieldToReset = ''; // 定义需要重置的字段名
        if (alertMessage.includes('年份')) { // 如果错误信息包含"年份"
          fieldToReset = 'year'; // 设置重置字段为年份
        } else if (alertMessage.includes('月份')) { // 如果错误信息包含"月份"
          fieldToReset = 'month'; // 设置重置字段为月份
        } else if (alertMessage.includes('日期')) { // 如果错误信息包含"日期"
          fieldToReset = 'day'; // 设置重置字段为日期
        } else if (alertMessage.includes('小时')) { // 如果错误信息包含"小时"
          fieldToReset = 'hour'; // 设置重置字段为小时
        } else if (alertMessage.includes('分钟')) { // 如果错误信息包含"分钟"
          fieldToReset = 'minute'; // 设置重置字段为分钟
        } else if (alertMessage.includes('秒')) { // 如果错误信息包含"秒"
          fieldToReset = 'second'; // 设置重置字段为秒
        }
        
        if (fieldToReset) { // 如果确定了需要重置的字段
          setTimeData(prev => ({ // 更新时间数据状态
            ...prev, // 保留其他字段的值
            [fieldToReset]: '' // 清空指定字段的值
          }));
          
          // 在下一个渲染周期后将焦点设置回触发警告的输入框
          setTimeout(() => { // 设置延迟执行
            if (inputRefs.current[fieldToReset]) { // 如果输入框引用存在
              inputRefs.current[fieldToReset].focus(); // 将焦点设置回输入框
            }
          }, 0); // 延迟0ms，在下一个渲染周期执行
        }
        
        setShowAlert(false); // 隐藏错误提示弹窗
      }
    };

    // 添加键盘事件监听器
    window.addEventListener('keydown', handleKeyPress); // 添加键盘事件监听

    // 清理函数
    return () => { // 返回清理函数
      window.removeEventListener('keydown', handleKeyPress); // 移除键盘事件监听
    };
  }, [showAlert, alertMessage]); // 依赖showAlert和alertMessage状态

  // 防抖处理的农历转换
  const debouncedConvertToLunar = useCallback(() => { // 定义防抖处理的农历转换函数
    let timeoutId; // 定义定时器ID变量
    return (timeData) => { // 返回防抖函数
      clearTimeout(timeoutId); // 清除之前的定时器
      timeoutId = setTimeout(() => { // 设置新的定时器
        convertToLunar(timeData); // 延迟执行农历转换
      }, 300); // 300ms防抖延迟
    };
  }, [convertToLunar])(); // 依赖数组：监听convertToLunar函数变化

  // 监听timeData变化，更新农历信息（使用防抖）
  useEffect(() => { // 定义副作用钩子，监听timeData变化
    debouncedConvertToLunar(timeData); // 调用防抖函数执行农历转换
  }, [timeData, debouncedConvertToLunar]); // 依赖数组：监听timeData和debouncedConvertToLunar变化
  
  /**
   * 当timeData变化时，同步DOM值
   * 确保React状态与DOM显示一致，特别是在全清按钮点击后
   */
  useEffect(() => { // 定义副作用钩子，同步DOM值
    // 同步DOM值，确保输入框显示与React状态一致
    Object.keys(timeData).forEach(fieldName => { // 遍历时间数据对象的所有字段
      if (inputRefs.current[fieldName]) { // 如果输入框引用存在
        inputRefs.current[fieldName].value = timeData[fieldName] || ''; // 设置输入框的DOM值为状态值
      }
    });
  }, [timeData]); // 依赖数组：监听timeData变化

  return ( // 返回JSX结构
    <div className="gregorian-time-container"> {/* 公历时间容器 */}
      {/* 时间输入区域 */}
      <div className="timestamp-inputs"> {/* 时间输入框容器 */}
        <input // 年份输入框
          ref={(el) => (inputRefs.current.year = el)} // 设置年份输入框引用
          type="number" // 输入类型为数字
          name="year" // 输入框名称为year
          placeholder="年" // 占位符为"年"
          className="time-input time-input-year no-spin-buttons" // 设置样式类名
          value={timeData.year} // 绑定年份值
          onChange={handleChange} // 绑定输入变化处理函数
          onBlur={handleBlur} // 绑定失去焦点处理函数
          onDoubleClick={(e) => handleDoubleClick(e, 'year')} // 绑定双击清空处理函数
          onKeyDown={handleNumberInputKeyDown} // 绑定键盘事件处理函数
          disabled={disabledFields.year} // 绑定禁用状态
          min="1" // 最小值为1
          max="9999" // 最大值为9999
        />
        <input // 月份输入框
          ref={(el) => (inputRefs.current.month = el)} // 设置月份输入框引用
          type="number" // 输入类型为数字
          name="month" // 输入框名称为month
          placeholder="月" // 占位符为"月"
          className="time-input time-input-small no-spin-buttons" // 设置样式类名
          value={timeData.month} // 绑定月份值
          onChange={handleChange} // 绑定输入变化处理函数
          onBlur={handleBlur} // 绑定失去焦点处理函数
          onDoubleClick={(e) => handleDoubleClick(e, 'month')} // 绑定双击清空处理函数
          onKeyDown={handleNumberInputKeyDown} // 绑定键盘事件处理函数
          disabled={disabledFields.month} // 绑定禁用状态
          min="1" // 最小值为1
          max="12" // 最大值为12
        />
        <input // 日期输入框
          ref={(el) => (inputRefs.current.day = el)} // 设置日期输入框引用
          type="number" // 输入类型为数字
          name="day" // 输入框名称为day
          placeholder="日" // 占位符为"日"
          className="time-input time-input-small no-spin-buttons" // 设置样式类名
          value={timeData.day} // 绑定日期值
          onChange={handleChange} // 绑定输入变化处理函数
          onBlur={handleBlur} // 绑定失去焦点处理函数
          onDoubleClick={(e) => handleDoubleClick(e, 'day')} // 绑定双击清空处理函数
          onKeyDown={handleNumberInputKeyDown} // 绑定键盘事件处理函数
          disabled={disabledFields.day} // 绑定禁用状态
          min="1" // 最小值为1
          max="31" // 最大值为31
        />
        <input // 小时输入框
          ref={(el) => (inputRefs.current.hour = el)} // 设置小时输入框引用
          type="number" // 输入类型为数字
          name="hour" // 输入框名称为hour
          placeholder="时" // 占位符为"时"
          className="time-input time-input-small no-spin-buttons" // 设置样式类名
          value={timeData.hour} // 绑定小时值
          onChange={handleChange} // 绑定输入变化处理函数
          onBlur={handleBlur} // 绑定失去焦点处理函数
          onDoubleClick={(e) => handleDoubleClick(e, 'hour')} // 绑定双击清空处理函数
          onKeyDown={handleNumberInputKeyDown} // 绑定键盘事件处理函数
          disabled={disabledFields.hour} // 绑定禁用状态
          min="0" // 最小值为0
          max="23" // 最大值为23
        />
        <input // 分钟输入框
          ref={(el) => (inputRefs.current.minute = el)} // 设置分钟输入框引用
          type="number" // 输入类型为数字
          name="minute" // 输入框名称为minute
          placeholder="分" // 占位符为"分"
          className="time-input time-input-small no-spin-buttons" // 设置样式类名
          value={timeData.minute} // 绑定分钟值
          onChange={handleChange} // 绑定输入变化处理函数
          onBlur={handleBlur} // 绑定失去焦点处理函数
          onDoubleClick={(e) => handleDoubleClick(e, 'minute')} // 绑定双击清空处理函数
          onKeyDown={handleNumberInputKeyDown} // 绑定键盘事件处理函数
          disabled={disabledFields.minute} // 绑定禁用状态
          min="0" // 最小值为0
          max="59" // 最大值为59
        />
        <input // 秒输入框
          ref={(el) => (inputRefs.current.second = el)} // 设置秒输入框引用
          type="number" // 输入类型为数字
          name="second" // 输入框名称为second
          placeholder="秒" // 占位符为"秒"
          className="time-input time-input-small no-spin-buttons" // 设置样式类名
          value={timeData.second} // 绑定秒值
          onChange={handleChange} // 绑定输入变化处理函数
          onBlur={handleBlur} // 绑定失去焦点处理函数
          onDoubleClick={(e) => handleDoubleClick(e, 'second')} // 绑定双击清空处理函数
          onKeyDown={handleNumberInputKeyDown} // 绑定键盘事件处理函数
          disabled={disabledFields.second} // 绑定禁用状态
          min="0" // 最小值为0
          max="59" // 最大值为59
        />
      </div> {/* 时间输入框容器结束 */}
      
      {/* 时间显示区域 */}
      <div className="timestamp-display"> {/* 时间显示容器 */}
        <div className="solar-info"> {/* 公历信息容器 */}
          <span className="solar-label">公历：</span> {/* 公历标签 */}
          <span className="date-value">{solarDate}</span> {/* 公历日期值 */}
          <span className="time-value"> {/* 公历时间值 */}
            {timeData.hour ? solarTime : ''} {/* 如果有小时值则显示公历时间 */}
          </span> {/* 公历时间值结束 */}
        </div> {/* 公历信息容器结束 */}
        <div className="lunar-info"> {/* 农历信息容器 */}
          <span className="date-label">农历：</span> {/* 农历标签 */}
          <span className="date-value">{lunarDate}</span> {/* 农历日期值 */}
          <span className="time-value">{lunarTime}</span> {/* 农历时辰值 */}
        </div> {/* 农历信息容器结束 */}
      </div> {/* 时间显示容器结束 */}
      
      <AlertMessage
        showAlert={showAlert}
        alertMessage={alertMessage}
        onClose={closeAlert}
      />
    </div> // 公历时间容器结束
  ); // return结束
}; // 组件定义结束

export default SolarTime; // 导出公历时间组件
