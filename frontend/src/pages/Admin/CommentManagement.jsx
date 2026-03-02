/*
 * @file            frontend/src/pages/Admin/CommentManagement.jsx
 * @description     评论管理页面
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-01 10:00:00
 * @lastModified    2026-03-01 10:00:00
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react';
import { getCommentList, auditComment, deleteComment } from '../../api/adminApi';
import './ManagementPages.css';

export default function CommentManagement() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, page_size: 20, total: 0 });
  const [filters, setFilters] = useState({ keyword: '', audit_status: '' });

  const fetchComments = async () => {
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
      const response = await getCommentList(params);
      if (response.success || response.code === 200) {
        setComments(response.data.list || []);
        setPagination(prev => ({ ...prev, total: response.data.total || 0 }));
      }
    } catch (error) {
      console.error('获取评论列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [pagination.page, pagination.page_size, filters]);

  const handleAudit = async (commentId, auditStatus) => {
    try {
      await auditComment(commentId, { audit_status: auditStatus });
      fetchComments();
    } catch (error) {
      console.error('审核评论失败:', error);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('确定要删除该评论吗？')) return;
    try {
      await deleteComment(commentId);
      fetchComments();
    } catch (error) {
      console.error('删除评论失败:', error);
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

  return (
    <div className="management-page">
      <div className="page-header">
        <h2>评论管理</h2>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="搜索内容"
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
        <button onClick={fetchComments} className="filter-btn">搜索</button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>用户ID</th>
              <th>排盘ID</th>
              <th>内容</th>
              <th>审核状态</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="loading-cell">加载中...</td></tr>
            ) : comments.length === 0 ? (
              <tr><td colSpan="7" className="empty-cell">暂无数据</td></tr>
            ) : (
              comments.map((comment) => (
                <tr key={comment.id}>
                  <td>{comment.id}</td>
                  <td>{comment.user_id}</td>
                  <td>{comment.pan_record_id}</td>
                  <td className="content-cell">{comment.content}</td>
                  <td>
                    <span className={`audit-badge status-${comment.audit_status}`}>
                      {getAuditStatusText(comment.audit_status)}
                    </span>
                  </td>
                  <td>{formatTime(comment.create_time)}</td>
                  <td>
                    <button className="small-btn">查看</button>
                    {comment.audit_status === 0 && (
                      <>
                        <button onClick={() => handleAudit(comment.id, 1)} className="small-btn success">通过</button>
                        <button onClick={() => handleAudit(comment.id, 2)} className="small-btn danger">拒绝</button>
                      </>
                    )}
                    <button onClick={() => handleDelete(comment.id)} className="small-btn danger">删除</button>
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
