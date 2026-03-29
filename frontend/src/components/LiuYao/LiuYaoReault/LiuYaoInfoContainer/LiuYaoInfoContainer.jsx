/*
 * @file            frontend/src/components/LiuYao/LiuYaoReault/LiuYaoInfoContainer/LiuYaoInfoContainer.jsx
 * @description     六爻信息容器组件，整合六爻相关的所有信息展示
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-16 00:00:00
 * @lastModified    2026-03-26 18:27:56
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import desktopStyles from './LiuYaoInfoContainer.desktop.module.css';
import mobileStyles from './LiuYaoInfoContainer.mobile.module.css';

// 导入子组件
import BriefDivinationQuery from '../../../DivinationInfo/components/DisplayComponents/BriefDivinationQuery/BriefDivinationQuery';
import FourPillarsDisplay, { defaultDisplayConfig as fourPillarsDefaultConfig } from '../../../FourPillarsDisplay/FourPillarsDisplay';
import LiuYaoGridDisplay, { defaultDisplayConfig as liuYaoDefaultConfig } from '../LiuYaoGridDisplay/LiuYaoGridDisplay';
import DisplayControl from '../../../common/DisplayControl/DisplayControl';

/**
 * 六爻信息容器组件
 * 整合六爻相关的所有信息展示，提供统一的布局和样式管理
 * 支持在其他场景中复用，如历史记录、分享页面等
 * 
 * @param           {Object}    props                  - 组件属性对象
 * @param           {Object}    props.formData          - 表单数据对象
 * @param           {Object}    props.divinationData     - 占卜数据对象
 * @param           {Array}     props.activeButtons      - 激活的按钮ID数组
 * @param           {Function}  props.onButtonClick      - 按钮点击回调函数
 * @param           {Object}    props.fourPillarsDisplayConfig - 四柱显示配置对象
 * @param           {Object}    props.liuYaoDisplayConfig    - 六爻显示配置对象
 * @param           {boolean}   props.isColorMode        - 是否为彩色模式
 * @param           {string}    props.className          - 额外的CSS类名
 * @param           {Object}    props.style             - 行内样式对象
 * 
 * @return          {JSX.Element}                     - 返回React JSX元素
 */
const LiuYaoInfoContainer = ({
  formData,
  divinationData,
  activeButtons = ['liuqin', 'fuchen', 'yinyang', 'colorChange'],
  onButtonClick,
  fourPillarsDisplayConfig = fourPillarsDefaultConfig,
  liuYaoDisplayConfig = liuYaoDefaultConfig,
  isColorMode = false,
  className = '',
  style = {}
}) => {
  // 移动端状态管理
  const [isMobile, setIsMobile] = useState(() => {
    return window.innerWidth < 768;
  });
  
  // 监听窗口大小变化，更新移动端状态
  useEffect(() => {
    const handleResize = () => {
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 100);
    };
    
    // 初始执行一次
    handleResize();
    // 添加窗口大小变化监听器
    window.addEventListener('resize', handleResize);
    // 组件卸载时移除监听器
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(window.resizeTimeout);
    };
  }, []);
  
  // 根据屏幕尺寸选择样式
  const styles = isMobile ? mobileStyles : desktopStyles;
  
  /**
   * 构建容器CSS类名字符串
   * 组合基础类名和额外类名
   * @returns {string} 完整的CSS类名字符串
   */
  const getContainerClassName = () => {
    const classNames = [styles.liuYaoInfoContainer];
    if (className) {
      classNames.push(className);
    }
    return classNames.join(' ');
  };

  /**
   * 检查是否为彩色模式
   * 通过activeButtons数组中是否包含'colorChange'来判断
   * @returns {boolean} 是否为彩色模式
   */
  const checkIsColorMode = () => {
    return isColorMode || activeButtons.includes('colorChange');
  };

  // 处理数据结构，提取实际的数据对象
  const actualDivinationData = divinationData?.liuyao_config_data || divinationData || {};
  const calendarInfo = actualDivinationData?.calendar_info || {};
  const ganzhiInfo = calendarInfo?.ganzhi_info || {};

  /**
   * 渲染六爻信息容器
   * 包含简要占题、四柱信息、六爻详细排盘和显示控制
   */
  return (
    <div className={getContainerClassName()} style={style}>
      {/* 简要占题组件，显示占卜问题和时间 */}
      <BriefDivinationQuery
        formData={formData}
        divinationData={actualDivinationData}
        className={styles.briefDivinationQuery}
        isMobile={isMobile}
      />

      {/* 四柱展示组件，显示干支信息 */}
      <FourPillarsDisplay
        ganzhiInfo={ganzhiInfo}
        isColorMode={checkIsColorMode()}
        displayConfig={fourPillarsDisplayConfig}
        className={styles.fourPillarsDisplay}
        isMobile={isMobile}
      />

      {/* 六爻网格展示组件，显示卦象信息 */}
      <LiuYaoGridDisplay
        divinationData={actualDivinationData}
        isColorMode={checkIsColorMode()}
        displayConfig={liuYaoDisplayConfig}
        className={styles.liuYaoGridDisplay}
        isMobile={isMobile}
      />

      {/* 显示控制组件，用于控制展示样式和模式切换 */}
      <DisplayControl
        activeButtons={activeButtons}
        onButtonClick={onButtonClick}
        className={styles.displayControl}
      />
    </div>
  );
};

/**
 * 组件属性类型检查
 * 定义每个属性的数据类型和是否必需
 */
LiuYaoInfoContainer.propTypes = {
  formData: PropTypes.object, // 表单数据对象
  divinationData: PropTypes.object.isRequired, // 占卜数据对象（必需）
  activeButtons: PropTypes.arrayOf(PropTypes.string), // 激活的按钮ID数组
  onButtonClick: PropTypes.func, // 按钮点击回调函数
  fourPillarsDisplayConfig: PropTypes.object, // 四柱显示配置对象
  liuYaoDisplayConfig: PropTypes.object, // 六爻显示配置对象
  isColorMode: PropTypes.bool, // 是否为彩色模式
  className: PropTypes.string, // 额外的CSS类名
  style: PropTypes.object // 行内样式对象
};

/**
 * 组件默认属性
 * 为可选属性提供默认值
 */
LiuYaoInfoContainer.defaultProps = {
  activeButtons: ['liuqin', 'fuchen', 'yinyang', 'colorChange'],
  fourPillarsDisplayConfig: fourPillarsDefaultConfig,
  liuYaoDisplayConfig: liuYaoDefaultConfig,
  isColorMode: false,
  className: '',
  style: {}
};

/**
 * 默认显示配置
 * 导出默认的显示配置，供其他组件使用
 */
export const defaultDisplayConfig = {
  // 六亲显示配置
  liuqin: true,
  // 本伏显示配置
  fuchen: true,
  // 阴阳显示配置
  yinyang: true,
  // 梅花显示配置
  meihua: false,
  // 彩色模式配置
  colorChange: false
};

export default LiuYaoInfoContainer;