/*
 * @file            frontend/src/components/DivinationInfo/timestamp/GanZhiSelector.jsx
 * @description     天干地支选择菜单组件，支持点击选择和鼠标事件处理
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-06 10:00:00
 * @lastModified    2026-02-18 14:13:59
 * Copyright © All rights reserved
*/

// 导入React核心库
import React, {
  useState, // useState: 用于组件状态管理
  useRef, // useRef: 用于引用DOM元素或保存可变值(不触发重新渲染)
  useEffect // useEffect: 用于处理副作用(如订阅、定时器、DOM操作等)
} from 'react'; // 从react模块导入 
import styles from './GanZhiSelector.module.css'; // 导入组件样式模块

// 菜单内容配置
// 定义菜单类型常量对象,包含各种天干地支菜单的配置
const MENU_TYPES = {
  // 天干菜单类型配置
  TIANGAN: {
    name: '天干', // 菜单名称
    // 菜单内容数组
    content: [
      ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'], // 单行：天干
    ]
  },
  // 阳天干菜单类型配置
  TIANGAN_YANG: {
    name: '阳天干', // 菜单名称
    // 菜单内容数组
    content: [
      ['甲', '丙', '戊', '庚', '壬'], // 单行：阳干
    ]
  },
  // 阴天干菜单类型配置
  TIANGAN_YIN: {
    name: '阴天干', // 菜单名称
    // 菜单内容数组
    content: [
      ['乙', '丁', '己', '辛', '癸'], // 单行：阴干
    ]
  },
  // 阳地支菜单类型配置
  DIZHI_YANG: {
    name: '阳地支', // 菜单名称
    // 菜单内容数组
    content: [
      ['子', '寅', '辰', '午', '申', '戌'] // 单行：阳地支
    ]
  },
  // 阴地支菜单类型配置
  DIZHI_YIN: {
    name: '阴地支', // 菜单名称
    // 菜单内容数组
    content: [
      ['丑', '卯', '巳', '未', '酉', '亥'] // 单行：阴地支
    ]
  },
  // 四季地支菜单类型配置
  DIZHI_SEASONAL: {
    name: '四季地支', // 菜单名称
    // 菜单内容数组
    content: [
      ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'] // 单行：所有地支
    ]
  },
  // 顺序地支菜单类型配置
  DIZHI_ORDERED: {
    name: '顺序地支', // 菜单名称
    // 菜单内容数组
    content: [
      ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] // 单行：所有地支
    ]
  }
};

// 定义天干地支选择器组件
// 组件参数解构
const GanZhiSelector = ({
  isVisible, // 菜单是否可见的布尔值
  onSelect, // 选择项的回调函数
  onClose, // 关闭菜单的回调函数
  position = { top: 0, left: 0 }, // 菜单位置对象,包含top和left坐标,默认值为{ top: 0, left: 0 }
  menuType = 'TIANGAN' // 菜单类型,默认显示天干菜单
}) => {
  const [isHovered, setIsHovered] = useState(false); // 定义鼠标悬停状态,控制菜单的悬停效果
  const menuRef = useRef(null); // 定义菜单引用,用于获取菜单DOM元素
  // 获取当前菜单类型的内容
  const menuContent = MENU_TYPES[menuType]?.content || MENU_TYPES.TIANGAN.content; // 根据menuType获取对应菜单内容,如果不存在则默认使用天干菜单内容

  // 处理选择
  // 定义选择处理函数,接收选中的项作为参数
  const handleSelect = (item) => {
    onSelect(item); // 调用父组件传递的onSelect回调函数,传递选中的项
    onClose(); // 选择后关闭菜单
  };
  
  // 定义鼠标进入处理函数
  const handleMouseEnter = () => {
    setIsHovered(true); // 设置悬停状态为true
  };
  
  // 定义鼠标离开处理函数
  const handleMouseLeave = () => {
    setIsHovered(false); // 设置悬停状态为false
    // 移除 onClose() 调用，使菜单在鼠标离开时不消失
  };
  
  // 当菜单不可见时，重置 hover 状态
  // 定义副作用钩子,监听isVisible变化
  useEffect(() => {
    // 如果菜单不可见
    if (!isVisible) {
      setIsHovered(false); // 重置悬停状态为false
    }
  }, [isVisible]); // 依赖数组:监听isVisible变化
  
  // 如果菜单不可见，不渲染
  if (!isVisible) {
    return null; // 返回null,不渲染任何内容
  }

  // 返回JSX元素
  return (
    // 定义菜单容器div元素
    <div 
      ref={menuRef} // 将menuRef引用绑定到div元素
      className={styles.selector} // 应用选择器样式类
      onMouseEnter={handleMouseEnter} // 绑定鼠标进入事件处理函数
      onMouseLeave={handleMouseLeave} // 绑定鼠标离开事件处理函数
      // 定义内联样式对象
      style={{
        top: position.top, // 设置顶部位置
        left: position.left, // 设置左侧位置
        transform: position.transform // 设置变换样式
      }}
    >
      {/* 渲染菜单内容 - 所有项一行显示 */}
      <div className={styles.row}> {/* 定义行容器div元素,应用行样式类 */}
        {/* 将menuContent数组扁平化后遍历,渲染每个菜单项 */}
        {menuContent.flat().map((item, itemIndex) => (
          // 定义菜单项div元素
          <div
            key={`item-${itemIndex}`} // 设置唯一key属性,用于React渲染优化
            className={styles.item} // 应用菜单项样式类
            onClick={() => handleSelect(item)} // 绑定点击事件,调用handleSelect函数并传递当前项
          >
            {item} {/* 渲染菜单项内容 */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GanZhiSelector; // 默认导出GanZhiSelector组件