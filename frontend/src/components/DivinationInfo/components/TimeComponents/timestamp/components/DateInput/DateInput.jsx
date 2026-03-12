/*
 * @file            frontend/src/components/DivinationInfo/components/TimeComponents/timestamp/components/DateInput/DateInput.jsx
 * @description     统一的时间输入框组件，支持公历、农历、四柱场景的输入框渲染
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-11 20:30:00
 * @lastModified    2026-03-12 13:00:11
 * Copyright © All rights reserved
*/

import React, { useRef, useEffect } from 'react';
import desktopStyles from './DateInput.desktop.module.css'; // 导入桌面端样式
import mobileStyles from './DateInput.mobile.module.css'; // 导入移动端样式

// 设备类型检测（简化版，实际项目中可能使用更复杂的检测方法）
const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;

// 根据设备类型选择样式
const styles = isDesktop ? desktopStyles : mobileStyles;

/**
 * 统一的时间输入框组件
 * @param {string} field - 字段名称
 * @param {string} value - 输入值
 * @param {function} onChange - 输入变化回调
 * @param {function} onBlur - 失去焦点回调
 * @param {function} onDoubleClick - 双击回调
 * @param {function} onKeyDown - 键盘事件回调
 * @param {boolean} disabled - 是否禁用
 * @param {string} type - 输入类型（text/number）
 * @param {string} placeholder - 占位符
 * @param {number} min - 最小值（仅数字输入）
 * @param {number} max - 最大值（仅数字输入）
 * @param {Object} styles - 样式对象
 * @param {string} className - 额外类名
 * @param {Object} inputRefs - 输入框引用对象（可选）
 */
const DateInput = ({
  field,
  value,
  onChange,
  onFocus,
  onBlur,
  onDoubleClick,
  onKeyDown,
  disabled = false,
  type = 'number',
  placeholder = '',
  min = null,
  max = null,
  className = '',
  inputRefs = null
}) => {
  const inputRef = useRef(null);

  // 存储输入框引用到父组件传递的对象中
  useEffect(() => {
    if (inputRef.current && inputRefs) {
      inputRefs[field] = inputRef.current;
    }
  }, [inputRef.current, inputRefs, field]);

  // 获取输入框的样式类名
  const getInputClassName = () => {
    if (!styles) return className;
    
    let baseClasses = styles.timeInput;
    
    // 根据字段类型添加特定样式
    if (field === 'year' || field === 'lunar_year') {
      baseClasses += ` ${styles.timeInputYear}`;
    } else if (['month', 'day', 'hour', 'minute', 'second', 'lunar_month', 'lunar_day'].includes(field)) {
      baseClasses += ` ${styles.timeInputSmall}`;
    }
    
    // 添加无滚动按钮样式（仅数字输入）
    if (type === 'number') {
      baseClasses += ` ${styles.noSpinButtons}`;
    }
    
    // 添加额外类名
    if (className) {
      baseClasses += ` ${className}`;
    }
    
    return baseClasses;
  };

  // 处理输入变化
  const handleChange = (e) => {
    const { value: inputValue } = e.target;
    if (onChange) {
      onChange(e);
    }
  };

  // 处理获取焦点
  const handleFocus = (e) => {
    if (onFocus) {
      onFocus(e);
    }
  };

  // 处理失去焦点
  const handleBlur = (e) => {
    if (onBlur) {
      onBlur(e);
    }
  };

  // 处理双击
  const handleDoubleClick = (e) => {
    e.preventDefault();
    if (onDoubleClick) {
      onDoubleClick(e, field);
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e) => {
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  // 渲染输入框
  const renderInput = () => {
    const commonProps = {
      ref: inputRef,
      type,
      name: field,
      placeholder,
      className: getInputClassName(),
      value,
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onDoubleClick: handleDoubleClick,
      onKeyDown: handleKeyDown,
      disabled,
      autoComplete: 'off' // 禁用浏览器自动填充
    };

    if (type === 'number') {
      return (
        <input
          {...commonProps}
          min={min}
          max={max}
        />
      );
    }

    return (
      <input
        {...commonProps}
      />
    );
  };

  return renderInput();
};

export default DateInput;
