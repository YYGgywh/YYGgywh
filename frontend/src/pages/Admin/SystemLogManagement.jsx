/*
 * @file            frontend/src/pages/Admin/SystemLogManagement.jsx
 * @description     系统日志页面
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-01 10:00:00
 * @lastModified    2026-03-01 10:00:00
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react';
import { getSystemLogList } from '../../api/adminApi';
import './ManagementPages.css';

export default function SystemLogManagement() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, page_size: 20, total: 0 });
  const [filters, setFilters] = useState({ module: '', action: '', user_id: '' });

  const exportLogs = () => {
    const params = new URLSearchParams();
    if (filters.module) {
      params.append('module', filters.module);
    }
    if (filters.action) {
      params.append('action', filters.action);
    }
    if (filters.user_id) {
      params.append('user_id', filters.user_id);
    }
    
    const url = `/api/v1/admin/system-logs/export?${params.toString()}`;
    window.open(url, '_blank');
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        page_size: pagination.page_size
      };
      if (filters.module) {
        params.module = filters.module;
      }
      if (filters.action) {
        params.action = filters.action;
      }
      if (filters.user_id) {
        params.user_id = parseInt(filters.user_id);
      }
      const response = await getSystemLogList(params);
      if (response.success || response.code === 200) {
        setLogs(response.data.list || []);
        setPagination(prev => ({ ...prev, total: response.data.total || 0 }));
      }
    } catch (error) {
      console.error('获取系统日志失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [pagination.page, pagination.page_size, filters]);

  const formatTime = (timestamp) => {
    if (!timestamp) return '-';
    return new Date(timestamp * 1000).toLocaleString('zh-CN');
  };

  const getModuleText = (module) => {
    const modules = { 'user': '用户模块', 'pan': '排盘模块', 'comment': '评论模块', 'system': '系统模块' };
    return modules[module] || module;
  };

  const getActionText = (action) => {
    const actions = { 'login': '登录', 'view': '查看', 'create': '创建', 'update': '更新', 'delete': '删除' };
    return actions[action] || action;
  };

  return (
    <div className="management-page">
      <div className="page-header">
        <h2>系统日志</h2>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="搜索用户ID"
          value={filters.user_id}
          onChange={(e) => setFilters({ ...filters, user_id: e.target.value })}
          className="filter-input"
        />
        <select
          value={filters.module}
          onChange={(e) => setFilters({ ...filters, module: e.target.value })}
          className="filter-select"
        >
          <option value="">全部模块</option>
          <option value="user">用户模块</option>
          <option value="pan">排盘模块</option>
          <option value="comment">评论模块</option>
          <option value="system">系统模块</option>
        </select>
        <select
          value={filters.action}
          onChange={(e) => setFilters({ ...filters, action: e.target.value })}
          className="filter-select"
        >
          <option value="">全部操作</option>
          <option value="login">登录</option>
          <option value="view">查看</option>
          <option value="create">创建</option>
          <option value="update">更新</option>
          <option value="delete">删除</option>
        </select>
        <button onClick={fetchLogs} className="filter-btn">搜索</button>
        <button onClick={exportLogs} className="export-btn">导出</button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>用户ID</th>
              <th>操作</th>
              <th>模块</th>
              <th>IP地址</th>
              <th>时间</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="loading-cell">加载中...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan="6" className="empty-cell">暂无数据</td></tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>{log.user_id}</td>
                  <td>{getActionText(log.action)}</td>
                  <td>{getModuleText(log.module)}</td>
                  <td>{log.ip || '-'}</td>
                  <td>{formatTime(log.create_time)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          disabled={pagination.page <= 1}
          onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
        >
          上一页
        </button>
        <span>第 {pagination.page} 页 / 共 {Math.ceil(pagination.total / pagination.page_size)} 页</span>
        <button
          disabled={pagination.page >= Math.ceil(pagination.total / pagination.page_size)}
          onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
        >
          下一页
        </button>
      </div>
    </div>
  );
}
