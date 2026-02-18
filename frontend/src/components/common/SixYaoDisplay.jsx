/*
 * @file            frontend/src/components/common/SixYaoDisplay.jsx
 * @description     六爻显示组件，用于展示从初爻到上爻的排盘结果
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2024-07-01 10:00:00
 * @lastModified    2026-02-16 21:46:53
 * Copyright © All rights reserved
*/

import React from 'react'; // 导入React核心库
import { YangYao, YinYao } from './YaoComponents'; // 导入阳爻和阴爻组件
import './SixYaoDisplay.css'; // 导入六爻显示组件样式

/**
 * 六爻显示组件
 * 用于展示从初爻到上爻的排盘结果
 * 
 * @param {Object} props - 组件属性
 * @param {Array} props.yaoTypes - 六个爻的类型数组，每个元素为'yang'或'yin'
 * @param {string} props.className - 自定义类名
 * @param {Object} props.style - 自定义样式
 * @param {Object} props.yaoContainerStyle - 每个爻容器的自定义样式
 * @param {Object} props.yaoLabelStyle - 爻位标签的自定义样式
 * @param {Object} props.yaoComponentStyle - 爻型组件的自定义样式
 * @param {number} props.yaoWidth - 爻的宽度
 * @param {number} props.yaoHeight - 爻的高度
 * @param {string} props.yangColor - 阳爻的颜色
 * @param {string} props.yinColor - 阴爻的颜色
 * @returns {JSX.Element} 六爻显示组件
 */

// 定义SixYaoDisplay组件，接收以下属性
const SixYaoDisplay = ({
  yaoTypes = [], // 六个爻的类型数组，默认为空数组
  className = '', // 自定义类名，默认为空字符串
  style = {}, // 自定义样式，默认为空对象
  yaoContainerStyle = {}, // 每个爻容器的自定义样式，默认为空对象
  yaoLabelStyle = {}, // 爻位标签的自定义样式，默认为空对象
  yaoComponentStyle = {}, // 爻型组件的自定义样式，默认为空对象
  yaoWidth = 100, // 爻的宽度，默认为100px
  yaoHeight = 20, // 爻的高度，默认为20px
  yangColor = '#000000', // 阳爻的颜色，默认为黑色
  yinColor = '#000000' // 阴爻的颜色，默认为黑色
}) => 
  // 结束属性解构
  {
  // 爻位名称数组，从上到下排列（上爻到初爻）
  const yaoLabels = ['上爻:', '五爻:', '四爻:', '三爻:', '二爻:', '初爻:']; // 定义六爻位标签数组
  // 确保yaoTypes数组长度为6，不足则补全
  const normalizedYaoTypes = [...yaoTypes]; // 复制yaoTypes数组
  // 循环直到数组长度为6
  while (normalizedYaoTypes.length < 6) {
    normalizedYaoTypes.unshift(null); // 在开头补null
  } // 结束while循环
  
  // 返回JSX
  return (
    
    <div className={`six-yao-display ${className}`} style={style}> {/* 渲染六爻显示容器，应用动态类名和自定义样式 */}

      {/* 遍历爻位标签数组 */}
      {yaoLabels.map((label, index) => {
        const yaoType = normalizedYaoTypes[5 - index]; // 反转索引，使初爻在最下方

        // 返回JSX
        return (
          // 渲染爻容器
          <div
            key={index} // 使用index作为key
            className="yao-container" // 设置类名为yao-container
            style={yaoContainerStyle} // 应用爻容器自定义样式
          > {/* 结束div开始标签 */}

            <span className="yao-label" style={yaoLabelStyle}> {/* 渲染爻位标签，应用自定义样式 */}

              {label} {/* 渲染爻位标签文本 */}

            </span> {/* 结束span元素 */}

            <div className="yao-content"> {/* 渲染爻内容容器 */}

              {/* 如果是阳爻 */}
              {yaoType === 'yang' && (
                // 渲染阳爻组件
                <YangYao
                  width={`${yaoWidth}px`} // 设置宽度
                  height={`${yaoHeight}px`} // 设置高度
                  backgroundColor={yangColor} // 设置背景颜色
                  style={yaoComponentStyle} // 应用爻组件自定义样式
                /> // 结束YangYao组件
              )} {/* 结束阳爻条件渲染 */}
              
              {/* 如果是阴爻 */}
              {yaoType === 'yin' && (
                // 渲染阴爻组件
                <YinYao
                  circleSize={`${yaoHeight}px`} // 设置圆圈大小
                  gap={`${yaoHeight / 2}px`} // 设置圆圈间距
                  backgroundColor={yinColor} // 设置背景颜色
                  style={yaoComponentStyle} // 应用爻组件自定义样式
                /> // 结束YinYao组件
              )} {/* 结束阴爻条件渲染 */}

              {/* 如果爻类型为空 */}
              {!yaoType && ( 
                <div className="yao-placeholder" style={{ width: yaoWidth, height: yaoHeight }} /> // 渲染占位符
              )} {/* 结束占位符条件渲染 */}

            </div> {/* 结束爻内容容器 */}

          </div> // 结束爻容器

        ); // 结束return语句

      })} {/* 结束map循环 */}

    </div> // 结束六爻显示容器

  ); // 结束return语句
  
}; // 结束SixYaoDisplay组件定义

export default SixYaoDisplay; // 导出SixYaoDisplay组件作为默认导出