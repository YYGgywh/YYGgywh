/*
 * @file            frontend/src/components/DivinationInfo/timestamp/TimestampModal.jsx
 * @description     时间戳设置弹窗主组件，管理选项卡状态和协调三个时间组件
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-01-30 11:00:00
 * @lastModified    2026-02-17 11:05:08
 * Copyright © All rights reserved
*/

import React, { useState, useEffect, useCallback } from 'react'; // 导入React钩子函数
import SolarTime from './SolarTime'; // 导入公历时间组件
import LunarTime from './LunarTime'; // 导入农历时间组件
import FourPillarsTime from './FourPillarsTime'; // 导入四柱时间组件

// 定义时间戳弹窗组件，接收关闭和提交回调函数
const TimestampModal = ({ onClose, onSubmit }) => {
  const [activeTab, setActiveTab] = useState('gregorian'); // 定义当前激活的选项卡状态，默认为公历
  // 定义选中时间状态，存储三个选项卡的时间数据
  const [selectedTime, setSelectedTime] = useState({
    gregorian: null, // 公历时间数据
    lunar: null, // 农历时间数据
    'four-pillars': null // 四柱时间数据
  });

  // 定义确认时间状态，存储补全后的时间数据
  const [confirmedTime, setConfirmedTime] = useState({
    gregorian: null, // 公历确认时间
    lunar: null, // 农历确认时间
    'four-pillars': null // 四柱确认时间
  });

  const [isConfirmDisabled, setIsConfirmDisabled] = useState(true); // 定义补全按钮禁用状态，默认为禁用
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true); // 定义提交按钮禁用状态，默认为禁用
  const [isInitializeDisabled, setIsInitializeDisabled] = useState(true); // 定义全清按钮禁用状态，默认为禁用
  const [solarListResult, setSolarListResult] = useState(null); // 存储四柱计算结果
  const [selectedSolarIndex, setSelectedSolarIndex] = useState(null); // 存储选中的公历结果索引
  const [selectedSolar, setSelectedSolar] = useState(null); // 存储选中的公历结果数据

  // 定义选项卡切换处理函数
  const handleTabChange = (tab) => {
    console.log('TimestampModal - 切换选项卡:', tab); // 输出切换日志
    setActiveTab(tab); // 设置当前激活的选项卡    
    let initialTime = {}; // 定义初始时间对象
    // 如果切换到公历选项卡
    if (tab === 'gregorian') {
      initialTime = { // 初始化公历时间对象
        year: '', // 年份
        month: '', // 月份
        day: '', // 日期
        hour: '', // 小时
        minute: '', // 分钟
        second: '' // 秒
      };
    }
    // 如果切换到农历选项卡
    else if (tab === 'lunar') {
      initialTime = { // 初始化农历时间对象
        lunar_year: '', // 农历年份
        lunar_month: '', // 农历月份
        lunar_day: '', // 农历日期
        hour: '', // 小时
        minute: '', // 分钟
        second: '', // 秒
        is_leap_month: false // 是否闰月
      };
    }
    // 如果切换到四柱选项卡
    else if (tab === 'four-pillars') {
      initialTime = { // 初始化四柱时间对象
        yearGan: '', // 年干
        monthGan: '', // 月干
        dayGan: '', // 日干
        hourGan: '', // 时干
        yearZhi: '', // 年支
        monthZhi: '', // 月支
        dayZhi: '', // 日支
        hourZhi: '' // 时支
      };
    }
    // 更新选中时间状态
    setSelectedTime(prev => ({
      ...prev, // 保留其他选项卡的时间数据
      [tab]: initialTime // 设置当前选项卡的时间数据
    }));
    // 更新确认时间状态
    setConfirmedTime(prev => ({
      ...prev, // 保留其他选项卡的确认时间数据
      [tab]: initialTime // 设置当前选项卡的确认时间数据
    }));
    // 如果切换到四柱选项卡
    if (tab === 'four-pillars') {
      setSolarListResult(null); // 清空四柱计算结果
      setSelectedSolarIndex(null); // 清空选中的公历结果索引
      setSelectedSolar(null); // 清空选中的公历结果数据
    }
  };

  // 定义公历时间变化处理函数
  const handleGregorianTimeChange = useCallback((timeData) => {
    // 更新选中时间状态
    setSelectedTime(prev => ({
      ...prev, // 保留其他选项卡的时间数据
      gregorian: timeData // 设置公历时间数据
    }));
  }, []); // 空依赖数组，函数只创建一次

  // 定义农历时间变化处理函数
  const handleLunarTimeChange = useCallback((timeData) => {
    // 更新选中时间状态
    setSelectedTime(prev => ({
      ...prev, // 保留其他选项卡的时间数据
      lunar: timeData // 设置农历时间数据
    }));
  }, []); // 空依赖数组，函数只创建一次

  // 定义四柱时间变化处理函数
  const handleFourPillarsTimeChange = useCallback((timeData) => {
    console.log('TimestampModal - 接收到四柱数据:', timeData); // 输出四柱数据日志
    // 更新选中时间状态
    setSelectedTime(prev => ({
      ...prev, // 保留其他选项卡的时间数据
      'four-pillars': timeData // 设置四柱时间数据
    }));
  }, []); // 空依赖数组，函数只创建一次

  // 定义四柱计算结果处理函数
  const handleSolarListResult = useCallback((result) => {
    console.log('TimestampModal - 接收到四柱计算结果:', result); // 输出计算结果日志
    setSolarListResult(result); // 设置四柱计算结果
    setSelectedSolarIndex(null); // 清空选中的公历结果索引
    setSelectedSolar(null); // 清空选中的公历结果数据
  }, []); // 空依赖数组，函数只创建一次

  // 定义结果项点击处理函数
  const handleResultItemClick = useCallback((solar, index) => {
    console.log('TimestampModal - 选中结果:', solar, '索引:', index); // 输出选中结果日志
    setSelectedSolarIndex(index); // 设置选中的公历结果索引
    setSelectedSolar(solar); // 设置选中的公历结果数据
  }, []); // 空依赖数组，函数只创建一次

  // 定义副作用钩子，监听选中时间和选项卡变化
  useEffect(() => {
    const currentTime = selectedTime[activeTab]; // 获取当前选项卡的时间数据
    console.log('TimestampModal - 检查currentTime:', currentTime, 'activeTab:', activeTab); // 输出检查日志
    // 检查当前时间是否存在
    if (currentTime !== null && currentTime !== undefined) {
      let hasAllFields = false; // 定义是否所有字段都有值的标志
      let hasAnyValidValue = false; // 定义是否有任何有效值的标志
      // 如果是公历选项卡
      if (activeTab === 'gregorian') {
        hasAllFields = currentTime.year && currentTime.month && currentTime.day && currentTime.hour && currentTime.minute && currentTime.second; // 检查所有字段是否都有值
        hasAnyValidValue = Boolean(currentTime.year && currentTime.year !== '') || // 检查是否有任何有效值
                          Boolean(currentTime.month && currentTime.month !== '') || 
                          Boolean(currentTime.day && currentTime.day !== '') || 
                          Boolean(currentTime.hour && currentTime.hour !== '') || 
                          Boolean(currentTime.minute && currentTime.minute !== '') || 
                          Boolean(currentTime.second && currentTime.second !== '');
      }
      // 如果是农历选项卡
      else if (activeTab === 'lunar') {
        hasAllFields = currentTime.lunar_year && currentTime.lunar_month && currentTime.lunar_day && currentTime.hour && currentTime.minute && currentTime.second; // 检查所有字段是否都有值
        hasAnyValidValue = Boolean(currentTime.lunar_year && currentTime.lunar_year !== '') || // 检查是否有任何有效值
                          Boolean(currentTime.lunar_month && currentTime.lunar_month !== '') || 
                          Boolean(currentTime.lunar_day && currentTime.lunar_day !== '') || 
                          Boolean(currentTime.hour && currentTime.hour !== '') || 
                          Boolean(currentTime.minute && currentTime.minute !== '') || 
                          Boolean(currentTime.second && currentTime.second !== '');
      }
      // 如果是四柱选项卡
      else if (activeTab === 'four-pillars') {
        hasAllFields = currentTime.yearGan && currentTime.monthZhi && currentTime.dayGan && currentTime.dayZhi && currentTime.hourZhi; // 检查所有字段是否都有值
        // 输出四柱数据检查日志
        console.log('TimestampModal - 四柱数据检查:', {
          yearGan: currentTime.yearGan,
          yearZhi: currentTime.yearZhi,
          monthGan: currentTime.monthGan,
          monthZhi: currentTime.monthZhi,
          dayGan: currentTime.dayGan,
          dayZhi: currentTime.dayZhi,
          hourGan: currentTime.hourGan,
          hourZhi: currentTime.hourZhi
        });
        // 检查是否有任何有效值
        hasAnyValidValue = Boolean((currentTime.yearGan && currentTime.yearGan !== '')) || 
                          Boolean((currentTime.yearZhi && currentTime.yearZhi !== '')) || 
                          Boolean((currentTime.monthGan && currentTime.monthGan !== '')) || 
                          Boolean((currentTime.monthZhi && currentTime.monthZhi !== '')) || 
                          Boolean((currentTime.dayGan && currentTime.dayGan !== '')) || 
                          Boolean((currentTime.dayZhi && currentTime.dayZhi !== '')) || 
                          Boolean((currentTime.hourGan && currentTime.hourGan !== '')) || 
                          Boolean((currentTime.hourZhi && currentTime.hourZhi !== ''));
        console.log('TimestampModal - 四柱hasAnyValidValue:', hasAnyValidValue); // 输出四柱有效值检查日志
      }
      
      const shouldConfirmBeDisabled = !hasAnyValidValue || hasAllFields; // 计算补全按钮是否应该禁用
      setIsConfirmDisabled(shouldConfirmBeDisabled); // 设置补全按钮禁用状态      
      setIsSubmitDisabled(!hasAllFields); // 设置提交按钮禁用状态      
      setIsInitializeDisabled(!hasAnyValidValue); // 设置全清按钮禁用状态
      // 输出按钮状态日志
      console.log('TimestampModal - 按钮状态:', {
        isInitializeDisabled: !hasAnyValidValue,
        isConfirmDisabled: !hasAnyValidValue || hasAllFields,
        isSubmitDisabled: !hasAllFields
      });
    }
    // 如果当前时间不存在
    else {
      console.log('TimestampModal - 初始化阶段，所有按钮禁用'); // 输出初始化日志
      setIsConfirmDisabled(true); // 设置补全按钮为禁用状态
      setIsSubmitDisabled(true); // 设置提交按钮为禁用状态
      setIsInitializeDisabled(true); // 设置全清按钮为禁用状态
    }
  }, [selectedTime, activeTab]); // 依赖数组：监听选中时间和选项卡变化
  // 定义补全按钮处理函数
  const handleConfirm = () => {
    const currentTime = selectedTime[activeTab]; // 获取当前选项卡的时间数据
    if (!currentTime) return; // 如果时间数据不存在，直接返回

    const now = new Date(); // 获取当前时间
    const updatedTime = { ...currentTime }; // 复制当前时间数据
    // 如果是公历选项卡
    if (activeTab === 'gregorian') {
      // 如果年份为空
      if (!updatedTime.year || updatedTime.year === '') {
        updatedTime.year = String(now.getFullYear()).padStart(4, '0'); // 使用当前年份
      }
      // 如果月份为空
      if (!updatedTime.month || updatedTime.month === '') {
        updatedTime.month = String(now.getMonth() + 1).padStart(2, '0'); // 使用当前月份
      }
      // 如果日期为空
      if (!updatedTime.day || updatedTime.day === '') {
        updatedTime.day = String(now.getDate()).padStart(2, '0'); // 使用当前日期
      }
      // 如果小时为空
      if (!updatedTime.hour || updatedTime.hour === '') {
        updatedTime.hour = String(now.getHours()).padStart(2, '0'); // 使用当前小时
      }
      // 如果分钟为空
      if (!updatedTime.minute || updatedTime.minute === '') {
        updatedTime.minute = String(now.getMinutes()).padStart(2, '0'); // 使用当前分钟
      }
      // 如果秒为空
      if (!updatedTime.second || updatedTime.second === '') {
        updatedTime.second = String(now.getSeconds()).padStart(2, '0'); // 使用当前秒
      }
    }
    // 如果是农历选项卡
    else if (activeTab === 'lunar') {
      // 尝试获取当前农历日期
      try {
        const currentSolarTime = { // 构建当前公历时间
          year: now.getFullYear(), // 当前年份
          month: now.getMonth() + 1, // 当前月份
          day: now.getDate(), // 当前日期
          hour: now.getHours(), // 当前小时
          minute: now.getMinutes(), // 当前分钟
          second: now.getSeconds() // 当前秒
        };
        
        const CalendarService = require('../../../services/calendarService').default; // 导入日历服务
        
        const result = CalendarService.getFullCalendarInfo(currentSolarTime); // 获取完整的历法信息
        // 如果获取成功
        if (result.success && result.data) {
          // 如果农历年份为空
          if (!updatedTime.lunar_year || updatedTime.lunar_year === '') {
            updatedTime.lunar_year = String(result.data.lunarYear.year).padStart(4, '0'); // 使用农历年份
          }
          // 尝试获取农历月和日
          try {
            const { Solar } = require('lunar-javascript'); // 导入Solar类
            // 创建阳历对象
            const solar = Solar.fromYmdHms(
              now.getFullYear(),
              now.getMonth() + 1,
              now.getDate(),
              now.getHours(),
              now.getMinutes(),
              now.getSeconds()
            );
            
            const lunar = solar.getLunar(); // 获取农历对象
            // 如果农历月份为空
            if (!updatedTime.lunar_month || updatedTime.lunar_month === '') {
              const lunarMonth = lunar.getMonth(); // 获取农历月
              updatedTime.lunar_month = String(Math.abs(lunarMonth)).padStart(2, '0'); // 使用农历月（取绝对值）
            }
            // 如果农历日期为空
            if (!updatedTime.lunar_day || updatedTime.lunar_day === '') {
              updatedTime.lunar_day = String(lunar.getDay()).padStart(2, '0'); // 使用农历日
            }
            // 如果小时为空
            if (!updatedTime.hour || updatedTime.hour === '') {
              updatedTime.hour = String(now.getHours()).padStart(2, '0'); // 使用当前小时
            }
            // 如果分钟为空
            if (!updatedTime.minute || updatedTime.minute === '') {
              updatedTime.minute = String(now.getMinutes()).padStart(2, '0'); // 使用当前分钟
            }
            // 如果秒为空
            if (!updatedTime.second || updatedTime.second === '') {
              updatedTime.second = String(now.getSeconds()).padStart(2, '0'); // 使用当前秒
            }
            // 如果没有闰月属性
            if (!updatedTime.hasOwnProperty('is_leap_month')) {
              updatedTime.is_leap_month = lunar.getMonth() < 0; // 设置闰月状态
            }
          }
          // 获取农历月日失败
          catch (error) {
            console.error('获取农历月日失败:', error); // 输出错误日志
            // 如果农历月份为空
            if (!updatedTime.lunar_month || updatedTime.lunar_month === '') {
              updatedTime.lunar_month = String(now.getMonth() + 1).padStart(2, '0'); // 使用当前月份
            }
            // 如果农历日期为空
            if (!updatedTime.lunar_day || updatedTime.lunar_day === '') {
              updatedTime.lunar_day = String(now.getDate()).padStart(2, '0'); // 使用当前日期
            }
          }
        }
        // 如果获取失败
        else {
          // 如果获取失败，使用当前公历时间作为参考
          if (!updatedTime.lunar_year || updatedTime.lunar_year === '') {
            updatedTime.lunar_year = String(now.getFullYear()).padStart(4, '0');
          }
          if (!updatedTime.lunar_month || updatedTime.lunar_month === '') {
            updatedTime.lunar_month = String(now.getMonth() + 1).padStart(2, '0');
          }
          if (!updatedTime.lunar_day || updatedTime.lunar_day === '') {
            updatedTime.lunar_day = String(now.getDate()).padStart(2, '0');
          }
        }
      }
      catch (error) {
        console.error('获取当前农历时间失败:', error);
        // 失败时使用当前时间的公历值作为参考
        // 如果农历年份为空
        if (!updatedTime.lunar_year || updatedTime.lunar_year === '') {
          updatedTime.lunar_year = String(now.getFullYear()).padStart(4, '0'); // 使用当前年份
        }
        // 如果农历月份为空
        if (!updatedTime.lunar_month || updatedTime.lunar_month === '') {
          updatedTime.lunar_month = String(now.getMonth() + 1).padStart(2, '0'); // 使用当前月份
        }
        // 如果农历日期为空
        if (!updatedTime.lunar_day || updatedTime.lunar_day === '') {
          updatedTime.lunar_day = String(now.getDate()).padStart(2, '0'); // 使用当前日期
        }
        // 如果小时为空
        if (!updatedTime.hour || updatedTime.hour === '') {
          updatedTime.hour = String(now.getHours()).padStart(2, '0'); // 使用当前小时
        }
        // 如果分钟为空
        if (!updatedTime.minute || updatedTime.minute === '') {
          updatedTime.minute = String(now.getMinutes()).padStart(2, '0'); // 使用当前分钟
        }
        // 如果秒为空
        if (!updatedTime.second || updatedTime.second === '') {
          updatedTime.second = String(now.getSeconds()).padStart(2, '0'); // 使用当前秒
        }
      }
    }
    // 如果是四柱选项卡
    else if (activeTab === 'four-pillars') {
      // 如果分钟为空
      if (!updatedTime.minute || updatedTime.minute === '') {
        updatedTime.minute = String(now.getMinutes()).padStart(2, '0'); // 使用当前分钟
      }
      // 如果秒为空
      if (!updatedTime.second || updatedTime.second === '') {
        updatedTime.second = String(now.getSeconds()).padStart(2, '0'); // 使用当前秒
      }
    }
    // 更新确认时间状态
    setConfirmedTime(prev => ({
      ...prev, // 保留其他选项卡的确认时间数据
      [activeTab]: updatedTime // 设置当前选项卡的确认时间数据
    }));

    console.log('补全时间:', updatedTime); // 输出补全时间日志
  };

  // 定义提交按钮处理函数
  const handleSubmit = () => { 
    const currentTime = selectedTime[activeTab]; // 获取当前选项卡的时间数据
    if (!currentTime) return; // 如果时间数据不存在，直接返回

    let submittedTime = { ...currentTime }; // 复制当前时间数据

    // 如果分钟为空
    if (!submittedTime.minute || submittedTime.minute === '') { 
      const now = new Date(); // 获取当前时间
      submittedTime.minute = String(now.getMinutes()).padStart(2, '0'); // 使用当前分钟
    }
    // 如果秒为空
    if (!submittedTime.second || submittedTime.second === '') {
      const now = new Date(); // 获取当前时间
      submittedTime.second = String(now.getSeconds()).padStart(2, '0'); // 使用当前秒
    }
    // 如果是农历选项卡
    if (activeTab === 'lunar') { 
      try { // 尝试转换农历时间为公历时间
        const CalendarService = require('../../../services/calendarService').default; // 导入日历服务
        const result = CalendarService.getFullCalendarInfo(submittedTime); // 获取完整的历法信息        
        // 如果转换成功
        if (result.success && result.data && result.data.solar) {
          // 构建公历时间对象
          submittedTime = { 
            year: String(result.data.solar.year).padStart(4, '0'), // 年份
            month: String(result.data.solar.month).padStart(2, '0'), // 月份
            day: String(result.data.solar.day).padStart(2, '0'), // 日期
            hour: String(result.data.solar.hour).padStart(2, '0'), // 小时
            minute: String(result.data.solar.minute).padStart(2, '0'), // 分钟
            second: String(result.data.solar.second).padStart(2, '0') // 秒
          };
        }
        // 如果获取失败
        else {
          console.warn('农历转公历失败:', result.error); // 输出警告日志
        }
      }
      // 转换失败
      catch (error) { 
        console.error('农历转公历失败:', error); // 输出错误日志
      }
    }
    // 如果是四柱选项卡
    else if (activeTab === 'four-pillars') {
      // 如果有选中的公历结果
      if (selectedSolar) { 
        console.log('TimestampModal - 使用选中的公历结果提交:', selectedSolar); // 输出选中结果日志
        // 使用选中的公历结果构建提交数据
        submittedTime = {
          year: String(selectedSolar.year).padStart(4, '0'), // 年份
          month: String(selectedSolar.month).padStart(2, '0'), // 月份
          day: String(selectedSolar.day).padStart(2, '0'), // 日期
          hour: String(selectedSolar.hour).padStart(2, '0'), // 小时
          minute: String(selectedSolar.minute).padStart(2, '0'), // 分钟
          second: String(selectedSolar.second).padStart(2, '0') // 秒
        };
      }
      // 如果没有选中结果
      else {
        console.warn('TimestampModal - 四柱选项卡：未选择公历结果'); // 输出警告日志
      }
      // 尝试转换四柱时间为公历时间
      try {
        const CalendarService = require('../../../services/calendarService').default; // 导入日历服务
        const result = CalendarService.getFullCalendarInfo(submittedTime); // 获取完整的历法信息
        // 如果获取成功
        if (result.success && result.data && result.data.solar) {
          // 更新提交时间为公历时间
          submittedTime = {
            year: String(result.data.solar.year).padStart(4, '0'), // 年份
            month: String(result.data.solar.month).padStart(2, '0'), // 月份
            day: String(result.data.solar.day).padStart(2, '0'), // 日期
            hour: String(result.data.solar.hour).padStart(2, '0'), // 小时
            minute: String(result.data.solar.minute).padStart(2, '0'), // 分钟
            second: String(result.data.solar.second).padStart(2, '0') // 秒
          };
        }
        // 如果获取失败
        else {
          console.warn('四柱转公历失败:', result.error); // 输出警告日志
        }
      }
      // 转换失败
      catch (error) {
        console.error('四柱转公历失败:', error); // 输出错误日志
      }
    }

    console.log('提交时间:', submittedTime); // 输出提交时间日志
    // 如果有提交回调函数
    if (onSubmit) {
      onSubmit(submittedTime); // 调用父组件的提交回调，传递时间数据
    }
    
    onClose(); // 关闭弹窗
  };
  
  // 定义全清按钮处理函数
  const handleInitialize = () => {
    console.log('TimestampModal - 点击全清按钮，activeTab:', activeTab); // 输出全清日志
    let initialTime = {}; // 定义初始时间对象
    // 如果是公历选项卡
    if (activeTab === 'gregorian') {
      initialTime = { // 初始化公历时间对象
        year: '', // 年份
        month: '', // 月份
        day: '', // 日期
        hour: '', // 小时
        minute: '', // 分钟
        second: '' // 秒
      };
    }
    // 如果是四柱选项卡
    else if (activeTab === 'four-pillars') {
      initialTime = { // 初始化四柱时间对象
        yearGan: '', // 年干
        monthGan: '', // 月干
        dayGan: '', // 日干
        hourGan: '', // 时干
        yearZhi: '', // 年支
        monthZhi: '', // 月支
        dayZhi: '', // 日支
        hourZhi: '' // 时支
      };
    }
    // 如果是农历选项卡
    else if (activeTab === 'lunar') {
      initialTime = { // 初始化农历时间对象
        lunar_year: '', // 农历年份
        lunar_month: '', // 农历月份
        lunar_day: '', // 农历日期
        hour: '', // 小时
        minute: '', // 分钟
        second: '', // 秒
        is_leap_month: false // 是否闰月
      };
    }
    
    console.log('TimestampModal - 全清后的数据:', initialTime); // 输出全清后的数据日志
    
    // 更新选中时间状态
    setSelectedTime(prev => {
      // 创建新的选中时间对象
      const newSelectedTime = {
        ...prev, // 保留其他选项卡的时间数据
        [activeTab]: initialTime // 设置当前选项卡的时间数据
      };
      console.log('TimestampModal - 新的selectedTime:', newSelectedTime); // 输出新的选中时间日志
      return newSelectedTime; // 返回新的选中时间对象
    });
    
    // 更新确认时间状态
    setConfirmedTime(prev => {
      // 创建新的确认时间对象
      const newConfirmedTime = {
        ...prev, // 保留其他选项卡的确认时间数据
        [activeTab]: initialTime // 设置当前选项卡的确认时间数据
      };
      console.log('TimestampModal - 新的confirmedTime:', newConfirmedTime); // 输出新的确认时间日志
      return newConfirmedTime; // 返回新的确认时间对象
    });
    
    console.log('全清时间输入值'); // 输出全清完成日志
  };
  // 返回JSX结构
  return (
    <div className="modal-overlay"> {/* 模态框遮罩层 */}
      <div className="modal-content timestamp-modal"> {/* 模态框内容容器 */}
        <div className="modal-header"> {/* 模态框头部区域 */}
          <div className="timestamp-tabs"> {/* 选项卡容器 */}
            {/* 公历选项卡按钮 */}
            <button
              className={`tab-button ${activeTab === 'gregorian' ? 'active' : ''}`} // 根据当前选项卡设置激活样式
              onClick={() => handleTabChange('gregorian')} // 点击切换到公历选项卡
            >
              公历
            </button>
            {/* 农历选项卡按钮 */}
            <button
              className={`tab-button ${activeTab === 'lunar' ? 'active' : ''}`} // 根据当前选项卡设置激活样式
              onClick={() => handleTabChange('lunar')} // 点击切换到农历选项卡
            >
              农历
            </button>
            {/* 四柱选项卡按钮 */}
            <button
              className={`tab-button ${activeTab === 'four-pillars' ? 'active' : ''}`} // 根据当前选项卡设置激活样式
              onClick={() => handleTabChange('four-pillars')} // 点击切换到四柱选项卡
            >
              四柱
            </button>
          </div> {/* 选项卡容器结束 */}
        
        </div> {/* 模态框头部区域结束 */}
        
        {/* 时间输入区域 */}
        <div className="modal-body timestamp-modal-body"> {/* 模态框主体区域 */}
          {/* 如果当前是公历选项卡 */}
          {activeTab === 'gregorian' && (
            // 渲染公历时间组件
            <SolarTime
              onTimeChange={handleGregorianTimeChange} // 传递时间变化回调函数
              confirmedTime={confirmedTime.gregorian} // 传递确认的公历时间数据
            />
          )} {/* 公历选项卡条件渲染结束 */}
          
          {/* 如果当前是农历选项卡 */}
          {activeTab === 'lunar' && (
            // 渲染农历时间组件
            <LunarTime
              onTimeChange={handleLunarTimeChange} // 传递时间变化回调函数
              confirmedTime={confirmedTime.lunar} // 传递确认的农历时间数据
            />
          )} {/* 农历选项卡条件渲染结束 */}
          
          {/* 如果当前是四柱选项卡 */}
          {activeTab === 'four-pillars' && (
            <> {/* Fragment标签，用于包裹多个元素 */}
              {/* 渲染四柱时间组件 */}
              <FourPillarsTime
                onTimeChange={handleFourPillarsTimeChange} // 传递时间变化回调函数
                confirmedTime={confirmedTime['four-pillars']} // 传递确认的四柱时间数据
                onSolarListResult={handleSolarListResult} // 传递四柱计算结果回调函数
                selectedSolar={selectedSolar} // 传递选中的公历结果数据
              />
              
              {/* 四柱计算结果显示区域 */}
              {solarListResult && (
                <div className="solar-list-result"> {/* 四柱结果列表容器 */}
                  {/* 如果计算成功 */}
                  {solarListResult.success ? (
                    <div className="result-list"> {/* 结果列表容器 */}
                      {/* 反转结果列表并遍历 */}
                      {solarListResult.data.list.slice().reverse().map((solar, index) => {
                        const reversedList = solarListResult.data.list.slice().reverse(); // 获取反转后的列表
                        const currentIndex = reversedList.indexOf(solar) + 1; // 计算当前索引（从1开始）
                        const totalCount = solarListResult.data.count; // 获取结果总数
                        const formattedIndex = String(currentIndex).padStart(2, '0'); // 格式化索引为两位数
                        const formattedTotal = String(totalCount).padStart(2, '0'); // 格式化总数为两位数
                        const isSelected = selectedSolarIndex === index; // 判断是否为选中项
                        // 返回结果项
                        return (
                          // 结果项容器
                          <div
                            key={solar.fullString} // 使用完整字符串作为唯一key
                            className={`result-item ${isSelected ? 'selected' : ''}`} // 根据选中状态设置样式
                            onClick={() => handleResultItemClick(solar, index)} // 点击处理函数
                          >
                            <span className="result-index">{formattedIndex}/{formattedTotal}</span> {/* 显示索引和总数 */}
                            <span className="result-content">{solar.fullString}</span> {/* 显示完整时间字符串 */}
                          </div> // 结果项容器结束
                        ); // return结束
                      })} {/* map遍历结束 */}
                    </div> // 结果列表容器结束
                  ) : (
                    // 如果计算失败
                    <div className="result-error"> {/* 错误信息容器 */}
                      <span>{solarListResult.error}</span> {/* 显示错误信息 */}
                    </div> // 错误信息容器结束
                  )} {/* 成功/失败条件渲染结束 */}
                </div> // 四柱结果列表容器结束
              )} {/* 四柱计算结果条件渲染结束 */}
            </> // Fragment结束
          )} {/* 四柱选项卡条件渲染结束 */}
        </div> {/* 模态框主体区域结束 */}
        
        {/* 底部按钮 */}
        <div className="modal-footer timestamp-modal-footer"> {/* 模态框底部区域 */}
          <button // 全清按钮
            className="modal-button initialize" // 设置按钮样式类名
            onClick={handleInitialize} // 点击处理函数
            disabled={isInitializeDisabled} // 根据状态禁用按钮
          >
            全清
          </button> {/* 全清按钮结束 */}
          {/* 补全按钮 */}
          <button
            className="modal-button confirm" // 设置按钮样式类名
            onClick={handleConfirm} // 点击处理函数
            disabled={isConfirmDisabled} // 根据状态禁用按钮
            title={activeTab === 'gregorian' ? '以当前公历时间补全' : activeTab === 'lunar' ? '以当前农历时间补全' : '以当前时间补全'} // 根据选项卡设置提示文本
            style={{ display: activeTab === 'four-pillars' ? 'none' : 'block' }} // 四柱选项卡隐藏补全按钮
          >
            补全
          </button> {/* 补全按钮结束 */}
          {/* 提交按钮 */}
          <button
            className="modal-button submit" // 设置按钮样式类名
            onClick={handleSubmit} // 点击处理函数
            disabled={isSubmitDisabled} // 根据状态禁用按钮
          >
            提交
          </button> {/* 提交按钮结束 */}
          {/* 取消按钮 */}
          <button className="modal-button cancel" onClick={onClose}> {/* 取消按钮 */}
            取消
          </button> {/* 取消按钮结束 */}
        </div> {/* 模态框底部区域结束 */}
      </div> {/* 模态框内容容器结束 */}
    </div> // 模态框遮罩层结束
  ); // return结束
}; {/* 组件定义结束 */}

export default TimestampModal;
