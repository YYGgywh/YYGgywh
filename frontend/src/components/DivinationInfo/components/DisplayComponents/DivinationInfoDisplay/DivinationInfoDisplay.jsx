/*
 * @file            frontend/src/components/DivinationInfo/DivinationInfoDisplay.jsx
 * @description     占卜信息展示组件，用于展示求测者信息、占题、占类、时间和节气
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-22 16:00:00
 * @lastModified    2026-03-03 13:00:00
 * Copyright © All rights reserved
*/

import React from 'react';
import PropTypes from 'prop-types';
import { methodToChinese } from '../../../../../utils/methodMapping';
// 导入时间格式化工具函数，用于将原始数据格式化为可读的日期时间字符串
import {
  formatSolarDate,    // 格式化西历日期（如：2025年08月10日）
  formatSolarTime,    // 格式化西历时间（如：12:05:17）
  formatLunarDate,    // 格式化农历日期（如：乙巳年闰六月十七）
  formatLunarTime,    // 格式化农历时间（如：午时）
  formatJieqiDate,    // 格式化节气日期（如：2025年08月07日）
  formatJieqiTime,     // 格式化节气时间（如：12:00:00）
  formatJieqiDateToLunar, // 格式化节气日期为农历（如：乙巳年六月十七）
  formatJieqiTimeToLunar  // 格式化节气时间为农历（如：午时）
} from '../../../../../utils/formatTimeUtils';

// 导入组件样式文件，定义组件的视觉样式
import styles from './DivinationInfoDisplay.desktop.module.css';

// 导入简要占卜查询组件
import BriefDivinationQuery from '../BriefDivinationQuery/BriefDivinationQuery';

const formatDateTimeInfo = (solarInfo, lunarInfo) => ({
  solarDate: formatSolarDate(solarInfo),
  solarTime: formatSolarTime(solarInfo),
  lunarDate: formatLunarDate(lunarInfo),
  lunarTime: formatLunarTime(lunarInfo)
});

const formatJieqiInfo = (prevJie, nextJie) => ({
  prevJieDate: formatJieqiDate(prevJie?.time || ''),
  prevJieTime: formatJieqiTime(prevJie?.time || ''),
  nextJieDate: formatJieqiDate(nextJie?.time || ''),
  nextJieTime: formatJieqiTime(nextJie?.time || '')
});

const validateFormData = (formData) => {
  if (!formData || typeof formData !== 'object') {
    console.warn('Invalid formData:', formData);
    return false;
  }
  return true;
};

const validateDivinationData = (divinationData) => {
  if (!divinationData || typeof divinationData !== 'object') {
    console.warn('Invalid divinationData:', divinationData);
    return false;
  }
  return true;
};

// 定义 SeekerInfo 子组件：用于展示求测者的基本信息
// 使用 React.memo 包装组件，避免在父组件重渲染时不必要的重新渲染
// props 参数说明：
//   - firstName (string): 名字，默认值为空字符串
//   - lastName (string): 姓氏，默认值为空字符串
//   - gender (string): 性别，默认值为空字符串
//   - birthYear (string): 出生年份，默认值为空字符串
//   - location (string): 属地，默认值为空字符串
//   - divinationType (string): 占类，默认值为空字符串
//   - subType (string): 子类型，默认值为空字符串
const SeekerInfo = React.memo(({ firstName = '', lastName = '', gender = '', birthYear = '', location = '', divinationType = '', subType = '', method = '' }) => {
  const fullName = React.useMemo(() => `${firstName}${lastName}`.trim(), [firstName, lastName]);
  const displayType = React.useMemo(() => subType ? `${divinationType}·${subType}` : divinationType, [divinationType, subType]);
  const displayMethod = React.useMemo(() => methodToChinese(method), [method]);
  
  // 返回 JSX 元素，渲染求测者信息容器
  // role="list"：ARIA 角色，表示这是一个列表
  // aria-label="求测者信息"：为屏幕阅读器提供描述信息
  return (
    <div className={styles.seekerInfo} role="list" aria-label="求测者信息">
      {/* 姓名信息容器 */}
      <div className={styles.nameInfoContainer}>
        {/* 姓名标签，显示"姓名：" */}
        <span className={styles.nameLabel}>姓名：</span>
        {/* 姓名信息，显示拼接后的完整姓名 */}
        <span className={styles.nameInfo}>{fullName}</span>
      </div>
      {/* 性别信息容器 */}
      <div className={styles.genderInfoContainer}>
        {/* 性别标签，显示"性别：" */}
        <span className={styles.genderLabel}>性别：</span>
        {/* 性别信息，显示性别 */}
        <span className={styles.genderInfo}>{gender}</span>
      </div>
      {/* 出生年份信息容器 */}
      <div className={styles.birthYearInfoContainer}>
        {/* 出生年份标签，显示"生年：" */}
        <span className={styles.birthYearLabel}>生年：</span>
        {/* 出生年份信息，显示出生年份 */}
        <span className={styles.birthYearInfo}>{birthYear}</span>
      </div>
      {/* 属地信息容器 */}
      <div className={styles.locationInfoContainer}>
        {/* 属地标签，显示"属地：" */}
        <span className={styles.locationLabel}>属地：</span>
        {/* 属地信息，显示属地 */}
        <span className={styles.locationInfo}>{location}</span>
      </div>
      {/* 占类信息容器 */}
      <div className={styles.divinationTypeContainer}>
        {/* 占类标签，显示"占类：" */}
        <span className={styles.divinationTypeLabel}>占类：</span>
        {/* 占类信息，显示格式化后的占类（可能包含子类型） */}
        <span className={styles.divinationTypeInfo}>{displayType}</span>
      </div>
      {/* 起卦方式信息容器 */}
      {displayMethod && (
        <div className={styles.methodInfoContainer}>
          {/* 起卦方式标签，显示"起卦：" */}
          <span className={styles.methodLabel}>起卦：</span>
          {/* 起卦方式信息，显示格式化后的起卦方式 */}
          <span className={styles.methodInfo}>{displayMethod}</span>
        </div>
      )}
    </div>
  );
});

// 为 SeekerInfo 组件添加 PropTypes 类型定义
// 这有助于在开发阶段捕获类型错误，并提供更好的 IDE 智能提示
SeekerInfo.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  gender: PropTypes.string,
  birthYear: PropTypes.string,
  location: PropTypes.string,
  divinationType: PropTypes.string,
  subType: PropTypes.string,
  method: PropTypes.string
};

// 为 SeekerInfo 组件添加 displayName，便于在 React DevTools 中调试
SeekerInfo.displayName = 'SeekerInfo';

// 定义 DivinationQuery 子组件：用于展示占卜查询信息（占题）
// 使用 React.memo 包装组件，避免不必要的重渲染
// props 参数说明：
//   - question (string): 占题，默认值为空字符串
const DivinationQuery = React.memo(({ question = '' }) => {
  // 返回 JSX 元素，渲染占卜查询信息容器
  return (
    <div className={styles.divinationQuery} role="list" aria-label="占卜内容信息">
      {/* 占题信息容器 */}
      <div className={styles.questionInfoContainer}>
        {/* 占题标签，显示"占题：" */}
        <span className={styles.questionLabel}>占题：</span>
        {/* 占题信息，显示占题内容 */}
        <span className={styles.questionInfo}>{question}</span>
      </div>
    </div>
  );
});

// 为 DivinationQuery 组件添加 PropTypes 类型定义
DivinationQuery.propTypes = {
  question: PropTypes.string        // question 必须是字符串类型
};

// 为 DivinationQuery 组件添加 displayName，便于在 React DevTools 中调试
DivinationQuery.displayName = 'DivinationQuery';

// 定义 DateTimeInfo 子组件：用于展示日期时间信息（西历和农历）
// 使用 React.memo 包装组件，避免不必要的重渲染
// props 参数说明：
//   - solarInfo (object): 西历信息对象，包含年、月、日、时、分、秒
//   - lunarInfo (object): 农历信息对象，包含干支年、中文月、中文日、时辰
//   - prevJie (object): 上一个节气信息对象，包含 name（节气名称）和 time（节气时间）
//   - nextJie (object): 下一个节气信息对象，包含 name（节气名称）和 time（节气时间）
const DateTimeInfo = React.memo(({ solarInfo, lunarInfo, prevJie, nextJie }) => {
  const formattedDateTime = React.useMemo(() => formatDateTimeInfo(solarInfo, lunarInfo), [solarInfo, lunarInfo]);
  const formattedJieqi = React.useMemo(() => formatJieqiInfo(prevJie, nextJie), [prevJie?.time, nextJie?.time]);
  
  const [isLunar, setIsLunar] = React.useState(false);
  const [prevJieLunarDate, setPrevJieLunarDate] = React.useState('');
  const [prevJieLunarTime, setPrevJieLunarTime] = React.useState('');
  const [nextJieLunarDate, setNextJieLunarDate] = React.useState('');
  const [nextJieLunarTime, setNextJieLunarTime] = React.useState('');
  
  React.useEffect(() => {
    if (prevJie?.time) {
      const lunarDate = formatJieqiDateToLunar(prevJie.time);
      const lunarTime = formatJieqiTimeToLunar(prevJie.time);
      setPrevJieLunarDate(lunarDate);
      setPrevJieLunarTime(lunarTime);
    }
    if (nextJie?.time) {
      const lunarDate = formatJieqiDateToLunar(nextJie.time);
      const lunarTime = formatJieqiTimeToLunar(nextJie.time);
      setNextJieLunarDate(lunarDate);
      setNextJieLunarTime(lunarTime);
    }
  }, [prevJie?.time, nextJie?.time]);
  
  const handleMouseEnter = () => setIsLunar(true);
  const handleMouseLeave = () => setIsLunar(false);
  
  const displayDate = isLunar ? formattedDateTime.lunarDate : formattedDateTime.solarDate;
  const displayTime = isLunar ? formattedDateTime.lunarTime : formattedDateTime.solarTime;
  const displayPrevJieDate = isLunar ? prevJieLunarDate : formattedJieqi.prevJieDate;
  const displayPrevJieTime = isLunar ? prevJieLunarTime : formattedJieqi.prevJieTime;
  const displayNextJieDate = isLunar ? nextJieLunarDate : formattedJieqi.nextJieDate;
  const displayNextJieTime = isLunar ? nextJieLunarTime : formattedJieqi.nextJieTime;
  
  // 返回 JSX 元素，渲染日期时间信息容器
  return (
    <div className={styles.datetimeContainer} role="list" aria-label="日期时间和节气信息">
      {/* 西历信息行 */}
      <div 
        className={`${styles.calendarRow} ${styles.solarRow}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* 上一个节气 */}
        <div className={styles.calendarItem}>
          <span className={styles.jieqiLabel}>{prevJie?.name || ''}：</span>
          <span className={styles.dateInfo}>{displayPrevJieDate}</span>
          <span className={styles.timeInfo}>{displayPrevJieTime}</span>
        </div>
        {/* 占时 */}
        <div className={styles.calendarItem}>
          <span className={styles.timeLabel}>占时：</span>
          <span className={styles.dateInfo}>{displayDate}</span>
          <span className={styles.timeInfo}>{displayTime}</span>
        </div>
        {/* 下一个节气 */}
        <div className={styles.calendarItem}>
          <span className={styles.jieqiLabel}>{nextJie?.name || ''}：</span>
          <span className={styles.dateInfo}>{displayNextJieDate}</span>
          <span className={styles.timeInfo}>{displayNextJieTime}</span>
        </div>
      </div>
    </div>
  );
});

// 为 DateTimeInfo 组件添加 PropTypes 类型定义
// 使用 PropTypes.shape 定义对象类型的详细结构，提升类型安全性
DateTimeInfo.propTypes = {
  solarInfo: PropTypes.shape({           // solarInfo 必须是对象类型，且包含以下属性
    solar_year: PropTypes.string,         // solar_year 属性必须是字符串类型
    solar_month: PropTypes.string,        // solar_month 属性必须是字符串类型
    solar_day: PropTypes.string,          // solar_day 属性必须是字符串类型
    solar_hour: PropTypes.string,         // solar_hour 属性必须是字符串类型
    solar_minute: PropTypes.string,        // solar_minute 属性必须是字符串类型
    solar_second: PropTypes.string         // solar_second 属性必须是字符串类型
  }),
  lunarInfo: PropTypes.shape({           // lunarInfo 必须是对象类型，且包含以下属性
    lunar_year_in_GanZhi: PropTypes.string,  // lunar_year_in_GanZhi 属性必须是字符串类型
    lunar_month_in_Chinese: PropTypes.string,  // lunar_month_in_Chinese 属性必须是字符串类型
    lunar_day_in_Chinese: PropTypes.string,    // lunar_day_in_Chinese 属性必须是字符串类型
    lunar_hour: PropTypes.string,              // lunar_hour 属性必须是字符串类型
    lunar_time_Zhi: PropTypes.string          // lunar_time_Zhi 属性必须是字符串类型
  }),
  prevJie: PropTypes.shape({    // prevJie 必须是对象类型，且包含以下属性
    name: PropTypes.string,     // name 属性必须是字符串类型
    time: PropTypes.string       // time 属性必须是字符串类型
  }),
  nextJie: PropTypes.shape({    // nextJie 必须是对象类型，且包含以下属性
    name: PropTypes.string,     // name 属性必须是字符串类型
    time: PropTypes.string       // time 属性必须是字符串类型
  })
};

// 为 DateTimeInfo 组件添加 displayName，便于在 React DevTools 中调试
DateTimeInfo.displayName = 'DateTimeInfo';

// 定义 DivinationInfoDisplay 主组件：占卜信息展示的主容器组件
// 使用 React.memo 包装组件，避免在父组件重渲染时不必要的重新渲染
// props 参数说明：
//   - formData (object): 表单数据对象，包含求测者信息、占题、占类等，默认值为空对象
//   - divinationData (object): 占卜数据对象，包含日历信息、节气信息等，默认值为空对象
const DivinationInfoDisplay = React.memo(({ formData = {}, divinationData = {}, loading = false, error = null }) => {
  const calendarInfo = divinationData.calendar_info || {};
  const jieqiInfo = calendarInfo.jieqi_info?.jieqi_result_a || {};
  
  const seekerInfoProps = React.useMemo(() => ({
    firstName: formData.firstName,
    lastName: formData.lastName,
    gender: formData.gender,
    birthYear: formData.birthYear,
    location: formData.location,
    divinationType: formData.divinationType,
    subType: formData.subType,
    method: formData.method
  }), [formData.firstName, formData.lastName, formData.gender, formData.birthYear, formData.location, formData.divinationType, formData.subType, formData.method]);
  
  const divinationQueryProps = React.useMemo(() => ({
    question: formData.question
  }), [formData.question]);
  
  const dateTimeInfoProps = React.useMemo(() => ({
    solarInfo: calendarInfo.solar_info,
    lunarInfo: calendarInfo.lunar_info,
    prevJie: jieqiInfo.prev_jie,
    nextJie: jieqiInfo.next_jie
  }), [calendarInfo.solar_info, calendarInfo.lunar_info, jieqiInfo.prev_jie, jieqiInfo.next_jie]);

  if (loading) {
    return (
      <div className={`${styles.divinationInfo} ${styles.loading}`} role="status" aria-label="加载中">
        加载中...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.divinationInfo} ${styles.error}`} role="alert" aria-label="加载失败">
        {error}
      </div>
    );
  }

  if (!validateFormData(formData) || !validateDivinationData(divinationData)) {
    return null;
  }
  
  // 使用 try-catch 块捕获渲染过程中可能出现的错误
  // 错误处理策略：捕获任何渲染错误，并显示友好的错误提示
  // 这样可以防止单个组件的错误导致整个应用崩溃
  try {
    // 返回 JSX 元素，渲染占卜信息的主容器
    return (
      <div className={styles.divinationInfo} role="region" aria-label="占卜信息">
        {/* 顶部信息区域：包含求测者信息 */}
        <div className={styles.infoTop}>
          {/* 渲染 SeekerInfo 子组件，传入缓存的 props */}
          <SeekerInfo {...seekerInfoProps} />
        </div>

        {/* 中间信息区域：包含占卜查询信息 */}
        <div className={styles.infoMiddle}>
          {/* 渲染 DivinationQuery 子组件，传入缓存的 props */}
          <DivinationQuery {...divinationQueryProps} />
        </div>

        {/* 底部信息区域：包含日期时间信息和节气信息 */}
        <div className={styles.infoBottom}>
          {/* 渲染 DateTimeInfo 子组件，传入缓存的 props */}
          <DateTimeInfo {...dateTimeInfoProps} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('DivinationInfoDisplay 渲染错误:', {
      error,
      formData,
      divinationData,
      timestamp: new Date().toISOString()
    });
    
    return (
      <div className={`${styles.divinationInfo} ${styles.error}`} role="alert" aria-label="占卜信息加载失败">
        占卜信息加载失败，请稍后重试
      </div>
    );
  }
});

// 为 DivinationInfoDisplay 主组件添加 PropTypes 类型定义
// 使用 PropTypes.shape 定义对象类型的详细结构
DivinationInfoDisplay.propTypes = {
  formData: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    gender: PropTypes.string,
    birthYear: PropTypes.string,
    location: PropTypes.string,
    question: PropTypes.string,
    divinationType: PropTypes.string,
    subType: PropTypes.string,
    method: PropTypes.string
  }),
  divinationData: PropTypes.shape({
    calendar_info: PropTypes.shape({
      solar_info: PropTypes.object,
      lunar_info: PropTypes.object,
      jieqi_info: PropTypes.shape({
        jieqi_result_a: PropTypes.shape({
          prev_jie: PropTypes.shape({
            name: PropTypes.string,
            time: PropTypes.string
          }),
          next_jie: PropTypes.shape({
            name: PropTypes.string,
            time: PropTypes.string
          })
        })
      })
    })
  }),
  loading: PropTypes.bool,
  error: PropTypes.string
};

// 导出 DivinationInfoDisplay 组件作为默认导出
// 这样其他文件可以通过 import DivinationInfoDisplay from './DivinationInfoDisplay' 导入使用
export default DivinationInfoDisplay;

// 导出 BriefDivinationQuery 组件
// 这样其他文件可以通过 import { BriefDivinationQuery } from './DivinationInfoDisplay' 导入使用
export { BriefDivinationQuery };
