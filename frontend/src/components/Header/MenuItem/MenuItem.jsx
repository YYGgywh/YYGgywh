/*
 * @file            frontend/src/components/Header/MenuItem/MenuItem.jsx
 * @description     导航菜单项组件，支持下拉菜单和激活状态，使用DropdownMenu组件渲染下拉内容
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-07 14:30:00
 * @lastModified    2026-02-18 21:47:35
 * Copyright © All rights reserved
*/

import React, { useState, useRef, useEffect } from 'react'; // 导入React核心库和Hooks
import './MenuItem.css'; // 导入MenuItem组件样式
import DropdownMenu from '../DropdownMenu/DropdownMenu'; // 导入下拉菜单组件

// 定义MenuItem组件，接收name、hasDropdown、dropdownItems、dropdownConfig、isActive、onClick参数
const MenuItem = ({ name, hasDropdown = false, dropdownItems = [], dropdownConfig = null, isActive = false, onClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownTimerRef = useRef(null); // 定义下拉菜单定时器引用

  // 定义鼠标移入处理函数
  const handleMouseEnter = () => {
    // 检查是否有下拉菜单
    if (hasDropdown) {
      // 检查定时器是否存在
      if (dropdownTimerRef.current) {
        clearTimeout(dropdownTimerRef.current); // 清除定时器
        dropdownTimerRef.current = null; // 清空定时器引用
      } // 结束定时器清除
      setIsDropdownOpen(true); // 设置下拉菜单为打开状态
    } // 结束下拉菜单检查
  }; // 结束鼠标移入处理函数

  // 定义鼠标移出处理函数
  const handleMouseLeave = () => {
    // 检查是否有下拉菜单
    if (hasDropdown) {
      // 设置定时器，延迟关闭下拉菜单
      dropdownTimerRef.current = setTimeout(() => {
        setIsDropdownOpen(false); // 设置下拉菜单为关闭状态
      }, 200); // 延迟200毫秒
    } // 结束下拉菜单检查
  }; // 结束鼠标移出处理函数

  // 定义副作用Hook
  useEffect(() => {
    // 返回清理函数
    return () => {
      // 检查定时器是否存在
      if (dropdownTimerRef.current) {
        clearTimeout(dropdownTimerRef.current); // 清除定时器
      } // 结束定时器清除
    }; // 结束清理函数
  }, []); // 空依赖数组，仅在组件卸载时执行

  // 定义简单下拉菜单渲染函数
  const renderSimpleDropdown = () => (
    // 渲染无序列表元素
    <ul
      className="dropdown-menu dropdown-menu-simple" // 设置类名
      onMouseEnter={handleMouseEnter} // 绑定鼠标移入事件
      onMouseLeave={handleMouseLeave} // 绑定鼠标移出事件
    > {/* 结束ul元素开始 */}

      {/* 遍历下拉菜单项数组，渲染每个菜单项 */}
      {dropdownItems.map((item, index) => (
        <li key={index}> {/* 渲染列表项，使用index作为key */}
          <a href="#" className="dropdown-item"> {/* 渲染链接元素，设置类名 */}
            {item.title} {/* 渲染菜单项文本 */}
          </a> {/* 结束链接元素 */}
        </li> // 结束列表项
      ))} {/* 结束map循环 */}
    </ul> // 结束无序列表元素
  ); // 结束简单下拉菜单渲染函数

  // 返回JSX
  return (
    // 渲染列表项元素
    <li
      className="menu-item" // 设置类名
      onMouseEnter={handleMouseEnter} // 绑定鼠标移入事件
      onMouseLeave={handleMouseLeave} // 绑定鼠标移出事件
    > {/* 结束li元素开始 */}

      {/* 渲染链接元素 */}
      <a
        href="#" // 设置链接地址
        className={`menu-link ${isActive ? 'active' : ''}`} // 设置动态类名，激活时添加active类
        // 绑定点击事件
        onClick={(e) => {
          e.preventDefault(); // 阻止默认行为
          onClick(); // 调用onClick回调函数
        }} // 结束点击事件处理
      > {/* 结束a元素开始 */}
      
        {name} {/* 渲染菜单项名称 */}

        {/* 检查是否有下拉菜单 */}
        {hasDropdown && (
          // 渲染SVG图标
          <svg
            className="dropdown-arrow" // 设置类名
            width="12" // 设置宽度
            height="12" // 设置高度
            viewBox="0 0 12 12" // 设置视口
            fill="none" // 设置填充为无
            xmlns="http://www.w3.org/2000/svg" // 设置SVG命名空间
          > {/* 结束svg元素开始 */}
          
            {/* 渲染路径元素 */}
            <path
              d="M6 8L2 4H10L6 8Z" // 设置路径数据
              fill="currentColor" // 设置填充为当前颜色
            /> {/* 结束路径元素 */}
          </svg> // 结束svg元素
        )} {/* 结束下拉菜单检查 */}
      </a> {/* 结束链接元素 */}
      
      {/* 检查是否有下拉菜单且下拉菜单是否打开 */}
      {hasDropdown && isDropdownOpen && (
        dropdownConfig ? (
          <DropdownMenu
            columns={dropdownConfig.columns}
            className="community"
          />
        ) : (
          renderSimpleDropdown()
        )
      )}{/* 结束下拉菜单渲染 */}
    </li> // 结束列表项元素
  ); // 结束return
}; // 结束组件定义

export default MenuItem; // 导出MenuItem组件作为默认导出
