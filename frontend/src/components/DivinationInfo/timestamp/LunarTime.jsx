// 路径:src/components/DivinationInfo/timestamp/LunarTime.jsx 时间:2026-02-04 10:00
// 功能:农历时间输入和显示组件
import React, { useState, useEffect, useCallback, useRef } from 'react';
import CalendarService from '../../../services/calendarService';
import { formatInputValue, validateInputData, padValue, handleNumberInputKeyDown, handleInputValidation, getLunarMonthDays, getLeapMonth } from '../../../utils/validationUtils';

const LunarTime = ({ onTimeChange, confirmedTime }) => {
  const [timeData, setTimeData] = useState({
    lunar_year: '',
    lunar_month: '',
    lunar_day: '',
    hour: '',
    minute: '',
    second: '',
    is_leap_month: false
  });
  
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [lunarInfo, setLunarInfo] = useState({
    lunar_year_in_GanZhi: '',
    lunar_month_in_Chinese: '',
    lunar_day_in_Chinese: '',
    lunar_time_Zhi: '',
    solar_year: '',
    solar_month: '',
    solar_day: '',
    solar_hour: '',
    solar_minute: '',
    solar_second: ''
  });
  
  // 公历时间字符串状态
  const [solarTime, setSolarTime] = useState('');

  // 当前时间状态（用于分、秒未输入时显示）
  const [currentTime, setCurrentTime] = useState({
    minute: '',
    second: ''
  });

  const prevTimeDataRef = useRef(null);
  const skipNotifyRef = useRef(false);
  
  const [hadPreviousValue, setHadPreviousValue] = useState(false);
  
  const [disabledFields, setDisabledFields] = useState({
    lunar_year: false,
    lunar_month: false,
    lunar_day: false,
    hour: false,
    minute: false,
    second: false,
    leap_month: true
  });
  
  const inputRefs = useRef({
    lunar_year: null,
    lunar_month: null,
    lunar_day: null,
    hour: null,
    minute: null,
    second: null,
    leapMonthToggle: null
  });

  useEffect(() => {
    if (confirmedTime) {
      skipNotifyRef.current = true;
      setTimeData(confirmedTime);
      setDisabledFields({
        lunar_year: false,
        lunar_month: false,
        lunar_day: false,
        hour: false,
        minute: false,
        second: false
      });
      skipNotifyRef.current = false;
    }
  }, [confirmedTime]);
  
  useEffect(() => {
    const syncAutofilledValues = () => {
      const hasAutofilledValues = Object.keys(inputRefs.current).some(fieldName => {
        const input = inputRefs.current[fieldName];
        return input && input.value && input.value !== timeData[fieldName];
      });
      
      if (hasAutofilledValues) {
        const autofilledData = {
          lunar_year: inputRefs.current.lunar_year?.value || '',
          lunar_month: inputRefs.current.lunar_month?.value || '',
          lunar_day: inputRefs.current.lunar_day?.value || '',
          hour: inputRefs.current.hour?.value || '',
          minute: inputRefs.current.minute?.value || '',
          second: inputRefs.current.second?.value || '',
          is_leap_month: timeData.is_leap_month
        };
        
        skipNotifyRef.current = true;
        setTimeData(autofilledData);
        skipNotifyRef.current = false;
      }
    };
    
    const timer = setTimeout(syncAutofilledValues, 100);
    
    return () => clearTimeout(timer);
  }, []);

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

  // 当timeData变化时，通知父组件
  useEffect(() => {
    if (!skipNotifyRef.current) {
      const hasCurrentValue = Object.values(timeData).some(value => value !== '');
      
      if (hasCurrentValue || hadPreviousValue) {
        onTimeChange(timeData);
        setHadPreviousValue(hasCurrentValue);
      }
    }
  }, [timeData, onTimeChange, hadPreviousValue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const formattedValue = formatInputValue(value, name);
    
    // 计算农历日期的最大值（如果有足够的信息）
    let maxDays = null;
    if (name === 'lunar_day' || name === 'lunar_year' || name === 'lunar_month' || name === 'is_leap_month') {
      const { lunar_year, lunar_month, is_leap_month } = timeData;
      if (lunar_year && lunar_month) {
        try {
          maxDays = getLunarMonthDays(parseInt(lunar_year), parseInt(lunar_month), is_leap_month);
        } catch (error) {
          console.error('计算农历月份天数失败:', error);
        }
      }
    }
    
    // 使用validationUtils中的handleInputValidation进行验证
    if (!handleInputValidation(name, formattedValue, setAlertMessage, setShowAlert, setTimeData, maxDays, name.includes('lunar'))) {
      return;
    }
    
    setTimeData(prev => {
      const newData = {
        ...prev,
        [name]: formattedValue
      };
      
      // 处理"闰"键钮的禁用/启用逻辑已移至useEffect钩子中
      // 这里不再重复处理，确保与useEffect中的逻辑保持一致
      
      return newData;
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    if (value.length > 0) {
      let paddedValue;
      if (name === 'lunar_year') {
        paddedValue = padValue(value, 4);
        
        if (parseInt(paddedValue) <= 0) {
          setAlertMessage('年份值请输入0001~9999');
          setShowAlert(true);
          setTimeData(prev => ({
            ...prev,
            [name]: ''
          }));
          return;
        }
      } else if (name === 'lunar_month' || name === 'lunar_day') {
        paddedValue = padValue(value, 2);
        
        if (parseInt(paddedValue) <= 0) {
          setAlertMessage(`${name === 'lunar_month' ? '月份' : '日期'}值不能为0`);
          setShowAlert(true);
          setTimeData(prev => ({
            ...prev,
            [name]: ''
          }));
          return;
        }
      } else {
        paddedValue = padValue(value, 2);
      }
      
      setTimeData(prev => ({
        ...prev,
        [name]: paddedValue
      }));
    }
  };
  
  const handleDoubleClick = (e, fieldName) => {
    e.preventDefault();
    setTimeData(prev => {
      const newData = {
        ...prev,
        [fieldName]: ''
      };
      
      // 当清空年份时，处理"闰"键钮状态
      if (fieldName === 'lunar_year') {
        // 禁用"闰"键钮
        setDisabledFields(prev => ({
          ...prev,
          leap_month: true
        }));
        
        // 重置is_leap_month为false
        if (newData.is_leap_month) {
          newData.is_leap_month = false;
        }
      }
      
      return newData;
    });
    if (inputRefs.current[fieldName]) {
      inputRefs.current[fieldName].value = '';
    }
  };
  
  // 关闭弹窗
  const closeAlert = () => {
    let fieldToReset = '';
    if (alertMessage.includes('年份')) {
      fieldToReset = 'lunar_year';
    } else if (alertMessage.includes('月份')) {
      fieldToReset = 'lunar_month';
    } else if (alertMessage.includes('日期')) {
      fieldToReset = 'lunar_day';
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
  
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter' && showAlert) {
        let fieldToReset = '';
        if (alertMessage.includes('年份')) {
          fieldToReset = 'lunar_year';
        } else if (alertMessage.includes('月份')) {
          fieldToReset = 'lunar_month';
        } else if (alertMessage.includes('日期')) {
          fieldToReset = 'lunar_day';
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

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [showAlert, alertMessage]);
  
  useEffect(() => {
    Object.keys(timeData).forEach(fieldName => {
      if (inputRefs.current[fieldName]) {
        inputRefs.current[fieldName].value = timeData[fieldName] || '';
      }
    });
  }, [timeData]);
  
  // 监听timeData变化，确保"闰"键钮状态正确更新
  useEffect(() => {
    const { lunar_year, lunar_month } = timeData;
    let isLeapButtonDisabled = true;
    let shouldResetLeap = false;
    
    // 年值为空时，禁用"闰"键钮
    if (!lunar_year || lunar_year === '') {
      isLeapButtonDisabled = true;
      // 年值为空，重置is_leap_month
      shouldResetLeap = true;
    } else {
      // 年值为合法值，检查是否有闰月
      const lunarYearInt = parseInt(lunar_year);
      if (!isNaN(lunarYearInt) && lunarYearInt > 0) {
        const leapMonth = getLeapMonth(lunarYearInt);
        
        // 有闰月时
        if (leapMonth > 0) {
          // 检查月值是否为空
          if (!lunar_month || lunar_month === '') {
            // 月值为空，只判断年是否有闰月，有则启用"闰"键钮
            isLeapButtonDisabled = false;
            // 月值为空，不重置is_leap_month，保持当前状态
          } else {
            // 月值不为空，检查是否等于闰月值
            const lunarMonthInt = parseInt(lunar_month);
            if (!isNaN(lunarMonthInt)) {
              if (lunarMonthInt === leapMonth) {
                // 月值等于闰月值，启用"闰"键钮，不作任何操作
                isLeapButtonDisabled = false;
              } else {
                // 月值不等于闰月值，禁用"闰"键钮
                isLeapButtonDisabled = true;
                // 月值不等于闰月值，重置is_leap_month
                shouldResetLeap = true;
              }
            } else {
              // 月值为非法值，禁用"闰"键钮
              isLeapButtonDisabled = true;
              // 月值为非法值，重置is_leap_month
              shouldResetLeap = true;
            }
          }
        } else {
          // 无闰月时禁用"闰"键钮
          isLeapButtonDisabled = true;
          // 无闰月，重置is_leap_month
          shouldResetLeap = true;
        }
      } else {
        // 年值为非法值，禁用"闰"键钮
        isLeapButtonDisabled = true;
        // 年值为非法值，重置is_leap_month
        shouldResetLeap = true;
      }
    }
    
    // 更新"闰"键钮的禁用状态
    setDisabledFields(prev => ({
      ...prev,
      leap_month: isLeapButtonDisabled
    }));
    
    // 如果需要，自动将"闰"键钮设为false
    if (shouldResetLeap && timeData.is_leap_month) {
      setTimeData(prev => ({
        ...prev,
        is_leap_month: false
      }));
    }
  }, [timeData.lunar_year, timeData.lunar_month]);

  const handleLeapMonthToggle = () => {
    const newData = {
      ...timeData,
      is_leap_month: !timeData.is_leap_month
    };
    setTimeData(newData);
    
    // 移除按钮的焦点状态，避免取消选中后仍然显示#1890FF的边框
    if (inputRefs.current.leapMonthToggle) {
      inputRefs.current.leapMonthToggle.blur();
    }
  };

  const handleLeapMonthKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleLeapMonthToggle();
    }
  };

  // 构建农历时间字符串，处理早子时和晚子时
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

  // 前端农历转公历
  const convertToSolar = useCallback((timeData) => {
    try {
      // 检查小时值是否存在
      const hour = timeData.hour ? parseInt(timeData.hour) : null;
      
      // 当未输入分钟或秒时，使用当前时间的分钟和秒
      const minute = timeData.minute ? parseInt(timeData.minute) : parseInt(currentTime.minute);
      const second = timeData.second ? parseInt(timeData.second) : parseInt(currentTime.second);
      
      // 检查年、月、日是否完整
      const hasCompleteDate = timeData.lunar_year && timeData.lunar_month && timeData.lunar_day;
      
      if (hasCompleteDate) {
        // 年、月、日完整，执行完整的农历到公历转换
        const validationResult = validateInputData(timeData, true);
        if (!validationResult.valid) {
          // 输入无效，清空所有信息
          setLunarInfo({
            lunar_year_in_GanZhi: '',
            lunar_month_in_Chinese: '',
            lunar_day_in_Chinese: '',
            lunar_time_Zhi: '',
            solar_year: '',
            solar_month: '',
            solar_day: '',
            solar_hour: '',
            solar_minute: '',
            solar_second: ''
          });
          setSolarTime('');
          return;
        }
        
        const { lunar_year, lunar_month, lunar_day, is_leap_month } = validationResult.data;
        
        const result = CalendarService.convertLunarToSolar({
          lunar_year,
          lunar_month,
          lunar_day,
          hour,
          minute,
          second,
          is_leap_month
        });
        
        if (result.success && result.data) {
          const { 
            lunar_year_in_GanZhi, 
            lunar_month_in_Chinese, 
            lunar_day_in_Chinese,
            lunar_time_Zhi,
            solar_year,
            solar_month,
            solar_day,
            solar_hour,
            solar_minute,
            solar_second
          } = result.data;
          
          // 构建时辰字符串
          const lunarTimeString = buildLunarTimeString(hour, minute, second, result.data);
          
          // 构建公历时间字符串
          const solarTimeString = `${solar_hour.toString().padStart(2, '0')}:${solar_minute.toString().padStart(2, '0')}:${solar_second.toString().padStart(2, '0')}`;
          
          setLunarInfo({
            lunar_year_in_GanZhi: lunar_year_in_GanZhi,
            lunar_month_in_Chinese: lunar_month_in_Chinese,
            lunar_day_in_Chinese: lunar_day_in_Chinese,
            lunar_time_Zhi: lunarTimeString,
            solar_year: solar_year.toString().padStart(4, '0'),
            solar_month: solar_month.toString().padStart(2, '0'),
            solar_day: solar_day.toString().padStart(2, '0'),
            solar_hour: solar_hour.toString().padStart(2, '0'),
            solar_minute: solar_minute.toString().padStart(2, '0'),
            solar_second: solar_second.toString().padStart(2, '0')
          });
          
          // 设置公历时间字符串
          setSolarTime(solarTimeString);
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
            setLunarInfo(prev => ({
              ...prev,
              lunar_year_in_GanZhi: '', // 清空农历年
              lunar_month_in_Chinese: '', // 清空农历月
              lunar_day_in_Chinese: '', // 清空农历日
              lunar_time_Zhi: lunarTimeString,
              solar_year: '', // 清空公历年
              solar_month: '', // 清空公历月
              solar_day: '', // 清空公历日
              solar_hour: solar_hour.toString().padStart(2, '0'),
              solar_minute: solar_minute.toString().padStart(2, '0'),
              solar_second: solar_second.toString().padStart(2, '0')
            }));
            
            // 构建公历时间字符串
            const solarTimeString = `${solar_hour.toString().padStart(2, '0')}:${solar_minute.toString().padStart(2, '0')}:${solar_second.toString().padStart(2, '0')}`;
            setSolarTime(solarTimeString);
          }
        } else {
          // 没有小时值，清空所有时间相关信息
          setLunarInfo(prev => ({
            ...prev,
            lunar_year_in_GanZhi: '', // 清空农历年
            lunar_month_in_Chinese: '', // 清空农历月
            lunar_day_in_Chinese: '', // 清空农历日
            lunar_time_Zhi: '',
            solar_year: '', // 清空公历年
            solar_month: '', // 清空公历月
            solar_day: '', // 清空公历日
            solar_hour: '',
            solar_minute: '',
            solar_second: ''
          }));
          setSolarTime('');
        }
      }
    } catch (error) {
      console.error('转换为公历失败:', error);
    }
  }, [currentTime.minute, currentTime.second]);

  // 防抖处理
  const debouncedConvertToSolar = useCallback(() => {
    let timeoutId;
    return (timeData) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        convertToSolar(timeData);
      }, 300); // 300ms防抖延迟
    };
  }, [convertToSolar])();

  // 监听timeData变化，更新农历信息（使用防抖）
  useEffect(() => {
    debouncedConvertToSolar(timeData);
  }, [timeData, debouncedConvertToSolar]);

  return (
    <div className="lunar-time-container">
      {/* 农历输入区域 */}
      <div className="timestamp-inputs">
        <input 
          ref={(el) => (inputRefs.current.lunar_year = el)} 
          type="number" 
          name="lunar_year" 
          placeholder="年" 
          className="time-input time-input-year no-spin-buttons"
          value={timeData.lunar_year}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleNumberInputKeyDown}
          onDoubleClick={(e) => handleDoubleClick(e, 'lunar_year')}
          disabled={disabledFields.lunar_year}
          min="1"
          max="9999"
        />
        <button
          type="button"
          ref={(el) => (inputRefs.current.leapMonthToggle = el)}
          className={`leap-month-toggle ${timeData.is_leap_month ? 'active' : ''}`}
          onClick={handleLeapMonthToggle}
          onKeyDown={handleLeapMonthKeyDown}
          aria-pressed={timeData.is_leap_month}
          aria-label="闰月切换"
          disabled={disabledFields.leap_month}
          style={{
            color: timeData.is_leap_month ? '' : '#666666'
          }}
        >
          闰
        </button>
        <input 
          ref={(el) => (inputRefs.current.lunar_month = el)} 
          type="number" 
          name="lunar_month" 
          placeholder="月" 
          className="time-input time-input-small no-spin-buttons"
          value={timeData.lunar_month}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleNumberInputKeyDown}
          onDoubleClick={(e) => handleDoubleClick(e, 'lunar_month')}
          disabled={disabledFields.lunar_month}
          min="1"
          max="12"
        />
        <input 
          ref={(el) => (inputRefs.current.lunar_day = el)} 
          type="number" 
          name="lunar_day" 
          placeholder="日" 
          className="time-input time-input-small no-spin-buttons"
          value={timeData.lunar_day}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleNumberInputKeyDown}
          onDoubleClick={(e) => handleDoubleClick(e, 'lunar_day')}
          disabled={disabledFields.lunar_day}
          min="1"
          max="30"
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
          onKeyDown={handleNumberInputKeyDown}
          onDoubleClick={(e) => handleDoubleClick(e, 'hour')}
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
          onKeyDown={handleNumberInputKeyDown}
          onDoubleClick={(e) => handleDoubleClick(e, 'minute')}
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
          onKeyDown={handleNumberInputKeyDown}
          onDoubleClick={(e) => handleDoubleClick(e, 'second')}
          disabled={disabledFields.second}
          min="0"
          max="59"
        />
      </div>
      
      {/* 时间显示区域 */}
      <div className="timestamp-display">
        <>
          <div className="lunar-info">
            <span className="date-label">农历：</span>
            <span className="date-value">
              {lunarInfo.lunar_year_in_GanZhi ? lunarInfo.lunar_year_in_GanZhi + '年' : ''}
              {lunarInfo.lunar_month_in_Chinese ? lunarInfo.lunar_month_in_Chinese + '月' : ''}
              {lunarInfo.lunar_day_in_Chinese ? lunarInfo.lunar_day_in_Chinese : ''}
            </span>
            <span className="time-value">{lunarInfo.lunar_time_Zhi}</span>
          </div>
          <div className="solar-info">
            <span className="date-label">公历：</span>
            <span className="date-value">
              {lunarInfo.solar_year ? lunarInfo.solar_year : ''}
              {lunarInfo.solar_year && lunarInfo.solar_month ? '年' : ''}
              {lunarInfo.solar_month ? lunarInfo.solar_month : ''}
              {lunarInfo.solar_month && lunarInfo.solar_day ? '月' : ''}
              {lunarInfo.solar_day ? lunarInfo.solar_day : ''}
              {lunarInfo.solar_day ? '日' : ''}
            </span>
            <span className="time-value">
              {timeData.hour ? solarTime : ''}
            </span>
          </div>
        </>
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

export default LunarTime;
