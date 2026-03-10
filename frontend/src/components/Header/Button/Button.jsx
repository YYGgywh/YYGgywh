/*
 * @file            frontend/src/components/Header/Button/Button.jsx
 * @description     通用按钮组件，支持主按钮和次要按钮样式
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-01-27 16:33:00
 * @lastModified    2026-03-07 19:51:57
 * Copyright © All rights reserved
*/

import React from 'react'; // 导入React核心库，用于创建React组件
import styles from './Button.desktop.module.css'; // 导入桌面端按钮样式（CSS Modules方式）

/**
 * Button组件 - 通用按钮组件
 * @param {Object} props - 组件属性对象
 * @param {React.ReactNode} props.children - 按钮内容，可以是文本或其他React元素
 * @param {string} [props.variant='primary'] - 按钮变体，'primary'表示主要按钮，'secondary'表示次要按钮
 * @param {boolean} [props.fullWidth=false] - 是否全宽显示，true时按钮宽度为100%
 * @param {Object} props.rest - 其他原生button元素的属性（如onClick、disabled等）
 * @returns {JSX.Element} 返回渲染的按钮元素
 */
const Button = ({ children, variant = 'primary', fullWidth = false, ...props }) => {
  // 根据variant参数映射到对应的CSS Modules类名
  const variantClass = variant === 'primary' ? styles.buttonPrimary : styles.buttonSecondary; // 主要按钮使用buttonPrimary类，次要按钮使用buttonSecondary类
  
  // 构建完整的类名字符串，包含基础类名、变体类名和全宽类名（如果需要）
  const className = `${styles.button} ${variantClass} ${fullWidth ? styles.buttonFullWidth : ''}`; // 使用模板字符串拼接类名，fullWidth为true时添加buttonFullWidth类

  // 返回JSX，渲染button元素
  return (
    <button className={className} {...props}> {/* 渲染button元素，应用动态生成的类名，并传递所有其他props */}
      {children} {/* 渲染按钮内容，即children属性传入的内容 */}
    </button> // 结束button元素
  );
};

export default Button; // 导出Button组件作为默认导出，供其他组件使用