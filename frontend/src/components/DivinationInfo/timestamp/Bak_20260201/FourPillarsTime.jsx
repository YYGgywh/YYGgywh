// 路径:src/components/DivinationInfo/timestamp/FourPillarsTime.jsx 时间:2026-01-30 10:00
// 功能:四柱时间输入和显示组件
import React, { useState } from 'react';

const FourPillarsTime = ({ onTimeChange }) => {
  const [timeData, setTimeData] = useState({
    yearPillar: '',
    monthPillar: '',
    dayPillar: '',
    hourPillar: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTimeData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      onTimeChange(newData);
      return newData;
    });
  };

  return (
    <div className="four-pillars-time-container">
      {/* 四柱输入区域 */}
      <div className="timestamp-inputs">
        <input 
          type="text" 
          name="yearPillar" 
          placeholder="年柱" 
          className="time-input" 
          value={timeData.yearPillar}
          onChange={handleChange}
        />
        <input 
          type="text" 
          name="monthPillar" 
          placeholder="月柱" 
          className="time-input" 
          value={timeData.monthPillar}
          onChange={handleChange}
        />
        <input 
          type="text" 
          name="dayPillar" 
          placeholder="日柱" 
          className="time-input" 
          value={timeData.dayPillar}
          onChange={handleChange}
        />
        <input 
          type="text" 
          name="hourPillar" 
          placeholder="时柱" 
          className="time-input" 
          value={timeData.hourPillar}
          onChange={handleChange}
        />
      </div>
      
      {/* 时间显示区域 */}
      <div className="timestamp-display">
        <div className="time-info">
          <span className="time-label">四柱：</span>
          <span className="time-value">乙巳 己丑 癸酉 丙辰</span>
        </div>
        <div className="time-info">
          <span className="time-label">公历：</span>
          <span className="time-value">2026年01月02日 07:56:38</span>
        </div>
      </div>
    </div>
  );
};

export default FourPillarsTime;