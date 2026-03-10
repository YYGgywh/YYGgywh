/*
 * @file            frontend/src/components/DivinationInfo/components/FormComponents/NumberInput/NumberInput.jsx
 * @description     可复用的数字输入框组件，支持位数限制、最大值、最小值和自动补零功能
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-09 18:30:00
 * @lastModified    2026-03-09 18:33:51
 * Copyright © All rights reserved
*/

import React from 'react'; // 引入React核心库，用于构建用户界面
import styles from './NumberInput.desktop.module.css'; // 导入桌面端样式文件

/**
 * 可复用的数字输入框组件
 * @param {Object} props - 组件属性
 * @param {string} props.value - 当前输入值
 * @param {function} props.onChange - 输入值变化时的回调函数，接收处理后的值作为参数
 * @param {function} props.onBlur - 失去焦点时的回调函数，接收处理后的值作为参数
 * @param {function} props.onDoubleClick - 双击输入框时的回调函数
 * @param {string} props.className - 自定义类名，用于覆盖或扩展默认样式
 * @param {number} props.maxLength - 最大输入长度，默认为4位
 * @param {number} props.maxValue - 允许输入的最大值，默认为9999
 * @param {number} props.minValue - 允许输入的最小值，默认为0
 * @param {number} props.padLength - 自动补零的目标长度，默认为4位
 * @param {string} props.placeholder - 输入框占位符文本
 * @param {string} props.variant - 输入框样式变体，用于设置不同的宽度和样式
 * @param {Object} props... - 其他输入框原生属性
 * @returns {JSX.Element} - 数字输入框组件
 */
const NumberInput = ({ 
  value, // 当前输入值，字符串类型
  onChange, // 输入值变化回调函数
  onBlur, // 失去焦点回调函数
  onDoubleClick, // 双击事件回调函数
  className, // 自定义类名
  maxLength = 4, // 最大输入长度，默认为4位
  maxValue = 9999, // 允许输入的最大值，默认为9999
  minValue = 0, // 允许输入的最小值，默认为0
  padLength = 4, // 自动补零的目标长度，默认为4位
  placeholder = '', // 占位符文本，默认为空字符串
  variant, // 样式变体
  ...props // 其他原生input属性
}) => {
  /**
   * 处理输入变化事件
   * 限制输入内容为数字，并根据maxLength和maxValue进行限制
   * @param {Event} e - 输入事件对象
   */
  const handleChange = (e) => {
    // 使用正则表达式移除所有非数字字符，只保留数字
    let inputValue = e.target.value.replace(/\D/g, '');

    // 限制输入长度：如果输入长度超过maxLength，截取前maxLength位
    if (inputValue.length > maxLength) {
      inputValue = inputValue.slice(0, maxLength);
    }

    // 限制最大值：如果输入长度等于maxLength且数值超过maxValue，设置为maxValue
    if (inputValue.length === maxLength && parseInt(inputValue) > maxValue) {
      inputValue = maxValue.toString();
    }
    
    // 触发onChange回调，传递处理后的值
    onChange(inputValue);
  };

  /**
   * 处理失去焦点事件
   * 自动补零并校验最小值
   */
  const handleBlur = () => {
    // 检查是否有输入值且长度小于padLength，需要进行补零处理
    if (value && value.length > 0 && value.length < padLength) {
      // 使用padStart方法在字符串左侧补零，直到达到padLength长度
      const paddedValue = value.padStart(padLength, '0');
      
      // 校验最小值：如果补零后的值小于minValue，清空输入
      if (parseInt(paddedValue) < minValue) {
        onChange(''); // 小于最小值，清空输入
      } else {
        onChange(paddedValue); // 大于等于最小值，使用补零后的值
      }
    }
    
    // 如果提供了onBlur回调，触发它
    if (onBlur) {
      onBlur(value);
    }
  };

  // 合并类名：基础样式 + 变体样式 + 自定义类名
  const combinedClassName = [
    styles.numberInput, // 基础数字输入框样式
    variant && styles[variant], // 如果提供了变体，则添加对应样式
    className // 自定义类名
  ].filter(Boolean).join(' '); // 过滤掉false值并拼接为字符串

  // 渲染数字输入框元素
  return (
    <input
      type="number" // 设置输入框类型为数字
      placeholder={placeholder} // 设置占位符文本
      value={value} // 设置当前值
      onChange={handleChange} // 绑定输入变化事件处理函数
      onBlur={handleBlur} // 绑定失去焦点事件处理函数
      onDoubleClick={onDoubleClick} // 绑定双击事件处理函数
      className={combinedClassName} // 设置合并后的类名
      maxLength={maxLength} // 设置最大输入长度
      {...props} // 展开其他原生input属性
    />
  );
};

// 导出NumberInput组件作为默认导出
export default NumberInput;
