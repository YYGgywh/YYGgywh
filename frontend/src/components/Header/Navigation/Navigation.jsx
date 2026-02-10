// 路径:src/components/Navigation/Navigation.jsx 时间:2026-02-07 11:10
// 功能:圆运阁顶部导航栏组件，包含Logo、菜单和用户操作按钮
import React, { useState, useEffect } from 'react';
import './Navigation.css';
import Logo from '../Logo/Logo';
import MenuItem from '../MenuItem/MenuItem';
import Button from '../Button/Button';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('广场');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuClick = (menuName) => {
    setActiveMenu(menuName);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = [
    { name: '广场', hasDropdown: false },
    { 
      name: '排盘', 
      hasDropdown: true, 
      dropdownConfig: {
        columns: [
          {
            title: '命理排盘',
            className: 'dropdown-col-word',
            items: [
              {
                title: '八字',
                href: '#',
                icon: '★'
              },
              {
                title: '紫微',
                href: '#',
                icon: '★'
              }
            ]
          },
          {
            title: '卦爻排盘',
            className: 'dropdown-col-word',
            items: [
              {
                title: '六爻',
                href: '#',
                icon: '★'
              },
              {
                title: '梅花',
                href: '#',
                icon: '★'
              }
            ]
          },
          {
            title: '三式排盘',
            className: 'dropdown-col-word',
            items: [
              {
                title: '奇门',
                href: '#',
                icon: '★'
              },
              {
                title: '六壬',
                href: '#',
                icon: '★'
              },
              {
                title: '太乙',
                href: '#',
                icon: '★'
              }
            ]
          }
        ]
      }
    },
    { name: '藏经阁', hasDropdown: false },
    { name: 'TEST', hasDropdown: false }
  ];

  return (
    <nav className={`navigation ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navigation-container">
        <div className="navigation-left">
          <Logo />
          <ul className="navigation-menu">
            {menuItems.map((item) => (
              <MenuItem
                key={item.name}
                name={item.name}
                hasDropdown={item.hasDropdown}
                dropdownItems={item.dropdownItems}
                dropdownConfig={item.dropdownConfig}
                isActive={activeMenu === item.name}
                onClick={() => handleMenuClick(item.name)}
              />
            ))}
          </ul>
        </div>

        <div className="navigation-right">
          <div className="navigation-utils">
            <a href="#" className="navigation-link">帮助中心</a>
            <a href="#" className="navigation-link">中文/EN</a>
          </div>
          <div className="navigation-actions">
            <Button variant="secondary">登录</Button>
            <Button variant="primary">免费试用</Button>
          </div>
          <button 
            className="hamburger-menu"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-menu-items">
          {menuItems.map((item) => (
            <li key={item.name} className="mobile-menu-item">
              <a 
                href="#" 
                className={`mobile-menu-link ${activeMenu === item.name ? 'active' : ''}`}
                onClick={() => {
                  handleMenuClick(item.name);
                  setIsMobileMenuOpen(false);
                }}
              >
                {item.name}
              </a>
              {item.hasDropdown && item.dropdownConfig && (
                <ul className="mobile-dropdown">
                  {item.dropdownConfig.columns.map((column) => (
                    <li key={column.title}>
                      <div className="mobile-dropdown-title">{column.title}</div>
                      <ul className="mobile-dropdown-sub">
                        {column.items.map((subItem) => (
                          <li key={subItem.title}>
                            <a href={subItem.href}>{subItem.title}</a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
              {item.hasDropdown && item.dropdownItems && (
                <ul className="mobile-dropdown">
                  {item.dropdownItems.map((subItem) => (
                    <li key={subItem}>
                      <a href="#">{subItem}</a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          <li className="mobile-menu-item">
            <a href="#" className="mobile-menu-link">帮助中心</a>
          </li>
          <li className="mobile-menu-item">
            <a href="#" className="mobile-menu-link">中文/EN</a>
          </li>
          <li className="mobile-menu-actions">
            <Button variant="secondary" fullWidth>登录</Button>
            <Button variant="primary" fullWidth>免费试用</Button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
