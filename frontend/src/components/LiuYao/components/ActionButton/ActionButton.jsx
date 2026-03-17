/*
 * @file            frontend/src/components/LiuYao/components/ActionButton/ActionButton.jsx
 * @description     操作按钮组件 - 用于六爻起卦方法中的操作按钮（投掷、重置、生成等）
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-08 18:10:00
 * @lastModified    2026-03-15 20:30:17
 * Copyright © All rights reserved
*/

// 导入 React 核心库，用于创建 React 组件
import React from 'react';

// 导入统一的按钮组件
import { Button } from '../../../common/Button';

/**
 * @description     操作按钮组件
 *                   用于六爻起卦方法中的各种操作按钮
 *                   基于统一的 Button 组件，保持 API 兼容性
 * 
 * @param           {Object}     props                  - 组件属性对象
 * @param           {string}     props.children         - 按钮文本内容
 * @param           {Function}   props.onClick          - 点击事件回调函数
 * @param           {string}     [props.type='primary'] - 按钮类型：'primary', 'secondary', 'danger'
 * @param           {string}     [props.size='medium']  - 按钮大小：'small', 'medium', 'large'
 * @param           {boolean}    [props.disabled=false] - 是否禁用按钮
 * @param           {boolean}    [props.loading=false]  - 是否显示加载状态
 * @param           {string}     [props.className='']   - 额外的 CSS 类名
 * @param           {Object}     [props.ref]           - 按钮 ref 引用
 * @param           {string}     [props.ariaLabel]     - 无障碍访问标签
 * @param           {Object}     [props.style]         - 行内样式对象
 * 
 * @return          {JSX.Element}                     - 返回 React JSX 元素
 */
const ActionButton = ({
  children, /* 按钮文本内容 */
  onClick, /* 点击事件回调函数 */
  type = 'primary', /* 按钮类型：'primary', 'secondary', 'danger', 'confirm' */
  size = 'medium', /* 按钮大小：'small', 'medium', 'large' */
  disabled = false, /* 是否禁用按钮 */
  loading = false, /* 是否显示加载状态 */
  className = '', /* 额外的 CSS 类名 */
  ref, /* 按钮 ref 引用 */
  ariaLabel, /* 无障碍访问标签 */
  style /* 行内样式对象 */
}) => {
  return (
    <Button
      ref={ref} 
      type={type}
      size={size}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      className={className}
      style={style}
      ariaLabel={ariaLabel}
    >
      {children}
    </Button>
  );
};

/**
 * @description     导出 ActionButton 组件
 *                   使用默认导出，便于其他文件导入
 *                   导入方式：import ActionButton from './ActionButton';
 */
export default ActionButton;
