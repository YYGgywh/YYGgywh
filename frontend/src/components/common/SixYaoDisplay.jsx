// 路径:frontend/src/components/common/SixYaoDisplay.jsx 时间:2024-07-01 10:00
// 功能：六爻显示组件

import React from 'react';
import { YangYao, YinYao } from './YaoComponents';
import './SixYaoDisplay.css';

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
const SixYaoDisplay = ({
  yaoTypes = [],
  className = '',
  style = {},
  yaoContainerStyle = {},
  yaoLabelStyle = {},
  yaoComponentStyle = {},
  yaoWidth = 100,
  yaoHeight = 20,
  yangColor = '#000000',
  yinColor = '#000000'
}) => {
  // 爻位名称数组，从上到下排列（上爻到初爻）
  const yaoLabels = ['上爻:', '五爻:', '四爻:', '三爻:', '二爻:', '初爻:'];
  
  // 确保yaoTypes数组长度为6，不足则补全
  const normalizedYaoTypes = [...yaoTypes];
  while (normalizedYaoTypes.length < 6) {
    normalizedYaoTypes.unshift(null); // 在开头补null
  }
  
  return (
    <div className={`six-yao-display ${className}`} style={style}>
      {yaoLabels.map((label, index) => {
        const yaoType = normalizedYaoTypes[5 - index]; // 反转索引，使初爻在最下方
        
        return (
          <div 
            key={index} 
            className="yao-container"
            style={yaoContainerStyle}
          >
            <span className="yao-label" style={yaoLabelStyle}>
              {label}
            </span>
            <div className="yao-content">
              {yaoType === 'yang' && (
                <YangYao 
                  width={`${yaoWidth}px`} 
                  height={`${yaoHeight}px`} 
                  backgroundColor={yangColor}
                  style={yaoComponentStyle}
                />
              )}
              {yaoType === 'yin' && (
                <YinYao 
                  circleSize={`${yaoHeight}px`} 
                  gap={`${yaoHeight / 2}px`}
                  backgroundColor={yinColor}
                  style={yaoComponentStyle}
                />
              )}
              {!yaoType && (
                <div className="yao-placeholder" style={{ width: yaoWidth, height: yaoHeight }} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SixYaoDisplay;