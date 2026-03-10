/*
 * @file            frontend/src/components/LiuYao/components/YaoButton/YaoButton.jsx
 * @description     阴阳爻选择按钮组件 - 用于指定起卦方式中选择爻的阴阳属性
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-08 17:00:00
 * @lastModified    2026-03-08 15:31:50
 * Copyright © All rights reserved
*/

// 导入 React 核心库，用于创建 React 组件
import React from 'react';

// 导入 CSS Modules 样式文件
// 使用 CSS Modules 实现样式隔离，避免类名冲突
// styles 对象包含所有经过哈希处理的类名
import styles from './YaoButton.desktop.module.css';

/**
 * @description     阴阳爻选择按钮组件
 *                   该组件用于指定起卦方式中，让用户选择每个爻位的阴阳属性
 *                   支持三种状态的循环切换：未选中 -> 选中（静）-> 激活（动）-> 选中（静）
 *                   阳爻使用红色主题，阴爻使用蓝色主题
 * 
 * @param           {Object}    props                   - 组件属性对象
 * @param           {string}    props.type              - 按钮类型：'yang'（阳）或 'yin'（阴）
 * @param           {string|null} props.state           - 按钮当前状态：
 *                                                        null - 未选中
 *                                                        'selected' - 选中（静）
 *                                                        'active' - 激活（动）
 * @param           {Function}  props.onClick           - 点击事件回调函数
 * @param           {string}    [props.className='']    - 额外的 CSS 类名，用于父组件自定义样式
 * 
 * @return          {JSX.Element}                      - 返回 React JSX 元素
 * 
 * @example
 * // 阳爻按钮，未选中状态
 * <YaoButton type="yang" state={null} onClick={() => handleClick('yang')} />
 * 
 * // 阴爻按钮，选中状态
 * <YaoButton type="yin" state="selected" onClick={() => handleClick('yin')} />
 * 
 * // 阳爻按钮，激活状态
 * <YaoButton type="yang" state="active" onClick={() => handleClick('yang')} />
 */
const YaoButton = ({ 
  type,           // 按钮类型：'yang' 表示阳爻，'yin' 表示阴爻
  state,          // 按钮状态：null | 'selected' | 'active'
  onClick,        // 点击回调函数
  className = ''  // 可选的额外类名，默认为空字符串
}) => {
  
  /**
   * @description     状态到显示文本的映射表
   *                   根据按钮类型和当前状态，确定按钮上显示的文本
   *                   使用对象结构，便于快速查找和扩展
   */
  const stateTextMap = {
    // 阳爻在不同状态下的显示文本
    yang: {
      null: '阳',           // 未选中时显示"阳"
      selected: '静',       // 选中时显示"静"（静态阳爻）
      active: '动'          // 激活时显示"动"（动爻，会变化）
    },
    // 阴爻在不同状态下的显示文本
    yin: {
      null: '阴',           // 未选中时显示"阴"
      selected: '静',       // 选中时显示"静"（静态阴爻）
      active: '动'          // 激活时显示"动"（动爻，会变化）
    }
  };
  
  /**
   * @description     获取按钮显示的文本
   *                   根据按钮类型和当前状态，从映射表中获取对应的显示文本
   *                   如果状态无效，默认返回未选中状态的文本
   * 
   * @return          {string}  - 按钮上应显示的文本
   */
  const getButtonText = () => {
    // 获取当前按钮类型的状态映射
    const typeMap = stateTextMap[type];
    // 如果状态有效，返回对应文本；否则返回未选中状态的文本
    return typeMap[state] || typeMap.null;
  };
  
  /**
   * @description     构建按钮的 CSS 类名字符串
   *                   组合基础类名、类型类名、状态类名和额外类名
   *                   使用数组过滤和连接，确保类名格式正确
   * 
   * @return          {string}  - 完整的 CSS 类名字符串
   */
  const getButtonClassName = () => {
    // 定义基础类名数组
    const classNames = [
      // 基础类名：所有按钮共有的样式
      styles.yaoButton,
      // 类型类名：根据 type 动态选择阳爻或阴爻的基础样式
      // 使用方括号语法动态访问 styles 对象的属性
      // 例如：type='yang' 时，styles['yangButton']
      styles[`${type}Button`]
    ];
    
    // 根据状态添加对应的状态类名
    // 只有在有状态时才添加状态类名
    if (state) {
      // 构建状态类名，例如：'yang' + 'Selected' = 'yangSelected'
      // 使用模板字符串组合类型和状态
      // state.charAt(0).toUpperCase() 获取状态首字母并转为大写
      // state.slice(1) 获取状态剩余部分
      const stateClassName = `${type}Button${state.charAt(0).toUpperCase() + state.slice(1)}`;
      // 将状态类名添加到数组
      classNames.push(styles[stateClassName]);
    }
    
    // 如果传入了额外的类名，添加到数组
    // 用于父组件通过 CSS Modules 覆盖样式
    if (className) {
      classNames.push(className);
    }
    
    // 使用 filter 过滤掉 falsy 值（null, undefined, 空字符串）
    // 使用 join(' ') 将类名数组连接成字符串，用空格分隔
    return classNames.filter(Boolean).join(' ');
  };
  
  /**
   * @description     渲染按钮组件
   *                   返回一个 button 元素，包含计算好的类名、点击事件和显示文本
   */
  return (
    // button 元素作为按钮的根节点
    <button
      // 使用计算好的 CSS 类名
      className={getButtonClassName()}
      // 绑定点击事件处理函数
      onClick={onClick}
      // type="button" 防止在表单中提交
      type="button"
      // aria-label 提供无障碍访问支持，描述按钮的功能
      aria-label={`${type === 'yang' ? '阳' : '阴'}爻选择按钮，当前状态：${state || '未选中'}`}
    >
      {/* 显示按钮文本，由 getButtonText() 函数计算得出 */}
      {getButtonText()}
    </button>
  );
};

/**
 * @description     导出 YaoButton 组件
 *                   使用默认导出，便于其他文件导入
 *                   导入方式：import YaoButton from './YaoButton';
 */
export default YaoButton;
