// 路径:src/components/LiuYao/LiuYaoReault/LiuYaoReault.jsx 时间:2026-02-10 10:00
// 功能:排盘结果展示页面，显示"待开发"字样
import React, { useEffect } from 'react';
import './LiuYaoReault.css';

const LiuYaoReault = () => {
  useEffect(() => {
    // 从 localStorage 获取数据
    const data = localStorage.getItem('divinationResult');
    if (data) {
      const parsedData = JSON.parse(data);
      // 打印数据到控制台
      console.log('传递的数据:');
      console.log('表单数据:', parsedData.formData);
      console.log('公历时间:', parsedData.calendarData);
      console.log('起卦三位数数组:', parsedData.threeDigitsArray);
      console.log('后端返回的数据:');
      console.log('日历转换结果:', parsedData.calendarResult || null);
      console.log('排盘结果:', parsedData.divineResult || null);
      // 清除 localStorage 中的数据，避免数据残留
      localStorage.removeItem('divinationResult');
    } else {
      // 如果 localStorage 中没有数据，打印默认数据
      console.log('传递的数据:');
      console.log('表单数据:', {});
      console.log('公历时间:', {});
      console.log('起卦三位数数组:', []);
      console.log('后端返回的数据:');
      console.log('日历转换结果:', null);
      console.log('排盘结果:', null);
    }
  }, []);

  return (
    <div id="LiuYaoReault" className="liu-yao-reault-container">
      <h1>待开发</h1>
    </div>
  );
};

export default LiuYaoReault;
