// 路径:src/components/DivinationInfo/timestamp/GanZhiSelector.jsx 时间:2026-02-06 10:00
// 功能:天干地支选择菜单组件，支持点击选择和鼠标事件处理

import React, { useState, useRef, useEffect } from 'react';
import styles from './GanZhiSelector.module.css';

// 菜单内容配置
const MENU_TYPES = {
  TIANGAN: {
    name: '天干',
    content: [
      ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'], // 单行：天干
    ]
  },
  TIANGAN_YANG: {
    name: '阳天干',
    content: [
      ['甲', '丙', '戊', '庚', '壬'], // 单行：阳干
    ]
  },
  TIANGAN_YIN: {
    name: '阴天干',
    content: [
      ['乙', '丁', '己', '辛', '癸'], // 单行：阴干
    ]
  },
  DIZHI_YANG: {
    name: '阳地支',
    content: [
      ['子', '寅', '辰', '午', '申', '戌'] // 单行：阳地支
    ]
  },
  DIZHI_YIN: {
    name: '阴地支',
    content: [
      ['丑', '卯', '巳', '未', '酉', '亥'] // 单行：阴地支
    ]
  },
  DIZHI_SEASONAL: {
    name: '四季地支',
    content: [
      ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'] // 单行：所有地支
    ]
  },
  DIZHI_ORDERED: {
    name: '顺序地支',
    content: [
      ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] // 单行：所有地支
    ]
  }
};

const GanZhiSelector = ({ 
  isVisible, 
  onSelect, 
  onClose, 
  position = { top: 0, left: 0 },
  menuType = 'TIANGAN' // 默认显示天干菜单
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef(null);
  
  // 获取当前菜单类型的内容
  const menuContent = MENU_TYPES[menuType]?.content || MENU_TYPES.TIANGAN.content;
  
  // 处理选择
  const handleSelect = (item) => {
    onSelect(item);
    onClose(); // 选择后关闭菜单
  };
  
  // 处理鼠标进入菜单
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  // 处理鼠标离开菜单
  const handleMouseLeave = () => {
    setIsHovered(false);
    // 移除 onClose() 调用，使菜单在鼠标离开时不消失
  };
  
  // 当菜单不可见时，重置 hover 状态
  useEffect(() => {
    if (!isVisible) {
      setIsHovered(false);
    }
  }, [isVisible]);
  
  // 如果菜单不可见，不渲染
  if (!isVisible) {
    return null;
  }
  
  return (
    <div 
      ref={menuRef}
      className={styles.selector}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        top: position.top,
        left: position.left,
        transform: position.transform
      }}
    >
      {/* 渲染菜单内容 - 所有项一行显示 */}
      <div className={styles.row}>
        {menuContent.flat().map((item, itemIndex) => (
          <div 
            key={`item-${itemIndex}`}
            className={styles.item}
            onClick={() => handleSelect(item)}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GanZhiSelector;