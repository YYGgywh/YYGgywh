/*
 * @file            frontend/src/pages/Admin/SystemConfigManagement.jsx
 * @description     系统配置页面，支持分类显示、配置验证、变更日志等功能
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-19 10:00:00
 * @lastModified    2026-03-19 10:00:00
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react';
import {
  getConfigCategories,
  getSystemConfigList,
  createSystemConfig,
  updateSystemConfig,
  deleteSystemConfig,
  getConfigChangeLogs,
  batchUpdateSystemConfigs
} from '../../api/adminApi';
import './ManagementPages.css';

export default function SystemConfigManagement() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);
  const [editingConfig, setEditingConfig] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedConfigForLogs, setSelectedConfigForLogs] = useState(null);
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsPage, setLogsPage] = useState(1);
  const [logsTotal, setLogsTotal] = useState(0);
  const [showBatchUpdateModal, setShowBatchUpdateModal] = useState(false);
  const [selectedConfigs, setSelectedConfigs] = useState([]);
  const [newConfig, setNewConfig] = useState({ key: '', value: '', description: '' });
  const [batchUpdateReason, setBatchUpdateReason] = useState('');
  const [batchUpdateConfigs, setBatchUpdateConfigs] = useState([]);
  const [inputValues, setInputValues] = useState({});

  const fetchCategories = async () => {
    try {
      const response = await getConfigCategories();
      if (response.success || response.code === 200) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('获取配置分类失败:', error);
    }
  };

  const fetchConfigs = async (category = null) => {
    try {
      setLoading(true);
      const response = await getSystemConfigList(category === 'all' ? null : category);
      if (response.success || response.code === 200) {
        setConfigs(response.data || []);
      }
    } catch (error) {
      console.error('获取系统配置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async (configKey, page = 1) => {
    try {
      setLogsLoading(true);
      const response = await getConfigChangeLogs(configKey, page, 20);
      if (response.success || response.code === 200) {
        setLogs(response.data.logs || []);
        setLogsTotal(response.data.total || 0);
        setLogsPage(page);
      }
    } catch (error) {
      console.error('获取配置变更日志失败:', error);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchConfigs();
  }, []);

  useEffect(() => {
    fetchConfigs(selectedCategory);
  }, [selectedCategory]);

  const handleSaveConfig = async (configKey, newValue, changeReason = null) => {
    try {
      setSavingKey(configKey);
      await updateSystemConfig(configKey, newValue, changeReason);
      fetchConfigs(selectedCategory);
      // 保存成功后清除临时输入值
      setInputValues(prev => {
        const newValues = { ...prev };
        delete newValues[configKey];
        return newValues;
      });
    } catch (error) {
      console.error('保存配置失败:', error);
      alert(error.response?.data?.detail || '保存失败，请稍后重试');
    } finally {
      setSavingKey(null);
    }
  };

  const handleCreateConfig = async () => {
    if (!newConfig.key || !newConfig.value) {
      alert('请填写配置键和配置值');
      return;
    }

    try {
      await createSystemConfig(newConfig);
      setShowCreateModal(false);
      setNewConfig({ key: '', value: '', description: '' });
      fetchConfigs(selectedCategory);
      alert('创建成功');
    } catch (error) {
      console.error('创建配置失败:', error);
      alert(error.response?.data?.detail || '创建失败，请稍后重试');
    }
  };

  const handleDeleteConfig = async (configKey) => {
    if (!confirm(`确定要删除配置项 "${configKey}" 吗？`)) {
      return;
    }

    try {
      await deleteSystemConfig(configKey);
      fetchConfigs(selectedCategory);
      alert('删除成功');
    } catch (error) {
      console.error('删除配置失败:', error);
      alert(error.response?.data?.detail || '删除失败，请稍后重试');
    }
  };

  const handleShowLogs = (configKey) => {
    setSelectedConfigForLogs(configKey);
    setShowLogModal(true);
    fetchLogs(configKey);
  };

  const handleBatchUpdate = async () => {
    if (batchUpdateConfigs.length === 0) {
      alert('请选择要更新的配置项');
      return;
    }

    try {
      await batchUpdateSystemConfigs(batchUpdateConfigs, batchUpdateReason);
      setShowBatchUpdateModal(false);
      setBatchUpdateConfigs([]);
      setBatchUpdateReason('');
      fetchConfigs(selectedCategory);
      alert('批量更新成功');
    } catch (error) {
      console.error('批量更新配置失败:', error);
      alert(error.response?.data?.detail || '批量更新失败，请稍后重试');
    }
  };

  const toggleConfigSelection = (configKey) => {
    if (selectedConfigs.includes(configKey)) {
      setSelectedConfigs(selectedConfigs.filter(key => key !== configKey));
      setBatchUpdateConfigs(batchUpdateConfigs.filter(config => config.key !== configKey));
    } else {
      setSelectedConfigs([...selectedConfigs, configKey]);
      const config = configs.find(c => c.key === configKey);
      if (config) {
        setBatchUpdateConfigs([...batchUpdateConfigs, { key: configKey, value: config.value }]);
      }
    }
  };

  const updateBatchConfigValue = (configKey, newValue) => {
    setBatchUpdateConfigs(batchUpdateConfigs.map(config =>
      config.key === configKey ? { ...config, value: newValue } : config
    ));
  };

  const renderConfigInput = (config) => {
    const isEditing = editingConfig === config.key;
    const isBoolean = config.type === 'boolean';

    if (isBoolean) {
      return (
        <select
          value={config.value}
          onChange={(e) => {
            if (isEditing) {
              setBatchUpdateConfigs(batchUpdateConfigs.map(c =>
                c.key === config.key ? { ...c, value: e.target.value } : c
              ));
            } else {
              handleSaveConfig(config.key, e.target.value);
            }
          }}
          disabled={!isEditing && savingKey === config.key}
          className="config-input"
        >
          <option value="True">是</option>
          <option value="False">否</option>
        </select>
      );
    }

    return (
      <input
        type={config.type === 'integer' ? 'number' : 'text'}
        value={inputValues[config.key] || config.value}
        onChange={(e) => {
          if (isEditing) {
            updateBatchConfigValue(config.key, e.target.value);
          } else {
            setInputValues(prev => ({
              ...prev,
              [config.key]: e.target.value
            }));
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !isEditing) {
            handleSaveConfig(config.key, inputValues[config.key] || config.value);
          }
        }}
        disabled={!isEditing && savingKey === config.key}
        className="config-input"
      />
    );
  };

  return (
    <div className="management-page">
      <div className="page-header">
        <h2>系统配置</h2>
        <div className="header-actions">
          <button
            className="primary-btn"
            onClick={() => setShowBatchUpdateModal(true)}
            disabled={selectedConfigs.length === 0}
          >
            批量更新 ({selectedConfigs.length})
          </button>
          <button
            className="primary-btn"
            onClick={() => setShowCreateModal(true)}
          >
            新增配置
          </button>
        </div>
      </div>

      <div className="category-tabs">
        <button
          className={`tab-button ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          全部
        </button>
        {categories.map((category) => (
          <button
            key={category.name}
            className={`tab-button ${selectedCategory === category.name ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.name)}
          >
            {category.display_name}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>加载中...</div>
      ) : (
        <div className="config-list">
          {configs.map((config) => (
            <div key={config.id} className="config-item">
              <div className="config-info">
                <div className="config-header">
                  <input
                    type="checkbox"
                    checked={selectedConfigs.includes(config.key)}
                    onChange={() => toggleConfigSelection(config.key)}
                    className="config-checkbox"
                  />
                  <div className="config-key">{config.key}</div>
                  {config.is_super_admin_only && (
                    <span className="super-admin-badge">超级管理员</span>
                  )}
                </div>
                <div className="config-desc">{config.description}</div>
              </div>
              <div className="config-value">
                {renderConfigInput(config)}
                <button
                  onClick={() => {
                    const input = document.querySelector(`input[disabled][value="${config.value}"]`);
                    if (input) {
                      handleSaveConfig(config.key, input.value);
                    }
                  }}
                  className="small-btn"
                  disabled={savingKey === config.key}
                >
                  {savingKey === config.key ? '保存中...' : '保存'}
                </button>
                <button
                  onClick={() => handleShowLogs(config.key)}
                  className="small-btn secondary-btn"
                >
                  日志
                </button>
                <button
                  onClick={() => handleDeleteConfig(config.key)}
                  className="small-btn danger-btn"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>新增配置</h3>
            <div className="form-group">
              <label>配置键</label>
              <input
                type="text"
                value={newConfig.key}
                onChange={(e) => setNewConfig({ ...newConfig, key: e.target.value })}
                placeholder="例如: app.name"
              />
            </div>
            <div className="form-group">
              <label>配置值</label>
              <input
                type="text"
                value={newConfig.value}
                onChange={(e) => setNewConfig({ ...newConfig, value: e.target.value })}
                placeholder="请输入配置值"
              />
            </div>
            <div className="form-group">
              <label>配置描述</label>
              <input
                type="text"
                value={newConfig.description}
                onChange={(e) => setNewConfig({ ...newConfig, description: e.target.value })}
                placeholder="请输入配置描述"
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowCreateModal(false)} className="secondary-btn">
                取消
              </button>
              <button onClick={handleCreateConfig} className="primary-btn">
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogModal && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <h3>配置变更日志 - {selectedConfigForLogs}</h3>
            {logsLoading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>加载中...</div>
            ) : (
              <div className="log-list">
                {logs.map((log) => (
                  <div key={log.id} className="log-item">
                    <div className="log-header">
                      <span className="log-operator">{log.operator_name}</span>
                      <span className="log-time">
                        {new Date(log.create_time * 1000).toLocaleString()}
                      </span>
                    </div>
                    <div className="log-content">
                      <div className="log-change">
                        <span className="log-label">旧值:</span>
                        <span className="log-value">{log.old_value || '无'}</span>
                      </div>
                      <div className="log-change">
                        <span className="log-label">新值:</span>
                        <span className="log-value">{log.new_value || '无'}</span>
                      </div>
                      {log.change_reason && (
                        <div className="log-reason">
                          <span className="log-label">原因:</span>
                          <span className="log-value">{log.change_reason}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="modal-actions">
              <button onClick={() => setShowLogModal(false)} className="primary-btn">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {showBatchUpdateModal && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <h3>批量更新配置</h3>
            <div className="form-group">
              <label>变更原因</label>
              <input
                type="text"
                value={batchUpdateReason}
                onChange={(e) => setBatchUpdateReason(e.target.value)}
                placeholder="请输入变更原因"
              />
            </div>
            <div className="batch-config-list">
              {batchUpdateConfigs.map((config) => (
                <div key={config.key} className="batch-config-item">
                  <div className="batch-config-key">{config.key}</div>
                  <input
                    type="text"
                    value={config.value}
                    onChange={(e) => updateBatchConfigValue(config.key, e.target.value)}
                    className="batch-config-input"
                  />
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowBatchUpdateModal(false)} className="secondary-btn">
                取消
              </button>
              <button onClick={handleBatchUpdate} className="primary-btn">
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
