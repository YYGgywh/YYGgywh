/*
 * @file            frontend/src/components/UserCenter/PanRecordsContent.jsx
 * @description     排盘记录内容组件，展示用户的排盘历史记录
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-03 20:52:00
 * @lastModified    2026-03-03 20:41:33
 * Copyright © All rights reserved
*/

import React from 'react';
import './PanRecordsContent.css';

/**
 * 排盘记录内容组件
 * @param {Object} props - 组件属性
 * @param {Array} props.records - 排盘记录列表
 * @param {boolean} props.loading - 是否加载中
 * @param {number} props.currentPage - 当前页码
 * @param {number} props.totalPages - 总页数
 * @param {Function} props.onPageChange - 页码变化回调
 * @param {Function} props.onViewDetail - 查看详情回调
 * @param {Function} props.formatTime - 时间格式化函数
 * @param {Function} props.panTypeToChinese - 排盘类型转中文函数
 */
const PanRecordsContent = ({
  records,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  onViewDetail,
  formatTime,
  panTypeToChinese
}) => {
  if (loading) {
    return (
      <div className="pan-records-loading">
        <div className="loading-spinner"></div>
        <span>加载中...</span>
      </div>
    );
  }

  if (!records || records.length === 0) {
    return (
      <div className="pan-records-empty">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="empty-icon">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M9 5a2 2 0 012-2h2a2 2 0 012 2v0H9v0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p>暂无排盘记录</p>
        <span>您还没有进行过任何排盘</span>
      </div>
    );
  }

  return (
    <div className="pan-records-content">
      {/* 记录列表 */}
      <div className="records-list">
        {records.map((record) => (
          <div key={record.id} className="record-card">
            <div className="record-card-header">
              <span className="record-type-badge">
                {panTypeToChinese ? panTypeToChinese(record.pan_type || 'liuyao') : '六爻'}
              </span>
              <span className="record-time">
                {formatTime ? formatTime(record.create_time) : new Date(record.create_time * 1000).toLocaleString('zh-CN')}
              </span>
            </div>
            <div className="record-card-body">
              <div className="record-result">
                <span className="result-label">卦象：</span>
                <span className="result-value">
                  {record.pan_result?.ben_gua_head?.name || '未知'}
                  {record.pan_result?.bian_gua_head?.name && ` → ${record.pan_result.bian_gua_head.name}`}
                </span>
              </div>
              {record.supplement && (
                <div className="record-supplement">
                  <span className="supplement-label">补充说明：</span>
                  <span className="supplement-value">{record.supplement}</span>
                </div>
              )}
            </div>
            <div className="record-card-footer">
              <button
                className="record-action-btn record-action-btn--primary"
                onClick={() => onViewDetail(record)}
              >
                查看详情
              </button>
              <button className="record-action-btn">
                评论({record.comment_count || 0})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 分页控制 */}
      {totalPages > 1 && (
        <div className="records-pagination">
          <button
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            上一页
          </button>
          <span className="page-info">
            第 {currentPage} 页，共 {totalPages} 页
          </span>
          <button
            className="page-btn"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
};

export default PanRecordsContent;
