/*
 * @file            frontend/src/components/Header/DropdownColumn/DropdownColumn.jsx
 * @description     下拉菜单列组件，负责单列的渲染，包含分类标题和菜单项列表
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-07 14:30:00
 * @lastModified    2026-02-16 15:17:09
 * Copyright © All rights reserved
*/

import React from 'react'; // 导入React核心库
import styles from './DropdownColumn.module.css'; // 导入下拉菜单列组件样式
import DropdownItem from '../DropdownItem/DropdownItem'; // 导入下拉菜单项组件

// 定义DropdownColumn组件，接收title、className、items参数
const DropdownColumn = ({ title = '', className = '', items = [] }) => {
  // 检查items是否存在或为空
  if (!items || items.length === 0) {
    return null; // 如果为空，返回null
  }

  // 返回JSX
  return (
    <dl className={`${styles.dropdownCol} ${className}`}> {/* 渲染定义列表元素，应用动态类名 */}
      {title && <dt className={`${styles.dropdownCol} ${styles.dropdownColTitle}`}>{title}</dt>} {/* 如果有标题，渲染定义列表标题 */}
      {/* 遍历items数组，渲染每个菜单项 */}
      {items.map((item, index) => (
        <dd key={index} className={styles.dropdownColItem}> {/* 渲染定义列表描述项，使用index作为key */}
          <DropdownItem {...item} /> {/* 渲染下拉菜单项组件，传递item的所有属性 */}
        </dd> // 结束定义列表描述项
      ))}
    </dl>
  );
};

export default DropdownColumn; // 导出DropdownColumn组件作为默认导出
