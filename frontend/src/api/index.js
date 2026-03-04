/*
 * @file            frontend/src/api/index.js
 * @description     API请求拦截器、响应拦截器配置
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-27 10:00:00
 * @lastModified    2026-03-02 19:00:00
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

// 错误提示函数
const showError = (message) => {
  // 这里可以集成通知组件，如antd的message
  if (window && window.alert) {
    window.alert(message);
  }
  console.error('API Error:', message);
};

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 添加请求时间戳，防止缓存
    config.params = {
      ...config.params,
      _t: Date.now()
    };
    
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
    
    // 显示加载状态（可根据需要集成loading组件）
    // 这里可以添加全局loading状态管理
    
    return config;
  },
  error => {
    // 隐藏加载状态
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    // 隐藏加载状态
    
    // 处理blob响应（用于文件下载）
    if (response.config.responseType === 'blob') {
      return response;
    }
    
    const res = response.data;
    // 检查状态码
    if (res.code !== 200) {
      // 处理业务错误
      const errorMessage = res.msg || '请求失败';
      showError(errorMessage);
      return Promise.reject(new Error(errorMessage));
    }
    return res;
  },
  error => {
    // 隐藏加载状态
    
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
        showError('登录已过期，请重新登录');
      } else if (status === 403) {
        showError('没有权限访问该资源');
      } else if (status === 404) {
        showError('请求的资源不存在');
      } else if (status === 500) {
        showError('服务器内部错误，请稍后重试');
      } else {
        // 其他错误
        const errorData = error.response.data;
        const errorMessage = errorData.msg || errorData.detail || `请求失败 (${status})`;
        showError(errorMessage);
      }
      
      // 详细显示错误信息
      console.error('Server Error:', error.response.data);
      if (error.response.data.detail) {
        console.error('Error Detail:', JSON.stringify(error.response.data.detail, null, 2));
      }
    } else if (error.request) {
      // 请求发送失败
      showError('网络连接失败，请检查网络设置');
      console.error('Network Error:', error.request);
    } else {
      // 其他错误
      showError(error.message || '请求失败');
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;