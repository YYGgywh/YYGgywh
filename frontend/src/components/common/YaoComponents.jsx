/*
 * @file            frontend/src/components/common/YaoComponents.jsx
 * @description     六爻爻型组件，包括阳爻和阴爻组件
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-01-29 10:00:00
 * @lastModified    2026-02-16 21:57:44
 * Copyright © All rights reserved
*/

import React from 'react'; // 导入React核心库
import './YaoComponents.css'; // 导入爻型组件样式

/**
 * 阳爻组件 - 直横形状
 * @param {string} width - 宽度，默认 '60px'
 * @param {string} height - 高度，默认 '10px'
 * @param {string} backgroundColor - 背景色，默认 '#000'
 * @param {string} borderRadius - 边框半径，默认 '3px'
 * @param {string} className - 自定义类名
 * @param {object} style - 额外样式
 */

// 定义阳爻组件，接收以下属性
export const YangYao = ({
  width = '60px', // 宽度，默认为60px
  height = '10px', // 高度，默认为10px
  backgroundColor = '#000', // 背景色，默认为黑色
  borderRadius = '3px', // 边框半径，默认为3px
  className = '', // 自定义类名，默认为空字符串
  style = {} // 额外样式，默认为空对象
}) => 
  // 结束属性解构
  {

  // 返回JSX
  return (
    // 渲染div元素
    <div 
      className={`yang-yao ${className}`} // 设置类名，包含基础类名和自定义类名
      style={{ // 设置内联样式
        width, // 设置宽度
        height, // 设置高度
        backgroundColor, // 设置背景色
        borderRadius, // 设置边框半径
        ...style // 展开额外样式
      }} // 结束style对象
    /> // 结束div元素
  ); // 结束return语句
}; // 结束YangYao组件定义

/**
 * 阴爻组件 - 断开形状（双长方形）
 * @param {string} width - 宽度，默认 '27px'
 * @param {string} height - 高度，默认 '10px'
 * @param {string} gap - 两个长方形之间的间距，默认 '6px'
 * @param {string} backgroundColor - 背景色，默认 '#000'
 * @param {string} borderRadius - 边框半径，默认 '3px'
 * @param {string} className - 自定义类名
 * @param {object} style - 额外样式
 * @param {object} circleStyle - 长方形额外样式
 */

// 定义阴爻组件，接收以下属性
export const YinYao = ({
  width = '27px', // 宽度，默认为27px
  height = '10px', // 高度，默认为10px
  gap = '6px', // 两个长方形之间的间距，默认为6px
  backgroundColor = '#000', // 背景色，默认为黑色
  borderRadius = '3px', // 边框半径，默认为3px
  className = '', // 自定义类名，默认为空字符串
  style = {}, // 额外样式，默认为空对象
  circleStyle = {} // 长方形额外样式，默认为空对象
}) => 
  // 结束属性解构
  {

  // 返回JSX
  return (
    // 渲染div元素
    <div
      className={`yin-yao ${className}`} // 设置类名，包含基础类名和自定义类名
      // 设置内联样式
      style={{
        gap, // 设置两个长方形之间的间距
        ...style // 展开额外样式
      }} // 结束style对象
    > {/* 结束div开始标签 */}

      {/* 渲染第一个长方形div元素 */}
      <div
        className="yin-yao-segment" // 设置类名为yin-yao-segment
        // 设置内联样式
        style={{
          width, // 设置宽度
          height, // 设置高度
          backgroundColor, // 设置背景色
          borderRadius, // 设置边框半径
          ...circleStyle // 展开长方形额外样式
        }} // 结束style对象
      /> {/* 结束第一个长方形div元素 */}

      {/* 渲染第二个长方形div元素 */}
      <div
        className="yin-yao-segment" // 设置类名为yin-yao-segment
        // 设置内联样式
        style={{
          width, // 设置宽度
          height, // 设置高度
          backgroundColor, // 设置背景色
          borderRadius, // 设置边框半径
          ...circleStyle // 展开长方形额外样式
        }} // 结束style对象
      /> {/* 结束第二个长方形div元素 */}

    </div> // 结束阴爻容器div元素

  ); // 结束return语句  
}; // 结束YinYao组件定义
