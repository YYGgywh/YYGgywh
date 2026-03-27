/*
 * @file            frontend/src/components/common/SupplementInput/SupplementInput.jsx
 * @description     补充说明输入组件，支持多行文本输入和自动保存草稿
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-15 10:00:00
 * @lastModified    2026-03-15 10:00:00
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './SupplementInput.desktop.module.css';
import mobileStyles from './SupplementInput.mobile.module.css';

const MAX_LENGTH = 500;
const STORAGE_KEY = 'supplement_draft';

// 先定义组件
const SupplementInputComponent = ({ 
  value = '', 
  onChange, 
  maxLength = MAX_LENGTH,
  placeholder = '请输入补充说明...',
  disabled = false,
  autoSave = true
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [charCount, setCharCount] = useState(value.length);
  
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
  const currentStyles = isMobile ? mobileStyles : styles;

  useEffect(() => {
    setLocalValue(value);
    setCharCount(value.length);
  }, [value]);

  useEffect(() => {
    if (autoSave && localValue) {
      localStorage.setItem(STORAGE_KEY, localValue);
    }
  }, [localValue, autoSave]);

  useEffect(() => {
    const draft = localStorage.getItem(STORAGE_KEY);
    if (draft && !value && autoSave) {
      setLocalValue(draft);
      setCharCount(draft.length);
      onChange(draft);
    }
  }, []);

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      setLocalValue(newValue);
      setCharCount(newValue.length);
      onChange(newValue);
    }
  };

  const handleClear = () => {
    setLocalValue('');
    setCharCount(0);
    onChange('');
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className={currentStyles.supplementInput}>
      <div className={currentStyles.inputContainer}>
        <textarea
          className={currentStyles.textarea}
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          rows={4}
          aria-label="补充说明输入框"
        />
        <div className={currentStyles.inputFooter}>
          <span className={currentStyles.charCount}>
            {charCount}/{maxLength}
          </span>
          {localValue && (
            <button 
              className={currentStyles.clearButton}
              onClick={handleClear}
              disabled={disabled}
              aria-label="清空内容"
            >
              清空
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// 使用 React.memo 包装组件
const SupplementInput = React.memo(SupplementInputComponent);

// 添加静态方法：清除草稿
SupplementInput.clearDraft = () => {
  localStorage.removeItem(STORAGE_KEY);
};

SupplementInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  maxLength: PropTypes.number,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  autoSave: PropTypes.bool
};

// 为 SupplementInput 组件添加 displayName，便于在 React DevTools 中调试
SupplementInput.displayName = 'SupplementInput';

export default SupplementInput;