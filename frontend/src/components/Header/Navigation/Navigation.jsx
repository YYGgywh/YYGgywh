/*
 * @file            frontend/src/components/Header/Navigation/Navigation.jsx
 * @description     圆运阁顶部导航栏组件，包含Logo、菜单和用户操作按钮
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-07 11:10:00
 * @lastModified    2026-02-27 15:00:00
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react'; // 导入React核心库和Hooks
import { useNavigate, useLocation } from 'react-router-dom'; // 导入useNavigate和useLocation钩子
import styles from './Navigation.desktop.module.css'; // 导入Navigation组件样式（CSS Modules）
import mobileStyles from './Navigation.mobile.module.css'; // 导入移动端样式模块
import Logo from '../Logo/Logo'; // 导入Logo组件
import MenuItem from '../MenuItem/MenuItem'; // 导入MenuItem组件
import Button from '../Button/Button'; // 导入Button组件
import { menuItems } from '../menuConfig';
import { isLoggedIn } from '../../../utils/storage'; // 导入登录状态检查
import yinYangIcon from '../../../assets/images/taiji.svg'; // 导入阴阳图标

// 定义Navigation组件
const Navigation = () => {
  const navigate = useNavigate(); // 获取导航实例
  const location = useLocation(); // 获取当前路由位置
  const [isScrolled, setIsScrolled] = useState(false); // 定义滚动状态，默认为false
  const [activeMenu, setActiveMenu] = useState('广场'); // 定义激活菜单状态，默认为'广场'
  const [isMobile, setIsMobile] = useState(() => {
    // 初始化时检测屏幕尺寸
    return window.innerWidth < 768;
  }); // 检测屏幕尺寸，判断是否为移动端
  const [activeTab, setActiveTab] = useState('论剑'); // 移动端标签激活状态
  
  // 监听窗口大小变化，更新响应式状态
  useEffect(() => {
    const handleResize = () => {
      // 防抖处理，避免频繁触发
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 100);
    };
    
    // 立即执行一次，确保初始状态正确
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(window.resizeTimeout);
    };
  }, []);
  
  // 根据屏幕尺寸选择样式
  const currentStyles = isMobile ? mobileStyles : styles;

  // URL路径到菜单项的映射
  const pathToMenuMap = {
    '/': '广场',
    '/divination/liuyao': '排盘',
    '/divination-result': '排盘'
  };

  // 定义副作用Hook
  useEffect(() => {
    // 定义滚动处理函数
    const handleScroll = () => { 
      setIsScrolled(window.scrollY > 50); // 设置滚动状态，滚动超过50px时为true
    }; // 结束滚动处理函数

    window.addEventListener('scroll', handleScroll); // 添加滚动事件监听

    return () => window.removeEventListener('scroll', handleScroll); // 返回清理函数，移除滚动事件监听

  }, []); // 空依赖数组，仅在组件挂载和卸载时执行

  // 监听路由变化，根据URL更新激活菜单
  useEffect(() => {
    const currentPath = location.pathname;
    // 查找当前路径对应的菜单项
    const menuName = pathToMenuMap[currentPath] || '广场';
    setActiveMenu(menuName);
  }, [location]); // 依赖于location对象

  // 定义菜单点击处理函数
  const handleMenuClick = (menuName) => {
    setActiveMenu(menuName); // 设置激活菜单
  };

  // 定义登录按钮点击处理函数
  const handleLoginClick = () => {
    if (!isLoggedIn()) {
      navigate('/login'); // 跳转到登录页面
    } else {
      navigate('/user'); // 跳转到用户中心
    }
  };

  // 定义免费试用按钮点击处理函数
  const handleTryClick = () => {
    if (!isLoggedIn()) {
      navigate('/login'); // 未登录时跳转到登录页面
    } else {
      // 已登录时的处理逻辑
      console.log('免费试用');
    }
  };

  // 渲染移动端导航
  const renderMobileNavigation = () => {
    // 检查当前路径是否为用户中心
    const isUserCenter = location.pathname.includes('/user');
    
    return (
      <>
        {/* 顶部导航 - 仅在非用户中心页面显示 */}
        {!isUserCenter && (
          <nav className={currentStyles.navigation}>
            <div className={currentStyles.navigationContainer}>
              {/* 左侧汉堡菜单 */}
              <div className={currentStyles.navigationLeft}>
                <div className={currentStyles.hamburgerMenu}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              
              {/* 中间标签栏 */}
              <div className={currentStyles.navTabs}>
                <div 
                  className={`${currentStyles.tabItem} ${activeTab === '关注' ? currentStyles.active : ''}`}
                  onClick={() => setActiveTab('关注')}
                >
                  关注
                </div>
                <div 
                  className={`${currentStyles.tabItem} ${activeTab === '论剑' ? currentStyles.active : ''}`}
                  onClick={() => setActiveTab('论剑')}
                >
                  论剑
                </div>
                <div 
                  className={`${currentStyles.tabItem} ${activeTab === '同城' ? currentStyles.active : ''}`}
                  onClick={() => setActiveTab('同城')}
                >
                  同城
                </div>
              </div>
              
              {/* 右侧搜索按钮 */}
              <div className={currentStyles.searchButton}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
            </div>
          </nav>
        )}
        
        {/* 底部导航 - 始终显示 */}
        <div className={currentStyles.bottomNavigation}>
          <div className={`${currentStyles.navItem} ${activeMenu === '广场' ? currentStyles.active : ''}`} onClick={() => navigate('/')}>
            <div className={currentStyles.navIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <span className={currentStyles.navText}>首页</span>
          </div>
          
          <div className={currentStyles.navItem}>
            <div className={currentStyles.navIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <span className={currentStyles.navText}>经楼</span>
          </div>
          
          {/* 阴阳图标 */}
          <div className={currentStyles.yinYangContainer}>
            <div className={currentStyles.yinYangIcon} onClick={() => navigate('/divination/liuyao')}>
              <img src={yinYangIcon} alt="阴阳" />
            </div>
          </div>
          
          <div className={currentStyles.navItem}>
            <div className={currentStyles.navIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <span className={currentStyles.navText}>消息</span>
          </div>
          
          <div className={`${currentStyles.navItem} ${isUserCenter ? currentStyles.active : ''}`} onClick={() => handleLoginClick()}>
            <div className={currentStyles.navIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <span className={currentStyles.navText}>我</span>
          </div>
        </div>
      </>
    );
  };

  // 渲染桌面端导航
  const renderDesktopNavigation = () => (
    <nav className={`${styles.navigation} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.navigationContainer}>
        <div className={styles.navigationLeft}>
          <Logo />
          <ul className={styles.navigationMenu}>
            {menuItems.map((item) => (
              <MenuItem
                key={item.name}
                name={item.name}
                hasDropdown={item.hasDropdown}
                dropdownItems={item.dropdownItems}
                dropdownConfig={item.dropdownConfig}
                href={item.href}
                isActive={activeMenu === item.name}
                onClick={() => handleMenuClick(item.name)}
              />
            ))}
          </ul>
        </div>

        <div className={styles.navigationRight}>
          <div className={styles.navigationUtils}>
            <a href="#" className={styles.navigationLink}>帮助中心</a>
            <a href="#" className={styles.navigationLink}>中文/EN</a>
          </div>

          <div className={styles.navigationActions}>
            <Button 
              variant="secondary" 
              onClick={handleLoginClick}
            >
              {isLoggedIn() ? '用户中心' : '登录'}
            </Button>
            <Button 
              variant="primary" 
              onClick={handleTryClick}
            >
              免费试用
            </Button>
          </div>
          
        </div>
      </div>
    </nav>
  );

  // 返回JSX
  return (
    <>
      {isMobile ? renderMobileNavigation() : renderDesktopNavigation()}
    </>
  ); // 结束return
  
}; // 结束组件定义

export default Navigation; // 导出Navigation组件作为默认导出
