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

const MAX_LENGTH = 500;
const STORAGE_KEY = 'supplement_draft';

const SupplementInput = React.memo(({ 
  value = '', 
  onChange, 
  maxLength = MAX_LENGTH,
  placeholder = '请输入补充说明...',
  disabled = false,
  autoSave = true 
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [charCount, setCharCount] = useState(value.length);

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
    <div className={styles.supplementInput}>
      <div className={styles.inputContainer}>
        <textarea
          className={styles.textarea}
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          rows={4}
          aria-label="补充说明输入框"
        />
        <div className={styles.inputFooter}>
          <span className={styles.charCount}>
            {charCount}/{maxLength}
          </span>
          {localValue && (
            <button 
              className={styles.clearButton}
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
});

SupplementInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  maxLength: PropTypes.number,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  autoSave: PropTypes.bool
};

export default SupplementInput;