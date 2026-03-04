/*
 * @file            frontend/src/api/userApi.js
 * @description     用户相关接口（注册、登录、验证码）
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-27 10:00:00
 * @lastModified    2026-03-02 11:55:36
 * Copyright © All rights reserved
*/

import api from './index';

// 发送手机验证码
export const sendCode = async (phone) => {
  try {
    const response = await api.post('/user/send_code', { phone });
    return response;
  } catch (error) {
    throw error;
  }
};

// 发送邮箱验证码
export const sendEmailCode = async (email) => {
  try {
    const response = await api.post('/user/send_email_code', { email });
    return response;
  } catch (error) {
    throw error;
  }
};

// 用户注册（手机）
export const register = async (phone, code, password, loginName) => {
  try {
    const data = { phone, code, password };
    if (loginName && loginName.trim()) {
      data.login_name = loginName;
    }
    const response = await api.post('/user/register', data);
    return response;
  } catch (error) {
    throw error;
  }
};

// 用户注册（邮箱）
export const registerByEmail = async (email, code, password, loginName) => {
  try {
    // 注意：后端需要添加邮箱注册接口，这里先保留接口结构
    const data = { email, code, password };
    if (loginName && loginName.trim()) {
      data.login_name = loginName;
    }
    const response = await api.post('/user/register', data);
    return response;
  } catch (error) {
    throw error;
  }
};

// 用户登录
export const login = async (phone, loginName, code, password) => {
  try {
    const params = {};
    if (phone) params.phone = phone;
    if (loginName) params.login_name = loginName;
    if (code) params.code = code;
    if (password) params.password = password;
    
    const response = await api.post('/user/login', params);
    return response;
  } catch (error) {
    throw error;
  }
};

// 更新用户信息
export const updateUserInfo = async (userInfo) => {
  try {
    const response = await api.post('/user/update_user_info', userInfo);
    return response;
  } catch (error) {
    throw error;
  }
};

// 获取昵称修改限制信息
export const getNicknameLimitInfo = async () => {
  try {
    const response = await api.get('/user/get_nickname_limit_info');
    return response;
  } catch (error) {
    throw error;
  }
};

// 获取登录名修改限制信息
export const getLoginNameLimitInfo = async () => {
  try {
    const response = await api.get('/user/get_login_name_limit_info');
    return response;
  } catch (error) {
    throw error;
  }
};

// 获取姓名修改限制信息
export const getNameLimitInfo = async () => {
  try {
    const response = await api.get('/user/get_name_limit_info');
    return response;
  } catch (error) {
    throw error;
  }
};

// 获取性别修改限制信息
export const getGenderLimitInfo = async () => {
  try {
    const response = await api.get('/user/get_gender_limit_info');
    return response;
  } catch (error) {
    throw error;
  }
};

// 获取生时修改限制信息
export const getBirthTimeLimitInfo = async () => {
  try {
    const response = await api.get('/user/get_birth_time_limit_info');
    return response;
  } catch (error) {
    throw error;
  }
};

// 修改登录名
export const updateLoginName = async (newLoginName) => {
  try {
    const response = await api.post('/user/update_login_name', {
      new_login_name: newLoginName
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// 上传头像
export const uploadAvatar = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/user/upload_avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response;
  } catch (error) {
    throw error;
  }
};