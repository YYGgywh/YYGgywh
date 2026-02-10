// 路径:src/components/DivinationInfo/timestamp/TimestampModal.jsx 时间:2026-01-30 11:00
// 功能:时间戳设置弹窗主组件，管理选项卡状态和协调三个时间组件
import React, { useState, useEffect, useCallback } from 'react';
import GregorianTime from './GregorianTime';
import LunarTime from './LunarTime';
import FourPillarsTime from './FourPillarsTime';

const TimestampModal = ({ onClose, onSubmit }) => {
  const [activeTab, setActiveTab] = useState('gregorian');
  const [selectedTime, setSelectedTime] = useState({
    gregorian: null,
    lunar: null,
    'four-pillars': null
  });
  const [confirmedTime, setConfirmedTime] = useState({
    gregorian: null,
    lunar: null,
    'four-pillars': null
  });
  const [isConfirmDisabled, setIsConfirmDisabled] = useState(true);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isInitializeDisabled, setIsInitializeDisabled] = useState(true);// 存储四柱计算结果
  const [solarListResult, setSolarListResult] = useState(null);
  const [selectedSolarIndex, setSelectedSolarIndex] = useState(null);
  const [selectedSolar, setSelectedSolar] = useState(null);

  const handleTabChange = (tab) => {
    console.log('TimestampModal - 切换选项卡:', tab);
    setActiveTab(tab);
    
    // 根据目标选项卡类型创建初始空状态
    let initialTime = {};
    
    if (tab === 'gregorian') {
      // 公历选项卡
      initialTime = {
        year: '',
        month: '',
        day: '',
        hour: '',
        minute: '',
        second: ''
      };
    } else if (tab === 'lunar') {
      // 农历选项卡
      initialTime = {
        lunar_year: '',
        lunar_month: '',
        lunar_day: '',
        hour: '',
        minute: '',
        second: '',
        is_leap_month: false
      };
    } else if (tab === 'four-pillars') {
      // 四柱选项卡
      initialTime = {
        yearGan: '',
        monthGan: '',
        dayGan: '',
        hourGan: '',
        yearZhi: '',
        monthZhi: '',
        dayZhi: '',
        hourZhi: ''
      };
    }
    
    // 初始化目标选项卡的 selectedTime 和 confirmedTime
    setSelectedTime(prev => ({
      ...prev,
      [tab]: initialTime
    }));
    
    setConfirmedTime(prev => ({
      ...prev,
      [tab]: initialTime
    }));
    
    // 如果切换到四柱选项卡，清空相关状态
    if (tab === 'four-pillars') {
      setSolarListResult(null);
      setSelectedSolarIndex(null);
      setSelectedSolar(null);
    }
  };

  // 为每个选项卡创建单独的useCallback函数，避免使用箭头函数传递参数
  const handleGregorianTimeChange = useCallback((timeData) => {
    setSelectedTime(prev => ({
      ...prev,
      gregorian: timeData
    }));
  }, []);

  const handleLunarTimeChange = useCallback((timeData) => {
    setSelectedTime(prev => ({
      ...prev,
      lunar: timeData
    }));
  }, []);

  const handleFourPillarsTimeChange = useCallback((timeData) => {
    console.log('TimestampModal - 接收到四柱数据:', timeData);
    setSelectedTime(prev => ({
      ...prev,
      'four-pillars': timeData
    }));
  }, []);

  const handleSolarListResult = useCallback((result) => {
    console.log('TimestampModal - 接收到四柱计算结果:', result);
    setSolarListResult(result);
    setSelectedSolarIndex(null);
    setSelectedSolar(null);
  }, []);

  const handleResultItemClick = useCallback((solar, index) => {
    console.log('TimestampModal - 选中结果:', solar, '索引:', index);
    setSelectedSolarIndex(index);
    setSelectedSolar(solar);
  }, []);

  useEffect(() => {
    const currentTime = selectedTime[activeTab];
    console.log('TimestampModal - 检查currentTime:', currentTime, 'activeTab:', activeTab);
    // 检查currentTime是否存在，包括空对象
    if (currentTime !== null && currentTime !== undefined) {
      let hasAllFields = false;
      let hasAnyValidValue = false;
      
      // 根据当前选项卡类型检查不同的字段
      if (activeTab === 'gregorian') {
        // 公历选项卡
        hasAllFields = currentTime.year && currentTime.month && currentTime.day && currentTime.hour && currentTime.minute && currentTime.second;
        hasAnyValidValue = Boolean(currentTime.year && currentTime.year !== '') || 
                          Boolean(currentTime.month && currentTime.month !== '') || 
                          Boolean(currentTime.day && currentTime.day !== '') || 
                          Boolean(currentTime.hour && currentTime.hour !== '') || 
                          Boolean(currentTime.minute && currentTime.minute !== '') || 
                          Boolean(currentTime.second && currentTime.second !== '');
      } else if (activeTab === 'lunar') {
        // 农历选项卡
        hasAllFields = currentTime.lunar_year && currentTime.lunar_month && currentTime.lunar_day && currentTime.hour && currentTime.minute && currentTime.second;
        hasAnyValidValue = Boolean(currentTime.lunar_year && currentTime.lunar_year !== '') || 
                          Boolean(currentTime.lunar_month && currentTime.lunar_month !== '') || 
                          Boolean(currentTime.lunar_day && currentTime.lunar_day !== '') || 
                          Boolean(currentTime.hour && currentTime.hour !== '') || 
                          Boolean(currentTime.minute && currentTime.minute !== '') || 
                          Boolean(currentTime.second && currentTime.second !== '');
      } else if (activeTab === 'four-pillars') {
        // 四柱选项卡
        hasAllFields = currentTime.yearGan && currentTime.monthZhi && currentTime.dayGan && currentTime.dayZhi && currentTime.hourZhi;
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
        hasAnyValidValue = Boolean((currentTime.yearGan && currentTime.yearGan !== '')) || 
                          Boolean((currentTime.yearZhi && currentTime.yearZhi !== '')) || 
                          Boolean((currentTime.monthGan && currentTime.monthGan !== '')) || 
                          Boolean((currentTime.monthZhi && currentTime.monthZhi !== '')) || 
                          Boolean((currentTime.dayGan && currentTime.dayGan !== '')) || 
                          Boolean((currentTime.dayZhi && currentTime.dayZhi !== '')) || 
                          Boolean((currentTime.hourGan && currentTime.hourGan !== '')) || 
                          Boolean((currentTime.hourZhi && currentTime.hourZhi !== ''));
        console.log('TimestampModal - 四柱hasAnyValidValue:', hasAnyValidValue);
      }
      
      // "补全"按钮禁用状态触发条件：
      // 1. 初始化阶段
      // 2. 输入框全空
      // 3. 输入框全有合法值
      const shouldConfirmBeDisabled = !hasAnyValidValue || hasAllFields;
      setIsConfirmDisabled(shouldConfirmBeDisabled);
      
      // "提交"按钮：当所有字段都已输入时为启用状态
      setIsSubmitDisabled(!hasAllFields);
      
      // "全清"按钮禁用状态触发条件：
      // 1. 初始化阶段
      // 2. 输入框全空
      setIsInitializeDisabled(!hasAnyValidValue);
      console.log('TimestampModal - 按钮状态:', {
        isInitializeDisabled: !hasAnyValidValue,
        isConfirmDisabled: !hasAnyValidValue || hasAllFields,
        isSubmitDisabled: !hasAllFields
      });
    } else {
      // 初始化阶段：所有按钮均为禁用状态
      console.log('TimestampModal - 初始化阶段，所有按钮禁用');
      setIsConfirmDisabled(true);
      setIsSubmitDisabled(true);
      setIsInitializeDisabled(true);
    }
  }, [selectedTime, activeTab]);

  const handleConfirm = () => {
    const currentTime = selectedTime[activeTab];
    if (!currentTime) return;

    const now = new Date();
    const updatedTime = { ...currentTime };

    if (activeTab === 'gregorian') {
      // 公历选项卡：以当前公历时间补全
      if (!updatedTime.year || updatedTime.year === '') {
        updatedTime.year = String(now.getFullYear()).padStart(4, '0');
      }
      if (!updatedTime.month || updatedTime.month === '') {
        updatedTime.month = String(now.getMonth() + 1).padStart(2, '0');
      }
      if (!updatedTime.day || updatedTime.day === '') {
        updatedTime.day = String(now.getDate()).padStart(2, '0');
      }
      if (!updatedTime.hour || updatedTime.hour === '') {
        updatedTime.hour = String(now.getHours()).padStart(2, '0');
      }
      if (!updatedTime.minute || updatedTime.minute === '') {
        updatedTime.minute = String(now.getMinutes()).padStart(2, '0');
      }
      if (!updatedTime.second || updatedTime.second === '') {
        updatedTime.second = String(now.getSeconds()).padStart(2, '0');
      }
    } else if (activeTab === 'lunar') {
      // 农历选项卡：以当前公历时间转换成农历补全
      // 尝试获取当前农历日期
      try {
        // 构建当前公历时间
        const currentSolarTime = {
          year: now.getFullYear(),
          month: now.getMonth() + 1,
          day: now.getDate(),
          hour: now.getHours(),
          minute: now.getMinutes(),
          second: now.getSeconds()
        };
        
        // 导入CalendarService
        const CalendarService = require('../../../services/calendarService').default;
        
        // 获取完整的历法信息
        const result = CalendarService.getFullCalendarInfo(currentSolarTime);
        
        if (result.success && result.data) {
          // 尝试从结果中获取农历信息
          if (!updatedTime.lunar_year || updatedTime.lunar_year === '') {
            // 使用农历年
            updatedTime.lunar_year = String(result.data.lunarYear.year).padStart(4, '0');
          }
          
          // 构建一个临时的农历对象来获取数字形式的月和日
          try {
            // 导入所需的类
            const { Solar } = require('lunar-javascript');
            
            // 创建阳历对象
            const solar = Solar.fromYmdHms(
              now.getFullYear(),
              now.getMonth() + 1,
              now.getDate(),
              now.getHours(),
              now.getMinutes(),
              now.getSeconds()
            );
            
            // 获取农历对象
            const lunar = solar.getLunar();
            
            // 使用数字形式的农历月和日
            if (!updatedTime.lunar_month || updatedTime.lunar_month === '') {
              // 获取农历月（注意：lunar.getMonth() 返回的是从1开始的月份，闰月为负数）
              const lunarMonth = lunar.getMonth();
              // 取绝对值，因为我们只需要月份数字，闰月状态由 is_leap_month 字段表示
              updatedTime.lunar_month = String(Math.abs(lunarMonth)).padStart(2, '0');
            }
            
            if (!updatedTime.lunar_day || updatedTime.lunar_day === '') {
              // 获取农历日
              updatedTime.lunar_day = String(lunar.getDay()).padStart(2, '0');
            }
            
            // 设置闰月状态
            if (!updatedTime.hasOwnProperty('is_leap_month')) {
              // 检查是否为闰月（lunar.getMonth() 返回负数表示闰月）
              updatedTime.is_leap_month = lunar.getMonth() < 0;
            }
          } catch (error) {
            console.error('获取农历月日失败:', error);
            // 如果失败，使用当前公历时间作为参考
            if (!updatedTime.lunar_month || updatedTime.lunar_month === '') {
              updatedTime.lunar_month = String(now.getMonth() + 1).padStart(2, '0');
            }
            if (!updatedTime.lunar_day || updatedTime.lunar_day === '') {
              updatedTime.lunar_day = String(now.getDate()).padStart(2, '0');
            }
          }
        } else {
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
      } catch (error) {
        console.error('获取当前农历时间失败:', error);
        // 失败时使用当前时间的公历值作为参考
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
      
      // 补全的农历的时、分、秒与公历的时、分、秒等值
      if (!updatedTime.hour || updatedTime.hour === '') {
        updatedTime.hour = String(now.getHours()).padStart(2, '0');
      }
      if (!updatedTime.minute || updatedTime.minute === '') {
        updatedTime.minute = String(now.getMinutes()).padStart(2, '0');
      }
      if (!updatedTime.second || updatedTime.second === '') {
        updatedTime.second = String(now.getSeconds()).padStart(2, '0');
      }
    } else if (activeTab === 'four-pillars') {
      // 四柱选项卡：不作调整，保持原有逻辑
      // 只补全分、秒，与原确认按钮逻辑一致
      if (!updatedTime.minute || updatedTime.minute === '') {
        updatedTime.minute = String(now.getMinutes()).padStart(2, '0');
      }

      if (!updatedTime.second || updatedTime.second === '') {
        updatedTime.second = String(now.getSeconds()).padStart(2, '0');
      }
    }

    setConfirmedTime(prev => ({
      ...prev,
      [activeTab]: updatedTime
    }));

    console.log('补全时间:', updatedTime);
  };

  const handleSubmit = () => {
    const currentTime = selectedTime[activeTab];
    if (!currentTime) return;

    let submittedTime = { ...currentTime };

    // 确保分、秒有值
    if (!submittedTime.minute || submittedTime.minute === '') {
      const now = new Date();
      submittedTime.minute = String(now.getMinutes()).padStart(2, '0');
    }

    if (!submittedTime.second || submittedTime.second === '') {
      const now = new Date();
      submittedTime.second = String(now.getSeconds()).padStart(2, '0');
    }

    // 转换为公历时间
    if (activeTab === 'lunar') {
      // 农历时间转换为公历时间
      try {
        const CalendarService = require('../../../services/calendarService').default;
        const result = CalendarService.getFullCalendarInfo(submittedTime);
        
        if (result.success && result.data && result.data.solar) {
          // 构建公历时间对象，所有字段进行补零处理
          submittedTime = {
            year: String(result.data.solar.year).padStart(4, '0'),
            month: String(result.data.solar.month).padStart(2, '0'),
            day: String(result.data.solar.day).padStart(2, '0'),
            hour: String(result.data.solar.hour).padStart(2, '0'),
            minute: String(result.data.solar.minute).padStart(2, '0'),
            second: String(result.data.solar.second).padStart(2, '0')
          };
        }
      } catch (error) {
        console.error('农历转公历失败:', error);
        // 失败时保持原有数据
      }
    } else if (activeTab === 'four-pillars') {
      // 四柱时间转换为公历时间
      try {
        // 检查是否有选中的公历结果
        if (selectedSolar) {
          console.log('TimestampModal - 使用选中的公历结果提交:', selectedSolar);
          
          // 使用选中的公历结果构建提交数据
          submittedTime = {
            year: String(selectedSolar.year).padStart(4, '0'),
            month: String(selectedSolar.month).padStart(2, '0'),
            day: String(selectedSolar.day).padStart(2, '0'),
            hour: String(selectedSolar.hour).padStart(2, '0'),
            minute: String(selectedSolar.minute).padStart(2, '0'),
            second: String(selectedSolar.second).padStart(2, '0')
          };
        } else {
          console.warn('TimestampModal - 四柱选项卡：未选择公历结果');
          // 没有选中结果时，保持原有数据结构
          // 这里可以根据需要添加提示逻辑
        }
      } catch (error) {
        console.error('四柱转公历失败:', error);
      }
    }
    // 公历时间直接使用

    console.log('提交时间:', submittedTime);
    
    // 调用父组件的onSubmit回调，传递时间数据
    if (onSubmit) {
      onSubmit(submittedTime);
    }
    
    onClose();
  };
  
  const handleInitialize = () => {
    console.log('TimestampModal - 点击全清按钮，activeTab:', activeTab);
    // 根据当前选项卡类型创建不同的初始时间对象
    let initialTime = {};
    
    if (activeTab === 'gregorian') {
      // 公历选项卡
      initialTime = {
        year: '',
        month: '',
        day: '',
        hour: '',
        minute: '',
        second: ''
      };
    } else if (activeTab === 'four-pillars') {
      // 四柱选项卡
      initialTime = {
        yearGan: '',
        monthGan: '',
        dayGan: '',
        hourGan: '',
        yearZhi: '',
        monthZhi: '',
        dayZhi: '',
        hourZhi: ''
      };
    } else if (activeTab === 'lunar') {
      // 农历选项卡
      initialTime = {
        lunar_year: '',
        lunar_month: '',
        lunar_day: '',
        hour: '',
        minute: '',
        second: '',
        is_leap_month: false
      };
    }
    
    console.log('TimestampModal - 全清后的数据:', initialTime);
    
    setSelectedTime(prev => {
      const newSelectedTime = {
        ...prev,
        [activeTab]: initialTime
      };
      console.log('TimestampModal - 新的selectedTime:', newSelectedTime);
      return newSelectedTime;
    });
    
    setConfirmedTime(prev => {
      const newConfirmedTime = {
        ...prev,
        [activeTab]: initialTime
      };
      console.log('TimestampModal - 新的confirmedTime:', newConfirmedTime);
      return newConfirmedTime;
    });
    
    console.log('全清时间输入值');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content timestamp-modal">
        <div className="modal-header">
          <div className="timestamp-tabs">
            <button 
              className={`tab-button ${activeTab === 'gregorian' ? 'active' : ''}`}
              onClick={() => handleTabChange('gregorian')}
            >
              公历
            </button>
            <button 
              className={`tab-button ${activeTab === 'lunar' ? 'active' : ''}`}
              onClick={() => handleTabChange('lunar')}
            >
              农历
            </button>
            <button 
              className={`tab-button ${activeTab === 'four-pillars' ? 'active' : ''}`}
              onClick={() => handleTabChange('four-pillars')}
            >
              四柱
            </button>
          </div>
        </div>
        
        {/* 时间输入区域 */}
        <div className="modal-body timestamp-modal-body">
          {activeTab === 'gregorian' && (
            <GregorianTime 
              onTimeChange={handleGregorianTimeChange}
              confirmedTime={confirmedTime.gregorian}
            />
          )}
          {activeTab === 'lunar' && (
            <LunarTime 
              onTimeChange={handleLunarTimeChange}
              confirmedTime={confirmedTime.lunar}
            />
          )}
          {activeTab === 'four-pillars' && (
            <>
              <FourPillarsTime 
                onTimeChange={handleFourPillarsTimeChange}
                confirmedTime={confirmedTime['four-pillars']}
                onSolarListResult={handleSolarListResult}
                selectedSolar={selectedSolar}
              />
              
              {/* 四柱计算结果显示区域 */}
              {solarListResult && (
                <div className="solar-list-result">
                  {solarListResult.success ? (
                    <div className="result-list">
                      {solarListResult.data.list.slice().reverse().map((solar, index) => {
                        const reversedList = solarListResult.data.list.slice().reverse();
                        const currentIndex = reversedList.indexOf(solar) + 1;
                        const totalCount = solarListResult.data.count;
                        const formattedIndex = String(currentIndex).padStart(2, '0');
                        const formattedTotal = String(totalCount).padStart(2, '0');
                        const isSelected = selectedSolarIndex === index;
                        
                        return (
                          <div 
                            key={solar.fullString} 
                            className={`result-item ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleResultItemClick(solar, index)}
                          >
                            <span className="result-index">{formattedIndex}/{formattedTotal}</span>
                            <span className="result-content">{solar.fullString}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="result-error">
                      <span>{solarListResult.error}</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        
        {/* 底部按钮 */}
        <div className="modal-footer timestamp-modal-footer">
          <button 
            className="modal-button initialize" 
            onClick={handleInitialize}
            disabled={isInitializeDisabled}
          >
            全清
          </button>
          <button 
            className="modal-button confirm" 
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            title={activeTab === 'gregorian' ? '以当前公历时间补全' : activeTab === 'lunar' ? '以当前农历时间补全' : '以当前时间补全'}
            style={{ display: activeTab === 'four-pillars' ? 'none' : 'block' }}
          >
            补全
          </button>
          <button 
            className="modal-button submit" 
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
          >
            提交
          </button>
          <button className="modal-button cancel" onClick={onClose}>
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimestampModal;
