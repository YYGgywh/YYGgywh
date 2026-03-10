/*
 * @file            frontend/src/components/DivinationInfo/components/FormComponents/GenderSelector/GenderSelector.jsx
 * @description     性别选择组件，提供男/女单选按钮功能
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-09 18:45:00
 * @lastModified    2026-03-09 18:45:00
 * Copyright © All rights reserved
*/

import React from 'react'; // 引入React核心库，用于构建用户界面
import styles from './GenderSelector.desktop.module.css'; // 导入桌面端样式文件

/**
 * 性别选择组件
 * 提供男/女单选按钮，支持自定义样式
 * @param {Object} props - 组件属性
 * @param {string} props.selectedGender - 当前选中的性别
 * @param {function} props.onGenderChange - 性别选择变化时的回调函数，接收新的性别值作为参数
 * @param {string} props.className - 自定义类名，用于覆盖或扩展默认样式
 * @param {string} props.variant - 组件样式变体，用于设置不同的样式
 * @returns {JSX.Element} - 性别选择组件
 */
const GenderSelector = ({ 
  selectedGender, // 当前选中的性别
  onGenderChange, // 性别选择变化回调函数
  className, // 自定义类名
  variant // 样式变体
}) => {
  // 性别选项数组
  const genderOptions = ['男', '女'];

  // 合并类名：基础样式 + 变体样式 + 自定义类名
  const combinedClassName = [
    styles.genderRadioContainer, // 基础性别选择容器样式
    variant && styles[variant], // 如果提供了变体，则添加对应样式
    className // 自定义类名
  ].filter(Boolean).join(' '); // 过滤掉false值并拼接为字符串

  // 渲染性别选择组件
  return (
    <div className={combinedClassName}> {/* 性别选择组件容器 */}
      <div className={styles.radioGroup}> {/* 性别选择组件单选按钮组 */}
        {/* 遍历性别选项，渲染每个单选按钮 */}
        {genderOptions.map((gender) => (
          <label 
            key={gender} 
            className={styles.radioLabel} 
            htmlFor={`gender-${gender}`} // 关联label和input
          > {/* 性别选择组件单选按钮标签 */}
            {/* 隐藏的原生单选按钮 */}
            <input
              id={`gender-${gender}`} // 性别选择组件单选按钮ID
              type="radio" // 性别选择组件单选按钮类型
              name="gender" // 性别选择组件单选按钮名称
              value={gender} // 性别选择组件单选按钮值
              checked={selectedGender === gender} // 性别选择组件单选按钮是否选中
              onChange={(e) => onGenderChange(e.target.value)} // 性别选择组件单选按钮改变事件
              className={styles.radioInput} // 性别选择组件单选按钮类名
            />
            <span className={styles.radioCustom}></span> {/* 自定义单选按钮样式 */}
            <span className={styles.radioText}>{gender}</span> {/* 性别选择组件单选按钮文本 */}
          </label>
        ))}
      </div>
    </div>
  );
};

// 导出GenderSelector组件作为默认导出
export default GenderSelector;
