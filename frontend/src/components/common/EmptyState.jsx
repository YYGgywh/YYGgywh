import React from 'react';
import './EmptyState.css';

/**
 * 空状态组件
 * @param {Object} props 组件属性
 * @param {string} props.message 空状态消息
 * @param {string} props.actionText 按钮文本
 * @param {Function} props.onAction 按钮点击回调
 */
const EmptyState = ({ message = '暂无数据', actionText, onAction }) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" stroke="#e8e8e8" strokeWidth="2"/>
          <path d="M24 32h16" stroke="#e8e8e8" strokeWidth="2" strokeLinecap="round"/>
          <path d="M32 24v16" stroke="#e8e8e8" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <p className="empty-message">{message}</p>
      {actionText && onAction && (
        <button className="empty-action" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;