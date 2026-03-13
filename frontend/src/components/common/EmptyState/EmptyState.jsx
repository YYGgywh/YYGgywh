/*
 * @file            frontend/src/components/common/EmptyState/EmptyState.jsx
 * @description     空状态组件，用于展示空数据状态
 *                  提供友好的用户提示和操作按钮
 *                  使用 CSS Modules 实现样式隔离
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-01-27 16:33:00
 * @lastModified    2026-03-13 11:30:00
 * Copyright © All rights reserved
*/

import React from 'react'; // 导入React核心库，用于创建React组件

// 根据设备类型导入不同的样式
const isMobile = window.innerWidth < 768;
const styles = isMobile 
  ? require("./EmptyState.mobile.module.css").default
  : require("./EmptyState.desktop.module.css").default;

/**
 * EmptyState组件 - 空状态展示组件
 * 用于在数据为空时展示友好的提示信息和可选的操作按钮
 * @param {Object} props - 组件属性对象
 * @param {string} [props.message='暂无数据'] - 空状态提示消息文本
 * @param {string} [props.actionText] - 操作按钮的文本，可选参数
 * @param {Function} [props.onAction] - 操作按钮的点击回调函数，可选参数
 * @returns {JSX.Element} 返回渲染的空状态组件元素
 */
const EmptyState = ({ message = '暂无数据', actionText, onAction }) => {
  // 返回JSX，渲染空状态组件
  return (
    <div className={styles.emptyState}> {/* 空状态容器，应用CSS Modules样式 */}
      <div className={styles.emptyIcon}> {/* 空状态图标容器 */}
        {/* 空状态图标SVG - 使用圆形和加号表示空状态 */}
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 外圆 - 表示空状态的圆形边框 */}
          <circle cx="32" cy="32" r="30" stroke="#e8e8e8" strokeWidth="2"/>
          {/* 水平线 - 加号的水平部分 */}
          <path d="M24 32h16" stroke="#e8e8e8" strokeWidth="2" strokeLinecap="round"/>
          {/* 垂直线 - 加号的垂直部分 */}
          <path d="M32 24v16" stroke="#e8e8e8" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      {/* 空状态消息文本 - 显示传入的message或默认值 */}
      <p className={styles.emptyMessage}>{message}</p>
      {/* 条件渲染操作按钮 - 只有当actionText和onAction都存在时才显示 */}
      {actionText && onAction && (
        <button className={styles.emptyAction} onClick={onAction}> {/* 操作按钮，点击时触发onAction回调 */}
          {actionText} {/* 按钮文本内容 */}
        </button>
      )}
    </div>
  );
};

export default EmptyState; // 导出EmptyState组件作为默认导出，供其他组件使用