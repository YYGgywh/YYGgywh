/* 路径:src/components/Header/DropdownItem/DropdownItem.jsx 时间:2026-02-07 11:00 */
/* 功能:下拉菜单项组件，负责单个菜单项的渲染，包含图标、标题和描述文字 */
import React from 'react';
import './DropdownItem.css';

const DropdownItem = ({ title = '', description = '', href = '#', icon = null }) => {
  const renderIcon = () => {
    if (!icon) return null;

    if (typeof icon === 'string') {
      return <span className="dropdown-col-icon-text">{icon}</span>;
    }

    return (
      <div className="dropdown-col-icon">
        {icon}
      </div>
    );
  };

  return (
    <a href={href} className="dropdown-col-link">
      {renderIcon()}
      <div className="dropdown-col-text">
        <span className="dropdown-col-title">{title}</span>
        {description && (
          <span className="dropdown-col-desc">{description}</span>
        )}
      </div>
    </a>
  );
};

export default DropdownItem;
