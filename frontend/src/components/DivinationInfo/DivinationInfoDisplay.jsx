/*
 * @file            frontend/src/components/DivinationInfo/DivinationInfoDisplay.jsx
 * @description     占卜信息展示组件，用于展示求测者信息、占题、占类、时间和节气
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-22 16:00:00
 * @lastModified    2026-02-22 21:35:58
 * Copyright © All rights reserved
*/

// 导入 React 核心库，用于创建组件和使用 React Hooks
import React from 'react';
// 导入 PropTypes 库，用于组件 props 的类型检查，提升代码健壮性
import PropTypes from 'prop-types';
// 导入时间格式化工具函数，用于将原始数据格式化为可读的日期时间字符串
import {
  formatSolarDate,    // 格式化西历日期（如：2025年08月10日）
  formatSolarTime,    // 格式化西历时间（如：12:05:17）
  formatLunarDate,    // 格式化农历日期（如：乙巳年闰六月十七）
  formatLunarTime,    // 格式化农历时间（如：午时）
  formatJieqiDate,    // 格式化节气日期（如：2025年08月07日）
  formatJieqiTime     // 格式化节气时间（如：12:00:00）
} from '../../utils/formatTimeUtils';
// 导入组件样式文件，定义组件的视觉样式
import './DivinationInfoDisplay.css';

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
const SeekerInfo = React.memo(({ firstName = '', lastName = '', gender = '', birthYear = '', location = '' }) => {
  const fullName = React.useMemo(() => `${firstName}${lastName}`.trim(), [firstName, lastName]);
  
  // 返回 JSX 元素，渲染求测者信息容器
  // role="list"：ARIA 角色，表示这是一个列表
  // aria-label="求测者信息"：为屏幕阅读器提供描述信息
  return (
    <div className="seeker-info" role="list" aria-label="求测者信息">
      {/* 姓名信息容器 */}
      <div className="name-info-container">
        {/* 姓名标签，显示"姓名：" */}
        <span className="name-label">姓名：</span>
        {/* 姓名信息，显示拼接后的完整姓名 */}
        <span className="name-info">{fullName}</span>
      </div>
      {/* 性别信息容器 */}
      <div className="gender-info-container">
        {/* 性别标签，显示"性别：" */}
        <span className="gender-label">性别：</span>
        {/* 性别信息，显示性别 */}
        <span className="gender-info">{gender}</span>
      </div>
      {/* 出生年份信息容器 */}
      <div className="birth-year-info-container">
        {/* 出生年份标签，显示"生年：" */}
        <span className="birth-year-label">生年：</span>
        {/* 出生年份信息，显示出生年份 */}
        <span className="birth-year-info">{birthYear}</span>
      </div>
      {/* 属地信息容器 */}
      <div className="location-info-container">
        {/* 属地标签，显示"属地：" */}
        <span className="location-label">属地：</span>
        {/* 属地信息，显示属地 */}
        <span className="location-info">{location}</span>
      </div>
    </div>
  );
});

// 为 SeekerInfo 组件添加 PropTypes 类型定义
// 这有助于在开发阶段捕获类型错误，并提供更好的 IDE 智能提示
SeekerInfo.propTypes = {
  firstName: PropTypes.string,    // firstName 必须是字符串类型
  lastName: PropTypes.string,     // lastName 必须是字符串类型
  gender: PropTypes.string,       // gender 必须是字符串类型
  birthYear: PropTypes.string,    // birthYear 必须是字符串类型
  location: PropTypes.string      // location 必须是字符串类型
};

// 为 SeekerInfo 组件添加 displayName，便于在 React DevTools 中调试
SeekerInfo.displayName = 'SeekerInfo';

// 定义 DivinationQuery 子组件：用于展示占卜查询信息（占题和占类）
// 使用 React.memo 包装组件，避免不必要的重渲染
// props 参数说明：
//   - question (string): 占题，默认值为空字符串
//   - divinationType (string): 占类，默认值为空字符串
//   - subType (string): 子类型，默认值为空字符串
const DivinationQuery = React.memo(({ question = '', divinationType = '', subType = '' }) => {
  const displayType = React.useMemo(() => subType ? `${divinationType}·${subType}` : divinationType, [divinationType, subType]);
  
  // 返回 JSX 元素，渲染占卜查询信息容器
  return (
    <div className="divination-query" role="list" aria-label="占卜内容信息">
      {/* 占题信息容器 */}
      <div className="question-info-container">
        {/* 占题标签，显示"占题：" */}
        <span className="question-label">占题：</span>
        {/* 占题信息，显示占题内容 */}
        <span className="question-info">{question}</span>
      </div>
      {/* 占类信息容器 */}
      <div className="divination-type-container">
        {/* 占类标签，显示"占类：" */}
        <span className="divination-type-label">占类：</span>
        {/* 占类信息，显示格式化后的占类（可能包含子类型） */}
        <span className="divination-type-info">{displayType}</span>
      </div>
    </div>
  );
});

// 为 DivinationQuery 组件添加 PropTypes 类型定义
DivinationQuery.propTypes = {
  question: PropTypes.string,        // question 必须是字符串类型
  divinationType: PropTypes.string,  // divinationType 必须是字符串类型
  subType: PropTypes.string         // subType 必须是字符串类型
};

// 为 DivinationQuery 组件添加 displayName，便于在 React DevTools 中调试
DivinationQuery.displayName = 'DivinationQuery';

// 定义 DateTimeInfo 子组件：用于展示日期时间信息（西历和农历）
// 使用 React.memo 包装组件，避免不必要的重渲染
// props 参数说明：
//   - solarInfo (object): 西历信息对象，包含年、月、日、时、分、秒
//   - lunarInfo (object): 农历信息对象，包含干支年、中文月、中文日、时辰
const DateTimeInfo = React.memo(({ solarInfo, lunarInfo }) => {
  const formattedDateTime = React.useMemo(() => formatDateTimeInfo(solarInfo, lunarInfo), [solarInfo, lunarInfo]);
  
  // 返回 JSX 元素，渲染日期时间信息容器
  return (
    <div className="divination-datetime" role="list" aria-label="日期时间信息">
      {/* 西历信息容器 */}
      <div className="solar-info">
        <span className="solar-label">西历：</span>
        <span className="date-info">{formattedDateTime.solarDate}</span>
        <span className="time-info">{formattedDateTime.solarTime}</span>
      </div>
      <div className="lunar-info">
        <span className="lunar-label">农历：</span>
        <span className="date-info">{formattedDateTime.lunarDate}</span>
        <span className="time-info">{formattedDateTime.lunarTime}</span>
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
  })
};

// 为 DateTimeInfo 组件添加 displayName，便于在 React DevTools 中调试
DateTimeInfo.displayName = 'DateTimeInfo';

// 定义 SolarTermsInfo 子组件：用于展示节气信息（上一个节气和下一个节气）
// 使用 React.memo 包装组件，避免不必要的重渲染
// props 参数说明：
//   - prevJie (object): 上一个节气信息对象，包含 name（节气名称）和 time（节气时间）
//   - nextJie (object): 下一个节气信息对象，包含 name（节气名称）和 time（节气时间）
const SolarTermsInfo = React.memo(({ prevJie, nextJie }) => {
  const formattedJieqi = React.useMemo(() => formatJieqiInfo(prevJie, nextJie), [prevJie?.time, nextJie?.time]);
  
  // 返回 JSX 元素，渲染节气信息容器
  return (
    <div className="solar-terms-info" role="list" aria-label="节气信息">
      {/* 上一个节气信息容器 */}
      <div className="prev-jie-info">
        <span className="prev-jie-label">
          {prevJie?.name || ''}：
        </span>
        <span className="date-info">{formattedJieqi.prevJieDate}</span>
        <span className="time-info">{formattedJieqi.prevJieTime}</span>
      </div>
      <div className="next-jie-info">
        <span className="next-jie-label">
          {nextJie?.name || ''}：
        </span>
        <span className="date-info">{formattedJieqi.nextJieDate}</span>
        <span className="time-info">{formattedJieqi.nextJieTime}</span>
      </div>
    </div>
  );
});

// 为 SolarTermsInfo 组件添加 PropTypes 类型定义
// 使用 PropTypes.shape 定义对象类型的详细结构
SolarTermsInfo.propTypes = {
  prevJie: PropTypes.shape({    // prevJie 必须是对象类型，且包含以下属性
    name: PropTypes.string,     // name 属性必须是字符串类型
    time: PropTypes.string       // time 属性必须是字符串类型
  }),
  nextJie: PropTypes.shape({    // nextJie 必须是对象类型，且包含以下属性
    name: PropTypes.string,     // name 属性必须是字符串类型
    time: PropTypes.string       // time 属性必须是字符串类型
  })
};

// 为 SolarTermsInfo 组件添加 displayName，便于在 React DevTools 中调试
SolarTermsInfo.displayName = 'SolarTermsInfo';

// 定义 BriefDivinationQuery 子组件：用于展示简要的占卜信息
// 该组件将求测者信息和占题合并为一行显示，适用于需要紧凑展示的场景
// 使用 React.memo 包装组件，避免不必要的重渲染
// props 参数说明：
//   - formData (object): 表单数据对象，包含求测者信息、占题等，默认值为空对象
const BriefDivinationQuery = React.memo(({ formData = {} }) => {
  // 使用 React.useMemo 缓存简要占题文本的格式化结果
  // 只有当 formData 中的相关字段变化时才重新计算
  // 优化目的：避免每次渲染都重新拼接字符串
  // 依赖项：formData.location, formData.firstName, formData.lastName, formData.gender, formData.birthYear, formData.question
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
    const questionText = question ? `${question}。` : '';
    
    // 拼接所有信息，格式为：属地 姓名 性别 生年生人，占：占题。
    // 使用模板字符串进行拼接，各字段之间用空格分隔
    return `${location} ${firstName}${lastName} ${gender} ${birthYearText}，占：${questionText}`.trim();
  }, [formData.location, formData.firstName, formData.lastName, formData.gender, formData.birthYear, formData.question]);
  
  // 如果没有数据，则不渲染任何内容
  if (!briefText) {
    return null;
  }
  
  // 返回 JSX 元素，渲染简要占卜查询信息
  // role="listitem"：ARIA 角色，表示这是一个列表项
  // aria-label="简要占题"：为屏幕阅读器提供描述信息
  return (
    <div className="divination-info brief" role="listitem" aria-label="简要占题">
      {/* 显示格式化后的简要占题文本 */}
      {briefText}
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
  })
};

// 为 BriefDivinationQuery 组件添加 displayName，便于在 React DevTools 中调试
BriefDivinationQuery.displayName = 'BriefDivinationQuery';

// 导出所有组件，包括主组件和子组件
// 这样其他文件可以按需导入需要的组件
export { BriefDivinationQuery };

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
    location: formData.location
  }), [formData.firstName, formData.lastName, formData.gender, formData.birthYear, formData.location]);
  
  const divinationQueryProps = React.useMemo(() => ({
    question: formData.question,
    divinationType: formData.divinationType,
    subType: formData.subType
  }), [formData.question, formData.divinationType, formData.subType]);
  
  const dateTimeInfoProps = React.useMemo(() => ({
    solarInfo: calendarInfo.solar_info,
    lunarInfo: calendarInfo.lunar_info
  }), [calendarInfo.solar_info, calendarInfo.lunar_info]);
  
  const solarTermsInfoProps = React.useMemo(() => ({
    prevJie: jieqiInfo.prev_jie,
    nextJie: jieqiInfo.next_jie
  }), [jieqiInfo.prev_jie, jieqiInfo.next_jie]);

  if (loading) {
    return (
      <div className="divination-info loading" role="status" aria-label="加载中">
        加载中...
      </div>
    );
  }

  if (error) {
    return (
      <div className="divination-info error" role="alert" aria-label="加载失败">
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
      <div className="divination-info" role="region" aria-label="占卜信息">
        {/* 顶部信息区域：包含求测者信息 */}
        <div className="info-top">
          {/* 渲染 SeekerInfo 子组件，传入缓存的 props */}
          <SeekerInfo {...seekerInfoProps} />
        </div>

        {/* 中间信息区域：包含占卜查询信息 */}
        <div className="info-middle">
          {/* 渲染 DivinationQuery 子组件，传入缓存的 props */}
          <DivinationQuery {...divinationQueryProps} />
        </div>

        {/* 底部信息区域：包含日期时间信息和节气信息 */}
        <div className="info-bottom">
          {/* 渲染 DateTimeInfo 子组件，传入缓存的 props */}
          <DateTimeInfo {...dateTimeInfoProps} />
          {/* 渲染 SolarTermsInfo 子组件，传入缓存的 props */}
          <SolarTermsInfo {...solarTermsInfoProps} />
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
      <div className="divination-info error" role="alert" aria-label="占卜信息加载失败">
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
    subType: PropTypes.string
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
