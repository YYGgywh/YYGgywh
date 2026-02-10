// 路径:src/components/Header/DropdownMenu/DropdownMenu.jsx 时间:2026-02-07 14:30
// 功能:下拉菜单组件，负责多列布局和内容渲染
import React from 'react';
import styles from './DropdownMenu.module.css';
import DropdownColumn from '../DropdownColumn/DropdownColumn';

const DropdownMenu = ({ columns = [], className = '' }) => {
  if (!columns || columns.length === 0) {
    return null;
  }

  return (
    <div className={`${styles.dropdownMenuRich} ${className}`}>
      <div className={styles.dropdownMenuContent}>
        {columns.map((column, index) => (
          <DropdownColumn 
            key={index}
            title={column.title}
            className={column.className}
            items={column.items}
          />
        ))}
      </div>
    </div>
  );
};

export default DropdownMenu;
