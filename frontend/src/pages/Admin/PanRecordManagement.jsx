/*
 * @file            frontend/src/pages/Admin/PanRecordManagement.jsx
 * @description     排盘记录管理页面
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-01 10:00:00
 * @lastModified    2026-03-01 10:00:00
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react';
import { getPanRecordList, auditPanRecord, deletePanRecord } from '../../api/adminApi';
import './ManagementPages.css';

export default function PanRecordManagement() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, page_size: 20, total: 0 });
  const [filters, setFilters] = useState({ keyword: '', audit_status: '' });

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        page_size: pagination.page_size,
        keyword: filters.keyword || undefined
      };
      if (filters.audit_status && filters.audit_status !== '') {
        params.audit_status = parseInt(filters.audit_status);
      }
      const response = await getPanRecordList(params);
      if (response.success || response.code === 200) {
        setRecords(response.data.list || []);
        setPagination(prev => ({ ...prev, total: response.data.total || 0 }));
      }
    } catch (error) {
      console.error('获取排盘记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [pagination.page, pagination.page_size, filters]);

  const handleAudit = async (recordId, auditStatus) => {
    try {
      await auditPanRecord(recordId, { audit_status: auditStatus });
      fetchRecords();
    } catch (error) {
      console.error('审核排盘记录失败:', error);
    }
  };

  const handleDelete = async (recordId) => {
    if (!window.confirm('确定要删除该排盘记录吗？')) return;
    try {
      await deletePanRecord(recordId);
      fetchRecords();
    } catch (error) {
      console.error('删除排盘记录失败:', error);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '-';
    return new Date(timestamp * 1000).toLocaleString('zh-CN');
  };

  const getAuditStatusText = (status) => {
    const statuses = { 0: '待审核', 1: '已通过', 2: '已拒绝' };
    return statuses[status] || '未知';
  };

  const getPanTypeText = (type) => {
    const types = { 'liuyao': '六爻排盘' };
    return types[type] || type;
  };

  return (
    <div className="management-page">
      <div className="page-header">
        <h2>排盘记录管理</h2>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="搜索用户ID"
          value={filters.keyword}
          onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
          className="filter-input"
        />
        <select
          value={filters.audit_status}
          onChange={(e) => setFilters({ ...filters, audit_status: e.target.value })}
          className="filter-select"
        >
          <option value="">全部状态</option>
          <option value="0">待审核</option>
          <option value="1">已通过</option>
          <option value="2">已拒绝</option>
        </select>
        <button onClick={fetchRecords} className="filter-btn">搜索</button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>用户ID</th>
              <th>排盘类型</th>
              <th>审核状态</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="loading-cell">加载中...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan="6" className="empty-cell">暂无数据</td></tr>
            ) : (
              records.map((record) => (
                <tr key={record.id}>
                  <td>{record.id}</td>
                  <td>{record.user_id}</td>
                  <td>{getPanTypeText(record.pan_type)}</td>
                  <td>
                    <span className={`audit-badge status-${record.audit_status}`}>
                      {getAuditStatusText(record.audit_status)}
                    </span>
                  </td>
                  <td>{formatTime(record.create_time)}</td>
                  <td>
                    <button className="small-btn">查看</button>
                    {record.audit_status === 0 && (
                      <>
                        <button onClick={() => handleAudit(record.id, 1)} className="small-btn success">通过</button>
                        <button onClick={() => handleAudit(record.id, 2)} className="small-btn danger">拒绝</button>
                      </>
                    )}
                    <button onClick={() => handleDelete(record.id)} className="small-btn danger">删除</button>
                  </td>
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
