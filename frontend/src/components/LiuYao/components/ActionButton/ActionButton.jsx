/*
 * @file            frontend/src/components/LiuYao/components/ActionButton/ActionButton.jsx
 * @description     操作按钮组件 - 用于六爻起卦方法中的操作按钮（投掷、重置、生成等）
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-08 18:10:00
 * @lastModified    2026-03-10 13:53:20
 * Copyright © All rights reserved
*/

// 导入 React 核心库，用于创建 React 组件
import React from 'react';

// 导入 CSS Modules 样式文件
// 使用 CSS Modules 实现样式隔离，避免类名冲突
// styles 对象包含所有经过哈希处理的类名
import styles from './ActionButton.desktop.module.css';

/**
 * @description     操作按钮组件
 *                   用于六爻起卦方法中的各种操作按钮
 *                   支持多种类型、大小、状态的按钮
 *                   支持响应式设计，适配桌面端和移动端
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
 * 
 * @example
 * // 主要操作按钮（投掷）
 * <ActionButton 
 *   type="primary"
 *   onClick={handleThrow}
 *   disabled={isDisabled}
 * >
 *   投掷初爻
 * </ActionButton>
 * 
 * // 次要操作按钮（重置）
 * <ActionButton 
 *   type="secondary"
 *   onClick={handleReset}
 *   disabled={!isResetEnabled}
 * >
 *   重新投掷
 * </ActionButton>
 * 
 * // 危险操作按钮
 * <ActionButton 
 *   type="danger"
 *   onClick={handleDelete}
 * >
 *   清空数据
 * </ActionButton>
 * 
 * // 加载状态
 * <ActionButton 
 *   type="primary"
 *   loading={isLoading}
 *   disabled={isLoading}
 * >
 *   生成卦象
 * </ActionButton>
 */
const ActionButton = ({
  children,               // 按钮文本内容
  onClick,                // 点击事件回调函数
  type = 'primary',       // 按钮类型，默认为 'primary'
  size = 'medium',        // 按钮大小，默认为 'medium'
  disabled = false,       // 是否禁用，默认为 false
  loading = false,        // 是否显示加载状态，默认为 false
  className = '',         // 额外的 CSS 类名
  ref,                   // 按钮 ref 引用
  ariaLabel,             // 无障碍访问标签
  style                   // 行内样式对象
}) => {
  
  /**
   * @description     构建按钮的 CSS 类名字符串
   *                   组合基础类名、类型类名、大小类名、状态类名和额外类名
   *                   使用数组过滤和连接，确保类名格式正确
   * 
   * @return          {string}  - 完整的 CSS 类名字符串
   */
  const getButtonClassName = () => {
    // 定义基础类名数组
    const classNames = [
      // 基础类名：所有按钮共有的样式
      styles.actionButton,
      // 类型类名：根据 type 属性添加对应的样式类
      // 例如：actionButtonPrimary, actionButtonSecondary, actionButtonDanger
      styles[`actionButton${type.charAt(0).toUpperCase() + type.slice(1)}`],
      // 大小类名：根据 size 属性添加对应的样式类
      // 例如：actionButtonSmall, actionButtonMedium, actionButtonLarge
      styles[`actionButton${size.charAt(0).toUpperCase() + size.slice(1)}`]
    ];
    
    // 如果按钮被禁用，添加禁用状态类名
    if (disabled) {
      classNames.push(styles.actionButtonDisabled);
    }
    
    // 如果按钮处于加载状态，添加加载状态类名
    if (loading) {
      classNames.push(styles.actionButtonLoading);
    }
    
    // 如果传入了额外的类名，添加到数组
    if (className) {
      classNames.push(className);
    }
    
    // 使用 filter 过滤掉 falsy 值（null, undefined, 空字符串）
    // 使用 join(' ') 将类名数组连接成字符串，用空格分隔
    return classNames.filter(Boolean).join(' ');
  };
  
  /**
   * @description     处理按钮点击事件
   *                   只有在按钮未禁用且非加载状态时才执行回调
   * 
   * @param           {Event}     e - 点击事件对象
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
   * @description     获取无障碍访问标签文本
   *                   如果传入了 ariaLabel，则使用传入的值
   *                   否则使用按钮文本内容
   * 
   * @return          {string}  - ARIA 标签文本
   */
  const getAriaLabel = () => {
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
   * @description     渲染按钮组件
   *                   根据按钮状态渲染不同的内容：
   *                   - 加载状态：显示加载指示器
   *                   - 普通状态：显示按钮文本
   */
  return (
    // button 元素作为按钮的根节点
    <button
      // ref 引用
      ref={ref}
      // 使用计算好的 CSS 类名
      className={getButtonClassName()}
      // 点击事件处理函数
      onClick={handleClick}
      // 禁用状态
      disabled={disabled || loading}
      // 无障碍访问标签
      aria-label={getAriaLabel()}
      // aria-disabled 提供禁用状态信息
      aria-disabled={disabled || loading}
      // aria-busy 提供加载状态信息
      aria-busy={loading}
      // 行内样式
      style={style}
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
};

/**
 * @description     导出 ActionButton 组件
 *                   使用默认导出，便于其他文件导入
 *                   导入方式：import ActionButton from './ActionButton';
 */
export default ActionButton;
