/*
 * @file            frontend/src/components/Header/Navigation/Navigation.jsx
 * @description     圆运阁顶部导航栏组件，包含Logo、菜单和用户操作按钮
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-07 11:10:00
 * @lastModified    2026-02-16 21:23:13
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react'; // 导入React核心库和Hooks
import './Navigation.css'; // 导入Navigation组件样式
import Logo from '../Logo/Logo'; // 导入Logo组件
import MenuItem from '../MenuItem/MenuItem'; // 导入MenuItem组件
import Button from '../Button/Button'; // 导入Button组件
import { menuItems } from '../menuConfig';

// 定义Navigation组件
const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false); // 定义滚动状态，默认为false
  const [activeMenu, setActiveMenu] = useState('广场'); // 定义激活菜单状态，默认为'广场'

  // 定义副作用Hook
  useEffect(() => {
    // 定义滚动处理函数
    const handleScroll = () => { 
      setIsScrolled(window.scrollY > 50); // 设置滚动状态，滚动超过50px时为true
    }; // 结束滚动处理函数

    window.addEventListener('scroll', handleScroll); // 添加滚动事件监听

    return () => window.removeEventListener('scroll', handleScroll); // 返回清理函数，移除滚动事件监听

  }, []); // 空依赖数组，仅在组件挂载和卸载时执行

  // 定义菜单点击处理函数
  const handleMenuClick = (menuName) => {
    setActiveMenu(menuName); // 设置激活菜单
  };

  // 返回JSX
  return (
    <nav className={`navigation ${isScrolled ? 'scrolled' : ''}`}> {/* 渲染导航元素，设置动态类名 */}
      <div className="navigation-container"> {/* 渲染导航容器 */}
        <div className="navigation-left"> {/* 渲染左侧导航区域 */}
          <Logo /> {/* 渲染Logo组件 */}
          <ul className="navigation-menu"> {/* 渲染导航菜单列表 */}
            {/* 遍历菜单项数组，渲染每个菜单项 */}
            {menuItems.map((item) => (
              // 渲染MenuItem组件
              <MenuItem
                key={item.name} // 设置key为菜单项名称
                name={item.name} // 传递菜单项名称
                hasDropdown={item.hasDropdown} // 传递是否有下拉菜单
                dropdownItems={item.dropdownItems} // 传递下拉菜单项
                dropdownConfig={item.dropdownConfig} // 传递下拉菜单配置
                isActive={activeMenu === item.name} // 传递是否激活
                onClick={() => handleMenuClick(item.name)} // 传递点击事件处理函数
              /> // 结束MenuItem组件
            ))} {/* 结束map循环 */}
          </ul> {/* 结束导航菜单列表 */}
        </div> {/* 结束左侧导航区域 */}

        <div className="navigation-right"> {/* 渲染右侧导航区域 */}
          <div className="navigation-utils"> {/* 渲染导航工具区域 */}
            <a href="#" className="navigation-link">帮助中心</a> {/* 渲染帮助中心链接 */}
            <a href="#" className="navigation-link">中文/EN</a> {/* 渲染语言切换链接 */}
          </div> {/* 结束导航工具区域 */}

          <div className="navigation-actions"> {/* 渲染导航操作区域 */}
            <Button variant="secondary">登录</Button> {/* 渲染登录按钮 */}
            <Button variant="primary">免费试用</Button> {/* 渲染免费试用按钮 */}
          </div> {/* 结束导航操作区域 */}
          
        </div> {/* 结束右侧导航区域 */}
      </div> {/* 结束导航容器 */}

    </nav> // 结束导航元素

  ); // 结束return
  
}; // 结束组件定义

export default Navigation; // 导出Navigation组件作为默认导出
