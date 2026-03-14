/*
 * @file            frontend/src/components/common/DisplayControl/DisplayControl.jsx
 * @description     显示控制组件，用于控制展示样式和模式切换
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-23 10:00:00
 * @lastModified    2026-03-13 11:00:00
 * Copyright © All rights reserved
*/

import React from 'react';
import PropTypes from 'prop-types';

// 导入桌面端样式
import styles from "./DisplayControl.desktop.module.css";

/**
 * 显示控制组件
 * 用于控制展示样式和模式切换
 */
const DisplayControl = React.memo(({
  className = '',
  buttons = [],
  activeButtons = [],
  onButtonClick,
  disabled = true
}) => {
  const defaultButtons = [
    { id: 'liuqin', label: '六亲', primary: true },
    { id: 'fuchen', label: '本伏', primary: true },
    { id: 'yinyang', label: '阴阳', primary: true },
    { id: 'meihua', label: '梅花', primary: false },
    { id: 'colorChange', label: '黑白', primary: true },
    { id: 'copy', label: '复制', primary: false },
    { id: 'calendar', label: '日历', primary: false }
  ];

  const displayButtons = buttons.length > 0 ? buttons : defaultButtons;

  return (
    <div className={`${styles.root} ${className}`} role="group" aria-label="显示控制按钮组">
      {displayButtons.map((button) => {
        const isActive = activeButtons.includes(button.id);
        const isColorChangeButton = button.id === 'colorChange';
        const isButtonDisabled = disabled && !isColorChangeButton;
        
        return (
          <button
            key={button.id}
            id={button.id}
            className={`${styles.button} ${button.primary ? styles.buttonPrimary : styles.buttonSecondary} ${isActive ? (isColorChangeButton ? styles.buttonColorChangeActive : styles.buttonActive) : ''} ${isButtonDisabled ? styles.buttonDisabled : ''} ${isColorChangeButton ? styles.buttonColorChange : ''}`}
            onClick={() => !isButtonDisabled && onButtonClick && onButtonClick(button.id)}
            disabled={isButtonDisabled}
            aria-pressed={isActive}
          >
            {isColorChangeButton ? (isActive ? '黑白' : '彩色') : button.label}
          </button>
        );
      })}
    </div>
  );
});

DisplayControl.propTypes = {
  className: PropTypes.string,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      primary: PropTypes.bool
    })
  ),
  activeButtons: PropTypes.arrayOf(PropTypes.string),
  onButtonClick: PropTypes.func,
  disabled: PropTypes.bool
};

DisplayControl.defaultProps = {
  className: '',
  buttons: [],
  activeButtons: [],
  onButtonClick: null,
  disabled: false
};

DisplayControl.displayName = 'DisplayControl';

export default DisplayControl;
