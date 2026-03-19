/*
 * @file            frontend/src/components/common/Button/ButtonGroup.jsx
 * @description     按钮组组件，用于管理多个按钮的布局和样式
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-15 15:00:00
 * @lastModified    2026-03-15 16:10:04
 * Copyright © All rights reserved
*/

// 导入 React 核心库
import React from 'react';
// 导入 PropTypes 用于类型检查
import PropTypes from 'prop-types';
// 导入 CSS Modules 样式文件
import styles from './ButtonGroup.desktop.module.css';

/**
 * 按钮组组件
 * 用于将多个按钮组合在一起，统一管理它们的布局和间距
 * 支持水平和垂直两种排列方式
 * 使用 React.memo 进行性能优化，避免不必要的重渲染
 */
const ButtonGroup = React.memo(({
  children,              // 按钮组内的子元素（通常是多个 Button 组件）
  direction = 'horizontal',  // 排列方向，默认为水平排列
  spacing = 'medium',    // 按钮间距，默认为中等间距
  className = '',        // 额外的 CSS 类名
  style = {},            // 行内样式对象
  ...props               // 其他属性，会传递给底层 div 元素
}) => {
  /**
   * 构建按钮组的 CSS 类名字符串
   * 组合基础类名、方向类名、间距类名和额外类名
   * @returns {string} 完整的 CSS 类名字符串
   */
  const getGroupClassName = () => {
    // 定义基础类名数组
    const classNames = [
      styles.buttonGroup,  // 基础按钮组样式
      // 根据 direction 属性添加对应的样式类（如 buttonGroupHorizontal）
      styles[`buttonGroup${direction.charAt(0).toUpperCase() + direction.slice(1)}`],
      // 根据 spacing 属性添加对应的样式类（如 buttonGroupSpacingMedium）
      styles[`buttonGroupSpacing${spacing.charAt(0).toUpperCase() + spacing.slice(1)}`]
    ];
    
    // 如果传入了额外的类名，添加到数组
    if (className) {
      classNames.push(className);
    }
    
    // 过滤掉 falsy 值并连接成字符串
    return classNames.filter(Boolean).join(' ');
  };
  
  /**
   * 渲染按钮组组件
   * 使用 div 元素作为容器，包裹所有子按钮
   */
  return (
    // 使用 div 元素作为按钮组的容器
    <div
      // 使用计算好的 CSS 类名
      className={getGroupClassName()}
      // 行内样式
      style={style}
      // 传递其他属性
      {...props}
    >
      {/* 渲染所有子元素（按钮） */}
      {children}
    </div>
  );
});

/**
 * 组件属性类型检查
 * 定义每个属性的数据类型和可选值
 */
ButtonGroup.propTypes = {
  children: PropTypes.node.isRequired,  // 子元素，必需（通常是 Button 组件）
  direction: PropTypes.oneOf(['horizontal', 'vertical']),  // 排列方向：水平或垂直
  spacing: PropTypes.oneOf(['small', 'medium', 'large']),  // 间距大小：小、中、大
  className: PropTypes.string,          // 额外类名
  style: PropTypes.object               // 行内样式
};

// 导出 ButtonGroup 组件
// 为 ButtonGroup 组件添加 displayName，便于在 React DevTools 中调试
ButtonGroup.displayName = 'ButtonGroup';

export default ButtonGroup;
