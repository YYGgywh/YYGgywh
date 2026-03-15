/*
 * @file            frontend/src/components/common/ActionButtons/ActionButtons.jsx
 * @description     操作按钮组件，提供保存和发布功能
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-15 10:00:00
 * @lastModified    2026-03-15 10:00:00
 * Copyright © All rights reserved
*/

import React from 'react';
import PropTypes from 'prop-types';
import { isLoggedIn } from '../../../utils/storage';
import styles from './ActionButtons.desktop.module.css';

const ActionButtons = React.memo(({ 
  onSave, 
  onPublish, 
  loading = false, 
  disabled = false 
}) => {
  const handleSave = () => {
    if (!loading && !disabled && onSave) {
      onSave();
    }
  };

  const handlePublish = () => {
    if (!loading && !disabled && onPublish) {
      onPublish();
    }
  };

  return (
    <div className={styles.actionButtons}>
      <button 
        className={`${styles.button} ${styles.saveButton}`}
        onClick={handleSave}
        disabled={loading || disabled}
        aria-label="保存排盘记录"
      >
        {loading ? '保存中...' : '保存'}
      </button>
      <button 
        className={`${styles.button} ${styles.publishButton}`}
        onClick={handlePublish}
        disabled={loading || disabled}
        aria-label="发布排盘记录"
      >
        {loading ? '发布中...' : '发布'}
      </button>
    </div>
  );
});

ActionButtons.propTypes = {
  onSave: PropTypes.func,
  onPublish: PropTypes.func,
  loading: PropTypes.bool,
  disabled: PropTypes.bool
};

export default ActionButtons;