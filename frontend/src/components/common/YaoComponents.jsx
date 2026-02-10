// 路径:src/components/common/YaoComponents.jsx 时间:2026-01-29
// 功能:六爻爻型组件，包括阳爻和阴爻
import React from 'react';
import './YaoComponents.css';

/**
 * 阳爻组件 - 直横形状
 * @param {string} width - 宽度，默认 '60px'
 * @param {string} height - 高度，默认 '10px'
 * @param {string} backgroundColor - 背景色，默认 '#000'
 * @param {string} borderRadius - 边框半径，默认 '3px'
 * @param {string} className - 自定义类名
 * @param {object} style - 额外样式
 */
export const YangYao = ({ 
  width = '60px', 
  height = '10px', 
  backgroundColor = '#000', 
  borderRadius = '3px',
  className = '',
  style = {}
}) => {
  return (
    <div 
      className={`yang-yao ${className}`}
      style={{
        width,
        height,
        backgroundColor,
        borderRadius,
        ...style
      }}
    />
  );
};

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
export const YinYao = ({ 
  width = '27px', 
  height = '10px', 
  gap = '6px', 
  backgroundColor = '#000', 
  borderRadius = '3px',
  className = '',
  style = {},
  circleStyle = {}
}) => {
  return (
    <div 
      className={`yin-yao ${className}`} 
      style={{ 
        gap,
        ...style
      }}
    >
      <div 
        className="yin-yao-segment"
        style={{
          width,
          height,
          backgroundColor,
          borderRadius,
          ...circleStyle
        }}
      />
      <div 
        className="yin-yao-segment"
        style={{
          width,
          height,
          backgroundColor,
          borderRadius,
          ...circleStyle
        }}
      />
    </div>
  );
};
