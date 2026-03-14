/*
 * @file            frontend/src/components/PanRecordDetail/PanRecordDetail.jsx
 * @description     排盘记录详情组件
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-02 18:10:00
 * @lastModified    2026-03-14 12:00:00
 * Copyright © All rights reserved
*/

import React, { useState, useEffect, useMemo } from 'react';
import { updatePan, deletePan } from '../../api/panApi';
import { methodToChinese, panTypeToChinese } from '../../utils/methodMapping';
import styles from './PanRecordDetail.desktop.module.css';

/**
 * 排盘记录详情组件
 * @param {Object} record - 排盘记录对象
 * @param {Function} onClose - 关闭详情的回调函数
 * @param {Function} onUpdate - 更新记录后的回调函数
 * @param {Function} onDelete - 删除记录后的回调函数
 * @param {Function} updateFunc - 自定义更新函数（可选）
 * @param {Function} deleteFunc - 自定义删除函数（可选）
 * @returns {JSX.Element} 排盘记录详情弹窗
 */

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
  // 编辑状态，控制补充说明是否处于编辑模式
  const [editing, setEditing] = useState(false);
  // 补充说明内容
  const [supplement, setSupplement] = useState(record.supplement || '');
  // 加载状态，用于控制按钮禁用和显示加载提示
  const [loading, setLoading] = useState(false);
  // 错误信息，用于显示操作失败的提示
  const [error, setError] = useState('');

  // 当记录数据变化时，更新补充说明内容
  useEffect(() => {
    if (record) {
      setSupplement(record.supplement || '');
    }
  }, [record]);

  // 使用useMemo缓存排盘参数的解析和渲染结果，避免重复计算
  const paramsContent = useMemo(() => {
    // 安全解析排盘参数JSON数据
    const parseResult = safeJsonParse(record.pan_params, '排盘参数');
    
    // 如果解析失败，显示错误信息和原始数据
    if (!parseResult.success) {
      return (
        <div className={styles.panParams}>
          <h3>排盘参数</h3>
          <div className={styles.error}>{parseResult.error}</div>
          {parseResult.data && (
            <div className={styles.paramItem}>
              <span className={styles.paramLabel}>原始数据：</span>
              <span className={styles.paramValue}>{String(parseResult.data)}</span>
            </div>
          )}
        </div>
      );
    }
    
    const params = parseResult.data;
    
    // 解析成功，渲染排盘参数详情
    return (
      <div className={styles.panParams}>
        <h3>排盘参数</h3>
        {/* 起卦方式 */}
        {params.method && (
          <div className={styles.paramItem}>
            <span className={styles.paramLabel}>起卦方式：</span>
            <span className={styles.paramValue}>{methodToChinese(params.method)}</span>
          </div>
        )}
        {/* 起卦数字 */}
        {params.numbers && Array.isArray(params.numbers) && params.numbers.length > 0 && (
          <div className={styles.paramItem}>
            <span className={styles.paramLabel}>起卦数字：</span>
            <span className={styles.paramValue}>{params.numbers.join(', ')}</span>
          </div>
        )}
        {/* 起卦时间 */}
        {params.time && (
          <div className={styles.paramItem}>
            <span className={styles.paramLabel}>起卦时间：</span>
            <span className={styles.paramValue}>
              {params.time.year || '-'}年
              {params.time.month || '-'}月
              {params.time.day || '-'}日
              {params.time.hour !== undefined ? `${params.time.hour}时` : ''}
              {params.time.minute !== undefined ? `${params.time.minute}分` : ''}
              {params.time.second !== undefined ? `${params.time.second}秒` : ''}
            </span>
          </div>
        )}
        {/* 求占问题 */}
        {params.form_data?.question && (
          <div className={styles.paramItem}>
            <span className={styles.paramLabel}>求占问题：</span>
            <span className={styles.paramValue}>{params.form_data.question}</span>
          </div>
        )}
        {/* 求测者信息 */}
        {params.form_data?.firstName && (
          <div className={styles.paramItem}>
            <span className={styles.paramLabel}>求测者：</span>
            <span className={styles.paramValue}>
              {params.form_data.firstName}{params.form_data.lastName || ''}
            </span>
          </div>
        )}
        {/* 性别 */}
        {params.form_data?.gender && (
          <div className={styles.paramItem}>
            <span className={styles.paramLabel}>性别：</span>
            <span className={styles.paramValue}>{params.form_data.gender}</span>
          </div>
        )}
        {/* 出生年 */}
        {params.form_data?.birthYear && (
          <div className={styles.paramItem}>
            <span className={styles.paramLabel}>出生年：</span>
            <span className={styles.paramValue}>{params.form_data.birthYear}</span>
          </div>
        )}
        {/* 属地 */}
        {params.form_data?.location && (
          <div className={styles.paramItem}>
            <span className={styles.paramLabel}>属地：</span>
            <span className={styles.paramValue}>{params.form_data.location}</span>
          </div>
        )}
        {/* 占类 */}
        {params.form_data?.divinationType && (
          <div className={styles.paramItem}>
            <span className={styles.paramLabel}>占类：</span>
            <span className={styles.paramValue}>
              {params.form_data.divinationType}
              {params.form_data.subType ? `·${params.form_data.subType}` : ''}
            </span>
          </div>
        )}
      </div>
    );
  }, [record.pan_params]);

  // 使用useMemo缓存排盘结果的解析和渲染结果，避免重复计算
  const resultContent = useMemo(() => {
    // 安全解析排盘结果JSON数据
    const parseResult = safeJsonParse(record.pan_result, '排盘结果');
    
    // 如果解析失败，显示错误信息和原始数据
    if (!parseResult.success) {
      return (
        <div className={styles.panResult}>
          <h3>排盘结果</h3>
          <div className={styles.error}>{parseResult.error}</div>
          {parseResult.data && (
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>原始数据：</span>
              <span className={styles.resultValue}>{String(parseResult.data)}</span>
            </div>
          )}
        </div>
      );
    }
    
    const result = parseResult.data;
    
    // 解析成功，渲染排盘结果详情
    return (
      <div className={styles.panResult}>
        <h3>排盘结果</h3>
        {/* 本卦信息 */}
        {result.ben_gua_head && (
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>本卦：</span>
            <span className={styles.resultValue}>{result.ben_gua_head.name}</span>
          </div>
        )}
        {/* 变卦信息 */}
        {result.bian_gua_head && (
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>变卦：</span>
            <span className={styles.resultValue}>{result.bian_gua_head.name}</span>
          </div>
        )}
        {/* 动爻信息 */}
        {result.dong_yao_info && result.dong_yao_info.positions && (
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>动爻：</span>
            <span className={styles.resultValue}>{result.dong_yao_info.positions.join(', ')}</span>
          </div>
        )}
        {/* 农历时间信息 */}
        {result.calendar_info && result.calendar_info.lunar_info && (
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>起卦时间（农历）：</span>
            <span className={styles.resultValue}>{result.calendar_info.lunar_info.lunar_full_string}</span>
          </div>
        )}
        {/* 公历时间信息 */}
        {result.calendar_info && result.calendar_info.solar_info && (
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>起卦时间（公历）：</span>
            <span className={styles.resultValue}>{result.calendar_info.solar_info.solar_full_string}</span>
          </div>
        )}
      </div>
    );
  }, [record.pan_result]);

  /**
   * 处理更新补充说明的函数
   */
  const handleUpdate = async () => {
    if (!record) return;

    // 设置加载状态，清空错误信息
    setLoading(true);
    setError('');

    try {
      // 使用自定义更新函数或默认的updatePan函数
      const updateFn = updateFunc || updatePan;
      // 调用更新API，更新补充说明
      await updateFn(record.id, { supplement });
      // 退出编辑模式
      setEditing(false);
      // 调用更新回调函数，传递更新后的记录数据
      if (onUpdate) {
        onUpdate({ ...record, supplement, update_time: Math.floor(Date.now() / 1000) });
      }
    } catch (err) {
      // 显示错误信息
      setError('更新失败，请重试');
      // 打印错误日志
      console.error('更新排盘记录失败:', err);
    } finally {
      // 重置加载状态
      setLoading(false);
    }
  };

  /**
   * 处理删除记录的函数
   */
  const handleDelete = async () => {
    if (!record) return;

    // 显示确认对话框，确认是否删除
    if (!window.confirm('确定要删除这条排盘记录吗？')) {
      return;
    }

    // 设置加载状态，清空错误信息
    setLoading(true);
    setError('');

    try {
      // 使用自定义删除函数或默认的deletePan函数
      const deleteFn = deleteFunc || deletePan;
      // 调用删除API
      await deleteFn(record.id);
      // 调用删除回调函数，传递删除的记录ID
      if (onDelete) {
        onDelete(record.id);
      }
      // 关闭详情弹窗
      if (onClose) {
        onClose();
      }
    } catch (err) {
      // 显示错误信息
      setError('删除失败，请重试');
      // 打印错误日志
      console.error('删除排盘记录失败:', err);
    } finally {
      // 重置加载状态
      setLoading(false);
    }
  };

  // 如果没有记录数据，返回null
  if (!record) {
    return null;
  }

  /**
   * 时间戳格式化函数
   * @param {number} timestamp - 时间戳（秒）
   * @returns {string} 格式化后的时间字符串
   */
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

  // 渲染组件
  return (
    <div className={styles.panRecordDetail}>
      {/* 弹窗头部 */}
      <div className={styles.detailHeader}>
        <h2>排盘记录详情</h2>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
      </div>
      
      {/* 弹窗内容 */}
      <div className={styles.detailContent}>
        {/* 基本信息 */}
        <div className={styles.basicInfo}>
          {/* 记录ID */}
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>记录ID：</span>
            <span className={styles.infoValue}>{record.id}</span>
          </div>
          {/* 排盘类型 */}
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>排盘类型：</span>
            <span className={styles.infoValue}>{panTypeToChinese(record.pan_type || 'liuyao')}</span>
          </div>
          {/* 创建时间 */}
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>创建时间：</span>
            <span className={styles.infoValue}>{formatTime(record.create_time)}</span>
          </div>
          {/* 更新时间 */}
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>更新时间：</span>
            <span className={styles.infoValue}>{formatTime(record.update_time)}</span>
          </div>
          
          {/* 补充说明 */}
          <div className={styles.infoItem + ' ' + styles.supplementItem}>
            <span className={styles.infoLabel}>补充说明：</span>
            {/* 编辑模式 */}
            {editing ? (
              <div className={styles.supplementEdit}>
                <textarea 
                  value={supplement}
                  onChange={(e) => setSupplement(e.target.value)}
                  placeholder="请输入补充说明"
                  rows={3}
                />
                <div className={styles.editButtons}>
                  <button 
                    className={styles.btn + ' ' + styles.btnPrimary} 
                    onClick={handleUpdate}
                    disabled={loading}
                  >
                    {loading ? '保存中...' : '保存'}
                  </button>
                  <button 
                    className={styles.btn + ' ' + styles.btnSecondary} 
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
              /* 显示模式 */
              <div className={styles.supplementDisplay}>
                <span className={styles.infoValue}>{supplement || '-'}</span>
                <button 
                  className={styles.btn + ' ' + styles.btnSm} 
                  onClick={() => setEditing(true)}
                >
                  编辑
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 排盘参数 */}
        {paramsContent}
        {/* 排盘结果 */}
        {resultContent}
      </div>

      {/* 弹窗底部 */}
      <div className={styles.detailFooter}>
        {/* 错误信息 */}
        {error && <div className={styles.errorMessage}>{error}</div>}
        {/* 删除按钮 */}
        <button 
          className={styles.btn + ' ' + styles.btnDanger} 
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? '删除中...' : '删除记录'}
        </button>
        {/* 关闭按钮 */}
        <button 
          className={styles.btn + ' ' + styles.btnSecondary} 
          onClick={onClose}
          disabled={loading}
        >
          关闭
        </button>
      </div>

      
    </div>
  );
};

export default PanRecordDetail;