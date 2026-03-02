/*
 * @file            frontend/src/utils/validate.js
 * @description     表单校验（手机号、邮箱、验证码、密码、登录名）
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-02-27 10:00:00
 * @lastModified    2026-02-28 18:00:00
 * Copyright © All rights reserved
*/

// 验证手机号
export const validatePhone = (phone) => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// 验证邮箱
export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// 验证登录名
export const validateLoginName = (loginName) => {
  // 登录名长度4-20字符，允许字母、数字和下划线
  const loginNameRegex = /^[a-zA-Z0-9_]{4,20}$/;
  return loginNameRegex.test(loginName);
};

// 验证验证码
export const validateCode = (code) => {
  const codeRegex = /^\d{6}$/;
  return codeRegex.test(code);
};

// 验证密码
export const validatePassword = (password) => {
  // 密码至少6位，允许字母、数字和下划线的任意组合
  const passwordRegex = /^[a-zA-Z0-9_]{6,}$/;
  return passwordRegex.test(password);
};

// 验证表单数据
export const validateForm = (formData, type, registerMethod = 'phone') => {
  const errors = {};

  if (type === 'login' || type === 'register') {
    // 根据注册/登录方式验证手机号或邮箱
    if (type === 'register' && registerMethod === 'email') {
      if (!formData.email) {
        errors.email = '请输入邮箱';
      } else if (!validateEmail(formData.email)) {
        errors.email = '请输入正确的邮箱';
      }
    } else {
      if (!formData.phone) {
        errors.phone = '请输入手机号';
      } else if (!validatePhone(formData.phone)) {
        errors.phone = '请输入正确的手机号';
      }
    }

    // 验证验证码或密码
    if (formData.code) {
      if (!validateCode(formData.code)) {
        errors.code = '请输入6位数字验证码';
      }
    } else if (formData.password) {
      if (!validatePassword(formData.password)) {
        errors.password = '密码至少6位，允许字母、数字和下划线';
      }
    }

    // 验证登录名（如果有输入）
    if (formData.loginName) {
      if (!validateLoginName(formData.loginName)) {
        errors.loginName = '登录名长度4-20字符，允许字母、数字和下划线';
      }
    }
  }

  if (type === 'register') {
    // 注册时必须验证密码
    if (!formData.password) {
      errors.password = '请设置密码';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
