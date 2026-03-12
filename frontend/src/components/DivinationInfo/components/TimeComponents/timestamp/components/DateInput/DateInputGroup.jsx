/*
 * @file            frontend/src/components/DivinationInfo/components/TimeComponents/timestamp/components/DateInput/DateInputGroup.jsx
 * @description     日期输入框组组件，支持公历、农历、四柱场景的输入框集合渲染
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-11 20:40:00
 * @lastModified    2026-03-12 12:33:41
 * Copyright © All rights reserved
*/

import React from 'react';
import DateInput from './DateInput';

/**
 * 获取场景对应的输入框配置
 * @param {string} type - 场景类型（solar/lunar/four-pillars）
 * @returns {Array} 输入框配置数组
 */
const getInputFields = (type) => {
  switch (type) {
    case 'solar': // 公历场景
      return [
        { field: 'year', type: 'number', placeholder: '年', min: 1, max: 9999 },
        { field: 'month', type: 'number', placeholder: '月', min: 1, max: 12 },
        { field: 'day', type: 'number', placeholder: '日', min: 1, max: 31 },
        { field: 'hour', type: 'number', placeholder: '时', min: 0, max: 23 },
        { field: 'minute', type: 'number', placeholder: '分', min: 0, max: 59 },
        { field: 'second', type: 'number', placeholder: '秒', min: 0, max: 59 }
      ];
    
    case 'lunar': // 农历场景
      return [
        { field: 'lunar_year', type: 'number', placeholder: '年', min: 1, max: 9999 },
        { field: 'lunar_month', type: 'number', placeholder: '月', min: 1, max: 12 },
        { field: 'lunar_day', type: 'number', placeholder: '日', min: 1, max: 30 },
        { field: 'hour', type: 'number', placeholder: '时', min: 0, max: 23 },
        { field: 'minute', type: 'number', placeholder: '分', min: 0, max: 59 },
        { field: 'second', type: 'number', placeholder: '秒', min: 0, max: 59 }
      ];
    
    case 'four-pillars': // 四柱场景
      return [
        // 天干输入框
        { field: 'yearGan', type: 'text', placeholder: '年', min: null, max: null },
        { field: 'monthGan', type: 'text', placeholder: '月', min: null, max: null, disabled: true },
        { field: 'dayGan', type: 'text', placeholder: '日', min: null, max: null },
        { field: 'hourGan', type: 'text', placeholder: '时', min: null, max: null, disabled: true },
        // 地支输入框
        { field: 'yearZhi', type: 'text', placeholder: '年', min: null, max: null },
        { field: 'monthZhi', type: 'text', placeholder: '月', min: null, max: null },
        { field: 'dayZhi', type: 'text', placeholder: '日', min: null, max: null },
        { field: 'hourZhi', type: 'text', placeholder: '时', min: null, max: null }
      ];
    
    default:
      return [];
  }
};

/**
 * 日期输入框组组件
 * @param {string} type - 场景类型（solar/lunar/four-pillars）
 * @param {Object} value - 输入值
 * @param {function} onChange - 输入变化回调
 * @param {function} onBlur - 失去焦点回调
 * @param {function} onDoubleClick - 双击回调
 * @param {function} onKeyDown - 键盘事件回调
 * @param {Object} disabledFields - 禁用字段配置
 * @param {Object} styles - 样式对象
 * @param {string} className - 额外类名
 * @param {Object} inputRefs - 输入框引用对象（可选）
 * @param {function} onLeapMonthToggle - 闰月切换回调（仅农历场景）
 * @param {boolean} isLeapMonth - 是否是闰月（仅农历场景）
 */
const DateInputGroup = ({
  type = 'solar',
  value = {},
  onChange,
  onFocus,
  onBlur,
  onDoubleClick,
  onKeyDown,
  disabledFields = {},
  styles,
  className = '',
  inputRefs = null,
  onLeapMonthToggle,
  isLeapMonth = false
}) => {
  const inputFields = getInputFields(type);

  // 渲染输入框组
  const renderInputGroup = () => {
    // 四柱场景需要分组渲染
    if (type === 'four-pillars') {
      const tianganFields = inputFields.slice(0, 4); // 前4个是天干
      const dizhiFields = inputFields.slice(4); // 后4个是地支

      return (
        <>
          {/* 天干输入区域 */}
          <div className={`${styles.timestampInputs} ${styles.tianganInputs}`}>
            {tianganFields.map(fieldConfig => (
              <DateInput
                key={fieldConfig.field}
                field={fieldConfig.field}
                value={value[fieldConfig.field] || ''}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onDoubleClick={onDoubleClick}
                onKeyDown={onKeyDown}
                disabled={fieldConfig.disabled || disabledFields[fieldConfig.field]}
                type={fieldConfig.type}
                placeholder={fieldConfig.placeholder}
                min={fieldConfig.min}
                max={fieldConfig.max}
                styles={styles}
                inputRefs={inputRefs}
              />
            ))}
          </div>

          {/* 地支输入区域 */}
          <div className={`${styles.timestampInputs} ${styles.dizhiInputs}`}>
            {dizhiFields.map(fieldConfig => (
              <DateInput
                key={fieldConfig.field}
                field={fieldConfig.field}
                value={value[fieldConfig.field] || ''}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onDoubleClick={onDoubleClick}
                onKeyDown={onKeyDown}
                disabled={fieldConfig.disabled || disabledFields[fieldConfig.field]}
                type={fieldConfig.type}
                placeholder={fieldConfig.placeholder}
                min={fieldConfig.min}
                max={fieldConfig.max}
                styles={styles}
                inputRefs={inputRefs}
              />
            ))}
          </div>
        </>
      );
    }

    // 其他场景直接渲染
    if (type === 'lunar') {
      return (
        <div className={`${styles.timestampInputs} ${className}`}>
          {inputFields.map((fieldConfig, index) => (
            <React.Fragment key={fieldConfig.field}>
              {index === 1 && onLeapMonthToggle && (
                <button
                  type="button"
                  ref={(el) => (inputRefs && inputRefs.leapMonthToggle ? inputRefs.leapMonthToggle = el : null)}
                  className={`${styles.leapMonthToggle} ${isLeapMonth ? styles.active : ''}`}
                  onClick={onLeapMonthToggle}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onLeapMonthToggle();
                    }
                  }}
                  aria-pressed={isLeapMonth}
                  aria-label="闰月切换"
                  disabled={disabledFields.leap_month}
                  style={{
                    color: isLeapMonth ? '' : '#666666'
                  }}
                >
                  闰
                </button>
              )}
              <DateInput
                field={fieldConfig.field}
                value={value[fieldConfig.field] || ''}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onDoubleClick={onDoubleClick}
                onKeyDown={onKeyDown}
                disabled={fieldConfig.disabled || disabledFields[fieldConfig.field]}
                type={fieldConfig.type}
                placeholder={fieldConfig.placeholder}
                min={fieldConfig.min}
                max={fieldConfig.max}
                styles={styles}
                inputRefs={inputRefs}
              />
            </React.Fragment>
          ))}
        </div>
      );
    }

    // 公历场景直接渲染
    return (
      <div className={`${styles.timestampInputs} ${className}`}>
        {inputFields.map(fieldConfig => (
          <DateInput
            key={fieldConfig.field}
            field={fieldConfig.field}
            value={value[fieldConfig.field] || ''}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onDoubleClick={onDoubleClick}
            onKeyDown={onKeyDown}
            disabled={fieldConfig.disabled || disabledFields[fieldConfig.field]}
            type={fieldConfig.type}
            placeholder={fieldConfig.placeholder}
            min={fieldConfig.min}
            max={fieldConfig.max}
            styles={styles}
            inputRefs={inputRefs}
          />
        ))}
      </div>
    );
  };

  return renderInputGroup();
};

export default DateInputGroup;
