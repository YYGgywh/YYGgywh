/*
 * @file            frontend/src/components/PanRecordDetail.jsx
 * @description     排盘记录详情组件
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-02 18:10:00
 * @lastModified    2026-03-03 13:15:00
 * Copyright © All rights reserved
*/

import React, { useState, useEffect, useMemo } from 'react';
import { updatePan, deletePan } from '../api/panApi';
import { methodToChinese, panTypeToChinese } from '../utils/methodMapping';

/**
 * 安全解析JSON数据
 * @param {any} data - 待解析的数据
 * @param {string} fieldName - 字段名称，用于错误提示
 * @returns {object} 解析结果对象 { success: boolean, data: any, error: string|null }
 */
const safeJsonParse = (data, fieldName = '数据') => {
  if (data === null || data === undefined) {
    return {
      success: false,
      data: null,
      error: `${fieldName}为空`
    };
  }

  if (typeof data === 'object') {
    if (Array.isArray(data)) {
      return {
        success: true,
        data: data,
        error: null
      };
    }
    return {
      success: true,
      data: data,
      error: null
    };
  }

  if (typeof data === 'string') {
    const trimmedData = data.trim();
    if (!trimmedData) {
      return {
        success: false,
        data: null,
        error: `${fieldName}为空字符串`
      };
    }

    try {
      const parsed = JSON.parse(trimmedData);
      return {
        success: true,
        data: parsed,
        error: null
      };
    } catch (parseError) {
      return {
        success: false,
        data: trimmedData,
        error: `${fieldName}解析失败: ${parseError.message}`
      };
    }
  }

  return {
    success: false,
    data: data,
    error: `${fieldName}类型未知: ${typeof data}`
  };
};

const PanRecordDetail = ({ record, onClose, onUpdate, onDelete, updateFunc, deleteFunc }) => {
  const [editing, setEditing] = useState(false);
  const [supplement, setSupplement] = useState(record.supplement || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 使用useEffect更新补充说明
  useEffect(() => {
    if (record) {
      setSupplement(record.supplement || '');
    }
  }, [record]);

  const paramsContent = useMemo(() => {
    const parseResult = safeJsonParse(record.pan_params, '排盘参数');
    
    if (!parseResult.success) {
      return (
        <div className="pan-params">
          <h3>排盘参数</h3>
          <div className="error">{parseResult.error}</div>
          {parseResult.data && (
            <div className="param-item">
              <span className="param-label">原始数据：</span>
              <span className="param-value">{String(parseResult.data)}</span>
            </div>
          )}
        </div>
      );
    }
    
    const params = parseResult.data;
    
    return (
      <div className="pan-params">
        <h3>排盘参数</h3>
        {params.method && (
          <div className="param-item">
            <span className="param-label">起卦方式：</span>
            <span className="param-value">{methodToChinese(params.method)}</span>
          </div>
        )}
        {params.numbers && Array.isArray(params.numbers) && params.numbers.length > 0 && (
          <div className="param-item">
            <span className="param-label">起卦数字：</span>
            <span className="param-value">{params.numbers.join(', ')}</span>
          </div>
        )}
        {params.time && (
          <div className="param-item">
            <span className="param-label">起卦时间：</span>
            <span className="param-value">
              {params.time.year || '-'}年
              {params.time.month || '-'}月
              {params.time.day || '-'}日
              {params.time.hour !== undefined ? `${params.time.hour}时` : ''}
              {params.time.minute !== undefined ? `${params.time.minute}分` : ''}
              {params.time.second !== undefined ? `${params.time.second}秒` : ''}
            </span>
          </div>
        )}
        {params.form_data?.question && (
          <div className="param-item">
            <span className="param-label">求占问题：</span>
            <span className="param-value">{params.form_data.question}</span>
          </div>
        )}
        {params.form_data?.firstName && (
          <div className="param-item">
            <span className="param-label">求测者：</span>
            <span className="param-value">
              {params.form_data.firstName}{params.form_data.lastName || ''}
            </span>
          </div>
        )}
        {params.form_data?.gender && (
          <div className="param-item">
            <span className="param-label">性别：</span>
            <span className="param-value">{params.form_data.gender}</span>
          </div>
        )}
        {params.form_data?.birthYear && (
          <div className="param-item">
            <span className="param-label">出生年：</span>
            <span className="param-value">{params.form_data.birthYear}</span>
          </div>
        )}
        {params.form_data?.location && (
          <div className="param-item">
            <span className="param-label">属地：</span>
            <span className="param-value">{params.form_data.location}</span>
          </div>
        )}
        {params.form_data?.divinationType && (
          <div className="param-item">
            <span className="param-label">占类：</span>
            <span className="param-value">
              {params.form_data.divinationType}
              {params.form_data.subType ? `·${params.form_data.subType}` : ''}
            </span>
          </div>
        )}
      </div>
    );
  }, [record.pan_params]);

  const resultContent = useMemo(() => {
    const parseResult = safeJsonParse(record.pan_result, '排盘结果');
    
    if (!parseResult.success) {
      return (
        <div className="pan-result">
          <h3>排盘结果</h3>
          <div className="error">{parseResult.error}</div>
          {parseResult.data && (
            <div className="result-item">
              <span className="result-label">原始数据：</span>
              <span className="result-value">{String(parseResult.data)}</span>
            </div>
          )}
        </div>
      );
    }
    
    const result = parseResult.data;
    
    return (
      <div className="pan-result">
        <h3>排盘结果</h3>
        {result.ben_gua_head && (
          <div className="result-item">
            <span className="result-label">本卦：</span>
            <span className="result-value">{result.ben_gua_head.name}</span>
          </div>
        )}
        {result.bian_gua_head && (
          <div className="result-item">
            <span className="result-label">变卦：</span>
            <span className="result-value">{result.bian_gua_head.name}</span>
          </div>
        )}
        {result.dong_yao_info && result.dong_yao_info.positions && (
          <div className="result-item">
            <span className="result-label">动爻：</span>
            <span className="result-value">{result.dong_yao_info.positions.join(', ')}</span>
          </div>
        )}
        {result.calendar_info && result.calendar_info.lunar_info && (
          <div className="result-item">
            <span className="result-label">起卦时间（农历）：</span>
            <span className="result-value">{result.calendar_info.lunar_info.lunar_full_string}</span>
          </div>
        )}
        {result.calendar_info && result.calendar_info.solar_info && (
          <div className="result-item">
            <span className="result-label">起卦时间（公历）：</span>
            <span className="result-value">{result.calendar_info.solar_info.solar_full_string}</span>
          </div>
        )}
      </div>
    );
  }, [record.pan_result]);

  const handleUpdate = async () => {
    if (!record) return;

    setLoading(true);
    setError('');

    try {
      const updateFn = updateFunc || updatePan;
      await updateFn(record.id, { supplement });
      setEditing(false);
      if (onUpdate) {
        onUpdate({ ...record, supplement, update_time: Math.floor(Date.now() / 1000) });
      }
    } catch (err) {
      setError('更新失败，请重试');
      console.error('更新排盘记录失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!record) return;

    if (!window.confirm('确定要删除这条排盘记录吗？')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const deleteFn = deleteFunc || deletePan;
      await deleteFn(record.id);
      if (onDelete) {
        onDelete(record.id);
      }
      if (onClose) {
        onClose();
      }
    } catch (err) {
      setError('删除失败，请重试');
      console.error('删除排盘记录失败:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!record) {
    return null;
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };



  return (
    <div className="pan-record-detail">
      <div className="detail-header">
        <h2>排盘记录详情</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      
      <div className="detail-content">
        <div className="basic-info">
          <div className="info-item">
            <span className="info-label">记录ID：</span>
            <span className="info-value">{record.id}</span>
          </div>
          <div className="info-item">
            <span className="info-label">排盘类型：</span>
            <span className="info-value">{panTypeToChinese(record.pan_type || 'liuyao')}</span>
          </div>
          <div className="info-item">
            <span className="info-label">创建时间：</span>
            <span className="info-value">{formatTime(record.create_time)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">更新时间：</span>
            <span className="info-value">{formatTime(record.update_time)}</span>
          </div>
          
          <div className="info-item supplement-item">
            <span className="info-label">补充说明：</span>
            {editing ? (
              <div className="supplement-edit">
                <textarea 
                  value={supplement}
                  onChange={(e) => setSupplement(e.target.value)}
                  placeholder="请输入补充说明"
                  rows={3}
                />
                <div className="edit-buttons">
                  <button 
                    className="btn btn-primary" 
                    onClick={handleUpdate}
                    disabled={loading}
                  >
                    {loading ? '保存中...' : '保存'}
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setEditing(false);
                      setSupplement(record.supplement || '');
                    }}
                  >
                    取消
                  </button>
                </div>
              </div>
            ) : (
              <div className="supplement-display">
                <span className="info-value">{supplement || '-'}</span>
                <button 
                  className="btn btn-sm btn-edit" 
                  onClick={() => setEditing(true)}
                >
                  编辑
                </button>
              </div>
            )}
          </div>
        </div>

        {paramsContent}
        {resultContent}
      </div>

      <div className="detail-footer">
        {error && <div className="error-message">{error}</div>}
        <button 
          className="btn btn-danger" 
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? '删除中...' : '删除记录'}
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={onClose}
          disabled={loading}
        >
          关闭
        </button>
      </div>

      <style>{`
        .pan-record-detail {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 800px;
          max-height: 90vh;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          display: flex;
          flex-direction: column;
        }

        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e0e0e0;
        }

        .detail-header h2 {
          margin: 0;
          font-size: 18px;
          color: #333;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #999;
        }

        .close-btn:hover {
          color: #333;
        }

        .detail-content {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
        }

        .basic-info {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e0e0e0;
        }

        .info-item {
          display: flex;
          margin-bottom: 12px;
          align-items: flex-start;
        }

        .info-label {
          width: 120px;
          font-weight: 500;
          color: #666;
        }

        .info-value {
          flex: 1;
          color: #333;
        }

        .supplement-item {
          margin-top: 16px;
        }

        .supplement-display {
          flex: 1;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .supplement-edit {
          flex: 1;
        }

        .supplement-edit textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          resize: vertical;
          margin-bottom: 10px;
        }

        .edit-buttons {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

        .pan-params,
        .pan-result {
          margin-bottom: 30px;
        }

        .pan-params h3,
        .pan-result h3 {
          margin: 0 0 15px 0;
          font-size: 16px;
          color: #333;
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 8px;
        }

        .param-item,
        .result-item {
          display: flex;
          margin-bottom: 10px;
          align-items: flex-start;
        }

        .param-label,
        .result-label {
          width: 120px;
          font-weight: 500;
          color: #666;
        }

        .param-value,
        .result-value {
          flex: 1;
          color: #333;
        }

        .detail-footer {
          padding: 20px;
          border-top: 1px solid #e0e0e0;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          align-items: center;
        }

        .error-message {
          flex: 1;
          color: #ff4d4f;
          font-size: 14px;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-primary {
          background-color: #1890ff;
          color: #fff;
        }

        .btn-secondary {
          background-color: #f0f0f0;
          color: #333;
        }

        .btn-danger {
          background-color: #ff4d4f;
          color: #fff;
        }

        .btn-sm {
          padding: 4px 8px;
          font-size: 12px;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error {
          color: #ff4d4f;
          font-size: 14px;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default PanRecordDetail;