// 路径:src/components/DivinationInfo/timestamp/LunarTime.jsx 时间:2026-01-31 10:00
// 功能:农历时间输入和显示组件
import React, { useState, useEffect, useCallback, useRef } from 'react';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const prevTimeDataRef = useRef(null);
  const skipNotifyRef = useRef(false);

  useEffect(() => {
    if (confirmedTime) {
      skipNotifyRef.current = true;
      setTimeData(confirmedTime);
      skipNotifyRef.current = false;
    }
  }, [confirmedTime]);

  // 当timeData变化时，通知父组件
  useEffect(() => {
    if (!skipNotifyRef.current) {
      // 只有当timeData有实际值时才通知父组件，避免初始化时的空对象触发无限循环
      const hasValue = Object.values(timeData).some(value => value !== '');
      if (hasValue) {
        onTimeChange(timeData);
      }
    }
  }, [timeData, onTimeChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // 验证输入：只允许输入数字
    const numericValue = value.replace(/[^0-9]/g, '');
    
    // 根据字段类型进行验证和限制
    let validatedValue = numericValue;
    if (name === 'lunar_year') {
      validatedValue = numericValue.slice(0, 4);
    } else if (name === 'lunar_month') {
      validatedValue = numericValue.slice(0, 2);
    } else if (name === 'lunar_day') {
      validatedValue = numericValue.slice(0, 2);
    } else if (name === 'hour') {
      validatedValue = numericValue.slice(0, 2);
    } else if (name === 'minute') {
      validatedValue = numericValue.slice(0, 2);
    } else if (name === 'second') {
      validatedValue = numericValue.slice(0, 2);
    }
    
    setTimeData(prev => {
      const newData = {
        ...prev,
        [name]: validatedValue
      };
      
      // 当用户输入完整的年月日时，调用后端API转换为公历
      if (newData.lunar_year && newData.lunar_month && newData.lunar_day && newData.hour) {
        // 检查是否与上一次的数据相同，避免重复调用
        const prevData = prevTimeDataRef.current;
        const isSameData = prevData && 
          prevData.lunar_year === newData.lunar_year &&
          prevData.lunar_month === newData.lunar_month &&
          prevData.lunar_day === newData.lunar_day &&
          prevData.hour === newData.hour &&
          prevData.minute === newData.minute &&
          prevData.second === newData.second &&
          prevData.is_leap_month === newData.is_leap_month;
        
        if (!isSameData) {
          // 使用 setTimeout 来防抖，避免频繁请求
          setTimeout(() => {
            fetchLunarInfo(newData);
          }, 500);
          prevTimeDataRef.current = newData;
        }
      }
      
      return newData;
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // 对于年份，当失去焦点时，自动补零到4位
    if (name === 'lunar_year' && value.length > 0 && value.length < 4) {
      const paddedValue = value.padStart(4, '0');
      const newData = {
        ...timeData,
        [name]: paddedValue
      };
      setTimeData(newData);
    }
    // 对于月份，当失去焦点时，自动补零到2位并验证
    else if (name === 'lunar_month') {
      if (value.length > 0) {
        // 自动补零到2位
        const paddedValue = value.padStart(2, '0');
        
        // 验证月份值是否在1-12之间
        const monthNum = parseInt(paddedValue);
        if (monthNum < 1 || monthNum > 12) {
          // 显示弹窗提示
          setAlertMessage('月份值请输入1~12');
          setShowAlert(true);
        }
        
        const newData = {
          ...timeData,
          [name]: paddedValue
        };
        setTimeData(newData);
      }
    }
  };
  
  // 关闭弹窗
  const closeAlert = () => {
    // 根据错误信息重置对应的输入框
    let fieldToReset = '';
    if (alertMessage.includes('月份')) {
      fieldToReset = 'lunar_month';
    }
    
    if (fieldToReset) {
      const newData = {
        ...timeData,
        [fieldToReset]: ''
      };
      setTimeData(newData);
    }
    
    setShowAlert(false);
  };

  const handleLeapMonthToggle = () => {
    const newData = {
      ...timeData,
      is_leap_month: !timeData.is_leap_month
    };
    setTimeData(newData);
  };

  const handleLeapMonthKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleLeapMonthToggle();
    }
  };

  // 调用后端 API 获取农历信息
  const fetchLunarInfo = useCallback(async (data) => {
    // 验证必要的字段是否有值
    if (!data.lunar_year || !data.lunar_month || !data.lunar_day || !data.hour) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 构建 API 请求体
      const requestBody = {
        lunar_year: parseInt(data.lunar_year),
        lunar_month: parseInt(data.lunar_month),
        lunar_day: parseInt(data.lunar_day),
        hour: parseInt(data.hour),
        minute: data.minute ? parseInt(data.minute) : 0,
        second: data.second ? parseInt(data.second) : 0,
        is_leap_month: data.is_leap_month
      };

      // 发送 POST 请求到后端 API
      const response = await fetch('http://localhost:8000/api/v1/calendar/convert-from-lunar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch lunar information');
      }

      const result = await response.json();
      
      // 检查响应结构，确保包含 data 字段
      if (result.success && result.data) {
        const data = result.data;
        // 从 solar_info 中提取公历信息
        const solarInfo = data.solar_info || {};
        // 从 lunar_info 中提取农历信息
        const lunarInfo = data.lunar_info || {};
        // 更新农历信息状态
        setLunarInfo({
          lunar_year_in_GanZhi: lunarInfo.lunar_year_in_GanZhi || '',
          lunar_month_in_Chinese: lunarInfo.lunar_month_in_Chinese || '',
          lunar_day_in_Chinese: lunarInfo.lunar_day_in_Chinese || '',
          lunar_time_Zhi: lunarInfo.lunar_time_Zhi || '',
          solar_year: solarInfo.solar_year || '',
          solar_month: solarInfo.solar_month || '',
          solar_day: solarInfo.solar_day || '',
          solar_hour: solarInfo.solar_hour || '',
          solar_minute: solarInfo.solar_minute || '',
          solar_second: solarInfo.solar_second || ''
        });
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      setError('获取农历信息失败，请检查输入或网络连接');
      console.error('Error fetching lunar info:', err);
    } finally {
      setLoading(false);
    }
  }, []);



  return (
    <div className="lunar-time-container">
      {/* 农历输入区域 */}
      <div className="timestamp-inputs">
        <input 
          type="text" 
          name="lunar_year" 
          placeholder="年" 
          className="time-input" 
          value={timeData.lunar_year}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <button
          type="button"
          className={`leap-month-toggle ${timeData.is_leap_month ? 'active' : ''}`}
          onClick={handleLeapMonthToggle}
          onKeyDown={handleLeapMonthKeyDown}
          aria-pressed={timeData.is_leap_month}
          aria-label="闰月切换"
        >
          闰
        </button>
        <input 
          type="text" 
          name="lunar_month" 
          placeholder="月" 
          className="time-input" 
          value={timeData.lunar_month}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <input 
          type="text" 
          name="lunar_day" 
          placeholder="日" 
          className="time-input" 
          value={timeData.lunar_day}
          onChange={handleChange}
        />
        <input 
          type="text" 
          name="hour" 
          placeholder="时" 
          className="time-input" 
          value={timeData.hour}
          onChange={handleChange}
        />
        <input 
          type="text" 
          name="minute" 
          placeholder="分" 
          className="time-input" 
          value={timeData.minute}
          onChange={handleChange}
        />
        <input 
          type="text" 
          name="second" 
          placeholder="秒" 
          className="time-input" 
          value={timeData.second}
          onChange={handleChange}
        />
      </div>
      
      {/* 时间显示区域 */}
      <div className="timestamp-display">
        {loading ? (
          <div className="loading">加载中...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            <div className="lunar-info">
              <span className="date-label">农历：</span>
              <span className="date-value">
                {lunarInfo.lunar_year_in_GanZhi}年{lunarInfo.lunar_month_in_Chinese}月{lunarInfo.lunar_day_in_Chinese}
              </span>
              <span className="time-value">{lunarInfo.lunar_time_Zhi}时</span>
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
                {lunarInfo.solar_hour ? lunarInfo.solar_hour : ''}
                {lunarInfo.solar_hour && lunarInfo.solar_minute ? ':' : ''}
                {lunarInfo.solar_minute ? lunarInfo.solar_minute : ''}
                {lunarInfo.solar_minute && lunarInfo.solar_second ? ':' : ''}
                {lunarInfo.solar_second ? lunarInfo.solar_second : ''}
              </span>
            </div>
          </>
        )}
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
