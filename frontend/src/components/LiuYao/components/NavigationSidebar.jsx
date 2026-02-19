/*
 * @file            frontend/src/components/LiuYao/components/NavigationSidebar.jsx
 * @description     侧边导航组件，用于显示和选择起卦方式
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-01-28 11:30:00
 * @lastModified    2026-02-19 09:14:24
 * Copyright © All rights reserved
*/

import React from 'react';  // 导入 React 核心库
import './NavigationSidebar.css';  // 导入组件样式文件

/**
 * @description     侧边导航组件，用于显示和选择起卦方式
 * @param           {Array}     methods           起卦方法数组
 * @param           {string}    selectedMethod    当前选中的起卦方法
 * @param           {Function}  onMethodSelect    方法选择回调函数
 * @return          {JSX}                        侧边导航 JSX 元素
 */

// 定义 NavigationSidebar 组件
const NavigationSidebar = ({ methods, selectedMethod, onMethodSelect }) => {
  // 从 props 中解构出 methods, selectedMethod, onMethodSelect
  return (
    <div className="method-sidebar">  {/* 侧边导航容器 */}
      {/* 遍历 methods 数组，渲染每个方法项 */}
      {methods.map((method) => (
        <div
          key={method}  // 使用 method 作为唯一标识符
          className={`method-item ${selectedMethod === method ? 'active' : ''}`}  // 动态类名，选中时添加 active
          onClick={() => onMethodSelect(method)}  // 点击事件处理，调用 onMethodSelect 回调
        >
          {method}  {/* 显示方法名称 */}
        </div>
      ))}
    </div>
  );
};

export default NavigationSidebar;  // 导出 NavigationSidebar 组件