/*
 * @file            frontend/src/components/NumberInput.jsx
 * @description     通用数字输入组件，支持位数限制、最大值、最小值和自动补零
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-18 11:00:00
 * @lastModified    2026-02-18 20:50:42
 * Copyright © All rights reserved
*/

import React from 'react'; // 引入 React 核心库，用于构建用户界面

// NumberInput 通用数字输入组件。支持位数限制、最大值、最小值和自动补零
const NumberInput = ({ 
  value,               // 当前输入值
  onChange,            // 输入变化回调
  onBlur,              // 失去焦点回调
  onDoubleClick,       // 双击回调
  className,           // 自定义样式类名
  maxLength = 4,        // 默认4位
  maxValue = 9999,       // 默认最大值
  minValue = 0,         // 默认最小值
  padLength = 4,        // 补零长度
  placeholder = '',      // 占位提示文本
  ...props              // 其余原生 input 属性
}) => {
  // 处理输入变化，限制为数字、位数和最大值
  const handleChange = (e) => {
    let inputValue = e.target.value.replace(/\D/g, ''); // 只保留数字

    // 限制位数
    if (inputValue.length > maxLength) {
      inputValue = inputValue.slice(0, maxLength); // 截取前 maxLength 位
    }

    // 限制最大值
    if (inputValue.length === maxLength && parseInt(inputValue) > maxValue) {
      inputValue = maxValue.toString(); // 超过最大值，取最大值
    }
    
    onChange(inputValue); // 触发变化回调
  };

  // 处理失去焦点，自动补零和最小值校验
  const handleBlur = () => {
    // 失去焦点时，自动补零和校验最小值
    if (value && value.length > 0 && value.length < padLength) {
      const paddedValue = value.padStart(padLength, '0'); // 自动补零
      
      // 校验最小值
      if (parseInt(paddedValue) < minValue) {
        onChange(''); // 小于最小值，清空输入
      } else {
        onChange(paddedValue); // 大于等于最小值，触发变化回调
      }
    }
  };

  // 渲染数字输入框
  return (
    // 数字输入框
    <input
      type="number" // 数字输入框，限制为数字
      placeholder={placeholder} // 占位提示文本
      value={value} // 当前输入值
      onChange={handleChange} // 输入变化回调，处理数字限制、位数和最大值
      onBlur={handleBlur} // 失去焦点回调，处理自动补零和最小值校验
      onDoubleClick={onDoubleClick} // 双击回调
      className={className} // 自定义样式类名
      maxLength={maxLength} // 最大输入长度
      {...props} // 其余原生 input 属性
    />
  );
};

export default NumberInput; //
