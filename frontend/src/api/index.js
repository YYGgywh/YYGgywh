/*
 * @file            frontend/src/api/index.js
 * @description     API请求拦截器、响应拦截器配置
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-27 10:00:00
 * @lastModified    2026-03-01 11:00:00
 * Copyright © All rights reserved
*/

import axios from 'axios';
import { getFrontendToken, getBackendToken, removeFrontendToken, removeBackendToken } from '../utils/storage';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 根据请求路径选择使用的Token
    if (config.url && (config.url.startsWith('/admin') || config.url.startsWith('/sensitive_word'))) {
      // 后台管理接口，使用后台Token
      const token = getBackendToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      // 前台接口，使用前台Token
      const token = getFrontendToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    const res = response.data;
    // 检查状态码
    if (res.code !== 200) {
      // 处理错误
      console.error('API Error:', res.msg);
      return Promise.reject(new Error(res.msg || '请求失败'));
    }
    return res;
  },
  error => {
    // 处理网络错误
    if (error.response) {
      // 服务器返回错误
      const status = error.response.status;
      const requestUrl = error.config.url;
      
      // 登录接口返回401是正常的登录失败，不需要跳转
      const isLoginRequest = requestUrl.includes('/login') || requestUrl.includes('/user/login');
      
      if (status === 401 && !isLoginRequest) {
        // 根据请求路径判断是前台还是后台Token失效
        if (requestUrl.startsWith('/admin')) {
          // 后台管理接口，清除后台Token
          removeBackendToken();
          // 如果当前页面是后台页面，跳转到后台登录页
          if (window.location.pathname.startsWith('/admin')) {
            window.location.href = '/admin/login';
          }
        } else {
          // 前台接口，清除前台Token
          removeFrontendToken();
          // 如果当前页面不是后台页面，跳转到前台登录页
          if (!window.location.pathname.startsWith('/admin')) {
            window.location.href = '/login';
          }
        }
      }
      // 详细显示错误信息
      console.error('Server Error:', error.response.data);
      if (error.response.data.detail) {
        console.error('Error Detail:', JSON.stringify(error.response.data.detail, null, 2));
      }
    } else if (error.request) {
      // 请求发送失败
      console.error('Network Error:', error.request);
    } else {
      // 其他错误
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;