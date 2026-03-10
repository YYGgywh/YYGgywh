/*
 * @file            frontend/src/components/DivinationInfo/components/FormComponents/FormInput/FormInput.jsx
 * @description     可复用的表单输入框组件，支持文本输入、占位提示、双击清空等功能
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-09 15:30:00
 * @lastModified    2026-03-09 18:12:45
 * Copyright © All rights reserved
*/

import React from 'react';
import styles from './FormInput.desktop.module.css';

/**
 * 可复用的表单输入框组件
 * @param {Object} props - 组件属性
 * @param {string} props.name - 输入框名称，用于表单提交时识别
 * @param {string} props.placeholder - 输入框占位符文本
 * @param {string} props.value - 输入框当前值
 * @param {function} props.onChange - 输入值变化时的回调函数
 * @param {function} props.onDoubleClick - 双击输入框时的回调函数
 * @param {string} props.className - 自定义类名
 * @param {string} props.type - 输入框类型，默认为'text'
 * @param {string} props.variant - 输入框样式变体，用于设置不同的宽度和样式
 * @param {Object} props... - 其他输入框属性
 * @returns {JSX.Element} - 表单输入框组件
 */
const FormInput = ({ 
  name, // 输入框名称
  placeholder, // 输入框占位符
  value, // 输入框当前值
  onChange, // 输入值变化回调
  onDoubleClick, // 双击事件回调
  className, // 自定义类名
  type = 'text', // 输入框类型，默认text
  variant, // 样式变体
  ...props // 其他属性
}) => {

  // 合并类名：基础样式 + 变体样式 + 自定义类名
  const combinedClassName = [
    styles.formInput, // 基础输入框样式
    variant && styles[variant], // 如果提供了变体，则添加对应样式
    className // 自定义类名
  ].filter(Boolean).join(' '); // 过滤掉false值并拼接

  // 返回输入框元素
  return (
    <input
      type={type} // 输入框类型
      name={name} // 输入框名称
      placeholder={placeholder} // 占位符文本
      value={value} // 当前值
      onChange={onChange} // 值变化回调
      onDoubleClick={onDoubleClick} // 双击回调
      className={combinedClassName} // 合并后的类名
      {...props} // 展开其他属性
    />
  );
};

// 导出FormInput组件作为默认导出
export default FormInput;
