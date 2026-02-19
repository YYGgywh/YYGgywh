/*
 * @file            frontend/src/contexts/AppContext.jsx
 * @description     应用全局上下文，用于管理用户信息、时间数据和排盘方式选择等基础共享数据
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-19 00:00:00
 * @lastModified    2026-02-19 14:22:52
 * Copyright © All rights reserved
*/

import React, { createContext, useState, useContext } from 'react'; // 导入 React 核心库和 Hooks

/**
 * @description     创建应用全局上下文
 */

const AppContext = createContext(); // 创建应用全局上下文

/**
 * @description     自定义 Hook，方便组件使用 AppContext
 * @return          {Object}                     AppContext 上下文对象
 */

// 自定义 Hook，用于在组件中使用 AppContext
export const useApp = () => {
  // 使用 useContext 钩子获取 AppContext 上下文
  const context = useContext(AppContext);
  // 如果上下文不存在，抛出错误
  if (!context) {
    throw new Error('useApp must be used within an AppProvider'); // 抛出错误，提示必须在 AppProvider 中使用
  }
  return context; // 返回 AppContext 上下文对象
};

/**
 * @description     Context Provider 组件
 * @param           {JSX}       children          子组件
 * @return          {JSX}                          Provider 组件
 */

// AppProvider 组件，用于提供 AppContext 上下文
export const AppProvider = ({ children }) => {
  // 表单数据（用户信息）
  const [formData, setFormData] = useState({
    firstName: '',      // 名字
    lastName: '',       // 姓氏
    gender: '男',       // 性别
    birthYear: '',      // 出生年份
    location: '',       // 地点
    divinationType: '', // 排盘方式
    subType: '',        // 子类型
    question: ''        // 占卜问题
  });

  const [timestamp, setTimestamp] = useState(null); // 时间数据（起卦时间）
  const [currentDivinationType, setCurrentDivinationType] = useState('liuyao'); // 当前排盘方式

  // 渲染 AppContext.Provider，向子组件提供全局状态与更新函数
  return (
    // 提供 AppContext 上下文，包含表单数据、时间数据、当前排盘方式和相关操作函数
    <AppContext.Provider
      value={{
        formData, // 表单数据及其更新函数
        setFormData, // 更新表单数据的函数
        timestamp, // 时间戳及其更新函数
        setTimestamp, // 更新时间戳的函数
        currentDivinationType, // 当前排盘方式及其更新函数
        setCurrentDivinationType // 更新当前排盘方式的函数
      }}
    >
      {children} {/* 渲染子组件 */}
    </AppContext.Provider>
  );
};
