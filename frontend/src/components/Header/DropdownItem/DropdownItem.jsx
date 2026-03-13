/*
 * @file            frontend/src/components/Header/DropdownItem/DropdownItem.jsx
 * @description     下拉菜单项组件，负责单个菜单项的渲染，包含图标、标题和描述文字
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-07 11:00:00
 * @lastModified    2026-03-13 00:00:00
 * Copyright © All rights reserved
*/

import React from 'react'; // 导入React核心库，用于创建React组件
import desktopStyles from './DropdownItem.desktop.module.css'; // 导入桌面端样式
import mobileStyles from './DropdownItem.mobile.module.css'; // 导入移动端样式

// 检测设备类型
const isMobile = () => {
  return window.innerWidth < 768;
};

// 定义DropdownItem组件，接收以下属性：
// title - 菜单项标题，默认为空字符串
// description - 菜单项描述文字，默认为空字符串
// href - 链接地址，默认为 '#'
// icon - 图标，可以是字符串或React元素，默认为null
const DropdownItem = ({ title = '', description = '', href = '#', icon = null }) => {
  // 定义renderIcon函数，用于渲染图标部分
  const renderIcon = () => {
    // 获取当前设备的样式
    const styles = isMobile() ? mobileStyles : desktopStyles;
    
    // 如果图标不存在，返回null，不渲染图标
    if (!icon) return null;

    // 如果图标是字符串类型，渲染为文本图标
    if (typeof icon === 'string') {
      return <span className={styles.dropdownColIconText}>{icon}</span>; // 渲染文本图标
    }

    // 如果图标是React元素，渲染为图标容器
    return (
      <div className={styles.dropdownColIcon}> // 渲染图标容器
        {icon} // 渲染React元素图标
      </div>
    );
  };

  // 获取当前设备的样式
  const styles = isMobile() ? mobileStyles : desktopStyles;
  
  // 返回组件的JSX结构
  return (
    <a href={href} className={styles.dropdownColLink}> {/* 渲染链接元素，应用下拉菜单链接样式 */}
      {renderIcon()} {/* 调用renderIcon函数渲染图标 */}
      <div className={styles.dropdownColText}> {/* 渲染文本容器，包含标题和描述 */}
        <span className={styles.dropdownColTitle}>{title}</span> {/* 渲染菜单项标题 */}
        {description && ( // 如果存在描述文字，则渲染描述
          <span className={styles.dropdownColDesc}>{description}</span> // 渲染菜单项描述
        )}
      </div>
    </a>
  );
};

export default DropdownItem; // 导出DropdownItem组件作为默认导出，供其他组件使用
