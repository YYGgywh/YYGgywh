/*
 * @file            frontend/src/utils/storage.js
 * @description     本地存储封装（token、临时排盘记录）
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-27 10:00:00
 * @lastModified    2026-03-01 11:00:00
 * Copyright © All rights reserved
*/

// 前台用户相关键名
const FRONTEND_TOKEN_KEY = 'paipan_token';
const FRONTEND_USER_INFO_KEY = 'paipan_user_info';

// 后台管理员相关键名
const BACKEND_TOKEN_KEY = 'paipan_admin_token';
const BACKEND_USER_INFO_KEY = 'paipan_admin_user_info';

// 临时排盘记录相关键名
const TEMP_PAN_RECORDS_KEY = 'paipan_temp_records';

// 前台Token操作
export const setFrontendToken = (token) => {
  localStorage.setItem(FRONTEND_TOKEN_KEY, token);
};

export const getFrontendToken = () => {
  return localStorage.getItem(FRONTEND_TOKEN_KEY);
};

export const removeFrontendToken = () => {
  localStorage.removeItem(FRONTEND_TOKEN_KEY);
  localStorage.removeItem(FRONTEND_USER_INFO_KEY);
};

// 后台Token操作
export const setBackendToken = (token) => {
  localStorage.setItem(BACKEND_TOKEN_KEY, token);
};

export const getBackendToken = () => {
  return localStorage.getItem(BACKEND_TOKEN_KEY);
};

export const removeBackendToken = () => {
  localStorage.removeItem(BACKEND_TOKEN_KEY);
  localStorage.removeItem(BACKEND_USER_INFO_KEY);
};

// 前台用户信息操作
export const setFrontendUserInfo = (userInfo) => {
  localStorage.setItem(FRONTEND_USER_INFO_KEY, JSON.stringify(userInfo));
};

export const getFrontendUserInfo = () => {
  const userInfo = localStorage.getItem(FRONTEND_USER_INFO_KEY);
  return userInfo ? JSON.parse(userInfo) : null;
};

// 后台用户信息操作
export const setBackendUserInfo = (userInfo) => {
  localStorage.setItem(BACKEND_USER_INFO_KEY, JSON.stringify(userInfo));
};

export const getBackendUserInfo = () => {
  const userInfo = localStorage.getItem(BACKEND_USER_INFO_KEY);
  return userInfo ? JSON.parse(userInfo) : null;
};

// 通用方法（保持向后兼容）
export const setToken = setFrontendToken;
export const getToken = getFrontendToken;
export const removeToken = removeFrontendToken;
export const setUserInfo = setFrontendUserInfo;
export const getUserInfo = getFrontendUserInfo;

// 检查前台登录状态
export const isFrontendLoggedIn = () => {
  return !!getFrontendToken();
};

// 检查后台登录状态
export const isBackendLoggedIn = () => {
  return !!getBackendToken();
};

// 存储临时排盘记录
export const saveTempPanRecord = (record) => {
  const records = getTempPanRecords();
  records.unshift({
    ...record,
    id: Date.now(),
    create_time: Math.floor(Date.now() / 1000)
  });
  // 限制临时记录数量为10条
  if (records.length > 10) {
    records.pop();
  }
  localStorage.setItem(TEMP_PAN_RECORDS_KEY, JSON.stringify(records));
};

// 获取临时排盘记录
export const getTempPanRecords = () => {
  const records = localStorage.getItem(TEMP_PAN_RECORDS_KEY);
  return records ? JSON.parse(records) : [];
};

// 清除临时排盘记录
export const clearTempPanRecords = () => {
  localStorage.removeItem(TEMP_PAN_RECORDS_KEY);
};

// 检查是否已登录
export const isLoggedIn = () => {
  return !!getToken();
};