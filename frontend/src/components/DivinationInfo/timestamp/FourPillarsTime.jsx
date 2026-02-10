// 路径:src/components/DivinationInfo/timestamp/FourPillarsTime.jsx 时间:2026-02-06 10:00
// 功能:四柱时间输入和显示组件
import React, { useState, useEffect, useRef } from 'react';
import { getTianGanList, validateYearGanInput, validateYearZhiInput, validateDayGanInput, validateDayZhiInput, validateMonthZhiInput, validateHourZhiInput, calculateMonthGan, calculateHourGan } from '../../../utils/fourPillarsUtils';
import GanZhiSelector from './GanZhiSelector';
import CalendarService from '../../../services/calendarService';

const FourPillarsTime = ({ onTimeChange, confirmedTime, onSolarListResult, selectedSolar }) => {
  const [timeData, setTimeData] = useState({
    yearGan: '',
    monthGan: '',
    dayGan: '',
    hourGan: '',
    yearZhi: '',
    monthZhi: '',
    dayZhi: '',
    hourZhi: ''
  });
  
  // 存储计算结果的状态
  const [solarListResult, setSolarListResult] = useState(null);
  
  // 公历信息状态
  const [solarDate, setSolarDate] = useState('');
  const [solarTime, setSolarTime] = useState('');
  
  // 农历信息状态
  const [lunarDate, setLunarDate] = useState('');
  const [lunarTime, setLunarTime] = useState('');
  
  const skipNotifyRef = useRef(false);
  
  // 菜单相关状态
  const [showGanMenu, setShowGanMenu] = useState(false);
  const [showZhiMenu, setShowZhiMenu] = useState(false);
  const [ganMenuPosition, setGanMenuPosition] = useState({ top: 0, left: 0 });
  const [zhiMenuPosition, setZhiMenuPosition] = useState({ top: 0, left: 0 });
  const [currentFocus, setCurrentFocus] = useState('yearGan'); // 跟踪当前焦点的输入框
  const yearGanRef = useRef(null);
  const dayGanRef = useRef(null);
  const yearZhiRef = useRef(null);
  const dayZhiRef = useRef(null);
  const monthZhiRef = useRef(null); // 添加月支输入框的引用
  const hourZhiRef = useRef(null); // 添加时支输入框的引用
  const containerRef = useRef(null);
  const ganMenuRef = useRef(null); // 添加天干菜单的引用
  const zhiMenuRef = useRef(null); // 添加地支菜单的引用
  
  // 获取天干列表
  const tianGan = getTianGanList();

  // 处理confirmedTime变化
  useEffect(() => {
    console.log('FourPillarsTime - confirmedTime变化:', confirmedTime);
    if (confirmedTime) {
      skipNotifyRef.current = true;
      setTimeData({
        yearGan: confirmedTime.yearGan || confirmedTime.yearPillar || '',
        monthGan: confirmedTime.monthGan || confirmedTime.monthPillar || '',
        dayGan: confirmedTime.dayGan || confirmedTime.dayPillar || '',
        hourGan: confirmedTime.hourGan || confirmedTime.hourPillar || '',
        yearZhi: confirmedTime.yearZhi || confirmedTime.yearPillar2 || '',
        monthZhi: confirmedTime.monthZhi || confirmedTime.monthPillar2 || '',
        dayZhi: confirmedTime.dayZhi || confirmedTime.dayPillar2 || '',
        hourZhi: confirmedTime.hourZhi || confirmedTime.hourPillar2 || ''
      });
      skipNotifyRef.current = false;
      console.log('FourPillarsTime - 已更新timeData');
    }
  }, [confirmedTime]);
  
  // 监听年干和月支变化，自动计算月干
  useEffect(() => {
    if (timeData.yearGan && timeData.monthZhi) {
      const monthGan = calculateMonthGan(timeData.yearGan, timeData.monthZhi);
      setTimeData(prev => {
        if (prev.monthGan !== monthGan) {
          return {
            ...prev,
            monthGan
          };
        }
        return prev;
      });
    } else {
      // 当年干或月支不存在时，清空月干
      setTimeData(prev => {
        if (prev.monthGan !== '') {
          return {
            ...prev,
            monthGan: ''
          };
        }
        return prev;
      });
    }
  }, [timeData.yearGan, timeData.monthZhi]);
  
  // 监听日干和时支变化，自动计算时干
  useEffect(() => {
    if (timeData.dayGan && timeData.hourZhi) {
      const hourGan = calculateHourGan(timeData.dayGan, timeData.hourZhi);
      setTimeData(prev => {
        if (prev.hourGan !== hourGan) {
          return {
            ...prev,
            hourGan
          };
        }
        return prev;
      });
    } else {
      // 当日干或时支不存在时，清空时干
      setTimeData(prev => {
        if (prev.hourGan !== '') {
          return {
            ...prev,
            hourGan: ''
          };
        }
        return prev;
      });
    }
  }, [timeData.dayGan, timeData.hourZhi]);
  
  // 监听 timeData 变化，调用 onTimeChange 回调
  useEffect(() => {
    // 组件挂载时跳过首次调用，避免传递空数据
    if (!skipNotifyRef.current && (Object.values(timeData).some(value => value !== ''))) {
      console.log('FourPillarsTime - 调用 onTimeChange:', timeData);
      onTimeChange(timeData);
    } else {
      console.log('FourPillarsTime - 跳过 onTimeChange 调用');
    }
  }, [timeData, onTimeChange]);
  
  // 监听 timeData 变化，当四柱值输入完整时计算阳历列表
  useEffect(() => {
    // 检查四柱值是否完整
    const isComplete = timeData.yearGan && timeData.yearZhi && timeData.monthGan && timeData.monthZhi && timeData.dayGan && timeData.dayZhi && timeData.hourGan && timeData.hourZhi;
    
    if (isComplete) {
      console.log('FourPillarsTime - 四柱值完整，开始计算阳历列表:', timeData);
      
      // 构建八字四柱字符串
      const yearGanZhi = timeData.yearGan + timeData.yearZhi;
      const monthGanZhi = timeData.monthGan + timeData.monthZhi;
      const dayGanZhi = timeData.dayGan + timeData.dayZhi;
      const timeGanZhi = timeData.hourGan + timeData.hourZhi;
      
      // 调用 CalendarService.getSolarListByBaZi 方法计算结果
      const result = CalendarService.getSolarListByBaZi(yearGanZhi, monthGanZhi, dayGanZhi, timeGanZhi);
      console.log('FourPillarsTime - 计算结果:', result);
      
      // 更新结果状态
      setSolarListResult(result);
      
      // 调用回调函数，将结果传递给父组件
      if (onSolarListResult) {
        onSolarListResult(result);
      }
    } else {
      // 四柱值不完整时清空结果
      setSolarListResult(null);
      
      // 调用回调函数，通知父组件清空结果
      if (onSolarListResult) {
        onSolarListResult(null);
      }
    }
  }, [timeData]);
  
  // 处理选中结果，转换为公历和农历显示
  useEffect(() => {
    if (selectedSolar) {
      console.log('FourPillarsTime - 选中的公历结果:', selectedSolar);
      
      // 构建公历日期字符串
      const solarDateString = `${selectedSolar.year.toString().padStart(4, '0')}年${selectedSolar.month.toString().padStart(2, '0')}月${selectedSolar.day.toString().padStart(2, '0')}日`;
      // 构建公历时间字符串
      const solarTimeString = `${selectedSolar.hour.toString().padStart(2, '0')}:${selectedSolar.minute.toString().padStart(2, '0')}:${selectedSolar.second.toString().padStart(2, '0')}`;
      
      // 更新公历信息
      setSolarDate(solarDateString);
      setSolarTime(solarTimeString);
      
      // 调用 CalendarService.convertSolarToLunar 方法转换
      const result = CalendarService.convertSolarToLunar({
        year: selectedSolar.year,
        month: selectedSolar.month,
        day: selectedSolar.day,
        hour: selectedSolar.hour,
        minute: selectedSolar.minute,
        second: selectedSolar.second
      });
      
      if (result.success && result.data) {
        console.log('FourPillarsTime - 转换结果:', result.data);
        
        // 构建农历日期字符串
        let lunarDateString = '';
        if (result.data.lunar_year_in_GanZhi) {
          lunarDateString += result.data.lunar_year_in_GanZhi + '年';
        }
        if (result.data.lunar_month_in_Chinese) {
          lunarDateString += result.data.lunar_month_in_Chinese + '月';
        }
        if (result.data.lunar_day_in_Chinese) {
          lunarDateString += result.data.lunar_day_in_Chinese;
        }
        
        // 构建时辰字符串
        let lunarTimeString = '';
        if (selectedSolar.hour !== null && result.data.lunar_time_Zhi) {
          if (result.data.lunar_time_Zhi === '子') {
            const hourNum = parseInt(selectedSolar.hour);
            const minuteNum = parseInt(selectedSolar.minute || 0);
            const secondNum = parseInt(selectedSolar.second || 0);
            if (hourNum === 23 && (minuteNum > 0 || secondNum > 0)) {
              lunarTimeString = '晚子时';
            } else if (hourNum === 23 && minuteNum === 0 && secondNum === 0) {
              lunarTimeString = '晚子时';
            } else if (hourNum === 0) {
              lunarTimeString = '早子时';
            } else {
              lunarTimeString = `${result.data.lunar_time_Zhi}时`;
            }
          } else {
            lunarTimeString = `${result.data.lunar_time_Zhi}时`;
          }
        }
        
        // 更新农历信息
        setLunarDate(lunarDateString);
        setLunarTime(lunarTimeString);
      } else {
        console.error('FourPillarsTime - 转换失败:', result.error);
        // 清空农历信息
        setLunarDate('');
        setLunarTime('');
      }
    } else {
      // 没有选中结果时，清空所有信息
      setLunarDate('');
      setLunarTime('');
      setSolarDate('');
      setSolarTime('');
    }
  }, [selectedSolar]);
  
  // 添加点击其他区域隐藏菜单的功能
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 检查点击的目标是否在菜单或输入框之外
      
      // 检查是否点击在所有输入框之外
      const isClickOutsideInputs = (
        (yearGanRef.current && !yearGanRef.current.contains(event.target)) &&
        (dayGanRef.current && !dayGanRef.current.contains(event.target)) &&
        (yearZhiRef.current && !yearZhiRef.current.contains(event.target)) &&
        (dayZhiRef.current && !dayZhiRef.current.contains(event.target)) &&
        (monthZhiRef.current && !monthZhiRef.current.contains(event.target)) &&
        (hourZhiRef.current && !hourZhiRef.current.contains(event.target))
      );
      
      // 检查是否点击在所有菜单之外
      const isClickOutsideMenus = (
        (!showGanMenu || (ganMenuRef.current && !ganMenuRef.current.contains(event.target))) &&
        (!showZhiMenu || (zhiMenuRef.current && !zhiMenuRef.current.contains(event.target)))
      );
      
      // 如果点击在所有输入框和菜单之外，则隐藏所有菜单
      if (isClickOutsideInputs && isClickOutsideMenus) {
        setShowGanMenu(false);
        setShowZhiMenu(false);
      }
    };
    
    // 添加全局点击事件监听器
    document.addEventListener('mousedown', handleClickOutside);
    
    // 清理事件监听器
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showGanMenu, showZhiMenu]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // 只处理单个字符的输入
    if (value.length > 1) {
      return;
    }
    
    setTimeData(prev => {
      // 验证输入值是否符合限制条件
      let isValid = true;
      if (name === 'yearGan') {
        isValid = validateYearGanInput(value, prev.yearZhi);
      } else if (name === 'yearZhi') {
        isValid = validateYearZhiInput(value, prev.yearGan);
      } else if (name === 'dayGan') {
        isValid = validateDayGanInput(value, prev.dayZhi);
      } else if (name === 'dayZhi') {
        isValid = validateDayZhiInput(value, prev.dayGan);
      } else if (name === 'monthZhi') {
        isValid = validateMonthZhiInput(value);
      } else if (name === 'hourZhi') {
        isValid = validateHourZhiInput(value);
      }
      
      if (!isValid) {
        return prev;
      }
      
      return {
        ...prev,
        [name]: value
      };
    });
  };
  
  // 计算菜单位置，使其水平居中
  const calculateMenuPosition = (inputElement, menuType = 'gan') => {
    const rect = inputElement.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    // 计算水平居中位置
    const containerCenter = containerRect ? containerRect.left + containerRect.width / 2 : rect.left + rect.width / 2;
    
    // 根据菜单类型设置不同的垂直偏移量
    const verticalOffset = menuType === 'zhi' ? +34 : -40; // 地支菜单向下移动
    
    return {
      top: rect.top + window.scrollY + verticalOffset,
      left: containerCenter,
      transform: 'translateX(-50%)' // 使用transform使菜单自身水平居中
    };
  };
  
  // 处理年干输入框获取焦点
  const handleYearGanFocus = (e) => {
    setCurrentFocus('yearGan');
    // 当年支为空时，显示天干菜单
    if (!timeData.yearZhi) {
      const inputElement = e.target;
      setGanMenuPosition(calculateMenuPosition(inputElement, 'gan'));
      setShowGanMenu(true);
      setShowZhiMenu(false);
    } else if (['子', '寅', '辰', '午', '申', '戌'].includes(timeData.yearZhi)) {
      // 当年支为阳支时，显示阳干菜单
      const inputElement = e.target;
      setGanMenuPosition(calculateMenuPosition(inputElement, 'gan'));
      setShowGanMenu(true);
      setShowZhiMenu(false);
    } else if (['丑', '卯', '巳', '未', '酉', '亥'].includes(timeData.yearZhi)) {
      // 当年支为阴支时，显示阴干菜单
      const inputElement = e.target;
      setGanMenuPosition(calculateMenuPosition(inputElement, 'gan'));
      setShowGanMenu(true);
      setShowZhiMenu(false);
    }
  };
  
  // 处理年干输入框失去焦点
  const handleYearGanBlur = () => {
    // 菜单不再在这里隐藏，而是通过点击其他区域隐藏
  };
  
  // 处理年支输入框获取焦点
  const handleYearZhiFocus = (e) => {
    setCurrentFocus('yearZhi');
    // 当年干为空时，显示地支菜单
    if (!timeData.yearGan) {
      const inputElement = e.target;
      setZhiMenuPosition(calculateMenuPosition(inputElement, 'zhi'));
      setShowZhiMenu(true);
      setShowGanMenu(false);
    } else if (['甲', '丙', '戊', '庚', '壬'].includes(timeData.yearGan)) {
      // 当年干为阳干时，显示阳支菜单
      const inputElement = e.target;
      setZhiMenuPosition(calculateMenuPosition(inputElement, 'zhi'));
      setShowZhiMenu(true);
      setShowGanMenu(false);
    } else if (['乙', '丁', '己', '辛', '癸'].includes(timeData.yearGan)) {
      // 当年干为阴干时，显示阴支菜单
      const inputElement = e.target;
      setZhiMenuPosition(calculateMenuPosition(inputElement, 'zhi'));
      setShowZhiMenu(true);
      setShowGanMenu(false);
    }
  };
  
  // 处理年支输入框失去焦点
  const handleYearZhiBlur = () => {
    // 菜单不再在这里隐藏，而是通过点击其他区域隐藏
  };
  
  // 处理月支输入框获取焦点
  const handleMonthZhiFocus = (e) => {
    setCurrentFocus('monthZhi');
    // 显示四季地支菜单
    const inputElement = e.target;
    setZhiMenuPosition(calculateMenuPosition(inputElement, 'zhi'));
    setShowZhiMenu(true);
    setShowGanMenu(false);
  };
  
  // 处理月支输入框失去焦点
  const handleMonthZhiBlur = () => {
    // 菜单不再在这里隐藏，而是通过点击其他区域隐藏
  };
  
  // 处理日干输入框获取焦点
  const handleDayGanFocus = (e) => {
    setCurrentFocus('dayGan');
    // 当日支为空时，显示天干菜单
    if (!timeData.dayZhi) {
      const inputElement = e.target;
      setGanMenuPosition(calculateMenuPosition(inputElement, 'gan'));
      setShowGanMenu(true);
      setShowZhiMenu(false);
    } else if (['子', '寅', '辰', '午', '申', '戌'].includes(timeData.dayZhi)) {
      // 当日支为阳支时，显示阳干菜单
      const inputElement = e.target;
      setGanMenuPosition(calculateMenuPosition(inputElement, 'gan'));
      setShowGanMenu(true);
      setShowZhiMenu(false);
    } else if (['丑', '卯', '巳', '未', '酉', '亥'].includes(timeData.dayZhi)) {
      // 当日支为阴支时，显示阴干菜单
      const inputElement = e.target;
      setGanMenuPosition(calculateMenuPosition(inputElement, 'gan'));
      setShowGanMenu(true);
      setShowZhiMenu(false);
    }
  };
  
  // 处理日干输入框失去焦点
  const handleDayGanBlur = () => {
    // 菜单不再在这里隐藏，而是通过点击其他区域隐藏
  };
  
  // 处理日支输入框获取焦点
  const handleDayZhiFocus = (e) => {
    setCurrentFocus('dayZhi');
    // 当日干为空时，显示地支菜单
    if (!timeData.dayGan) {
      const inputElement = e.target;
      setZhiMenuPosition(calculateMenuPosition(inputElement, 'zhi'));
      setShowZhiMenu(true);
      setShowGanMenu(false);
    } else if (['甲', '丙', '戊', '庚', '壬'].includes(timeData.dayGan)) {
      // 当日干为阳干时，显示阳支菜单
      const inputElement = e.target;
      setZhiMenuPosition(calculateMenuPosition(inputElement, 'zhi'));
      setShowZhiMenu(true);
      setShowGanMenu(false);
    } else if (['乙', '丁', '己', '辛', '癸'].includes(timeData.dayGan)) {
      // 当日干为阴干时，显示阴支菜单
      const inputElement = e.target;
      setZhiMenuPosition(calculateMenuPosition(inputElement, 'zhi'));
      setShowZhiMenu(true);
      setShowGanMenu(false);
    }
  };
  
  // 处理日支输入框失去焦点
  const handleDayZhiBlur = () => {
    // 菜单不再在这里隐藏，而是通过点击其他区域隐藏
  };
  
  // 处理时支输入框获取焦点
  const handleHourZhiFocus = (e) => {
    setCurrentFocus('hourZhi');
    // 显示顺序地支菜单
    const inputElement = e.target;
    setZhiMenuPosition(calculateMenuPosition(inputElement, 'zhi'));
    setShowZhiMenu(true);
    setShowGanMenu(false);
  };
  
  // 处理时支输入框失去焦点
  const handleHourZhiBlur = () => {
    // 菜单不再在这里隐藏，而是通过点击其他区域隐藏
  };
  
  // 处理菜单选择
  const handleGanSelect = (gan) => {
    setTimeData(prev => {
      return {
        ...prev,
        [currentFocus]: gan
      };
    });
    setShowGanMenu(false); // 选择后关闭菜单
  };
  
  // 处理地支菜单选择
  const handleZhiSelect = (zhi) => {
    setTimeData(prev => {
      return {
        ...prev,
        [currentFocus]: zhi
      };
    });
    setShowZhiMenu(false); // 选择后关闭菜单
  };
  
  // 处理菜单关闭
  const handleGanMenuClose = () => {
    setShowGanMenu(false);
  };
  
  // 处理地支菜单关闭
  const handleZhiMenuClose = () => {
    setShowZhiMenu(false);
  };
  
  // 处理输入框双击清空
  const handleDoubleClick = (e) => {
    const { name } = e.target;
    setTimeData(prev => {
      return {
        ...prev,
        [name]: ''
      };
    });
  };

  return (
    <div className="four-pillars-time-container" ref={containerRef}>
      {/* 四柱输入区域 */}
      <div className="timestamp-inputs tiangan-inputs">
        <input 
          ref={yearGanRef}
          type="text" 
          name="yearGan" 
          placeholder="年" 
          className="time-input" 
          value={timeData.yearGan}
          onChange={handleChange}
          onFocus={handleYearGanFocus}
          onBlur={handleYearGanBlur}
          onDoubleClick={handleDoubleClick}
        />
        <input 
          type="text" 
          name="monthGan" 
          placeholder="月" 
          className="time-input" 
          value={timeData.monthGan}
          onChange={handleChange}
          onDoubleClick={handleDoubleClick}
          disabled // 禁用月干输入，由程序自动计算
        />
        <input 
          ref={dayGanRef}
          type="text" 
          name="dayGan" 
          placeholder="日" 
          className="time-input" 
          value={timeData.dayGan}
          onChange={handleChange}
          onFocus={handleDayGanFocus}
          onBlur={handleDayGanBlur}
          onDoubleClick={handleDoubleClick}
        />
        <input 
          type="text" 
          name="hourGan" 
          placeholder="时" 
          className="time-input" 
          value={timeData.hourGan}
          onChange={handleChange}
          onDoubleClick={handleDoubleClick}
          disabled // 禁用时干输入，由程序自动计算
        />
      </div>
      <div className="timestamp-inputs dizhi-inputs">
        <input 
          ref={yearZhiRef}
          type="text" 
          name="yearZhi" 
          placeholder="年" 
          className="time-input" 
          value={timeData.yearZhi}
          onChange={handleChange}
          onFocus={handleYearZhiFocus}
          onBlur={handleYearZhiBlur}
          onDoubleClick={handleDoubleClick}
        />
        <input 
          ref={monthZhiRef}
          type="text" 
          name="monthZhi" 
          placeholder="月" 
          className="time-input" 
          value={timeData.monthZhi}
          onChange={handleChange}
          onFocus={handleMonthZhiFocus}
          onBlur={handleMonthZhiBlur}
          onDoubleClick={handleDoubleClick}
        />
        <input 
          ref={dayZhiRef}
          type="text" 
          name="dayZhi" 
          placeholder="日" 
          className="time-input" 
          value={timeData.dayZhi}
          onChange={handleChange}
          onFocus={handleDayZhiFocus}
          onBlur={handleDayZhiBlur}
          onDoubleClick={handleDoubleClick}
        />
        <input 
          ref={hourZhiRef}
          type="text" 
          name="hourZhi" 
          placeholder="时" 
          className="time-input" 
          value={timeData.hourZhi}
          onChange={handleChange}
          onFocus={handleHourZhiFocus}
          onBlur={handleHourZhiBlur}
          onDoubleClick={handleDoubleClick}
        />
      </div>
      
      {/* 天干选择菜单 */}
      <div ref={ganMenuRef}>
        <GanZhiSelector
          isVisible={showGanMenu}
          onSelect={handleGanSelect}
          onClose={handleGanMenuClose}
          position={ganMenuPosition}
          menuType={currentFocus === 'yearGan' ? 
            (timeData.yearZhi ? (['子', '寅', '辰', '午', '申', '戌'].includes(timeData.yearZhi) ? "TIANGAN_YANG" : "TIANGAN_YIN") : "TIANGAN") : 
            (timeData.dayZhi ? (['子', '寅', '辰', '午', '申', '戌'].includes(timeData.dayZhi) ? "TIANGAN_YANG" : "TIANGAN_YIN") : "TIANGAN")
          }
        />
      </div>
      
      {/* 地支选择菜单 */}
      <div ref={zhiMenuRef}>
        <GanZhiSelector
          isVisible={showZhiMenu}
          onSelect={handleZhiSelect}
          onClose={handleZhiMenuClose}
          position={zhiMenuPosition}
          menuType={currentFocus === 'yearZhi' ? 
            (timeData.yearGan ? (['甲', '丙', '戊', '庚', '壬'].includes(timeData.yearGan) ? "DIZHI_YANG" : "DIZHI_YIN") : "DIZHI_ORDERED") : 
            (currentFocus === 'monthZhi' ? "DIZHI_SEASONAL" : 
            (currentFocus === 'hourZhi' ? "DIZHI_ORDERED" : 
            (timeData.dayGan ? (['甲', '丙', '戊', '庚', '壬'].includes(timeData.dayGan) ? "DIZHI_YANG" : "DIZHI_YIN") : "DIZHI_ORDERED")))
          }
        />
      </div>
      
      {/* 时间显示区域 */}
      <div className="timestamp-display">
        <div className="solar-info">
          <span className="solar-label">公历：</span>
          <span className="date-value">{solarDate}</span>
          <span className="time-value">
            {selectedSolar ? solarTime : ''}
          </span>
        </div>
        <div className="lunar-info">
          <span className="date-label">农历：</span>
          <span className="date-value">{lunarDate}</span>
          <span className="time-value">{lunarTime}</span>
        </div>
      </div>
    </div>
  );
};

export default FourPillarsTime;