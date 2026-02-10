// 路径:src/components/Header/DropdownColumn/DropdownColumn.jsx 时间:2026-02-07 14:30
// 功能:下拉菜单列组件，负责单列的渲染，包含分类标题和菜单项列表
import React from 'react';
import styles from './DropdownColumn.module.css';
import DropdownItem from '../DropdownItem/DropdownItem';

const DropdownColumn = ({ title = '', className = '', items = [] }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <dl className={`${styles.dropdownCol} ${className}`}>
      {title && <dt className={`${styles.dropdownCol} ${styles.dropdownColTitle}`}>{title}</dt>}
      {items.map((item, index) => (
        <dd key={index} className={styles.dropdownColItem}>
          <DropdownItem {...item} />
        </dd>
      ))}
    </dl>
  );
};

export default DropdownColumn;
