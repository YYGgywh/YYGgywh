/*
 * @file            frontend/src/components/DivinationInfo/TimeComponents/timestamp/components/TimestampModal/TimestampModal.jsx
 * @description     时间戳设置弹窗组件，用于选择和设置时间戳
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-10 20:53:35
 * @lastModified    2026-03-10 20:54:12
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react';
import { getDeviceType, listenDeviceTypeChange } from '../../../../../../utils/deviceUtils';
import desktopStyles from './TimestampModal.desktop.module.css';
import mobileStyles from './TimestampModal.mobile.module.css';
import SolarTime from '../SolarTime/SolarTime';
import LunarTime from '../LunarTime/LunarTime';
import FourPillarsTime from '../FourPillarsTime/FourPillarsTime';

const TimestampModal = ({ onClose, onSubmit }) => {
  // 设备检测
  const [deviceType, setDeviceType] = useState(getDeviceType());
  const [activeTab, setActiveTab] = useState('solar'); // 默认显示公历
  const [selectedTime, setSelectedTime] = useState(null);
  
  // 监听设备类型变化
  useEffect(() => {
    const unsubscribe = listenDeviceTypeChange(setDeviceType);
    return () => unsubscribe();
  }, []);
  
  // 根据设备类型选择样式
  const styles = deviceType === 'mobile' ? mobileStyles : desktopStyles;
  
  // 处理时间变化
  const handleTimeChange = (timeData) => {
    setSelectedTime(timeData);
  };
  
  // 处理提交
  const handleSubmit = () => {
    onSubmit(selectedTime);
    onClose();
  };
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>设置时间戳</h3>
        
        {/* 标签页切换 */}
        <div className={styles.tabContainer}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'solar' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('solar')}
          >
            公历
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'lunar' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('lunar')}
          >
            农历
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'fourPillars' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('fourPillars')}
          >
            四柱
          </button>
        </div>
        
        <div className={styles.modalBody}>
          {/* 根据选中的标签显示对应的时间选择组件 */}
          {activeTab === 'solar' && (
            <SolarTime onTimeChange={handleTimeChange} />
          )}
          {activeTab === 'lunar' && (
            <LunarTime onTimeChange={handleTimeChange} />
          )}
          {activeTab === 'fourPillars' && (
            <FourPillarsTime onTimeChange={handleTimeChange} />
          )}
        </div>
        
        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={onClose}>
            取消
          </button>
          <button className={styles.submitButton} onClick={handleSubmit}>
            确认
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimestampModal;