/*
 * @file            frontend/src/components/TimestampDisplay.jsx
 * @description     时间戳显示组件，格式化并显示时间戳
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-18 10:45:00
 * @lastModified    2026-03-09 20:01:23
 * Copyright © All rights reserved
*/

import React from 'react';
import RefreshIcon from '../assets/images/refresh.svg';

const TimestampDisplay = ({ timestamp, onClick, onRefresh }) => {
  const padZero = (num) => String(num).padStart(2, '0');

  const formatTimestamp = () => {
    if (timestamp) {
      const { year, month, day, hour, minute, second } = timestamp;
      return `公历：${year}年${padZero(month)}月${padZero(day)}日 ${padZero(hour)}:${padZero(minute)}:${padZero(second)}`;
    }
    
    const now = new Date();
    const year = now.getFullYear();
    const month = padZero(now.getMonth() + 1);
    const day = padZero(now.getDate());
    const hours = padZero(now.getHours());
    const minutes = padZero(now.getMinutes());
    const seconds = padZero(now.getSeconds());

    return `公历：${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="timestamp-container">
      <div className="timestamp" onClick={onClick}>
        {formatTimestamp()}
      </div>
      <div className="timestamp-refresh" onClick={onRefresh}>
        <img src={RefreshIcon} className="icon" alt="刷新" />
      </div>
    </div>
  );
};

export default TimestampDisplay;
