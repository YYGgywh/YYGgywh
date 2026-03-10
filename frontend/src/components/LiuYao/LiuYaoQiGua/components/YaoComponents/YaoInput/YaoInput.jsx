/*
 * @file            frontend/src/components/LiuYao/components/YaoInput/YaoInput.jsx
 * @description     爻位输入框组件 - 用于显示和输入爻位数值
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-08 17:30:00
 * @lastModified    2026-03-08 15:06:26
 * Copyright © All rights reserved
*/

// 导入 React 核心库，用于创建 React 组件
import React from 'react';

// 导入 CSS Modules 样式文件
// 使用 CSS Modules 实现样式隔离，避免类名冲突
// styles 对象包含所有经过哈希处理的类名
import styles from './YaoInput.desktop.module.css';

/**
 * @description     爻位输入框组件
 *                   该组件用于显示和输入爻位的数值结果
 *                   支持两种模式：
 *                   1. 只读模式（默认）：用于展示投掷结果（如"2正1背"）
 *                   2. 可编辑模式：用于用户输入数字（如报数起卦）
 *                   支持占位符显示、状态样式、无障碍访问等特性
 * 
 * @param           {Object}     props                        - 组件属性对象
 * @param           {string}     props.value                  - 当前输入框的值
 * @param           {string}     [props.placeholder='待生成']  - 占位符文本
 * @param           {boolean}    [props.disabled=true]        - 是否禁用输入框
 * @param           {boolean}    [props.isPlaceholder=false]  - 是否处于占位符状态（只读模式）
 * @param           {boolean}    [props.editable=false]       - 是否可编辑（启用输入功能）
 * @param           {string}     [props.className='']         - 额外的 CSS 类名
 * @param           {Function}   [props.onChange]             - 输入变化回调函数（editable=true时生效）
 * @param           {Function}   [props.onInput]              - 输入事件回调函数（editable=true时生效）
 * @param           {Function}   [props.onDoubleClick]        - 双击事件回调函数（editable=true时生效）
 * @param           {Function}   [props.onFocus]              - 焦点事件回调函数（editable=true时生效）
 * @param           {Function}   [props.onBlur]               - 失焦事件回调函数（editable=true时生效）
 * @param           {Object}     [props.inputRef]             - 输入框 ref 引用（editable=true时生效）
 * @param           {string}     [props.type='text']          - 输入框类型
 * @param           {number}     [props.minLength]            - 最小输入长度
 * @param           {number}     [props.maxLength]            - 最大输入长度
 * @param           {string}     [props.pattern]              - 输入验证正则模式
 * @param           {boolean}    [props.isActive=false]       - 是否处于激活状态（可编辑模式下高亮）
 * 
 * @return          {JSX.Element}                           - 返回 React JSX 元素
 * 
 * @example
 * // 只读模式：显示投掷结果
 * <YaoInput 
 *   value="2正1背"
 *   isPlaceholder={false}
 *   disabled={true}
 * />
 * 
 * // 可编辑模式：用户输入
 * <YaoInput 
 *   value={value}
 *   editable={true}
 *   disabled={false}
 *   onChange={handleChange}
 *   onInput={handleInput}
 *   maxLength={3}
 *   pattern="\d{3}"
 * />
 */
const YaoInput = ({ 
  value,                          // 当前输入框的值
  placeholder = '待生成',         // 占位符文本，默认为"待生成"
  disabled = true,                // 是否禁用，默认为true
  isPlaceholder = false,          // 是否处于占位符状态（只读模式）
  editable = false,               // 是否可编辑，默认为false
  className = '',                 // 可选的额外类名
  onChange,                       // 输入变化回调函数
  onInput,                        // 输入事件回调函数
  onDoubleClick,                  // 双击事件回调函数
  onFocus,                        // 焦点事件回调函数
  onBlur,                         // 失焦事件回调函数
  inputRef,                       // 输入框 ref 引用
  type = 'text',                  // 输入框类型
  minLength,                      // 最小输入长度
  maxLength,                      // 最大输入长度
  pattern,                        // 输入验证正则模式
  isActive = false                // 是否处于激活状态
}) => {
  
  /**
   * @description     获取输入框的显示值
   *                   只读模式下：如果处于占位符状态，返回空字符串以显示占位符
   *                   可编辑模式下：直接返回 value
   * 
   * @return          {string}  - 输入框应显示的值
   */
  const getDisplayValue = () => {
    // 只读模式下，如果处于占位符状态，返回空字符串
    if (!editable && isPlaceholder) {
      return '';
    }
    // 否则返回实际的值
    return value;
  };
  
  /**
   * @description     构建输入框的 CSS 类名字符串
   *                   根据组件状态组合不同的类名：
   *                   - 基础类名：所有输入框共有
   *                   - 占位符状态类名（只读模式）
   *                   - 可编辑模式类名
   *                   - 激活状态类名（可编辑模式）
   *                   - 禁用状态类名（可编辑模式）
   *                   - 额外类名（父组件传入）
   * 
   * @return          {string}  - 完整的 CSS 类名字符串
   */
  const getInputClassName = () => {
    // 定义基础类名数组
    const classNames = [
      // 基础类名：所有输入框共有的样式
      styles.yaoValue
    ];
    
    // 只读模式下的占位符样式
    if (!editable && isPlaceholder) {
      classNames.push(styles.yaoValuePlaceholder);
    }
    
    // 可编辑模式下的样式
    if (editable) {
      classNames.push(styles.yaoValueEditable);
      
      // 激活状态样式（当前可输入）
      if (isActive) {
        classNames.push(styles.yaoValueActive);
      }
      
      // 禁用状态样式（不可输入）
      if (disabled) {
        classNames.push(styles.yaoValueDisabled);
      }
    }
    
    // 如果传入了额外的类名，添加到数组
    if (className) {
      classNames.push(className);
    }
    
    // 使用 filter 过滤掉 falsy 值，使用 join 连接成字符串
    return classNames.filter(Boolean).join(' ');
  };
  
  /**
   * @description     获取无障碍访问标签文本
   *                   根据组件状态生成描述性文本
   * 
   * @return          {string}  - ARIA 标签文本
   */
  const getAriaLabel = () => {
    if (editable) {
      // 可编辑模式
      if (disabled) {
        return `爻位输入框，当前值：${value || placeholder}，已禁用`;
      }
      if (isActive) {
        return `爻位输入框，当前值：${value}，可输入状态`;
      }
      return `爻位输入框，当前值：${value}`;
    }
    
    // 只读模式
    if (isPlaceholder) {
      return `爻位输入框，当前状态：${placeholder}`;
    }
    return `爻位输入框，当前值：${value}`;
  };
  
  /**
   * @description     渲染输入框组件
   *                   根据 editable 属性决定渲染模式：
   *                   - editable=false（默认）：只读展示模式
   *                   - editable=true：可编辑输入模式
   */
  return (
    <input
      // ref 引用（可编辑模式下使用）
      ref={inputRef}
      // 使用计算好的 CSS 类名
      className={getInputClassName()}
      // 设置占位符文本
      placeholder={placeholder}
      // 设置输入框的值
      value={getDisplayValue()}
      // 设置禁用状态
      disabled={disabled}
      // 输入框类型
      type={type}
      // 最小长度（可编辑模式下使用）
      minLength={minLength}
      // 最大长度（可编辑模式下使用）
      maxLength={maxLength}
      // 正则模式（可编辑模式下使用）
      pattern={pattern}
      // 只读属性：只读模式下强制只读，可编辑模式下根据 disabled 决定
      readOnly={!editable}
      // 输入变化事件（可编辑模式下使用）
      onChange={editable ? onChange : undefined}
      // 输入事件（可编辑模式下使用）
      onInput={editable ? onInput : undefined}
      // 双击事件（可编辑模式下使用）
      onDoubleClick={editable ? onDoubleClick : undefined}
      // 焦点事件（可编辑模式下使用）
      onFocus={editable ? onFocus : undefined}
      // 失焦事件（可编辑模式下使用）
      onBlur={editable ? onBlur : undefined}
      // aria-label 提供无障碍访问支持
      aria-label={getAriaLabel()}
      // aria-disabled 提供禁用状态信息
      aria-disabled={disabled}
    />
  );
};

/**
 * @description     导出 YaoInput 组件
 *                   使用默认导出，便于其他文件导入
 *                   导入方式：import YaoInput from './YaoInput';
 */
export default YaoInput;
