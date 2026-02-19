/*
 * @file            frontend/src/components/FormInput.jsx
 * @description     可复用的表单输入框组件
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-18 10:00:00
 * @lastModified    2026-02-18 19:57:42
 * Copyright © All rights reserved
*/

import React from 'react';  // 导入React库

// 定义可复用的表单输入框组件
const FormInput = ({ name, placeholder, value, onChange, onDoubleClick, className, type = 'text', ...props }) => (
  // 可复用的表单输入框组件，支持文本/数字输入、占位提示、双击清空等功能
  <input
    type={type}                 // 输入框类型（text、password、number 等）
    name={name}                 // 字段名称，用于表单提交或标识
    placeholder={placeholder}   // 占位提示文本
    value={value}               // 当前输入值
    onChange={onChange}         // 输入内容变化时的回调函数
    onDoubleClick={onDoubleClick} // 双击输入框时的回调函数（常用于清空）
    className={className}       // 自定义样式类名
    {...props}                  // 其余透传属性（如 disabled、maxLength 等）
  />
);

export default FormInput; // 导出可复用的表单输入框组件
