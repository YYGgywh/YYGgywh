/*
 * @file            frontend/src/components/common/ActionButtons/ActionButtons.jsx
 * @description     操作按钮组件，提供保存和发布功能
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-15 10:00:00
 * @lastModified    2026-03-16 15:21:38
 * Copyright © All rights reserved
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup } from '../Button';
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
    <ButtonGroup className={styles.actionButtons} spacing="medium">
      <Button
        type="primary"
        size="small"
        onClick={handleSave}
        loading={loading}
        disabled={disabled}
        ariaLabel="保存排盘记录"
      >
        {loading ? '保存中...' : '保存'}
      </Button>
      <Button
        type="confirm"
        size="small"
        onClick={handlePublish}
        loading={loading}
        disabled={disabled}
        ariaLabel="发布排盘记录"
      >
        {loading ? '发布中...' : '发布'}
      </Button>
    </ButtonGroup>
  );
});

ActionButtons.propTypes = {
  onSave: PropTypes.func,
  onPublish: PropTypes.func,
  loading: PropTypes.bool,
  disabled: PropTypes.bool
};

export default ActionButtons;