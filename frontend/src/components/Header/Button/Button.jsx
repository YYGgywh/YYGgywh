/*
 * @file            frontend/src/components/Header/Button/Button.jsx
 * @description     通用按钮组件，支持主按钮和次要按钮样式
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-01-27 16:33:00
 * @lastModified    2026-02-16 14:21:58
 * Copyright © All rights reserved
*/

import React from 'react'; // 导入React核心库
import './Button.css'; // 导入按钮样式文件

// 定义Button组件，接收children、variant、fullWidth和其他props参数
const Button = ({ children, variant = 'primary', fullWidth = false, ...props }) => {
  const className = `button button-${variant} ${fullWidth ? 'button-full-width' : ''}`; // 根据variant和fullWidth参数动态生成类名

  // 返回JSX
  return (
    <button className={className} {...props}> {/* 渲染button元素，应用动态类名和传递其他props */}
      {children} {/* 渲染按钮内容 */}
    </button> // 结束button元素
  );
};

export default Button; // 导出Button组件作为默认导出