/*
 * @file            frontend/src/api/adminApi.js
 * @description     后台管理相关接口
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-01 10:00:00
 * @lastModified    2026-03-01 10:00:00
 * Copyright © All rights reserved
*/

import api from './index';

// 管理员登录
export const adminLogin = async (username, password) => {
  try {
    const response = await api.post('/admin/login', { username, password });
    return response;
  } catch (error) {
    throw error;
  }
};

// 管理员登出
export const adminLogout = async () => {
  try {
    const response = await api.post('/admin/logout');
    return response;
  } catch (error) {
    throw error;
  }
};

// 获取用户列表
export const getUserList = async (params) => {
  try {
    const response = await api.get('/admin/users', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

// 获取用户详情
export const getUserDetail = async (userId) => {
  try {
    const response = await api.get(`/admin/users/${userId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// 更新用户信息
export const updateUser = async (userId, data) => {
  try {
    const response = await api.put(`/admin/users/${userId}`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

// 删除用户
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// 获取排盘记录列表
export const getPanRecordList = async (params) => {
  try {
    const response = await api.get('/admin/pan-records', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

// 获取排盘记录详情
export const getPanRecordDetail = async (recordId) => {
  try {
    const response = await api.get(`/admin/pan-records/${recordId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// 审核排盘记录
export const auditPanRecord = async (recordId, data) => {
  try {
    const response = await api.put(`/admin/pan-records/${recordId}/audit`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

// 删除排盘记录
export const deletePanRecord = async (recordId) => {
  try {
    const response = await api.delete(`/admin/pan-records/${recordId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// 批量删除排盘记录
export const batchDeletePanRecords = async (recordIds) => {
  try {
    const response = await api.post('/admin/pan-records/batch-delete', {
      record_ids: recordIds
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// 批量审核排盘记录
export const batchAuditPanRecords = async (recordIds, auditStatus, auditRemark = '') => {
  try {
    const response = await api.post('/admin/pan-records/batch-audit', {
      record_ids: recordIds,
      audit_status: auditStatus,
      audit_remark: auditRemark
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// 导出排盘记录
export const exportPanRecords = async (format, filters = {}, recordIds = null) => {
  try {
    const response = await api.post('/admin/pan-records/export', {
      format,
      filters,
      record_ids: recordIds
    }, {
      responseType: 'blob' // 重要：设置响应类型为blob
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// 获取已删除排盘记录列表
export const getDeletedPanRecordList = async (params) => {
  try {
    const response = await api.get('/admin/pan-records/deleted', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

// 恢复已删除排盘记录
export const restorePanRecord = async (recordId) => {
  try {
    const response = await api.put(`/admin/pan-records/${recordId}/restore`);
    return response;
  } catch (error) {
    throw error;
  }
};

// 永久删除排盘记录
export const permanentDeletePanRecord = async (recordId) => {
  try {
    const response = await api.delete(`/admin/pan-records/${recordId}/permanent`);
    return response;
  } catch (error) {
    throw error;
  }
};

// 批量永久删除排盘记录
export const batchPermanentDeletePanRecords = async (recordIds) => {
  try {
    const response = await api.post('/admin/pan-records/batch-permanent-delete', {
      record_ids: recordIds
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// 获取评论列表
export const getCommentList = async (params) => {
  try {
    const response = await api.get('/admin/comments', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

// 审核评论
export const auditComment = async (commentId, data) => {
  try {
    const response = await api.put(`/admin/comments/${commentId}/audit`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

// 删除评论
export const deleteComment = async (commentId) => {
  try {
    const response = await api.delete(`/admin/comments/${commentId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// 获取系统日志列表
export const getSystemLogList = async (params) => {
  try {
    const response = await api.get('/admin/system-logs', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

// 获取系统配置列表
export const getSystemConfigList = async () => {
  try {
    const response = await api.get('/admin/system-configs');
    return response;
  } catch (error) {
    throw error;
  }
};

// 更新系统配置
export const updateSystemConfig = async (configKey, value) => {
  try {
    const response = await api.put(`/admin/system-configs/${configKey}`, { value });
    return response;
  } catch (error) {
    throw error;
  }
};

// 获取统计数据
export const getStatistics = async () => {
  try {
    const response = await api.get('/admin/statistics');
    return response;
  } catch (error) {
    throw error;
  }
};

// 获取已删除用户列表
export const getDeletedUserList = async (params) => {
  try {
    const response = await api.get('/admin/users/deleted', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

// 恢复用户
export const restoreUser = async (userId) => {
  try {
    const response = await api.put(`/admin/users/${userId}/restore`);
    return response;
  } catch (error) {
    throw error;
  }
};

// 永久删除用户
export const permanentDeleteUser = async (userId) => {
  try {
    const response = await api.delete(`/admin/users/${userId}/permanent`);
    return response;
  } catch (error) {
    throw error;
  }
};

// 修改用户前台密码
export const updateUserPassword = async (userId, newPassword) => {
  try {
    const response = await api.put(`/admin/users/${userId}/password`, { new_password: newPassword });
    return response;
  } catch (error) {
    throw error;
  }
};

// 修改用户后台密码
export const updateAdminPassword = async (userId, newPassword) => {
  try {
    const response = await api.put(`/admin/users/${userId}/admin-password`, { new_password: newPassword });
    return response;
  } catch (error) {
    throw error;
  }
};
