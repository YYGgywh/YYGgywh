/*
 * @file            frontend/src/components/common/Button/Button.jsx
 * @description     基础按钮组件，提供统一的按钮样式和功能
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-15 15:00:00
 * @lastModified    2026-03-15 15:56:47
 * Copyright © All rights reserved
*/

// 导入 React 核心库
import React from 'react';
// 导入 PropTypes 用于类型检查
import PropTypes from 'prop-types';
// 导入 CSS Modules 样式文件
import styles from './Button.desktop.module.css';

/**
 * 基础按钮组件
 * 使用 React.memo 进行性能优化，避免不必要的重渲染
 */
const Button = React.memo(({
  children,           // 按钮文本或子元素
  onClick,            // 点击事件回调函数
  type = 'primary',   // 按钮类型，默认为 primary
  size = 'medium',    // 按钮尺寸，默认为 medium
  disabled = false,   // 是否禁用，默认为 false
  loading = false,    // 是否显示加载状态，默认为 false
  className = '',     // 额外的 CSS 类名
  style = {},         // 行内样式对象
  ref,               // 按钮 ref 引用
  ariaLabel,         // 无障碍访问标签
  ...props           // 其他属性，会传递给底层 button 元素
}) => {
  /**
   * 构建按钮的 CSS 类名字符串
   * @returns {string} 完整的 CSS 类名字符串
   */
  const getButtonClassName = () => {
    // 定义基础类名数组
    const classNames = [
      styles.button,  // 基础按钮样式
      // 根据 type 属性添加对应的样式类（如 buttonPrimary）
      styles[`button${type.charAt(0).toUpperCase() + type.slice(1)}`],
      // 根据 size 属性添加对应的样式类（如 buttonMedium）
      styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}`]
    ];
    
    // 如果按钮被禁用，添加禁用状态类名
    if (disabled) {
      classNames.push(styles.buttonDisabled);
    }
    
    // 如果按钮处于加载状态，添加加载状态类名
    if (loading) {
      classNames.push(styles.buttonLoading);
    }
    
    // 如果传入了额外的类名，添加到数组
    if (className) {
      classNames.push(className);
    }
    
    // 过滤掉 falsy 值并连接成字符串
    return classNames.filter(Boolean).join(' ');
  };
  
  /**
   * 处理按钮点击事件
   * @param {Event} e - 点击事件对象
   */
  const handleClick = (e) => {
    // 如果按钮被禁用或处于加载状态，不执行任何操作
    if (disabled || loading) {
      return;
    }
    // 执行点击回调函数
    if (onClick) {
      onClick(e);
    }
  };
  
  /**
   * 获取无障碍访问标签文本
   * @returns {string} ARIA 标签文本
   */
  const getAriaLabel = () => {
    // 如果传入了 ariaLabel，使用传入的值
    if (ariaLabel) {
      return ariaLabel;
    }
    // 如果 children 是字符串，直接使用
    if (typeof children === 'string') {
      return children;
    }
    // 否则返回默认标签
    return '操作按钮';
  };
  
  /**
   * 渲染按钮组件
   */
  return (
    // 使用原生 button 元素作为根节点
    <button
      // 传递 ref 引用
      ref={ref}
      // 使用计算好的 CSS 类名
      className={getButtonClassName()}
      // 绑定点击事件处理函数
      onClick={handleClick}
      // 禁用状态（禁用或加载中时禁用）
      disabled={disabled || loading}
      // 无障碍访问标签
      aria-label={getAriaLabel()}
      // 无障碍禁用状态
      aria-disabled={disabled || loading}
      // 无障碍加载状态
      aria-busy={loading}
      // 行内样式
      style={style}
      // 传递其他属性
      {...props}
    >
      {/* 加载状态指示器 */}
      {loading && (
        <span className={styles.loadingIndicator}>
          <span className={styles.loadingSpinner}></span>
        </span>
      )}
      {/* 按钮文本内容 */}
      <span className={styles.buttonText}>
        {children}
      </span>
    </button>
  );
});

/**
 * 组件属性类型检查
 */
Button.propTypes = {
  children: PropTypes.node.isRequired,  // 子元素，必需
  onClick: PropTypes.func,             // 点击事件回调
  type: PropTypes.oneOf(['primary', 'secondary', 'danger', 'text']),  // 按钮类型
  size: PropTypes.oneOf(['small', 'medium', 'large']),  // 按钮尺寸
  disabled: PropTypes.bool,            // 是否禁用
  loading: PropTypes.bool,             // 是否加载中
  className: PropTypes.string,         // 额外类名
  style: PropTypes.object,             // 行内样式
  ref: PropTypes.any,                  // ref 引用
  ariaLabel: PropTypes.string          // 无障碍标签
};

// 导出 Button 组件
export default Button;