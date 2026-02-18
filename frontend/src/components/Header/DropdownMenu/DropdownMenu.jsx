/*
 * @file            frontend/src/components/Header/DropdownMenu/DropdownMenu.jsx
 * @description     下拉菜单组件，负责多列布局和内容渲染
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-07 14:30:00
 * @lastModified    2026-02-16 19:55:46
 * Copyright © All rights reserved
*/

import React from 'react'; // 导入React核心库
import styles from './DropdownMenu.module.css'; // 导入下拉菜单组件样式
import DropdownColumn from '../DropdownColumn/DropdownColumn'; // 导入下拉菜单列组件

// 定义DropdownMenu组件，接收columns、className参数
const DropdownMenu = ({ columns = [], className = '' }) => {
  // 检查columns是否存在或为空
  if (!columns || columns.length === 0) {
    return null; // 如果为空，返回null
  }

  // 返回JSX
  return (
    <div className={`${styles.dropdownMenuRich} ${className}`}> {/* 渲染下拉菜单容器，应用动态类名 */}
      <div className={styles.dropdownMenuContent}> {/* 渲染下拉菜单内容容器 */}
        {/* 遍历columns数组，渲染每个菜单列 */}
        {columns.map((column, index) => (
          <DropdownColumn // 渲染下拉菜单列组件
            key={index} // 使用index作为key
            title={column.title} // 传递列标题
            className={column.className} // 传递列类名
            items={column.items} // 传递列菜单项
          />
        ))}
      </div>
    </div>
  );
};

export default DropdownMenu; // 导出DropdownMenu组件作为默认导出
