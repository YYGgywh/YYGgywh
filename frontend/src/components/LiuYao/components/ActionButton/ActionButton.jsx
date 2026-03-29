/*
 * @file            frontend/src/components/LiuYao/components/ActionButton/ActionButton.jsx
 * @description     操作按钮组件 - 用于六爻起卦方法中的操作按钮（投掷、重置、生成等）
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-08 18:10:00
 * @lastModified    2026-03-28 17:27:39
 * Copyright © All rights reserved
*/

// 导入 React 核心库，用于创建 React 组件
import React, { useState, useEffect } from 'react';

// 导入统一的按钮组件
import Button from '../../../common/Button/Button';

// 导入样式文件
import desktopStyles from './ActionButton.desktop.module.css';
import mobileStyles from './ActionButton.mobile.module.css';

/**
 * @description     操作按钮组件
 *                   用于六爻起卦方法中的各种操作按钮
 *                   支持单个按钮和按钮组两种模式
 * 
 * @param           {Object}     props                  - 组件属性对象
 * @param           {string}     props.children         - 按钮文本内容或子按钮数组
 * @param           {Function}   props.onClick          - 点击事件回调函数（单个按钮模式）
 * @param           {string}     [props.type='primary'] - 按钮类型：'primary', 'secondary', 'danger'
 * @param           {string}     [props.size='medium']  - 按钮大小：'small', 'medium', 'large'
 * @param           {boolean}    [props.disabled=false] - 是否禁用按钮
 * @param           {boolean}    [props.loading=false]  - 是否显示加载状态
 * @param           {string}     [props.className='']   - 额外的 CSS 类名
 * @param           {Object}     [props.ref]           - 按钮 ref 引用
 * @param           {string}     [props.ariaLabel]     - 无障碍访问标签
 * @param           {Object}     [props.style]         - 行内样式对象
 * @param           {string}     [props.orientation='horizontal'] - 按钮组排列方向：'horizontal' 或 'vertical'
 * 
 * @return          {JSX.Element}                     - 返回 React JSX 元素
 */
const ActionButton = ({
  children, /* 按钮文本内容或子按钮数组 */
  onClick, /* 点击事件回调函数（单个按钮模式） */
  type = 'primary', /* 按钮类型：'primary', 'secondary', 'danger', 'confirm' */
  size = 'medium', /* 按钮大小：'small', 'medium', 'large' */
  disabled = false, /* 是否禁用按钮 */
  loading = false, /* 是否显示加载状态 */
  className = '', /* 额外的 CSS 类名 */
  ref, /* 按钮 ref 引用 */
  ariaLabel, /* 无障碍访问标签 */
  style, /* 行内样式对象 */
  orientation = 'horizontal', /* 按钮组排列方向 */
  ...props
}) => {
  // 移动端状态管理
  const [isMobile, setIsMobile] = useState(() => {
    return window.innerWidth < 768;
  });
  
  // 监听窗口大小变化，更新移动端状态
  useEffect(() => {
    const handleResize = () => {
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 100);
    };
    
    // 初始执行一次
    handleResize();
    // 添加窗口大小变化监听器
    window.addEventListener('resize', handleResize);
    // 组件卸载时移除监听器
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(window.resizeTimeout);
    };
  }, []);
  
  // 根据屏幕尺寸选择样式
  const currentStyles = isMobile ? mobileStyles : desktopStyles;

  // 检查是否为按钮组模式
  const isButtonGroup = React.Children.count(children) > 1 || (React.isValidElement(children) && children.type === ActionButton);

  if (isButtonGroup) {
    // 按钮组模式
    return (
      <div className={`${currentStyles.buttonGroup} ${currentStyles[`buttonGroup${orientation.charAt(0).toUpperCase() + orientation.slice(1)}`]} ${className}`} style={style}>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              key: index,
              size: size // 继承父组件的尺寸
            });
          }
          return child;
        })}
      </div>
    );
  } else {
    // 单个按钮模式
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
        {...props}
      >
        {children}
      </Button>
    );
  }
};

/**
 * @description     导出 ActionButton 组件
 *                   使用默认导出，便于其他文件导入
 *                   导入方式：import ActionButton from './ActionButton';
 */
export default ActionButton;
