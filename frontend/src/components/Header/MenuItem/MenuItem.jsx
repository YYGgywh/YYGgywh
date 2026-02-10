// 路径:src/components/MenuItem/MenuItem.jsx 时间:2026-02-07 14:30
// 功能:导航菜单项组件，支持下拉菜单和激活状态，使用DropdownMenu组件渲染下拉内容
import React, { useState, useRef, useEffect } from 'react';
import './MenuItem.css';
import DropdownMenu from '../DropdownMenu/DropdownMenu';

const MenuItem = ({ name, hasDropdown = false, dropdownItems = [], dropdownConfig = null, isActive = false, onClick }) => {
  // 默认隐藏下拉菜单
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownTimerRef = useRef(null);

  // 鼠标移入处理函数
  const handleMouseEnter = () => {
    if (hasDropdown) {
      if (dropdownTimerRef.current) {
        clearTimeout(dropdownTimerRef.current);
        dropdownTimerRef.current = null;
      }
      setIsDropdownOpen(true);
    }
  };

  // 鼠标移出处理函数
  const handleMouseLeave = () => {
    if (hasDropdown) {
      dropdownTimerRef.current = setTimeout(() => {
        setIsDropdownOpen(false);
      }, 200);
    }
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (dropdownTimerRef.current) {
        clearTimeout(dropdownTimerRef.current);
      }
    };
  }, []);

  const renderSimpleDropdown = () => (
    <ul 
      className="dropdown-menu dropdown-menu-simple"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {dropdownItems.map((item, index) => (
        <li key={index}>
          <a href="#" className="dropdown-item">
            {item}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <li 
      className="menu-item"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a 
        href="#" 
        className={`menu-link ${isActive ? 'active' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
      >
        {name}
        {hasDropdown && (
          <svg 
            className="dropdown-arrow" 
            width="12" 
            height="12" 
            viewBox="0 0 12 12" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M6 8L2 4H10L6 8Z" 
              fill="currentColor"
            />
          </svg>
        )}
      </a>
      {hasDropdown && isDropdownOpen && (
        dropdownConfig ? (
          <DropdownMenu 
            columns={dropdownConfig.columns}
            className="community"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        ) : (
          renderSimpleDropdown()
        )
      )}
    </li>
  );
};

export default MenuItem;
