/*
 * @file            frontend/src/contexts/LiuyaoContext.jsx
 * @description     六爻排盘上下文，用于管理六爻排盘的起卦数据和占卜结果
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-19 00:00:00
 * @lastModified    2026-02-19 14:29:00
 * Copyright © All rights reserved
*/

import React, { createContext, useState, useContext } from 'react';  // 导入 React 核心库和 Hooks

/**
 * @description     创建六爻排盘上下文
 */

const LiuyaoContext = createContext();  // 创建六爻排盘 Context 对象

/**
 * @description     自定义 Hook，方便组件使用 LiuyaoContext
 * @return          {Object}                     LiuyaoContext 上下文对象
 */

// 自定义 Hook，用于在组件中使用 LiuyaoContext
export const useLiuyao = () => {
  const context = useContext(LiuyaoContext);  // 获取六爻排盘 Context 上下文
  
  // 检查 Context 是否存在
  if (!context) {
    throw new Error('useLiuyao must be used within a LiuyaoProvider');  // 抛出错误
  }
  return context;  // 返回 Context 上下文
};

/**
 * @description     Context Provider 组件
 * @param           {JSX}       children          子组件
 * @return          {JSX}                          Provider 组件
 */

// 六爻排盘 Context Provider 组件
export const LiuyaoProvider = ({ children }) => {
  const [threeDigitsArray, setThreeDigitsArray] = useState([]);  // 起卦数据（三位数数组）状态

  // 后端返回数据
  const [calendarResult, setCalendarResult] = useState(null);  // 日历结果状态
  const [divineResult, setDivineResult] = useState(null);  // 占卜结果状态

  // 提供 Context 值给子组件
  return (
    // 六爻排盘 Context Provider 组件
    <LiuyaoContext.Provider
      // Provider 的值对象
      value={{
        threeDigitsArray,  // 三位数数组
        setThreeDigitsArray,  // 设置三位数数组方法
        calendarResult,  // 日历结果
        setCalendarResult,  // 设置日历结果方法
        divineResult,  // 占卜结果
        setDivineResult  // 设置占卜结果方法
      }}
    >
      {children}  {/* 子组件 */}
    </LiuyaoContext.Provider>
  );
};
