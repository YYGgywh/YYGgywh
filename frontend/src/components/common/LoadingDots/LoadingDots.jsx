/*
 * @file            frontend/src/components/common/LoadingDots/LoadingDots.jsx
 * @description     加载动画组件，提供三个点的脉冲加载动画
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-01-27 16:33:00
 * @lastModified    2026-03-13 10:25:02
 * Copyright © All rights reserved
*/

import React from 'react'; // 导入React核心库，用于创建React组件

// 导入桌面端样式
import styles from "./LoadingDots.desktop.module.css";

/**
 * LoadingDots组件 - 加载动画组件
 * 显示三个点的脉冲加载动画，常用于数据加载状态
 * @param {Object} props - 组件属性对象
 * @param {string} [props.size='medium'] - 加载动画尺寸，可选值：'small'、'medium'、'large'
 * @param {string} [props.color='#1890ff'] - 加载点颜色，支持任何有效的CSS颜色值
 * @returns {JSX.Element} 返回渲染的加载动画组件元素
 */
const LoadingDots = ({ size = 'medium', color = '#1890ff' }) => {
  // 根据size参数获取对应的CSS Modules类名
  // 如果size为'medium'，则不添加额外的尺寸类（使用默认样式）
  const sizeClass = size === 'medium' ? '' : styles[size]; // small或large尺寸时，使用对应的类名
  
  // 返回JSX，渲染加载动画组件
  return (
    <div className={`${styles.loadingDots} ${sizeClass}`}> {/* 加载动画容器，应用基础样式和尺寸样式 */}
      {/* 第一个加载点 - 通过animation-delay实现波浪效果 */}
      <div className={styles.dot} style={{ backgroundColor: color }}></div>
      {/* 第二个加载点 - 通过animation-delay实现波浪效果 */}
      <div className={styles.dot} style={{ backgroundColor: color }}></div>
      {/* 第三个加载点 - 无动画延迟 */}
      <div className={styles.dot} style={{ backgroundColor: color }}></div>
    </div>
  );
};

export default LoadingDots; // 导出LoadingDots组件作为默认导出，供其他组件使用