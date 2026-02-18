// 路径:src/components/LiuYao/LiuYaoReault/LiuYaoReault.jsx 时间:2026-02-10 10:00
// 功能:排盘结果展示页面，显示"待开发"字样

import React, { useEffect } from 'react'; // 导入React核心库和useEffect钩子
import './LiuYaoReault.css'; // 导入组件样式文件

// 定义六爻排盘结果组件
const LiuYaoReault = () => {
  // 使用useEffect钩子，在组件挂载时执行一次
  useEffect(() => {
    // 从localStorage中获取排盘结果数据
    const data = localStorage.getItem('divinationResult');    
    // 检查是否存在排盘结果数据
    if (data) {      
      const parsedData = JSON.parse(data); // 解析JSON格式的数据
      console.log('★传递的数据★:'); // 打印传递的数据到控制台
      console.log('表单数据:', parsedData.formData); // 打印表单数据      
      
      // 检查是否使用新的数据结构
      if (parsedData.requestData) {
        // 新数据结构：打印请求数据
        console.log('请求数据:', parsedData.requestData);
        // 从requestData中获取起卦三位数数组
        console.log('起卦三位数数组:', parsedData.requestData.numbers);
      } else {
        // 旧数据结构：保持向后兼容
        console.log('公历时间:', parsedData.calendarData || {});
        console.log('起卦三位数数组:', parsedData.threeDigitsArray || []);
      }
      
      // 打印后端返回的数据
      console.log('后端返回的数据:');
      
      // 检查是否使用新的数据结构
      if (parsedData.requestData) {
        // 新数据结构：直接打印排盘结果
        console.log('排盘结果:', parsedData.divineResult || null);
      } else {
        // 旧数据结构：保持向后兼容
        console.log('日历转换结果:', parsedData.calendarResult || null);
        console.log('排盘结果:', parsedData.divineResult || null);
      }
      localStorage.removeItem('divinationResult'); // 清除localStorage中的数据，避免数据残留
    } 
    // 如果localStorage中没有数据，打印默认数据
    else {
      console.log('★传递的数据★:');
      console.log('表单数据:', {});
      console.log('请求数据:', {});
      console.log('起卦三位数数组:', []);
      console.log('后端返回的数据:');
      console.log('排盘结果:', null);
    }
  }, []); // 空依赖数组，表示只在组件挂载时执行一次

  // 组件返回的JSX结构
  return (
    // 排盘结果容器，设置id和class
    <div id="LiuYaoReault" className="liu-yao-reault-container">
      // 显示"待开发"字样
      <h1>待开发</h1>
    </div>
  );
};

// 导出LiuYaoReault组件
export default LiuYaoReault;
