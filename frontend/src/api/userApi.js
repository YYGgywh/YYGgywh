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
export const login = async (phone, loginName, code, password, email) => {
  try {
    const params = {};
    if (phone) params.phone = phone;
    if (loginName) params.login_name = loginName;
    if (email) params.email = email;
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

// 获取虚拟性别修改限制信息
export const getVirtualGenderLimitInfo = async () => {
  try {
    const response = await api.get('/user/get_virtual_gender_limit_info');
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
    
    const response = await api.post('/user/upload_avatar', formData);
    return response;
  } catch (error) {
    throw error;
  }
};

// 关注用户
export const followUser = async (userId) => {
  try {
    const response = await api.post('/user/follow', { user_id: userId });
    return response;
  } catch (error) {
    throw error;
  }
};

// 取消关注用户
export const unfollowUser = async (userId) => {
  try {
    const response = await api.post('/user/unfollow', { user_id: userId });
    return response;
  } catch (error) {
    throw error;
  }
};

// 检查关注状态
export const checkFollowStatus = async (userId) => {
  try {
    const response = await api.post('/user/check_follow', { user_id: userId });
    return response;
  } catch (error) {
    throw error;
  }
};

// 获取关注列表
export const getFollowingList = async (skip = 0, limit = 20) => {
  try {
    const response = await api.get('/user/following', {
      params: { skip, limit }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// 获取粉丝列表
export const getFollowersList = async (skip = 0, limit = 20) => {
  try {
    const response = await api.get('/user/followers', {
      params: { skip, limit }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// 获取用户统计数据
export const getUserStats = async () => {
  try {
    const response = await api.get('/user/stats');
    return response;
  } catch (error) {
    throw error;
  }
};