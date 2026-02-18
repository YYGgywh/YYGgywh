/*
 * @file            frontend/src/components/DivinationInfo/timestamp/LunarTime.jsx
 * @description     农历时间输入和显示组件，支持农历转公历转换
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-04 10:00:00
 * @lastModified    2026-02-18 13:27:38
 * Copyright © All rights reserved
*/

// 导入React核心库和Hooks
import React, {
  useState, // useState: 用于组件状态管理
  useEffect, // useEffect: 用于处理副作用(如订阅、定时器、DOM操作等)
  useCallback, // useCallback: 用于性能优化,缓存函数引用
  useRef // useRef: 用于引用DOM元素或保存可变值(不触发重新渲染)
} from 'react';

import CalendarService from '../../../services/calendarService'; // 导入日历服务模块,用于处理日历转换和计算

// 导入验证工具函数集合
import {
  formatInputValue, // formatInputValue: 格式化输入值,去除非数字字符
  validateInputData, // validateInputData: 验证输入数据的完整性和合法性
  padValue, // padValue: 填充值到指定长度(如将"1"填充为"0001")
  handleNumberInputKeyDown, // handleNumberInputKeyDown: 处理数字输入框的键盘事件
  handleInputValidation, // handleInputValidation: 处理输入验证,包括范围检查和错误提示
  getLunarMonthDays, // getLunarMonthDays: 获取指定农历月份的天数
  getLeapMonth // getLeapMonth: 获取指定农历年份的闰月月份
} from '../../../utils/validationUtils';

/**
 * 农历时间输入和显示组件
 * @param {Function} onTimeChange - 时间数据变化时的回调函数,将最新时间数据传递给父组件
 * @param {Object} confirmedTime - 确认的时间数据(用于初始化组件状态)
 */

// 定义农历时间组件,接收props参数
const LunarTime = ({ onTimeChange, confirmedTime }) => {
  // 定义时间数据状态,存储用户输入的时间值
  const [timeData, setTimeData] = useState({
    lunar_year: '',    // 农历年份字段,存储4位数字
    lunar_month: '',   // 农历月份字段,存储1-2位数字
    lunar_day: '',     // 农历日期字段,存储1-2位数字
    hour: '',          // 小时字段,存储1-2位数字(0-23)
    minute: '',        // 分钟字段,存储1-2位数字(0-59)
    second: '',        // 秒字段,存储1-2位数字(0-59)
    is_leap_month: false // 是否闰月字段,布尔值表示是否为闰月
  });

  const [showAlert, setShowAlert] = useState(false); // 定义错误提示显示状态,控制警告弹窗的显示/隐藏
  const [alertMessage, setAlertMessage] = useState(''); // 定义错误提示信息状态,存储警告弹窗中显示的错误消息
  
  // 定义农历信息状态,存储转换后的农历和公历信息
  const [lunarInfo, setLunarInfo] = useState({
    lunar_year_in_GanZhi: '',    // 农历干支年,如"甲子年"
    lunar_month_in_Chinese: '',   // 农历中文月,如"正月"、"二月"
    lunar_day_in_Chinese: '',     // 农历中文日,如"初一"、"十五"
    lunar_time_Zhi: '',           // 农历时辰,如"子时"、"丑时"
    solar_year: '',               // 公历年份,4位数字
    solar_month: '',              // 公历月份,2位数字
    solar_day: '',                // 公历日期,2位数字
    solar_hour: '',               // 公历小时,2位数字
    solar_minute: '',             // 公历分钟,2位数字
    solar_second: ''              // 公历秒,2位数字
  });
  
  const [solarTime, setSolarTime] = useState(''); // 定义公历时间字符串状态,存储格式化后的公历时间(如"12:30:45")

  // 定义当前时间状态,用于分、秒未输入时显示当前时间的分和秒
  const [currentTime, setCurrentTime] = useState({
    minute: '', // 当前分钟,2位数字
    second: ''  // 当前秒,2位数字
  });
  
  const prevTimeDataRef = useRef(null); // 使用ref存储之前的时间数据,用于比较变化(当前未使用)
  const skipNotifyRef = useRef(false); // 使用ref存储跳过通知的标记,避免不必要的父组件更新
  const [hadPreviousValue, setHadPreviousValue] = useState(false); // 跟踪之前是否有值,用于判断是否需要通知父组件
  
  // 定义输入框禁用状态对象,控制各个输入框的禁用/启用状态
  const [disabledFields, setDisabledFields] = useState({
    lunar_year: false,   // 农历年份输入框禁用状态
    lunar_month: false,  // 农历月份输入框禁用状态
    lunar_day: false,    // 农历日期输入框禁用状态
    hour: false,         // 小时输入框禁用状态
    minute: false,       // 分钟输入框禁用状态
    second: false,       // 秒输入框禁用状态
    leap_month: true     // 闰月切换按钮禁用状态(默认禁用,只有当年份有闰月且月份等于闰月时才启用)
  });
  
  // 定义输入框引用,用于同步浏览器自动填充的值(直接操作DOM元素)
  const inputRefs = useRef({
    lunar_year: null,     // 农历年份输入框引用
    lunar_month: null,    // 农历月份输入框引用
    lunar_day: null,      // 农历日期输入框引用
    hour: null,           // 小时输入框引用
    minute: null,         // 分钟输入框引用
    second: null,         // 秒输入框引用
    leapMonthToggle: null // 闰月切换按钮引用
  });

  /**
   * 当confirmedTime变化时,初始化时间数据
   * @param {Object} confirmedTime - 确认的时间数据
   */

  // 定义副作用钩子,监听confirmedTime变化
  useEffect(() => {
    // 如果确认时间不为空
    if (confirmedTime) {
      skipNotifyRef.current = true; // 设置跳过通知标记,避免触发父组件更新
      setTimeData(confirmedTime); // 设置时间数据为确认的时间
      // 设置所有输入框为可用状态
      setDisabledFields({
        lunar_year: false,  // 农历年份输入框可用
        lunar_month: false, // 农历月份输入框可用
        lunar_day: false,   // 农历日期输入框可用
        hour: false,        // 小时输入框可用
        minute: false,      // 分钟输入框可用
        second: false       // 秒输入框可用
      });
      skipNotifyRef.current = false; // 重置跳过通知标记
    }
  }, [confirmedTime]); // 依赖数组:监听confirmedTime变化
  
  /**
   * 初始化时同步浏览器自动填充的值
   * 浏览器自动填充不会触发onChange事件,需要手动同步
   */

  // 定义副作用钩子,处理浏览器自动填充
  useEffect(() => {
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
          lunar_year: inputRefs.current.lunar_year?.value || '',   // 获取农历年份输入框的值
          lunar_month: inputRefs.current.lunar_month?.value || '', // 获取农历月份输入框的值
          lunar_day: inputRefs.current.lunar_day?.value || '',     // 获取农历日期输入框的值
          hour: inputRefs.current.hour?.value || '',                // 获取小时输入框的值
          minute: inputRefs.current.minute?.value || '',            // 获取分钟输入框的值
          second: inputRefs.current.second?.value || '',            // 获取秒输入框的值
          is_leap_month: timeData.is_leap_month                     // 保持闰月状态不变
        };
        
        skipNotifyRef.current = true; // 设置跳过通知标记,避免触发父组件更新
        setTimeData(autofilledData); // 更新时间数据状态
        skipNotifyRef.current = false; // 重置跳过通知标记
      }
    };
    
    const timer = setTimeout(syncAutofilledValues, 100); // 延迟100ms执行同步,确保浏览器自动填充完成
    
    return () => clearTimeout(timer); // 清理函数:组件卸载时清除定时器
  }, []); // 空依赖数组,只在组件挂载时执行一次

  // 更新当前时间,用于分、秒未输入时显示
  useEffect(() => {
    // 定义更新当前时间的函数
    const updateCurrentTime = () => {
      const now = new Date(); // 获取当前时间
      // 更新当前时间状态，用于在用户未输入分钟或秒时提供默认值
      setCurrentTime({
        minute: now.getMinutes().toString().padStart(2, '0'), // 获取分钟并格式化为2位
        second: now.getSeconds().toString().padStart(2, '0')  // 获取秒并格式化为2位
      });
    };
    
    updateCurrentTime(); // 初始化时更新一次
    
    const intervalId = setInterval(updateCurrentTime, 1000); // 每秒更新一次当前时间
    
    return () => clearInterval(intervalId); // 清理函数:组件卸载时清除定时器
  }, []); // 空依赖数组,只在组件挂载时执行一次

  // 当timeData变化时,通知父组件
  useEffect(() => {
    // 如果未跳过通知
    if (!skipNotifyRef.current) {
      const hasCurrentValue = Object.values(timeData).some(value => value !== ''); // 检查是否有当前值
      
      // 如果有当前值或之前有值,则通知父组件
      if (hasCurrentValue || hadPreviousValue) {
        onTimeChange(timeData); // 调用父组件传递的回调函数
        setHadPreviousValue(hasCurrentValue); // 更新之前是否有值的标记
      }
    }
  }, [timeData, onTimeChange, hadPreviousValue]); // 依赖数组:监听timeData、onTimeChange、hadPreviousValue变化

  // 处理输入框值变化事件
  const handleChange = (e) => {
    const { name, value } = e.target; // 获取输入框名称和值
    const formattedValue = formatInputValue(value, name); // 格式化输入值,去除非数字字符
    
    let maxDays = null; // 计算农历日期的最大值(如果有足够的信息)
    // 如果修改的是日期相关字段
    if (name === 'lunar_day' || name === 'lunar_year' || name === 'lunar_month' || name === 'is_leap_month') {
      const { lunar_year, lunar_month, is_leap_month } = timeData; // 获取当前年份、月份和闰月状态
      // 如果年份和月份都有值
      if (lunar_year && lunar_month) {
        // 尝试获取指定农历月份的最大天数，用于后续输入验证
        try {
          maxDays = getLunarMonthDays(parseInt(lunar_year), parseInt(lunar_month), is_leap_month); // 调用工具函数获取指定农历年份、月份及是否闰月条件下的该月总天数，用于后续对“日”输入框的最大值做动态限制
        }
        // 若获取失败（如非法年份或月份），记录错误并继续，maxDays 保持为 null
        catch (error) {
          console.error('计算农历月份天数失败:', error); // 输出错误日志
        }
      }
    }
    
    // 使用validationUtils中的handleInputValidation进行验证
    // 参数:字段名、格式化后的值、设置错误消息函数、设置显示警告函数、设置时间数据函数、最大天数、是否为农历字段
    if (!handleInputValidation(name, formattedValue, setAlertMessage, setShowAlert, setTimeData, maxDays, name.includes('lunar'))) {
      return; // 验证失败,直接返回
    }
    
    // 更新时间数据状态
    setTimeData(prev => {
      // 创建新的时间数据对象，合并之前的状态并更新当前字段的值
      const newData = {
        ...prev, // 复制之前的状态
        [name]: formattedValue // 更新当前字段的值
      };
      
      // 处理"闰"键钮的禁用/启用逻辑已移至useEffect钩子中
      // 这里不再重复处理,确保与useEffect中的逻辑保持一致
      
      return newData; // 返回新的状态
    });
  };

  // 处理输入框失焦事件
  const handleBlur = (e) => {
    const { name, value } = e.target; // 获取输入框名称和值
    
    // 如果输入框有值
    if (value.length > 0) {
      let paddedValue; // 定义填充后的值变量
      // 如果是年份字段
      if (name === 'lunar_year') {
        paddedValue = padValue(value, 4); // 填充到4位(如"1"→"0001")
        
        // 检查年份值是否合法
        if (parseInt(paddedValue) <= 0) {
          setAlertMessage('年份值请输入0001~9999'); // 设置错误消息
          setShowAlert(true); // 显示警告弹窗
          setTimeData(prev => ({ // 清空该字段的值
            ...prev,  // 保留之前所有字段的值
            [name]: '' // 将当前出错的字段清空，等待用户重新输入
          }));
          return; // 直接返回
        }
      }
      // 如果是月份或日期字段
      else if (name === 'lunar_month' || name === 'lunar_day') {
        paddedValue = padValue(value, 2); // 填充到2位(如"1"→"01")
        
        // 检查值是否为0
        if (parseInt(paddedValue) <= 0) {
          setAlertMessage(`${name === 'lunar_month' ? '月份' : '日期'}值不能为0`); // 设置错误消息
          setShowAlert(true); // 显示警告弹窗
          // 清空该字段的值
          setTimeData(prev => ({
            ...prev,   // 保留之前所有字段的值
            [name]: '' // 将当前出错的字段清空，等待用户重新输入
          }));
          return; // 直接返回
        }
      }
      // 其他字段(时、分、秒)
      else {
        paddedValue = padValue(value, 2); // 填充到2位
      }
      
      // 更新时间数据状态,设置填充后的值
      setTimeData(prev => ({
        ...prev,            // 保留之前所有字段的状态（展开运算符复制旧状态）
        [name]: paddedValue // 使用计算属性名，将当前字段更新为填充后的值（如"1"→"01"或"0001"）
      }));
    }
  };
  
  // 处理输入框双击事件,用于清空输入框
  const handleDoubleClick = (e, fieldName) => {
    e.preventDefault(); // 阻止默认行为
    // 更新时间数据状态
    setTimeData(prev => {
      // 创建新的时间数据副本，用于后续修改并触发组件重新渲染
      const newData = {
        ...prev, // 复制之前的状态
        [fieldName]: '' // 清空指定字段的值
      };
      
      // 当清空年份时,处理"闰"键钮状态
      if (fieldName === 'lunar_year') {
        // 禁用"闰"键钮
        setDisabledFields(prev => ({
          ...prev,         // 复制之前的状态对象,保留其他字段的禁用状态
          leap_month: true // 将闰月按钮的禁用状态设置为true,禁用"闰"键钮
        }));
        
        // 重置is_leap_month为false
        if (newData.is_leap_month) {
          newData.is_leap_month = false; // 清空年份时同步重置闰月状态，避免残留无效闰月标记
        }
      }
      
      return newData; // 返回新的状态
    });
    // 清空输入框的DOM值
    if (inputRefs.current[fieldName]) {
      inputRefs.current[fieldName].value = ''; // 双击清空时同步更新对应输入框的 DOM 值，确保 UI 与状态保持一致
    }
  };
  
  // 关闭警告弹窗
  const closeAlert = () => {
    let fieldToReset = ''; // 定义需要重置的字段名
    // 根据错误消息判断需要重置的字段
    // 判断错误消息中是否包含"年份"关键词
    if (alertMessage.includes('年份')) {
      fieldToReset = 'lunar_year'; // 如果包含,则标记需要重置农历年份字段
    }
    // 判断错误消息中是否包含"月份"关键词
    else if (alertMessage.includes('月份')) {
      fieldToReset = 'lunar_month'; // 如果包含,则标记需要重置农历月份字段
    }
    // 判断错误消息中是否包含"日期"关键词
    else if (alertMessage.includes('日期')) {
      fieldToReset = 'lunar_day'; // 如果包含,则标记需要重置农历日期字段
    }
    // 判断错误消息中是否包含"小时"关键词
    else if (alertMessage.includes('小时')) {
      fieldToReset = 'hour'; // 如果包含,则标记需要重置小时字段
    }
    // 判断错误消息中是否包含"分钟"关键词
    else if (alertMessage.includes('分钟')) {
      fieldToReset = 'minute'; // 如果包含,则标记需要重置分钟字段
    }
    // 判断错误消息中是否包含"秒"关键词
    else if (alertMessage.includes('秒')) {
      fieldToReset = 'second'; // 如果包含,则标记需要重置秒字段
    }
    
    // 如果找到了需要重置的字段
    if (fieldToReset) {
      // 清空该字段的值
      setTimeData(prev => {
        // 创建新的时间数据副本，用于后续修改并触发组件重新渲染
        const newData = {
          ...prev,           // 复制之前的状态
          [fieldToReset]: '' // 清空指定字段的值
        };
        return newData; // 返回新的状态
      });
      
      // 在下一个渲染周期后将焦点设置回触发警告的输入框
      // 设置定时器,延迟执行回调函数
      setTimeout(() => {
        if (inputRefs.current[fieldToReset]) { // 检查是否存在对应的输入框引用
          inputRefs.current[fieldToReset].focus(); // 如果存在,则调用focus方法将焦点设置到该输入框
        }
      }, 0); // 延迟时间为0毫秒,在下一个事件循环中执行,确保DOM更新完成后再设置焦点
    }
    
    setShowAlert(false); // 隐藏警告弹窗
  };
  
  // 监听键盘事件,处理Enter键关闭警告弹窗
  useEffect(() => {
    // 定义键盘事件处理函数
    const handleKeyPress = (event) => {
      // 如果按下Enter键且警告弹窗显示中
      if (event.key === 'Enter' && showAlert) {
        let fieldToReset = ''; // 定义需要重置的字段名
        // 根据错误消息判断需要重置的字段
        // 判断错误消息中是否包含"年份"关键词
        if (alertMessage.includes('年份')) {
          fieldToReset = 'lunar_year'; // 如果包含,则标记需要重置农历年份字段
        }
        // 否则判断错误消息中是否包含"月份"关键词
        else if (alertMessage.includes('月份')) {
          fieldToReset = 'lunar_month'; // 如果包含,则标记需要重置农历月份字段
        }
        // 否则判断错误消息中是否包含"日期"关键词
        else if (alertMessage.includes('日期')) {
          fieldToReset = 'lunar_day'; // 如果包含,则标记需要重置农历日期字段
        }
        // 否则判断错误消息中是否包含"小时"关键词
        else if (alertMessage.includes('小时')) {
          fieldToReset = 'hour'; // 如果包含,则标记需要重置小时字段
        }
        // 否则判断错误消息中是否包含"分钟"关键词
        else if (alertMessage.includes('分钟')) {
          fieldToReset = 'minute'; // 如果包含,则标记需要重置分钟字段
        }
        // 否则判断错误消息中是否包含"秒"关键词
        else if (alertMessage.includes('秒')) {
          fieldToReset = 'second'; // 如果包含,则标记需要重置秒字段
        }
        
        // 如果找到了需要重置的字段
        if (fieldToReset) {
          // 清空该字段的值
          setTimeData(prev => ({
            ...prev,           // 复制之前的状态
            [fieldToReset]: '' // 清空指定字段的值
          }));
          
          // 在下一个渲染周期后将焦点设置回触发警告的输入框
          // 设置定时器,延迟执行回调函数
          setTimeout(() => {
            // 检查是否存在对应的输入框引用
            if (inputRefs.current[fieldToReset]) {
              inputRefs.current[fieldToReset].focus(); // 如果存在,则调用focus方法将焦点设置到该输入框
            }
          }, 0); // 延迟时间为0毫秒,在下一个事件循环中执行,确保DOM更新完成后再设置焦点
        }
        
        setShowAlert(false); // 隐藏警告弹窗
      }
    };
    
    window.addEventListener('keydown', handleKeyPress); // 添加键盘事件监听器

    // 清理函数:组件卸载时移除键盘事件监听器
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [showAlert, alertMessage]); // 依赖数组:监听showAlert和alertMessage变化
  
  // 同步输入框的DOM值与状态值
  useEffect(() => {
    // 遍历timeData的所有字段
    Object.keys(timeData).forEach(fieldName => {
      // 如果该字段有对应的输入框引用
      if (inputRefs.current[fieldName]) {
        inputRefs.current[fieldName].value = timeData[fieldName] || ''; // 设置输入框的值为状态值
      }
    });
  }, [timeData]); // 依赖数组:监听timeData变化
  
  // 监听timeData变化,确保"闰"键钮状态正确更新
  useEffect(() => {
    const { lunar_year, lunar_month } = timeData; // 获取年份和月份
    let isLeapButtonDisabled = true; // 初始化闰月按钮禁用状态为true
    let shouldResetLeap = false; // 初始化是否需要重置闰月状态为false
    
    // 年值为空时,禁用"闰"键钮
    if (!lunar_year || lunar_year === '') {
      isLeapButtonDisabled = true; // 禁用闰月按钮
      shouldResetLeap = true; // 年值为空,重置is_leap_month
    }
    // 年值为合法值,检查是否有闰月
    else {
      const lunarYearInt = parseInt(lunar_year); // 将年份转换为整数
      // 检查年份是否为合法的正整数
      if (!isNaN(lunarYearInt) && lunarYearInt > 0) {
        const leapMonth = getLeapMonth(lunarYearInt); // 获取该年份的闰月月份
        
        // 有闰月时
        if (leapMonth > 0) {
          // 检查月值是否为空
          if (!lunar_month || lunar_month === '') {
            // 月值为空,只判断年是否有闰月,有则启用"闰"键钮
            isLeapButtonDisabled = false; // 启用闰月按钮
            // 月值为空,不重置is_leap_month,保持当前状态
          }
          // 月值不为空,检查是否等于闰月值
          else {
            const lunarMonthInt = parseInt(lunar_month); // 将月份转换为整数
            // 检查月份是否为合法的数字
            if (!isNaN(lunarMonthInt)) {
              // 月值等于闰月值,启用"闰"键钮,不作任何操作
              if (lunarMonthInt === leapMonth) {
                isLeapButtonDisabled = false; // 启用闰月按钮
              }
              // 月值不等于闰月值,禁用"闰"键钮
              else {
                isLeapButtonDisabled = true; // 禁用闰月按钮
                shouldResetLeap = true; // 标记需要重置闰月状态
              }
            }
            // 月值为非法值,禁用"闰"键钮
            else {
              isLeapButtonDisabled = true; // 禁用闰月按钮
              // 月值为非法值,重置is_leap_month
              shouldResetLeap = true; // 标记需要重置闰月状态
            }
          }
        }
        // 无闰月时禁用"闰"键钮
        else {
          isLeapButtonDisabled = true; // 禁用闰月按钮
          // 无闰月,重置is_leap_month
          shouldResetLeap = true; // 标记需要重置闰月状态
        }
      }
      // 年值为非法值,禁用"闰"键钮
      else {
        isLeapButtonDisabled = true; // 禁用闰月按钮
        // 年值为非法值,重置is_leap_month
        shouldResetLeap = true; // 标记需要重置闰月状态
      }
    }
    
    // 更新"闰"键钮的禁用状态
    setDisabledFields(prev => ({
      ...prev,                         // 复制之前的状态
      leap_month: isLeapButtonDisabled // 更新闰月按钮的禁用状态
    }));
    
    // 如果需要,自动将"闰"键钮设为false
    if (shouldResetLeap && timeData.is_leap_month) {
      // 更新时间数据状态
      setTimeData(prev => ({
        ...prev,             // 复制之前的状态
        is_leap_month: false // 当需要重置闰月状态时，将闰月标记重置为false，确保状态正确
      }));
    }
  }, [timeData.lunar_year, timeData.lunar_month]); // 依赖数组:监听年份和月份变化

  // 处理闰月按钮点击事件,切换闰月状态
  const handleLeapMonthToggle = () => {
    // 构建新的时间数据对象，切换闰月状态（true ↔ false）
    const newData = {
      ...timeData,                           // 复制之前的时间数据
      is_leap_month: !timeData.is_leap_month // 切换闰月状态
    };
    setTimeData(newData); // 更新时间数据状态
    
    // 移除按钮的焦点状态,避免取消选中后仍然显示#1890FF的边框
    if (inputRefs.current.leapMonthToggle) {
      inputRefs.current.leapMonthToggle.blur(); // 在切换闰月状态后，手动移除按钮的焦点，避免取消选中后仍然显示高亮边框，保持 UI 状态一致
    }
  };

  // 处理闰月按钮键盘事件
  const handleLeapMonthKeyDown = (e) => {
    // 如果按下Enter键或空格键
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // 阻止默认行为
      handleLeapMonthToggle(); // 切换闰月状态
    }
  };

  // 构建农历时间字符串,处理早子时和晚子时
  const buildLunarTimeString = (hour, minute, second, lunarData) => {
    // 如果小时值为空或没有时辰数据,返回空字符串
    if (hour === null || !lunarData.lunar_time_Zhi) {
      return ''; // 当小时为空或时辰数据不存在时，返回空字符串，避免后续逻辑出错
    }
    
    // 判断是否为子时,并区分早子时和晚子时
    if (lunarData.lunar_time_Zhi === '子') {
      const hourNum = parseInt(hour); // 将小时转换为整数
      const minuteNum = parseInt(minute || 0); // 将分钟转换为整数,默认为0
      const secondNum = parseInt(second || 0); // 将秒转换为整数,默认为0
      
      // 23:00:00~23:59:59 → 晚子时
      if (hourNum === 23 && (minuteNum > 0 || secondNum > 0)) {
        return '晚子时'; // 返回晚子时
      } else if (hourNum === 23 && minuteNum === 0 && secondNum === 0) {
        return '晚子时'; // 23:00:00也是晚子时
      } else if (hourNum === 0) {
        // 00:00:00~00:59:59 → 早子时
        return '早子时'; // 返回早子时
      }
      // 其他时辰
      else {
        return `${lunarData.lunar_time_Zhi}时`; // 返回时辰字符串
      }
    }
    // 非子时
    else {
      return `${lunarData.lunar_time_Zhi}时`; // 返回时辰字符串
    }
  };

  // 前端农历转公历
  const convertToSolar = useCallback((timeData) => {
    // 开始农历转公历的转换流程，捕获可能的异常以保证组件稳定性
    try {
      const hour = timeData.hour ? parseInt(timeData.hour) : null; // 检查小时值是否存在
      
      const minute = timeData.minute ? parseInt(timeData.minute) : parseInt(currentTime.minute); // 若用户未输入分钟，则使用当前系统分钟作为默认值，确保后续时辰计算完整
      const second = timeData.second ? parseInt(timeData.second) : parseInt(currentTime.second); // 若用户未输入秒，则使用当前系统秒作为默认值，保证时间精度一致
      const hasCompleteDate = timeData.lunar_year && timeData.lunar_month && timeData.lunar_day; // 检查年、月、日是否完整
      
      // 如果年、月、日完整,执行完整的农历到公历转换
      if (hasCompleteDate) {
        // 验证输入数据的完整性和合法性
        const validationResult = validateInputData(timeData, true);
        // 如果输入无效
        if (!validationResult.valid) {
          // 输入无效,清空所有信息
          setLunarInfo({
            lunar_year_in_GanZhi: '',    // 清空农历干支年
            lunar_month_in_Chinese: '',   // 清空农历中文月
            lunar_day_in_Chinese: '',     // 清空农历中文日
            lunar_time_Zhi: '',           // 清空农历时辰
            solar_year: '',               // 清空公历年
            solar_month: '',              // 清空公历月
            solar_day: '',                // 清空公历日
            solar_hour: '',               // 清空公历小时
            solar_minute: '',             // 清空公历分钟
            solar_second: ''              // 清空公历秒
          });
          setSolarTime(''); // 清空公历时间字符串
          return; // 直接返回
        }
        
        const { lunar_year, lunar_month, lunar_day, is_leap_month } = validationResult.data; // 从验证结果中提取农历年、月、日和闰月状态
        
        // 调用日历服务进行农历到公历的转换
        const result = CalendarService.convertLunarToSolar({
          lunar_year,    // 农历年份
          lunar_month,   // 农历月份
          lunar_day,     // 农历日期
          hour,          // 小时
          minute,        // 分钟
          second,        // 秒
          is_leap_month  // 是否闰月
        });
        
        // 如果转换成功且有返回数据
        if (result.success && result.data) {
          // 从返回数据中解构获取农历和公历信息
          const { 
            lunar_year_in_GanZhi,     // 农历干支年
            lunar_month_in_Chinese,    // 农历中文月
            lunar_day_in_Chinese,      // 农历中文日
            lunar_time_Zhi,            // 农历时辰
            solar_year,                // 公历年份
            solar_month,               // 公历月份
            solar_day,                 // 公历日期
            solar_hour,                // 公历小时
            solar_minute,              // 公历分钟
            solar_second               // 公历秒
          } = result.data;
          
          const lunarTimeString = buildLunarTimeString(hour, minute, second, result.data); // 构建时辰字符串(处理早子时和晚子时)
          const solarTimeString = `${solar_hour.toString().padStart(2, '0')}:${solar_minute.toString().padStart(2, '0')}:${solar_second.toString().padStart(2, '0')}`; // 构建公历时间字符串(格式:HH:MM:SS)
          
          // 更新农历信息状态
          setLunarInfo({
            lunar_year_in_GanZhi: lunar_year_in_GanZhi,                           // 农历干支年
            lunar_month_in_Chinese: lunar_month_in_Chinese,                       // 农历中文月
            lunar_day_in_Chinese: lunar_day_in_Chinese,                           // 农历中文日
            lunar_time_Zhi: lunarTimeString,                                      // 农历时辰(包含早子时/晚子时)
            solar_year: solar_year.toString().padStart(4, '0'),                  // 公历年份(4位)
            solar_month: solar_month.toString().padStart(2, '0'),                // 公历月份(2位)
            solar_day: solar_day.toString().padStart(2, '0'),                    // 公历日期(2位)
            solar_hour: solar_hour.toString().padStart(2, '0'),                  // 公历小时(2位)
            solar_minute: solar_minute.toString().padStart(2, '0'),               // 公历分钟(2位)
            solar_second: solar_second.toString().padStart(2, '0')                // 公历秒(2位)
          });
          
          setSolarTime(solarTimeString); // 设置公历时间字符串
        }
      }
      // 年、月、日不完整
      else {
        // 如果有小时值,只计算时辰
        if (hour !== null) {
          const timeResult = CalendarService.getLunarTimeByHms(hour, minute, second); // 调用日历服务根据时分秒获取时辰信息
          
          // 如果获取成功且有返回数据
          if (timeResult.success && timeResult.data) {
            const { lunar_time_Zhi, solar_hour, solar_minute, solar_second } = timeResult.data; // 从返回数据中解构获取时辰和公历时间信息
            const lunarTimeString = buildLunarTimeString(hour, minute, second, { lunar_time_Zhi }); // 构建时辰字符串(处理早子时和晚子时)
            
            // 更新农历时辰信息,清空日期信息
            setLunarInfo(prev => ({
              ...prev, // 复制之前的状态
              lunar_year_in_GanZhi: '',    // 清空农历年
              lunar_month_in_Chinese: '',   // 清空农历月
              lunar_day_in_Chinese: '',     // 清空农历日
              lunar_time_Zhi: lunarTimeString, // 农历时辰
              solar_year: '',              // 清空公历年
              solar_month: '',             // 清空公历月
              solar_day: '',               // 清空公历日
              solar_hour: solar_hour.toString().padStart(2, '0'),       // 公历小时(2位)
              solar_minute: solar_minute.toString().padStart(2, '0'),   // 公历分钟(2位)
              solar_second: solar_second.toString().padStart(2, '0')    // 公历秒(2位)
            }));
            
            const solarTimeString = `${solar_hour.toString().padStart(2, '0')}:${solar_minute.toString().padStart(2, '0')}:${solar_second.toString().padStart(2, '0')}`; // 构建公历时间字符串(格式:HH:MM:SS)
            setSolarTime(solarTimeString); // 设置公历时间字符串
          }
        }
        // 没有小时值，清空所有时间相关信息，避免残留无效数据
        else {
          // 没有小时值,清空所有时间相关信息
          setLunarInfo(prev => ({
            ...prev, // 复制之前的状态
            lunar_year_in_GanZhi: '',   // 清空农历年
            lunar_month_in_Chinese: '', // 清空农历月
            lunar_day_in_Chinese: '',   // 清空农历日
            lunar_time_Zhi: '',         // 清空农历时辰
            solar_year: '',             // 清空公历年
            solar_month: '',            // 清空公历月
            solar_day: '',              // 清空公历日
            solar_hour: '',             // 清空公历小时
            solar_minute: '',           // 清空公历分钟
            solar_second: ''            // 清空公历秒
          }));
          setSolarTime(''); // 清空公历时间字符串
        }
      }
    }
    // 捕获农历转公历过程中可能出现的任何异常，确保组件不会因未处理的错误而崩溃
    catch (error) {
      console.error('转换为公历失败:', error); // 输出错误日志
    }
  }, [currentTime.minute, currentTime.second]); // 依赖数组:监听当前时间的分和秒变化

  // 防抖处理,避免频繁调用转换函数
  const debouncedConvertToSolar = useCallback(() => {
    let timeoutId; // 定义定时器ID变量
    // 返回一个函数,该函数接收timeData参数
    return (timeData) => {
      clearTimeout(timeoutId); // 清除之前的定时器
      // 设置新的定时器,延迟300ms执行转换
      timeoutId = setTimeout(() => {
        convertToSolar(timeData); // 调用转换函数
      }, 300); // 300ms防抖延迟
    };
  }, [convertToSolar])(); // 立即执行useCallback,返回防抖函数

  // 监听timeData变化,更新农历信息(使用防抖)
  useEffect(() => {
    debouncedConvertToSolar(timeData); // 调用防抖转换函数
  }, [timeData, debouncedConvertToSolar]); // 依赖数组:监听timeData和防抖函数变化

  // 返回JSX渲染结果
  return (
    <div className="lunar-time-container"> {/* 农历时间容器 */}
      {/* 农历输入区域 */}
      <div className="timestamp-inputs"> {/* 时间戳输入区域 */}
        {/* 农历年份输入框 */}
        <input 
          ref={(el) => (inputRefs.current.lunar_year = el)} // 设置输入框引用
          type="number" // 输入类型为数字
          name="lunar_year" // 输入框名称
          placeholder="年" // 占位符文本
          className="time-input time-input-year no-spin-buttons" // CSS类名
          value={timeData.lunar_year} // 输入框值
          onChange={handleChange} // 值变化事件处理
          onBlur={handleBlur} // 失焦事件处理
          onKeyDown={handleNumberInputKeyDown} // 键盘事件处理
          onDoubleClick={(e) => handleDoubleClick(e, 'lunar_year')} // 双击事件处理
          disabled={disabledFields.lunar_year} // 禁用状态
          min="1" // 最小值
          max="9999" // 最大值
        />
        {/* 闰月切换按钮 */}
        <button
          type="button" // 按钮类型
          ref={(el) => (inputRefs.current.leapMonthToggle = el)} // 设置按钮引用
          className={`leap-month-toggle ${timeData.is_leap_month ? 'active' : ''}`} // CSS类名,根据闰月状态添加active类
          onClick={handleLeapMonthToggle} // 点击事件处理
          onKeyDown={handleLeapMonthKeyDown} // 键盘事件处理
          aria-pressed={timeData.is_leap_month} // ARIA属性,表示按钮是否被按下
          aria-label="闰月切换" // ARIA标签,用于辅助功能
          disabled={disabledFields.leap_month} // 禁用状态
          style={{
            color: timeData.is_leap_month ? '' : '#666666' // 根据闰月状态设置颜色
          }}
        >
          闰 {/* 按钮文本 */}
        </button>
        {/* 农历月份输入框 */}
        <input 
          ref={(el) => (inputRefs.current.lunar_month = el)} // 设置输入框引用
          type="number" // 输入类型为数字
          name="lunar_month" // 输入框名称
          placeholder="月" // 占位符文本
          className="time-input time-input-small no-spin-buttons" // CSS类名
          value={timeData.lunar_month} // 输入框值
          onChange={handleChange} // 值变化事件处理
          onBlur={handleBlur} // 失焦事件处理
          onKeyDown={handleNumberInputKeyDown} // 键盘事件处理
          onDoubleClick={(e) => handleDoubleClick(e, 'lunar_month')} // 双击事件处理
          disabled={disabledFields.lunar_month} // 禁用状态
          min="1" // 最小值
          max="12" // 最大值
        />
        {/* 农历日期输入框 */}
        <input 
          ref={(el) => (inputRefs.current.lunar_day = el)} // 设置输入框引用
          type="number" // 输入类型为数字
          name="lunar_day" // 输入框名称
          placeholder="日" // 占位符文本
          className="time-input time-input-small no-spin-buttons" // CSS类名
          value={timeData.lunar_day} // 输入框值
          onChange={handleChange} // 值变化事件处理
          onBlur={handleBlur} // 失焦事件处理
          onKeyDown={handleNumberInputKeyDown} // 键盘事件处理
          onDoubleClick={(e) => handleDoubleClick(e, 'lunar_day')} // 双击事件处理
          disabled={disabledFields.lunar_day} // 禁用状态
          min="1" // 最小值
          max="30" // 最大值
        />
        {/* 小时输入框 */}
        <input 
          ref={(el) => (inputRefs.current.hour = el)} // 设置输入框引用
          type="number" // 输入类型为数字
          name="hour" // 输入框名称
          placeholder="时" // 占位符文本
          className="time-input time-input-small no-spin-buttons" // CSS类名
          value={timeData.hour} // 输入框值
          onChange={handleChange} // 值变化事件处理
          onBlur={handleBlur} // 失焦事件处理
          onKeyDown={handleNumberInputKeyDown} // 键盘事件处理
          onDoubleClick={(e) => handleDoubleClick(e, 'hour')} // 双击事件处理
          disabled={disabledFields.hour} // 禁用状态
          min="0" // 最小值
          max="23" // 最大值
        />
        {/* 分钟输入框 */}
        <input 
          ref={(el) => (inputRefs.current.minute = el)} // 设置输入框引用
          type="number" // 输入类型为数字
          name="minute" // 输入框名称
          placeholder="分" // 占位符文本
          className="time-input time-input-small no-spin-buttons" // CSS类名
          value={timeData.minute} // 输入框值
          onChange={handleChange} // 值变化事件处理
          onBlur={handleBlur} // 失焦事件处理
          onKeyDown={handleNumberInputKeyDown} // 键盘事件处理
          onDoubleClick={(e) => handleDoubleClick(e, 'minute')} // 双击事件处理
          disabled={disabledFields.minute} // 禁用状态
          min="0" // 最小值
          max="59" // 最大值
        />
        {/* 秒输入框 */}
        <input 
          ref={(el) => (inputRefs.current.second = el)} // 设置输入框引用
          type="number" // 输入类型为数字
          name="second" // 输入框名称
          placeholder="秒" // 占位符文本
          className="time-input time-input-small no-spin-buttons" // CSS类名
          value={timeData.second} // 输入框值
          onChange={handleChange} // 值变化事件处理
          onBlur={handleBlur} // 失焦事件处理
          onKeyDown={handleNumberInputKeyDown} // 键盘事件处理
          onDoubleClick={(e) => handleDoubleClick(e, 'second')} // 双击事件处理
          disabled={disabledFields.second} // 禁用状态
          min="0" // 最小值
          max="59" // 最大值
        />
      </div> {/* 结束时间戳输入区域 */}
      
      {/* 时间显示区域 */}
      <div className="timestamp-display"> {/* 时间戳显示区域 */}
        <> {/* React Fragment,用于包裹多个元素而不添加额外的DOM节点 */}
          {/* 农历信息显示 */}
          <div className="lunar-info"> {/* 农历信息容器 */}
            <span className="date-label">农历：</span> {/* 农历标签 */}
            <span className="date-value"> {/* 农历日期值 */}
              {/* 显示农历干支年,如"甲子年" */}
              {lunarInfo.lunar_year_in_GanZhi ? lunarInfo.lunar_year_in_GanZhi + '年' : ''}
              {/* 显示农历中文月,如"正月" */}
              {lunarInfo.lunar_month_in_Chinese ? lunarInfo.lunar_month_in_Chinese + '月' : ''}
              {/* 显示农历中文日,如"初一" */}
              {lunarInfo.lunar_day_in_Chinese ? lunarInfo.lunar_day_in_Chinese : ''}
            </span>
            {/* 显示农历时辰,如"子时"、"早子时"、"晚子时" */}
            <span className="time-value">{lunarInfo.lunar_time_Zhi}</span>
          </div>
          {/* 公历信息显示 */}
          <div className="solar-info"> {/* 公历信息容器 */}
            <span className="date-label">公历：</span> {/* 公历标签 */}
            <span className="date-value"> {/* 公历日期值 */}
              {/* 显示公历年份 */}
              {lunarInfo.solar_year ? lunarInfo.solar_year : ''}
              {/* 如果年份和月份都有值,显示"年"字 */}
              {lunarInfo.solar_year && lunarInfo.solar_month ? '年' : ''}
              {/* 显示公历月份 */}
              {lunarInfo.solar_month ? lunarInfo.solar_month : ''}
              {/* 如果月份和日期都有值,显示"月"字 */}
              {lunarInfo.solar_month && lunarInfo.solar_day ? '月' : ''}
              {/* 显示公历日期 */}
              {lunarInfo.solar_day ? lunarInfo.solar_day : ''}
              {/* 如果日期有值,显示"日"字 */}
              {lunarInfo.solar_day ? '日' : ''}
            </span>
            {/* 显示公历时间,如"12:30:45" */}
            <span className="time-value">
              {timeData.hour ? solarTime : ''}
            </span>
          </div>
        </> {/* 结束React Fragment */}
      </div> {/* 结束时间戳显示区域 */}
      
      {/* 警告弹窗 */}
      {showAlert && ( // 如果显示警告
        <div className="alert-overlay"> {/* 警告遮罩层 */}
          <div className="alert-content"> {/* 警告内容容器 */}
            {/* 显示警告消息 */}
            <div className="alert-message">{alertMessage}</div>
            {/* 确定按钮,点击关闭警告 */}
            <button className="alert-close" onClick={closeAlert}>确定</button>
          </div>
        </div>
      )}
    </div> // 结束农历时间容器
  ); // 结束return语句
}; // 结束组件定义

// 导出LunarTime组件作为默认导出
export default LunarTime;