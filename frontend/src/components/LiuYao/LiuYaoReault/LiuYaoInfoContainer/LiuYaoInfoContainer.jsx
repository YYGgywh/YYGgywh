/*
 * @file            frontend/src/components/LiuYao/LiuYaoReault/LiuYaoInfoContainer/LiuYaoInfoContainer.jsx
 * @description     六爻信息容器组件，整合六爻相关的所有信息展示
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-16 00:00:00
 * @lastModified    2026-03-16 00:00:00
 * Copyright © All rights reserved
*/

import React from 'react';
import PropTypes from 'prop-types';
import styles from './LiuYaoInfoContainer.desktop.module.css';

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

  /**
   * 渲染六爻信息容器
   * 包含简要占题、四柱信息、六爻详细排盘和显示控制
   */
  return (
    <div className={getContainerClassName()} style={style}>
      {/* 简要占题组件，显示占卜问题和时间 */}
      <BriefDivinationQuery
        formData={formData}
        divinationData={divinationData}
        className={styles.briefDivinationQuery}
      />

      {/* 四柱展示组件，显示干支信息 */}
      <FourPillarsDisplay
        ganzhiInfo={divinationData?.calendar_info?.ganzhi_info || {}}
        isColorMode={checkIsColorMode()}
        displayConfig={fourPillarsDisplayConfig}
        className={styles.fourPillarsDisplay}
      />

      {/* 六爻网格展示组件，显示卦象信息 */}
      <LiuYaoGridDisplay
        divinationData={divinationData}
        isColorMode={checkIsColorMode()}
        displayConfig={liuYaoDisplayConfig}
        className={styles.liuYaoGridDisplay}
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