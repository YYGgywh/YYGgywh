/*
 * @file            frontend/src/pages/Admin/PanRecordManagement.jsx
 * @description     排盘记录管理页面
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-01 10:00:00
 * @lastModified    2026-03-14 12:00:00
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react';
import { getPanRecordList, getPanRecordDetail, auditPanRecord, deletePanRecord, batchDeletePanRecords, batchAuditPanRecords, exportPanRecords, getDeletedPanRecordList, restorePanRecord, permanentDeletePanRecord, batchPermanentDeletePanRecords } from '../../api/adminApi';
import { panTypeToChinese } from '../../utils/methodMapping';
import PanRecordDetail from '../../components/PanRecordDetail/PanRecordDetail';
import './ManagementPages.css';

// 辅助函数
const getPanTypeText = (panType) => {
  return panTypeToChinese(panType);
};

const getAuditStatusText = (status) => {
  const statusMap = {
    0: '待审核',
    1: '已通过',
    2: '已拒绝'
  };
  return statusMap[status] || '未知';
};

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp * 1000).toLocaleString();
};

export default function PanRecordManagement() {
  const [activeTab, setActiveTab] = useState('active');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, page_size: 20, total: 0 });
  const [filters, setFilters] = useState({ keyword: '', audit_status: '' });
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailData, setDetailData] = useState(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      let response;
      const params = {
        page: pagination.page,
        page_size: pagination.page_size,
        keyword: filters.keyword || undefined
      };
      
      if (activeTab === 'active') {
        if (filters.audit_status && filters.audit_status !== '') {
          params.audit_status = parseInt(filters.audit_status);
        }
        response = await getPanRecordList(params);
      } else {
        response = await getDeletedPanRecordList(params);
      }
      
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
  }, [pagination.page, pagination.page_size, filters, activeTab]);

  const handleAudit = async (recordId, auditStatus) => {
    const statusText = auditStatus === 1 ? '通过' : '拒绝';
    if (!window.confirm(`确定要${statusText}这条排盘记录吗？`)) {
      return;
    }
    try {
      await auditPanRecord(recordId, { audit_status: auditStatus });
      fetchRecords();
      alert(`${statusText}成功`);
    } catch (error) {
      console.error('审核排盘记录失败:', error);
      alert(`${statusText}失败，请重试`);
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
    return panTypeToChinese(type || 'liuyao');
  };

  // 处理单个记录选择
  const handleSelectRecord = (recordId) => {
    setSelectedRecords(prev => {
      if (prev.includes(recordId)) {
        return prev.filter(id => id !== recordId);
      } else {
        return [...prev, recordId];
      }
    });
  };

  // 处理全选/取消全选
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(records.map(record => record.id));
    }
    setSelectAll(!selectAll);
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRecords.length === 0) {
      alert('请先选择要删除的记录');
      return;
    }
    if (!window.confirm(`确定要删除选中的 ${selectedRecords.length} 条记录吗？`)) {
      return;
    }
    try {
      await batchDeletePanRecords(selectedRecords);
      setSelectedRecords([]);
      setSelectAll(false);
      fetchRecords();
      alert('批量删除成功');
    } catch (error) {
      console.error('批量删除失败:', error);
      alert('批量删除失败，请重试');
    }
  };

  // 批量审核
  const handleBatchAudit = async (auditStatus) => {
    if (selectedRecords.length === 0) {
      alert('请先选择要审核的记录');
      return;
    }
    const statusText = auditStatus === 1 ? '通过' : '拒绝';
    if (!window.confirm(`确定要${statusText}选中的 ${selectedRecords.length} 条记录吗？`)) {
      return;
    }
    try {
      await batchAuditPanRecords(selectedRecords, auditStatus);
      setSelectedRecords([]);
      setSelectAll(false);
      fetchRecords();
      alert(`批量审核${statusText}成功`);
    } catch (error) {
      console.error('批量审核失败:', error);
      alert('批量审核失败，请重试');
    }
  };

  // 导出排盘记录
  const handleExport = async (format, recordIds = null) => {
    try {
      const exportFilters = {
        keyword: filters.keyword || undefined,
        audit_status: filters.audit_status ? parseInt(filters.audit_status) : undefined
      };
      
      const response = await exportPanRecords(format, exportFilters, recordIds);
      
      // 创建下载链接
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // 获取文件名
      const contentDisposition = response.headers['content-disposition'];
      let filename = format === 'excel' ? `排盘记录_${new Date().toISOString().slice(0,19).replace(/[-:]/g,'')}.xlsx` : `排盘记录_${new Date().toISOString().slice(0,19).replace(/[-:]/g,'')}.csv`;
      
      if (contentDisposition) {
        const matches = /filename=(.+)/.exec(contentDisposition);
        if (matches && matches[1]) {
          filename = matches[1].replace(/"/g, '');
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert(`导出${format === 'excel' ? 'Excel' : 'CSV'}文件成功`);
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请重试');
    }
  };

  // 导出选中的记录
  const handleExportSelected = async (format) => {
    if (selectedRecords.length === 0) {
      alert('请先选择要导出的记录');
      return;
    }
    await handleExport(format, selectedRecords);
  };

  // 恢复已删除记录
  const handleRestore = async (recordId) => {
    if (!window.confirm('确定要恢复这条记录吗？')) {
      return;
    }
    try {
      await restorePanRecord(recordId);
      fetchRecords();
      alert('恢复成功');
    } catch (error) {
      console.error('恢复失败:', error);
      alert('恢复失败，请重试');
    }
  };

  // 永久删除记录
  const handlePermanentDelete = async (recordId) => {
    if (!window.confirm('确定要永久删除这条记录吗？此操作不可恢复！')) {
      return;
    }
    try {
      await permanentDeletePanRecord(recordId);
      fetchRecords();
      alert('永久删除成功');
    } catch (error) {
      console.error('永久删除失败:', error);
      alert('永久删除失败，请重试');
    }
  };

  // 查看排盘记录详情
  const handleViewDetail = async (recordId) => {
    try {
      const response = await getPanRecordDetail(recordId);
      if (response.success || response.code === 200) {
        setDetailData(response.data);
        setShowDetailModal(true);
      }
    } catch (error) {
      console.error('获取排盘记录详情失败:', error);
      alert('获取排盘记录详情失败，请重试');
    }
  };

  // 批量永久删除
  const handleBatchPermanentDelete = async () => {
    if (selectedRecords.length === 0) {
      alert('请先选择要永久删除的记录');
      return;
    }
    if (!window.confirm(`确定要永久删除选中的 ${selectedRecords.length} 条记录吗？此操作不可恢复！`)) {
      return;
    }
    try {
      await batchPermanentDeletePanRecords(selectedRecords);
      setSelectedRecords([]);
      setSelectAll(false);
      fetchRecords();
      alert('批量永久删除成功');
    } catch (error) {
      console.error('批量永久删除失败:', error);
      alert('批量永久删除失败，请重试');
    }
  };

  return (
    <div className="management-page">
      <div className="page-header">
        <h2>排盘记录管理</h2>
      </div>

      {/* 标签页导航 */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          正常记录
        </button>
        <button
          className={`tab-btn ${activeTab === 'deleted' ? 'active' : ''}`}
          onClick={() => setActiveTab('deleted')}
        >
          已删除记录
        </button>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="搜索用户ID"
          value={filters.keyword}
          onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
          className="filter-input"
        />
        {activeTab === 'active' && (
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
        )}
        <button onClick={fetchRecords} className="filter-btn">搜索</button>
        {activeTab === 'active' && (
          <>
            <button onClick={() => handleExport('excel')} className="filter-btn success">导出Excel</button>
            <button onClick={() => handleExport('csv')} className="filter-btn warning">导出CSV</button>
          </>
        )}
      </div>

      {/* 批量操作栏 */}
      {selectedRecords.length > 0 && (
        <div className="batch-actions-bar">
          <span className="batch-info">已选择 {selectedRecords.length} 条记录</span>
          {activeTab === 'active' ? (
            <>
              <button onClick={() => handleBatchAudit(1)} className="batch-btn success">批量通过</button>
              <button onClick={() => handleBatchAudit(2)} className="batch-btn warning">批量拒绝</button>
              <button onClick={handleBatchDelete} className="batch-btn danger">批量删除</button>
              <div className="batch-export-buttons">
                <button onClick={() => handleExportSelected('excel')} className="batch-btn success">导出选中Excel</button>
                <button onClick={() => handleExportSelected('csv')} className="batch-btn warning">导出选中CSV</button>
              </div>
            </>
          ) : (
            <>
              <button onClick={handleBatchPermanentDelete} className="batch-btn danger">批量永久删除</button>
            </>
          )}
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  title="全选/取消全选"
                />
              </th>
              <th>ID</th>
              <th>用户ID</th>
              <th>排盘类型</th>
              <th>审核状态</th>
              <th>创建时间</th>
              {activeTab === 'deleted' && <th>删除时间</th>}
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={activeTab === 'deleted' ? 8 : 7} className="loading-cell">加载中...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan={activeTab === 'deleted' ? 8 : 7} className="empty-cell">暂无数据</td></tr>
            ) : (
              records.map((record) => (
                <tr key={record.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRecords.includes(record.id)}
                      onChange={() => handleSelectRecord(record.id)}
                    />
                  </td>
                  <td>{record.id}</td>
                  <td>{record.user_id}</td>
                  <td>{getPanTypeText(record.pan_type)}</td>
                  <td>
                    <span className={`audit-badge status-${record.audit_status}`}>
                      {getAuditStatusText(record.audit_status)}
                    </span>
                  </td>
                  <td>{formatTime(record.create_time)}</td>
                  {activeTab === 'deleted' && (
                    <td>{formatTime(record.deleted_at)}</td>
                  )}
                  <td>
                    {activeTab === 'active' ? (
                      <>
                        <button onClick={() => handleViewDetail(record.id)} className="small-btn">查看</button>
                        {record.audit_status === 0 && (
                          <>
                            <button onClick={() => handleAudit(record.id, 1)} className="small-btn success">通过</button>
                            <button onClick={() => handleAudit(record.id, 2)} className="small-btn danger">拒绝</button>
                          </>
                        )}
                        <button onClick={() => handleDelete(record.id)} className="small-btn danger">删除</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleRestore(record.id)} className="small-btn success">恢复</button>
                        <button onClick={() => handlePermanentDelete(record.id)} className="small-btn danger">永久删除</button>
                      </>
                    )}
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

      {/* 排盘记录详情模态框 */}
      {showDetailModal && detailData && (
        <PanRecordDetail 
          record={detailData}
          onClose={() => setShowDetailModal(false)}
          onUpdate={() => fetchRecords()}
          onDelete={() => {
            setShowDetailModal(false);
            fetchRecords();
          }}
          deleteFunc={deletePanRecord}
        />
      )}
    </div>
  );
}
