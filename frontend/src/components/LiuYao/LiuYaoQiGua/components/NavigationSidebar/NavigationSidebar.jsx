/*
 * @file            frontend/src/components/LiuYao/components/NavigationSidebar.jsx
 * @description     侧边导航组件，用于显示和选择起卦方式
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-01-28 11:30:00
 * @lastModified    2026-03-08 16:00:00
 * Copyright © All rights reserved
*/

// 导入 React 核心库
import React from 'react';
// 导入 CSS Modules 样式文件 - 桌面端样式
import styles from './NavigationSidebar.desktop.module.css';

/**
 * @description     侧边导航组件，用于显示和选择起卦方式
 * @param           {Array}     methods           起卦方法数组，包含所有可用的起卦方式名称
 * @param           {string}    selectedMethod    当前选中的起卦方法名称
 * @param           {Function}  onMethodSelect    方法选择回调函数，接收选中的方法名称作为参数
 * @return          {JSX}                        侧边导航 JSX 元素
 */

// 定义 NavigationSidebar 组件
const NavigationSidebar = ({ methods, selectedMethod, onMethodSelect }) => {
  // 从 props 中解构出 methods（起卦方法列表）、selectedMethod（当前选中方法）、onMethodSelect（选择回调函数）
  return (
    // 侧边导航容器 - 使用 CSS Modules 的 methodSidebar 类名
    <div className={styles.methodSidebar}>
      {/* 遍历 methods 数组，渲染每个方法项 */}
      {methods.map((method) => (
        // 单个起卦方法选项
        <div
          // 使用 method 作为 React 列表渲染的唯一标识符 key
          key={method}
          // 动态类名组合：
          // - styles.methodItem：基础导航项样式
          // - 当 method 等于 selectedMethod 时，添加 styles.active 选中状态样式
          className={`${styles.methodItem} ${selectedMethod === method ? styles.active : ''}`}
          // 点击事件处理：调用 onMethodSelect 回调函数，传入当前点击的方法名称
          onClick={() => onMethodSelect(method)}
        >
          {/* 显示方法名称文本 */}
          {method}
        </div>
      ))}
    </div>
  );
};

// 导出 NavigationSidebar 组件，供其他文件导入使用
export default NavigationSidebar;
