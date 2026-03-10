/*
 * @file            frontend/src/components/LiuYao/LiuYaoQiGua/components/YaoComponents/YaoDisplay/YaoDisplay.jsx
 * @description     爻位显示组件，支持三种模式：display（只读）、input（可编辑）、buttons（按钮选择）
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-08 20:15:00
 * @lastModified    2026-03-08 20:30:00
 * Copyright © All rights reserved
*/

import React from 'react';
import YaoInput from '../YaoInput/YaoInput';
import YaoButton from '../YaoButton/YaoButton';
import { getYaoComponent } from '../../../../utils/yaoUtils';
import styles from './YaoDisplay.desktop.module.css';

const YaoDisplay = ({
  className,
  mode,
  yaoValues,
  yaoOddCounts,
  yaoSelections,
  disabledYaos,
  onYaoChange,
  onYaoSelect,
  onYaoDoubleClick,
  onYaoInputValidation,
  yaoRefs,
  inputProps = {},
  currentYaoIndex = -1,
  isOneClick = false
}) => {
  const yaoOrder = ['shang', 'wu', 'si', 'san', 'er', 'chu'];
  const yaoLabels = { shang: '上爻', wu: '五爻', si: '四爻', san: '三爻', er: '二爻', chu: '初爻' };
  const [focusedYao, setFocusedYao] = React.useState(null);
  
  React.useEffect(() => {
    if (focusedYao && disabledYaos?.[focusedYao]) {
      setFocusedYao(null);
    }
  }, [disabledYaos, focusedYao]);

  const getYaoButtonState = (selection, type) => {
    if (selection === null) return null;
    if (selection === type) return 'selected';
    if (selection === `${type}-active`) return 'active';
    return null;
  };

  const getLabelClassName = (yao) => {
    const classNames = [styles.label];
    if (mode === 'input') {
      if (focusedYao === yao) {
        classNames.push(styles.labelActive);
      } else if (!yaoValues[yao]) {
        classNames.push(styles.labelDisabled);
      }
    } else if (mode === 'display' && isOneClick) {
      if (yaoValues[yao] === '待生成') {
        classNames.push(styles.labelDisabled);
      }
    } else if (mode === 'display' && currentYaoIndex >= 0) {
      const yaoIndex = yaoOrder.indexOf(yao);
      const reverseIndex = 5 - yaoIndex;
      if (reverseIndex === currentYaoIndex) {
        classNames.push(styles.labelActive);
      } else if (reverseIndex > currentYaoIndex && yaoValues[yao] === '待生成') {
        classNames.push(styles.labelDisabled);
      }
    } else if (mode === 'buttons') {
      if (yaoSelections?.[yao] === null) {
        classNames.push(styles.labelDisabled);
      }
    }
    return classNames.join(' ');
  };

  return (
    <div className={`${styles.root} ${className || ''}`}>
      {yaoOrder.map(yao => (
        <div key={yao} className={styles.item}>
          <span className={getLabelClassName(yao)}>{yaoLabels[yao]}：</span>
          
          {mode === 'display' && (
            <>
              <YaoInput
                value={yaoValues[yao]}
                isPlaceholder={yaoValues[yao] === '待生成'}
                disabled
              />
              <div className={styles.component}>
                {getYaoComponent(yaoOddCounts?.[yao])}
              </div>
            </>
          )}
          
          {mode === 'input' && (
            <>
              <YaoInput
                inputRef={yaoRefs?.[yao]}
                value={yaoValues[yao]}
                placeholder={inputProps.placeholder || '待输入'}
                editable={!disabledYaos?.[yao]}
                disabled={disabledYaos?.[yao]}
                isActive={!disabledYaos?.[yao]}
                onChange={(e) => onYaoChange?.(yao, e.target.value)}
                onDoubleClick={() => onYaoDoubleClick?.(yao)}
                onInput={onYaoInputValidation}
                onFocus={() => setFocusedYao(yao)}
                onBlur={() => setFocusedYao(null)}
                minLength={inputProps.minLength}
                maxLength={inputProps.maxLength}
                pattern={inputProps.pattern}
              />
              <div className={styles.component}>
                {getYaoComponent(yaoOddCounts?.[yao])}
              </div>
            </>
          )}
          
          {mode === 'buttons' && (
            <>
              <div className={styles.buttonsContainer}>
                <YaoButton
                  type="yang"
                  state={getYaoButtonState(yaoSelections?.[yao], 'yang')}
                  onClick={() => onYaoSelect?.(yao, 'yang')}
                />
                <YaoButton
                  type="yin"
                  state={getYaoButtonState(yaoSelections?.[yao], 'yin')}
                  onClick={() => onYaoSelect?.(yao, 'yin')}
                />
              </div>
              <div className={styles.component}>
                {getYaoComponent(yaoOddCounts?.[yao])}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default YaoDisplay;
