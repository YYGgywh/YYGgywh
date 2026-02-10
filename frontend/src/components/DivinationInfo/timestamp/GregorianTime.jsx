// 路径:src/components/DivinationInfo/timestamp/GregorianTime.jsx 时间:2026-02-04 10:00
// 功能:公历时间输入和显示组件
import React, { useState, useEffect, useRef, useCallback } from 'react';
import CalendarService from '../../../services/calendarService';
import { formatInputValue, handleInputValidation, validateInputData, padValue, handleNumberInputKeyDown } from '../../../utils/validationUtils';

/**
 * 公历时间输入和显示组件
 * @param {Function} onTimeChange - 时间数据变化时的回调函数
 * @param {Object} confirmedTime - 确认的时间数据（用于初始化）
 */
const GregorianTime = ({ onTimeChange, confirmedTime }) => {
  // 时间数据状态
  const [timeData, setTimeData] = useState({
    year: '',  // 年份
    month: '', // 月份
    day: '',   // 日期
    hour: '',  // 小时
    minute: '', // 分钟
    second: ''  // 秒
  });
  
  // 当前时间状态（用于分、秒未输入时显示）
  const [currentTime, setCurrentTime] = useState({
    minute: '',
    second: ''
  });
  
  // 跳过通知父组件的标记
  const skipNotifyRef = useRef(false);
  
  // 农历信息状态
  const [lunarDate, setLunarDate] = useState(''); // 农历日期
  const [lunarTime, setLunarTime] = useState(''); // 农历时辰
  
  // 公历信息状态
  const [solarDate, setSolarDate] = useState(''); // 公历日期
  const [solarTime, setSolarTime] = useState(''); // 公历时间
  
  // 错误提示状态
  const [showAlert, setShowAlert] = useState(false); // 是否显示错误提示
  const [alertMessage, setAlertMessage] = useState(''); // 错误提示信息
  
  // 跟踪之前是否有值，用于判断是否需要通知父组件
  const [hadPreviousValue, setHadPreviousValue] = useState(false);
  
  // 输入框禁用状态
  const [disabledFields, setDisabledFields] = useState({
    year: false,
    month: false,
    day: false,
    hour: false,
    minute: false,
    second: false
  });
  
  // 输入框引用，用于同步浏览器自动填充的值
  const inputRefs = useRef({
    year: null,
    month: null,
    day: null,
    hour: null,
    minute: null,
    second: null
  });

  /**
   * 当confirmedTime变化时，初始化时间数据
   * @param {Object} confirmedTime - 确认的时间数据
   */
  useEffect(() => {
    if (confirmedTime !== null) {
      skipNotifyRef.current = true;
      setTimeData(confirmedTime);
      // 所有输入框保持可用
      setDisabledFields({
        year: false,
        month: false,
        day: false,
        hour: false,
        minute: false,
        second: false
      });
      skipNotifyRef.current = false;
    }
  }, [confirmedTime]);
  
  /**
   * 初始化时同步浏览器自动填充的值
   * 浏览器自动填充不会触发onChange事件，需要手动同步
   */
  useEffect(() => {
    // 检查并同步浏览器自动填充的值
    const syncAutofilledValues = () => {
      const hasAutofilledValues = Object.keys(inputRefs.current).some(fieldName => {
        const input = inputRefs.current[fieldName];
        return input && input.value && input.value !== timeData[fieldName];
      });
      
      if (hasAutofilledValues) {
        const autofilledData = {
          year: inputRefs.current.year?.value || '',
          month: inputRefs.current.month?.value || '',
          day: inputRefs.current.day?.value || '',
          hour: inputRefs.current.hour?.value || '',
          minute: inputRefs.current.minute?.value || '',
          second: inputRefs.current.second?.value || ''
        };
        
        skipNotifyRef.current = true;
        setTimeData(autofilledData);
        skipNotifyRef.current = false;
      }
    };
    
    // 延迟执行，确保浏览器有足够时间完成自动填充
    const timer = setTimeout(syncAutofilledValues, 100);
    
    // 清理函数
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * 当timeData变化时，通知父组件
   * 通知父组件的条件：
   * 1. 当前有值，无论之前是否有值
   * 2. 当前无值，但之前有值（从有值变为无值的情况）
   */
  useEffect(() => {
    if (!skipNotifyRef.current) {
      const hasCurrentValue = Object.values(timeData).some(value => value !== '');
      
      if (hasCurrentValue || hadPreviousValue) {
        onTimeChange(timeData);
        // 更新之前是否有值的状态
        setHadPreviousValue(hasCurrentValue);
      }
    }
  }, [timeData, onTimeChange, hadPreviousValue]);

  // 更新当前时间，用于分、秒未输入时显示
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      setCurrentTime({
        minute: now.getMinutes().toString().padStart(2, '0'),
        second: now.getSeconds().toString().padStart(2, '0')
      });
    };
    
    // 初始化时更新一次
    updateCurrentTime();
    
    // 每秒更新一次
    const intervalId = setInterval(updateCurrentTime, 1000);
    
    // 清理函数
    return () => clearInterval(intervalId);
  }, []);

  // 处理输入变化
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // 格式化输入值
    const validatedValue = formatInputValue(value, name);
    
    // 验证输入值
    let maxValue = null;
    if (name === 'day') {
      maxValue = getDaysInMonth(timeData.year, timeData.month);
    }
    if (!handleInputValidation(name, validatedValue, setAlertMessage, setShowAlert, setTimeData, maxValue)) {
      return;
    }
    
    // 实时更新输入框显示值
    setTimeData(prev => ({
      ...prev,
      [name]: validatedValue
    }));
  };
  
  // 获取指定年月的天数
  const getDaysInMonth = (year, month) => {
    if (!year || !month) return 31; // 默认值
    return CalendarService.getDaysInMonth(year, month);
  };

  // 处理失去焦点事件
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    if (value.length > 0) {
      let paddedValue;
      if (name === 'year') {
        // 自动补零到4位
        paddedValue = padValue(value, 4);
        
        // 失去焦点验证：验证值是否小于等于0（仅对年有效）
        if (parseInt(paddedValue) <= 0) {
          setAlertMessage('年份值请输入0001~9999');
          setShowAlert(true);
          // 清空输入框
          setTimeData(prev => ({
            ...prev,
            [name]: ''
          }));
          return;
        }
      } else {
        // 自动补零到2位
        paddedValue = padValue(value, 2);
        
        // 失去焦点验证：验证值是否小于等于0（仅对月、日有效）
        if ((name === 'month' || name === 'day') && parseInt(paddedValue) <= 0) {
          setAlertMessage(`${name === 'month' ? '月份' : '日期'}值请输入1~${name === 'month' ? '12' : getDaysInMonth(timeData.year, timeData.month)}`);
          setShowAlert(true);
          // 清空输入框
          setTimeData(prev => ({
            ...prev,
            [name]: ''
          }));
          return;
        }
        
        // 对于日值，当同时指定年份与月份时，验证日值不能大于当月实际天数
        if (name === 'day' && timeData.year && timeData.month) {
          const maxDays = getDaysInMonth(timeData.year, timeData.month);
          if (parseInt(paddedValue) > maxDays) {
            setAlertMessage(`日期值请输入1~${maxDays}`);
            setShowAlert(true);
            // 清空输入框
            setTimeData(prev => ({
              ...prev,
              [name]: ''
            }));
            return;
          }
        }
      }
      
      setTimeData(prev => ({
        ...prev,
        [name]: paddedValue
      }));
    }
  };
  
  // 双击清空输入框
  const handleDoubleClick = (e, fieldName) => {
    // 阻止浏览器默认的全选行为
    e.preventDefault();
    // 清空输入框值
    setTimeData(prev => ({
      ...prev,
      [fieldName]: ''
    }));
    // 直接操作DOM确保清空，处理浏览器自动填充的情况
    if (inputRefs.current[fieldName]) {
      inputRefs.current[fieldName].value = '';
    }
  };

  // 关闭弹窗
  const closeAlert = () => {
    // 根据错误信息重置对应的输入框
    let fieldToReset = '';
    if (alertMessage.includes('年份')) {
      fieldToReset = 'year';
    } else if (alertMessage.includes('月份')) {
      fieldToReset = 'month';
    } else if (alertMessage.includes('日期')) {
      fieldToReset = 'day';
    } else if (alertMessage.includes('小时')) {
      fieldToReset = 'hour';
    } else if (alertMessage.includes('分钟')) {
      fieldToReset = 'minute';
    } else if (alertMessage.includes('秒')) {
      fieldToReset = 'second';
    }
    
    if (fieldToReset) {
      setTimeData(prev => {
        const newData = {
          ...prev,
          [fieldToReset]: ''
        };
        return newData;
      });
      
      // 在下一个渲染周期后将焦点设置回触发警告的输入框
      setTimeout(() => {
        if (inputRefs.current[fieldToReset]) {
          inputRefs.current[fieldToReset].focus();
        }
      }, 0);
    }
    
    setShowAlert(false);
  };

  // 构建农历日期字符串
  const buildLunarDateString = (lunarData) => {
    let lunarDateString = '';
    
    // 提取农历年信息
    if (lunarData.lunar_year_in_GanZhi) {
      lunarDateString += lunarData.lunar_year_in_GanZhi + '年';
    }
    
    // 提取农历月信息
    if (lunarData.lunar_month_in_Chinese) {
      lunarDateString += lunarData.lunar_month_in_Chinese + '月';
    }
    
    // 提取农历日信息
    if (lunarData.lunar_day_in_Chinese) {
      lunarDateString += lunarData.lunar_day_in_Chinese;
    }
    
    return lunarDateString || '';
  };

  // 构建时辰字符串
  const buildLunarTimeString = (hour, minute, second, lunarData) => {
    if (hour === null || !lunarData.lunar_time_Zhi) {
      return '';
    }
    
    // 判断是否为子时，并区分早子时和晚子时
    if (lunarData.lunar_time_Zhi === '子') {
      const hourNum = parseInt(hour);
      const minuteNum = parseInt(minute || 0);
      const secondNum = parseInt(second || 0);
      
      // 23:00:00~23:59:59 → 晚子时
      if (hourNum === 23 && (minuteNum > 0 || secondNum > 0)) {
        return '晚子时';
      } else if (hourNum === 23 && minuteNum === 0 && secondNum === 0) {
        return '晚子时';
      } else if (hourNum === 0) {
        // 00:00:00~00:59:59 → 早子时
        return '早子时';
      } else {
        return `${lunarData.lunar_time_Zhi}时`;
      }
    } else {
      return `${lunarData.lunar_time_Zhi}时`;
    }
  };

  // 使用前端CalendarService将公历时间转换为农历
  const convertToLunar = useCallback((timeData) => {
    try {
      // 检查小时值是否存在
      const hour = timeData.hour ? parseInt(timeData.hour) : null;
      
      // 当未输入分钟或秒时，使用当前时间的分钟和秒
      const minute = timeData.minute ? parseInt(timeData.minute) : parseInt(currentTime.minute);
      const second = timeData.second ? parseInt(timeData.second) : parseInt(currentTime.second);
      
      // 检查年、月、日是否完整
      const hasCompleteDate = timeData.year && timeData.month && timeData.day;
      
      if (hasCompleteDate) {
        // 年、月、日完整，执行完整的阳历到农历转换
        const validationResult = validateInputData(timeData, false);
        if (!validationResult.valid) {
          // 输入无效，清空所有信息
          setLunarDate('');
          setLunarTime('');
          setSolarDate('');
          setSolarTime('');
          return;
        }
        
        const { year, month, day } = validationResult.data;
        
        // 使用前端CalendarService进行转换
        const result = CalendarService.convertSolarToLunar({
          year,
          month,
          day,
          hour: hour || 0,
          minute,
          second
        });
        
        if (result.success && result.data) {
          // 构建农历日期字符串
          const lunarDateString = buildLunarDateString(result.data);
          // 构建时辰字符串
          const lunarTimeString = buildLunarTimeString(hour, minute, second, result.data);
          
          // 构建公历日期字符串
          const solarDateString = `${result.data.solar_year.toString().padStart(4, '0')}年${result.data.solar_month.toString().padStart(2, '0')}月${result.data.solar_day.toString().padStart(2, '0')}日`;
          // 构建公历时间字符串
          const solarTimeString = `${result.data.solar_hour.toString().padStart(2, '0')}:${result.data.solar_minute.toString().padStart(2, '0')}:${result.data.solar_second.toString().padStart(2, '0')}`;
          
          // 更新农历信息
          setLunarDate(lunarDateString);
          setLunarTime(lunarTimeString);
          // 更新公历信息
          setSolarDate(solarDateString);
          setSolarTime(solarTimeString);
        } else {
          // 转换失败，只打印日志，不显示错误提示
          console.error('转换为农历失败:', result.error || '未知错误');
        }
      } else {
        // 年、月、日不完整
        if (hour !== null) {
          // 有小时值，只计算时辰
          const timeResult = CalendarService.getLunarTimeByHms(hour, minute, second);
          
          if (timeResult.success && timeResult.data) {
            const { lunar_time_Zhi, solar_hour, solar_minute, solar_second } = timeResult.data;
            
            // 构建时辰字符串
            const lunarTimeString = buildLunarTimeString(hour, minute, second, { lunar_time_Zhi });
            
            // 更新农历时辰信息，清空日期信息
            setLunarDate(''); // 清空农历日期
            setLunarTime(lunarTimeString);
            
            // 构建公历时间字符串
            const solarTimeString = `${solar_hour.toString().padStart(2, '0')}:${solar_minute.toString().padStart(2, '0')}:${solar_second.toString().padStart(2, '0')}`;
            setSolarDate(''); // 清空公历日期
            setSolarTime(solarTimeString);
          }
        } else {
          // 没有小时值，清空所有时间相关信息
          setLunarDate(''); // 清空农历日期
          setLunarTime('');
          setSolarDate(''); // 清空公历日期
          setSolarTime('');
        }
      }
    } catch (error) {
      console.error('转换为农历失败:', error);
      // 错误时只打印日志，不显示提示
    }
  }, [currentTime.minute, currentTime.second]);

  // 监听键盘事件，支持回车键关闭弹窗
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter' && showAlert) {
        // 直接实现关闭弹窗的逻辑，避免依赖closeAlert函数
        // 根据错误信息重置对应的输入框
        let fieldToReset = '';
        if (alertMessage.includes('年份')) {
          fieldToReset = 'year';
        } else if (alertMessage.includes('月份')) {
          fieldToReset = 'month';
        } else if (alertMessage.includes('日期')) {
          fieldToReset = 'day';
        } else if (alertMessage.includes('小时')) {
          fieldToReset = 'hour';
        } else if (alertMessage.includes('分钟')) {
          fieldToReset = 'minute';
        } else if (alertMessage.includes('秒')) {
          fieldToReset = 'second';
        }
        
        if (fieldToReset) {
          setTimeData(prev => ({
            ...prev,
            [fieldToReset]: ''
          }));
          
          // 在下一个渲染周期后将焦点设置回触发警告的输入框
          setTimeout(() => {
            if (inputRefs.current[fieldToReset]) {
              inputRefs.current[fieldToReset].focus();
            }
          }, 0);
        }
        
        setShowAlert(false);
      }
    };

    // 添加键盘事件监听器
    window.addEventListener('keydown', handleKeyPress);

    // 清理函数
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [showAlert, alertMessage]); // 依赖showAlert和alertMessage状态

  // 防抖处理的农历转换
  const debouncedConvertToLunar = useCallback(() => {
    let timeoutId;
    return (timeData) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        convertToLunar(timeData);
      }, 300); // 300ms防抖延迟
    };
  }, [convertToLunar])();

  // 监听timeData变化，更新农历信息（使用防抖）
  useEffect(() => {
    debouncedConvertToLunar(timeData);
  }, [timeData, debouncedConvertToLunar]);
  
  /**
   * 当timeData变化时，同步DOM值
   * 确保React状态与DOM显示一致，特别是在全清按钮点击后
   */
  useEffect(() => {
    // 同步DOM值，确保输入框显示与React状态一致
    Object.keys(timeData).forEach(fieldName => {
      if (inputRefs.current[fieldName]) {
        inputRefs.current[fieldName].value = timeData[fieldName] || '';
      }
    });
  }, [timeData]);

  return (
    <div className="gregorian-time-container">
      {/* 时间输入区域 */}
      <div className="timestamp-inputs">
        <input 
          ref={(el) => (inputRefs.current.year = el)} 
          type="number" 
          name="year" 
          placeholder="年" 
          className="time-input time-input-year no-spin-buttons"
          value={timeData.year}
          onChange={handleChange}
          onBlur={handleBlur}
          onDoubleClick={(e) => handleDoubleClick(e, 'year')}
          onKeyDown={handleNumberInputKeyDown}
          disabled={disabledFields.year}
          min="1"
          max="9999"
        />
        <input 
          ref={(el) => (inputRefs.current.month = el)} 
          type="number" 
          name="month" 
          placeholder="月" 
          className="time-input time-input-small no-spin-buttons"
          value={timeData.month}
          onChange={handleChange}
          onBlur={handleBlur}
          onDoubleClick={(e) => handleDoubleClick(e, 'month')}
          onKeyDown={handleNumberInputKeyDown}
          disabled={disabledFields.month}
          min="1"
          max="12"
        />
        <input 
          ref={(el) => (inputRefs.current.day = el)} 
          type="number" 
          name="day" 
          placeholder="日" 
          className="time-input time-input-small no-spin-buttons"
          value={timeData.day}
          onChange={handleChange}
          onBlur={handleBlur}
          onDoubleClick={(e) => handleDoubleClick(e, 'day')}
          onKeyDown={handleNumberInputKeyDown}
          disabled={disabledFields.day}
          min="1"
          max="31"
        />
        <input 
          ref={(el) => (inputRefs.current.hour = el)} 
          type="number" 
          name="hour" 
          placeholder="时" 
          className="time-input time-input-small no-spin-buttons"
          value={timeData.hour}
          onChange={handleChange}
          onBlur={handleBlur}
          onDoubleClick={(e) => handleDoubleClick(e, 'hour')}
          onKeyDown={handleNumberInputKeyDown}
          disabled={disabledFields.hour}
          min="0"
          max="23"
        />
        <input 
          ref={(el) => (inputRefs.current.minute = el)} 
          type="number" 
          name="minute" 
          placeholder="分" 
          className="time-input time-input-small no-spin-buttons"
          value={timeData.minute}
          onChange={handleChange}
          onBlur={handleBlur}
          onDoubleClick={(e) => handleDoubleClick(e, 'minute')}
          onKeyDown={handleNumberInputKeyDown}
          disabled={disabledFields.minute}
          min="0"
          max="59"
        />
        <input 
          ref={(el) => (inputRefs.current.second = el)} 
          type="number" 
          name="second" 
          placeholder="秒" 
          className="time-input time-input-small no-spin-buttons"
          value={timeData.second}
          onChange={handleChange}
          onBlur={handleBlur}
          onDoubleClick={(e) => handleDoubleClick(e, 'second')}
          onKeyDown={handleNumberInputKeyDown}
          disabled={disabledFields.second}
          min="0"
          max="59"
        />
      </div>
      
      {/* 时间显示区域 */}
      <div className="timestamp-display">
        <div className="solar-info">
          <span className="solar-label">公历：</span>
          <span className="date-value">{solarDate}</span>
          <span className="time-value">
            {timeData.hour ? solarTime : ''}
          </span>
        </div>
        <div className="lunar-info">
          <span className="date-label">农历：</span>
          <span className="date-value">{lunarDate}</span>
          <span className="time-value">{lunarTime}</span>
        </div>
      </div>
      
      {/* 警告弹窗 */}
      {showAlert && (
        <div className="alert-overlay">
          <div className="alert-content">
            <div className="alert-message">{alertMessage}</div>
            <button className="alert-close" onClick={closeAlert}>确定</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GregorianTime;