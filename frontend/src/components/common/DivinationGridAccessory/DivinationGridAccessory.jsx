/*
 * @file            frontend/src/components/common/DivinationGridAccessory/DivinationGridAccessory.jsx
 * @description     占卜补充信息组件，整合补充说明输入和操作按钮
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-16 00:00:00
 * @lastModified    2026-03-16 00:00:00
 * Copyright © All rights reserved
*/

import React from 'react';
import PropTypes from 'prop-types';
import styles from './DivinationGridAccessory.desktop.module.css';

// 导入子组件
import SupplementInput from '../SupplementInput/SupplementInput';
import ActionButtons from '../ActionButtons/ActionButtons';

/**
 * 占卜补充信息组件
 * 整合补充说明输入和操作按钮，支持多种占卜方式使用
 * 
 * @param           {Object}    props                  - 组件属性对象
 * @param           {string}    props.value            - 补充说明文本内容
 * @param           {Function}  props.onChange         - 文本变化回调函数
 * @param           {Function}  props.onSave           - 保存按钮点击回调函数
 * @param           {Function}  props.onPublish        - 发布按钮点击回调函数
 * @param           {boolean}   props.loading          - 是否处于加载状态
 * @param           {boolean}   props.disabled         - 是否禁用按钮
 * @param           {number}    props.maxLength        - 最大字符长度
 * @param           {string}    props.placeholder      - 输入框占位文本
 * @param           {boolean}   props.autoSave         - 是否启用自动保存
 * @param           {string}    props.className        - 额外的CSS类名
 * @param           {Object}    props.style            - 行内样式对象
 * 
 * @return          {JSX.Element}                     - 返回React JSX元素
 */
const DivinationGridAccessory = ({
  value,
  onChange,
  onSave,
  onPublish,
  loading = false,
  disabled = false,
  maxLength = 500,
  placeholder = '请输入补充说明，记录您的求占背景、心境或其他相关信息...',
  autoSave = true,
  className = '',
  style = {}
}) => {
  /**
   * 构建容器CSS类名字符串
   * 组合基础类名和额外类名
   * @returns {string} 完整的CSS类名字符串
   */
  const getContainerClassName = () => {
    const classNames = [styles.divinationGridAccessory];
    if (className) {
      classNames.push(className);
    }
    return classNames.join(' ');
  };

  /**
   * 处理文本变化事件
   * @param {string} text - 变化后的文本内容
   */
  const handleChange = (text) => {
    if (onChange) {
      onChange(text);
    }
  };

  /**
   * 处理保存按钮点击事件
   */
  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };

  /**
   * 处理发布按钮点击事件
   */
  const handlePublish = () => {
    if (onPublish) {
      onPublish();
    }
  };

  /**
   * 渲染占卜补充信息组件
   * 包含补充说明输入框和操作按钮
   */
  return (
    <div className={styles.supplementInfo}>
      <div className={styles.supplementSection}>
        {/* 补充说明输入组件 */}
        <SupplementInput
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={loading}
          maxLength={maxLength}
          autoSave={autoSave}
          className={styles.supplementInput}
        />
        
        {/* 操作按钮组件 */}
        <ActionButtons
          onSave={handleSave}
          onPublish={handlePublish}
          loading={loading}
          disabled={disabled}
          className={styles.actionButtons}
        />
      </div>
    </div>
  );
};

/**
 * 组件属性类型检查
 * 定义每个属性的数据类型和是否必需
 */
DivinationGridAccessory.propTypes = {
  value: PropTypes.string, // 补充说明文本内容
  onChange: PropTypes.func.isRequired, // 文本变化回调函数（必需）
  onSave: PropTypes.func.isRequired, // 保存按钮点击回调函数（必需）
  onPublish: PropTypes.func.isRequired, // 发布按钮点击回调函数（必需）
  loading: PropTypes.bool, // 是否处于加载状态
  disabled: PropTypes.bool, // 是否禁用按钮
  maxLength: PropTypes.number, // 最大字符长度
  placeholder: PropTypes.string, // 输入框占位文本
  autoSave: PropTypes.bool, // 是否启用自动保存
  className: PropTypes.string, // 额外的CSS类名
  style: PropTypes.object // 行内样式对象
};

/**
 * 组件默认属性
 * 为可选属性提供默认值
 */
DivinationGridAccessory.defaultProps = {
  value: '',
  loading: false,
  disabled: false,
  maxLength: 500,
  placeholder: '请输入补充说明，记录您的求占背景、心境或其他相关信息...',
  autoSave: true,
  className: '',
  style: {}
};

// 为 DivinationGridAccessory 组件添加 displayName，便于在 React DevTools 中调试
DivinationGridAccessory.displayName = 'DivinationGridAccessory';

export default DivinationGridAccessory;
