// 路径:src/components/DivinationInfo/timestamp/GregorianTime.jsx 时间:2026-01-30 10:00
// 功能:公历时间输入和显示组件
import React, { useState, useEffect, useRef, useCallback } from 'react';

const GregorianTime = ({ onTimeChange, confirmedTime }) => {
  const [timeData, setTimeData] = useState({
    year: '',
    month: '',
    day: '',
    hour: '',
    minute: '',
    second: ''
  });
  
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

  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [lunarDate, setLunarDate] = useState('');
  const [lunarTime, setLunarTime] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const updateCurrentTimeDisplay = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');

    setCurrentDate(`${year}年${month}月${day}日`);
    setCurrentTime(`${hour}:${minute}:${second}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // 验证输入：只允许输入数字
    const numericValue = value.replace(/[^0-9]/g, '');
    
    // 根据字段类型进行验证和限制
    let validatedValue = numericValue;
    if (name === 'year') {
      validatedValue = numericValue.slice(0, 4);
    } else if (name === 'month') {
      // 月份限制长度为1-2个数字
      validatedValue = numericValue.slice(0, 2);
    } else if (name === 'day') {
      // 日期限制长度为1-2个数字
      validatedValue = numericValue.slice(0, 2);
    } else if (name === 'hour') {
      // 小时限制长度为1-2个数字，且值在0-23之间
      validatedValue = numericValue.slice(0, 2);
    } else if (name === 'minute') {
      // 分钟限制长度为1-2个数字，且值在0-59之间
      validatedValue = numericValue.slice(0, 2);
    } else if (name === 'second') {
      // 秒限制长度为1-2个数字，且值在0-59之间
      validatedValue = numericValue.slice(0, 2);
    }
    
    setTimeData(prev => {
      const newData = {
        ...prev,
        [name]: validatedValue
      };
      
      // 如果修改了年份或月份，验证日期是否有效
      if ((name === 'year' || name === 'month') && newData.day) {
        const maxDays = getDaysInMonth(newData.year, newData.month);
        const dayNum = parseInt(newData.day);
        if (dayNum > maxDays) {
          // 日期超过当月天数，重置为空
          newData.day = '';
        }
      }
      
      // 当用户输入完整的年月日时，调用后端API转换为农历
      if (newData.year && newData.month && newData.day) {
        convertToLunar(newData);
      }
      
      return newData;
    });
  };
  
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // 对于年份，当失去焦点时，自动补零到4位
    if (name === 'year' && value.length > 0 && value.length < 4) {
      const paddedValue = value.padStart(4, '0');
      setTimeData(prev => {
        const newData = {
          ...prev,
          [name]: paddedValue
        };
        return newData;
      });
    } 
    // 对于月份，当失去焦点时，自动补零到2位并验证
    else if (name === 'month') {
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
        
        setTimeData(prev => {
          const newData = {
            ...prev,
            [name]: paddedValue
          };
          return newData;
        });
      }
    } 
    // 对于日期，当失去焦点时，自动补零到2位并验证
    else if (name === 'day') {
      if (value.length > 0) {
        // 自动补零到2位
        const paddedValue = value.padStart(2, '0');
        
        // 计算当前年月的天数
        const maxDays = getDaysInMonth(timeData.year, timeData.month);
        
        // 验证日期值是否在1-maxDays之间
        const dayNum = parseInt(paddedValue);
        if (dayNum < 1 || dayNum > maxDays) {
          // 显示弹窗提示
          setAlertMessage(`日期值请输入1~${maxDays}`);
          setShowAlert(true);
        }
        
        setTimeData(prev => {
          const newData = {
            ...prev,
            [name]: paddedValue
          };
          return newData;
        });
      }
    }
    // 对于小时，当失去焦点时，自动补零到2位并验证
    else if (name === 'hour') {
      if (value.length > 0) {
        // 自动补零到2位
        const paddedValue = value.padStart(2, '0');
        
        // 验证小时值是否在0-23之间
        const hourNum = parseInt(paddedValue);
        if (hourNum < 0 || hourNum > 23) {
          // 显示弹窗提示
          setAlertMessage('小时值请输入0~23');
          setShowAlert(true);
        }
        
        setTimeData(prev => {
          const newData = {
            ...prev,
            [name]: paddedValue
          };
          return newData;
        });
      }
    }
    // 对于分钟，当失去焦点时，自动补零到2位并验证
    else if (name === 'minute') {
      if (value.length > 0) {
        // 自动补零到2位
        const paddedValue = value.padStart(2, '0');
        
        // 验证分钟值是否在0-59之间
        const minuteNum = parseInt(paddedValue);
        if (minuteNum < 0 || minuteNum > 59) {
          // 显示弹窗提示
          setAlertMessage('分钟值请输入0~59');
          setShowAlert(true);
        }
        
        setTimeData(prev => {
          const newData = {
            ...prev,
            [name]: paddedValue
          };
          return newData;
        });
      }
    }
    // 对于秒，当失去焦点时，自动补零到2位并验证
    else if (name === 'second') {
      if (value.length > 0) {
        // 自动补零到2位
        const paddedValue = value.padStart(2, '0');
        
        // 验证秒值是否在0-59之间
        const secondNum = parseInt(paddedValue);
        if (secondNum < 0 || secondNum > 59) {
          // 显示弹窗提示
          setAlertMessage('秒值请输入0~59');
          setShowAlert(true);
        }
        
        setTimeData(prev => {
          const newData = {
            ...prev,
            [name]: paddedValue
          };
          return newData;
        });
      }
    }
  };
  
  // 关闭弹窗
  // 计算给定年月的天数
  const getDaysInMonth = (year, month) => {
    if (!year || !month) return 31; // 默认值
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    return new Date(yearNum, monthNum, 0).getDate();
  };

  // 关闭弹窗
  const closeAlert = () => {
    // 根据错误信息重置对应的输入框
    let fieldToReset = '';
    if (alertMessage.includes('月份')) {
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
    }
    
    setShowAlert(false);
  };
  
  // 调用后端API将公历时间转换为农历
  const convertToLunar = useCallback(async (timeData) => {
    try {
      // 验证输入数据
      const year = parseInt(timeData.year);
      const month = parseInt(timeData.month);
      const day = parseInt(timeData.day);
      const hour = parseInt(timeData.hour || 0);
      const minute = parseInt(timeData.minute || 0);
      const second = parseInt(timeData.second || 0);
      
      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return;
      }
      
      // 调用后端API
      const response = await fetch('http://localhost:8000/api/v1/calendar/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          year,
          month,
          day,
          hour,
          minute,
          second
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          // 构建农历日期字符串
          let lunarDateString = '';
          
          // 提取农历年信息
          if (result.data.lunar_info && result.data.lunar_info.lunar_year_in_GanZhi) {
            lunarDateString += result.data.lunar_info.lunar_year_in_GanZhi + '年';
          }
          
          // 提取农历月信息
          if (result.data.lunar_info && result.data.lunar_info.lunar_month_in_Chinese) {
            lunarDateString += result.data.lunar_info.lunar_month_in_Chinese + '月';
          }
          
          // 提取农历日信息
          if (result.data.lunar_info && result.data.lunar_info.lunar_day_in_Chinese) {
            lunarDateString += result.data.lunar_info.lunar_day_in_Chinese;
          }
          
          // 构建时辰字符串
          let lunarTimeString = '';
          if (result.data.lunar_info && result.data.lunar_info.lunar_time_Zhi) {
            lunarTimeString = `${result.data.lunar_info.lunar_time_Zhi}时`;
          }
          
          // 更新农历信息
          setLunarDate(lunarDateString || '');
          setLunarTime(lunarTimeString || '');
        }
      }
    } catch (error) {
      console.error('转换为农历失败:', error);
      // 错误时保持默认值
    }
  }, []);

  return (
    <div className="gregorian-time-container">
      {/* 时间输入区域 */}
      <div className="timestamp-inputs">
        <input 
          type="text" 
          name="year" 
          placeholder="年" 
          className="time-input" 
          value={timeData.year}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <input 
          type="text" 
          name="month" 
          placeholder="月" 
          className="time-input"
          value={timeData.month}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <input 
          type="text" 
          name="day" 
          placeholder="日" 
          className="time-input"
          value={timeData.day}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <input 
          type="text" 
          name="hour" 
          placeholder="时" 
          className="time-input" 
          value={timeData.hour}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <input 
          type="text" 
          name="minute" 
          placeholder="分" 
          className="time-input" 
          value={timeData.minute}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <input 
          type="text" 
          name="second" 
          placeholder="秒" 
          className="time-input" 
          value={timeData.second}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
      
      {/* 时间显示区域 */}
      <div className="timestamp-display">
        <div className="solar-info">
          <span className="solar-label">公历：</span>
          <span className="date-value">
            {timeData.year ? timeData.year : ''}
            {timeData.year && timeData.month ? '年' : ''}
            {timeData.month ? timeData.month : ''}
            {timeData.month && timeData.day ? '月' : ''}
            {timeData.day ? timeData.day : ''}
            {timeData.day ? '日' : ''}
          </span>
          <span className="time-value">
            {timeData.hour ? timeData.hour : ''}
            {timeData.hour && timeData.minute ? ':' : ''}
            {timeData.minute ? timeData.minute : ''}
            {timeData.minute && timeData.second ? ':' : ''}
            {timeData.second ? timeData.second : ''}
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
