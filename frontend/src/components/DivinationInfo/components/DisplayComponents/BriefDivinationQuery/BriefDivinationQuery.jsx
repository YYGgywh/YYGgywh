/*
 * @file            frontend/src/components/DivinationInfo/components/DisplayComponents/BriefDivinationQuery/BriefDivinationQuery.jsx
 * @description     简要占卜查询组件，用于展示求测者信息和占题的简要形式
 * @author          圆运阁古易文化 <gordon_cao@qq.com>
 * @createTime      2026-03-14 16:30:00
 * @lastModified    2026-03-15 14:13:26
 * Copyright © All rights reserved
*/

import React from 'react';
import PropTypes from 'prop-types';
import styles from './BriefDivinationQuery.desktop.module.css';
import {
  formatSolarDate,
  formatSolarTime,
  formatLunarDate,
  formatLunarTime
} from '../../../../../utils/formatTimeUtils';

/**
 * 简要占卜查询组件
 * 使用 React.memo 包装组件，避免不必要的重渲染
 * @param {Object} props - 组件属性
 * @param {Object} props.formData - 表单数据对象，包含求测者信息和占题
 * @param {Object} props.divinationData - 占卜数据对象，包含日历信息
 * @param {string} props.className - 自定义类名
 * @returns {JSX.Element|null} 返回简要占卜查询信息的 JSX 元素，无数据时返回 null
 */
const BriefDivinationQuery = React.memo(({ formData = {}, divinationData = {}, className = '' }) => {
  const calendarInfo = divinationData.calendar_info || {};
  
  // 使用 React.useMemo 缓存简要占题文本的格式化结果
  // 只有当 formData 中的相关字段变化时才重新计算
  // 优化目的：避免每次渲染都重新拼接字符串
  const briefText = React.useMemo(() => {
    // 如果 formData 为空对象，则返回空字符串
    if (!formData || Object.keys(formData).length === 0) {
      return '';
    }
    
    // 提取各个字段，如果不存在则使用空字符串
    const location = formData.location || '';           // 属地
    const firstName = formData.firstName || '';         // 名字
    const lastName = formData.lastName || '';           // 姓氏
    const gender = formData.gender || '';             // 性别
    const birthYear = formData.birthYear || '';       // 出生年份
    const question = formData.question || '';         // 占题
    
    // 构建生年信息：如果有出生年份，则添加"生人"后缀
    const birthYearText = birthYear ? `${birthYear}生人` : '';
    
    // 构建占题信息：如果有占题，则添加句号后缀
    const questionText = question ? `${question} ？` : '';
    
    // 拼接所有信息，格式为：属地 姓名 性别 生年生人，占：占题。
    // 使用模板字符串进行拼接，各字段之间用空格分隔
    return `${location} ${firstName}${lastName} ${gender} ${birthYearText}，占：${questionText}`.trim();
  }, [formData.location, formData.firstName, formData.lastName, formData.gender, formData.birthYear, formData.question]);
  
  // 使用 React.useMemo 缓存时间信息的格式化结果
  const timeText = React.useMemo(() => {
    const solarInfo = calendarInfo.solar_info;
    const lunarInfo = calendarInfo.lunar_info;
    
    if (!solarInfo || !lunarInfo) {
      return '';
    }
    
    const solarDate = formatSolarDate(solarInfo);
    const solarTime = formatSolarTime(solarInfo);
    const lunarDate = formatLunarDate(lunarInfo);
    const lunarTime = formatLunarTime(lunarInfo);
    
    return `${solarDate} ${solarTime}（${lunarDate} ${lunarTime}）`;
  }, [calendarInfo.solar_info, calendarInfo.lunar_info]);
  
  // 如果没有数据，则不渲染任何内容
  if (!briefText) {
    return null;
  }
  
  // 返回 JSX 元素，渲染简要占卜查询信息
  // role="listitem"：ARIA 角色，表示这是一个列表项
  // aria-label="简要占题"：为屏幕阅读器提供描述信息
  return (
    <div 
      className={`${styles.briefDivinationQuery} ${className}`}
      role="listitem"
      aria-label="简要占题"
    >
      {/* 显示时间信息 */}
      {timeText && <div className={styles.timeInfo}>{timeText}</div>}
      {/* 显示格式化后的简要占题文本 */}
      <div className={styles.briefContent}>{briefText}</div>
    </div>
  );
});

// 为 BriefDivinationQuery 组件添加 PropTypes 类型定义
// 这有助于在开发阶段捕获类型错误，并提供更好的 IDE 智能提示
BriefDivinationQuery.propTypes = {
  formData: PropTypes.shape({          // formData 必须是对象类型，且包含以下属性
    location: PropTypes.string,       // location 属性必须是字符串类型
    firstName: PropTypes.string,       // firstName 属性必须是字符串类型
    lastName: PropTypes.string,        // lastName 属性必须是字符串类型
    gender: PropTypes.string,         // gender 属性必须是字符串类型
    birthYear: PropTypes.string,      // birthYear 属性必须是字符串类型
    question: PropTypes.string         // question 属性必须是字符串类型
  }),
  divinationData: PropTypes.shape({   // divinationData 必须是对象类型，且包含以下属性
    calendar_info: PropTypes.shape({  // calendar_info 必须是对象类型，且包含以下属性
      solar_info: PropTypes.object,   // solar_info 属性必须是对象类型
      lunar_info: PropTypes.object    // lunar_info 属性必须是对象类型
    })
  }),
  className: PropTypes.string         // className 属性必须是字符串类型
};

// 为 BriefDivinationQuery 组件添加 displayName，便于在 React DevTools 中调试
BriefDivinationQuery.displayName = 'BriefDivinationQuery';

// 导出 BriefDivinationQuery 组件作为默认导出
export default BriefDivinationQuery;