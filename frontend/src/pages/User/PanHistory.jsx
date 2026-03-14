/*
 * @file            frontend/src/pages/User/PanHistory.jsx
 * @description     用户排盘历史页面
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-02 18:30:00
 * @lastModified    2026-03-14 12:00:00
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react';
import { listPan } from '../../api/panApi';
import PanRecordDetail from '../../components/PanRecordDetail/PanRecordDetail';
import { panTypeToChinese } from '../../utils/methodMapping';

const PanHistory = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [filterParams, setFilterParams] = useState({
    panType: 'liuyao',
    startTime: null,
    endTime: null
  });

  // 加载排盘记录
  const loadRecords = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await listPan(
        filterParams.panType,
        currentPage,
        pageSize,
        filterParams.startTime,
        filterParams.endTime
      );

      if (response.code === 200) {
        setRecords(response.data || []);
        // 假设后端返回总记录数
        // setTotal(response.total || 0);
      } else {
        setError('加载失败，请重试');
      }
    } catch (err) {
      setError('网络错误，请检查网络连接');
      console.error('加载排盘记录失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载和参数变化时重新加载
  useEffect(() => {
    loadRecords();
  }, [currentPage, pageSize, filterParams]);

  // 处理页码变化
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 处理页大小变化
  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // 处理筛选参数变化
  const handleFilterChange = (key, value) => {
    setFilterParams(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  // 处理查看详情
  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setShowDetail(true);
  };

  // 处理记录更新
  const handleRecordUpdate = (updatedRecord) => {
    setRecords(prev => prev.map(record => 
      record.id === updatedRecord.id ? updatedRecord : record
    ));
  };

  // 处理记录删除
  const handleRecordDelete = (recordId) => {
    setRecords(prev => prev.filter(record => record.id !== recordId));
  };

  // 格式化时间
  const formatTime = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 计算总页数
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="pan-history">
      <div className="page-header">
        <h1>排盘历史</h1>
      </div>

      <div className="filter-section">
        <div className="filter-item">
          <label>排盘类型：</label>
          <select 
            value={filterParams.panType}
            onChange={(e) => handleFilterChange('panType', e.target.value)}
          >
            <option value="liuyao">六爻</option>
            <option value="sizhu">四柱</option>
            <option value="bagua">八卦</option>
          </select>
        </div>
        
        <div className="filter-item">
          <label>开始时间：</label>
          <input 
            type="datetime-local"
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                const timestamp = Math.floor(new Date(value).getTime() / 1000);
                handleFilterChange('startTime', timestamp);
              } else {
                handleFilterChange('startTime', null);
              }
            }}
          />
        </div>
        
        <div className="filter-item">
          <label>结束时间：</label>
          <input 
            type="datetime-local"
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                const timestamp = Math.floor(new Date(value).getTime() / 1000);
                handleFilterChange('endTime', timestamp);
              } else {
                handleFilterChange('endTime', null);
              }
            }}
          />
        </div>
      </div>

      <div className="records-section">
        {loading ? (
          <div className="loading">加载中...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : records.length === 0 ? (
          <div className="empty">暂无排盘记录</div>
        ) : (
          <>
            <table className="records-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>排盘类型</th>
                  <th>补充说明</th>
                  <th>创建时间</th>
                  <th>更新时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {records.map(record => (
                  <tr key={record.id}>
                    <td>{record.id}</td>
                    <td>{panTypeToChinese(record.pan_type || 'liuyao')}</td>
                    <td>{record.supplement || '-'}</td>
                    <td>{formatTime(record.create_time)}</td>
                    <td>{formatTime(record.update_time)}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-primary" 
                        onClick={() => handleViewDetail(record)}
                      >
                        查看详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <div className="page-info">
                共 {total} 条记录，每页 {pageSize} 条，第 {currentPage} / {totalPages} 页
              </div>
              <div className="page-controls">
                <button 
                  className="btn btn-sm" 
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  首页
                </button>
                <button 
                  className="btn btn-sm" 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  上一页
                </button>
                <button 
                  className="btn btn-sm" 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  下一页
                </button>
                <button 
                  className="btn btn-sm" 
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  末页
                </button>
                <select 
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="page-size-select"
                >
                  <option value={10}>10条/页</option>
                  <option value={20}>20条/页</option>
                  <option value={50}>50条/页</option>
                </select>
              </div>
            </div>
          </>
        )}
      </div>

      {showDetail && selectedRecord && (
        <PanRecordDetail 
          record={selectedRecord}
          onClose={() => setShowDetail(false)}
          onUpdate={handleRecordUpdate}
          onDelete={handleRecordDelete}
        />
      )}

      <style jsx>{`
        .pan-history {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: 30px;
        }

        .page-header h1 {
          font-size: 24px;
          color: #333;
          margin: 0;
        }

        .filter-section {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          padding: 20px;
          background: #f5f5f5;
          border-radius: 8px;
        }

        .filter-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-item label {
          font-weight: 500;
          color: #666;
          white-space: nowrap;
        }

        .filter-item select,
        .filter-item input {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .records-section {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
          overflow: hidden;
        }

        .loading,
        .empty,
        .error-message {
          padding: 60px 20px;
          text-align: center;
          color: #666;
        }

        .error-message {
          color: #ff4d4f;
        }

        .records-table {
          width: 100%;
          border-collapse: collapse;
        }

        .records-table th,
        .records-table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid #f0f0f0;
        }

        .records-table th {
          background-color: #fafafa;
          font-weight: 600;
          color: #333;
        }

        .records-table tr:hover {
          background-color: #f5f5f5;
        }

        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-top: 1px solid #f0f0f0;
        }

        .page-info {
          color: #666;
          font-size: 14px;
        }

        .page-controls {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .btn {
          padding: 6px 12px;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          background: #fff;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s;
        }

        .btn:hover {
          border-color: #1890ff;
          color: #1890ff;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background-color: #1890ff;
          border-color: #1890ff;
          color: #fff;
        }

        .btn-primary:hover {
          background-color: #40a9ff;
          border-color: #40a9ff;
          color: #fff;
        }

        .btn-sm {
          padding: 4px 8px;
          font-size: 12px;
        }

        .page-size-select {
          padding: 4px 8px;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .filter-section {
            flex-direction: column;
            align-items: flex-start;
          }

          .pagination {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .records-table {
            font-size: 12px;
          }

          .records-table th,
          .records-table td {
            padding: 8px 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default PanHistory;