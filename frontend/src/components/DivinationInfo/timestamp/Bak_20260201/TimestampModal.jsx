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
    fourPillars: null
  });
  const [confirmedTime, setConfirmedTime] = useState({
    gregorian: null,
    lunar: null,
    fourPillars: null
  });
  const [isConfirmDisabled, setIsConfirmDisabled] = useState(true);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
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
    setSelectedTime(prev => ({
      ...prev,
      fourPillars: timeData
    }));
  }, []);

  useEffect(() => {
    const currentTime = selectedTime[activeTab];
    if (currentTime) {
      const hasRequiredFields = currentTime.year && currentTime.month && currentTime.day && currentTime.hour;
      setIsConfirmDisabled(!hasRequiredFields);
      
      const hasAllFields = currentTime.year && currentTime.month && currentTime.day && currentTime.hour && currentTime.minute && currentTime.second;
      setIsSubmitDisabled(!hasAllFields);
    } else {
      setIsConfirmDisabled(true);
      setIsSubmitDisabled(true);
    }
  }, [selectedTime, activeTab]);

  const handleConfirm = () => {
    const currentTime = selectedTime[activeTab];
    if (!currentTime) return;

    const updatedTime = { ...currentTime };

    if (!updatedTime.minute || updatedTime.minute === '') {
      const now = new Date();
      updatedTime.minute = String(now.getMinutes()).padStart(2, '0');
    }

    if (!updatedTime.second || updatedTime.second === '') {
      const now = new Date();
      updatedTime.second = String(now.getSeconds()).padStart(2, '0');
    }

    setConfirmedTime(prev => ({
      ...prev,
      [activeTab]: updatedTime
    }));

    console.log('确认时间:', updatedTime);
  };

  const handleSubmit = () => {
    const currentTime = selectedTime[activeTab];
    if (!currentTime) return;

    const submittedTime = { ...currentTime };

    if (!submittedTime.minute || submittedTime.minute === '') {
      const now = new Date();
      submittedTime.minute = String(now.getMinutes()).padStart(2, '0');
    }

    if (!submittedTime.second || submittedTime.second === '') {
      const now = new Date();
      submittedTime.second = String(now.getSeconds()).padStart(2, '0');
    }

    console.log('提交时间:', submittedTime);
    
    // 调用父组件的onSubmit回调，传递时间数据
    if (onSubmit) {
      onSubmit(submittedTime);
    }
    
    onClose();
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
            <LunarTime onTimeChange={handleLunarTimeChange} />
          )}
          {activeTab === 'four-pillars' && (
            <FourPillarsTime onTimeChange={handleFourPillarsTimeChange} />
          )}
        </div>
        
        {/* 底部按钮 */}
        <div className="modal-footer timestamp-modal-footer">
          <button 
            className="modal-button confirm" 
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
          >
            确认
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
