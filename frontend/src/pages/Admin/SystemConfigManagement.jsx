/*
 * @file            frontend/src/pages/Admin/SystemConfigManagement.jsx
 * @description     系统配置页面
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-01 10:00:00
 * @lastModified    2026-03-01 10:00:00
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react';
import { getSystemConfigList, updateSystemConfig } from '../../api/adminApi';
import './ManagementPages.css';

export default function SystemConfigManagement() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const response = await getSystemConfigList();
      if (response.success || response.code === 200) {
        setConfigs(response.data || []);
      }
    } catch (error) {
      console.error('获取系统配置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleSaveConfig = async (configKey, newValue) => {
    try {
      setSavingKey(configKey);
      await updateSystemConfig(configKey, newValue);
      fetchConfigs();
    } catch (error) {
      console.error('保存配置失败:', error);
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="management-page">
      <div className="page-header">
        <h2>系统配置</h2>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>加载中...</div>
      ) : (
        <div className="config-list">
          {configs.map((config) => (
            <div key={config.id} className="config-item">
              <div className="config-info">
                <div className="config-key">{config.config_key}</div>
                <div className="config-desc">{config.description}</div>
              </div>
              <div className="config-value">
                <input
                  type="text"
                  defaultValue={config.config_value}
                  className="config-input"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveConfig(config.config_key, e.target.value);
                    }
                  }}
                />
                <button
                  onClick={(e) => {
                    const input = e.target.previousElementSibling;
                    handleSaveConfig(config.config_key, input.value);
                  }}
                  className="small-btn"
                  disabled={savingKey === config.config_key}
                >
                  {savingKey === config.config_key ? '保存中...' : '保存'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
