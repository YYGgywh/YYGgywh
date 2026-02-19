/*
 * @file            frontend/src/components/TimestampDisplay.jsx
 * @description     时间戳显示组件，格式化并显示时间戳
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-18 10:45:00
 * @lastModified    2026-02-18 10:45:00
 * Copyright © All rights reserved
*/

import React from 'react';

const TimestampDisplay = ({ timestamp, onClick }) => {
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
    <div className="timestamp" onClick={onClick}>
      {formatTimestamp()}
    </div>
  );
};

export default TimestampDisplay;
