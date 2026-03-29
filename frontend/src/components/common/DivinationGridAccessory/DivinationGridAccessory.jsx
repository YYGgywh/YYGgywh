/*
 * @file            frontend/src/components/common/DivinationGridAccessory/DivinationGridAccessory.jsx
 * @description     占卜补充信息组件，整合补充说明输入和操作按钮
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-16 00:00:00
 * @lastModified    2026-03-16 00:00:00
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import desktopStyles from './DivinationGridAccessory.desktop.module.css';
import mobileStyles from './DivinationGridAccessory.mobile.module.css';

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
  style = {},
  supplementCreateTime = null,
  supplementUpdateTime = null,
  supplementModifyCount = 0
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
    const classNames = [];
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
   * 格式化时间戳为可读日期时间
   * @param {number} timestamp - 时间戳
   * @returns {string} 格式化后的日期时间字符串
   */
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
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
        
        {/* 补充信息元数据 */}
        {(supplementCreateTime || supplementUpdateTime || supplementModifyCount > 0) && (
          <div className={styles.supplementMeta}>
            {supplementCreateTime && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>创建时间：</span>
                <span className={styles.metaValue}>{formatTime(supplementCreateTime)}</span>
              </div>
            )}
            {supplementUpdateTime && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>更新时间：</span>
                <span className={styles.metaValue}>{formatTime(supplementUpdateTime)}</span>
              </div>
            )}
            {supplementModifyCount > 0 && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>修改次数：</span>
                <span className={styles.metaValue}>{supplementModifyCount}</span>
              </div>
            )}
          </div>
        )}
        
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
  style: PropTypes.object, // 行内样式对象
  supplementCreateTime: PropTypes.number, // 补充说明创建时间
  supplementUpdateTime: PropTypes.number, // 补充说明更新时间
  supplementModifyCount: PropTypes.number // 补充说明修改次数
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
  style: {},
  supplementCreateTime: null,
  supplementUpdateTime: null,
  supplementModifyCount: 0
};

// 为 DivinationGridAccessory 组件添加 displayName，便于在 React DevTools 中调试
DivinationGridAccessory.displayName = 'DivinationGridAccessory';

export default DivinationGridAccessory;
