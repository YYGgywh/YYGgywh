/*
 * @file            frontend/src/pages/Admin/SensitiveWordManagement.jsx
 * @description     敏感词管理页面
 * @author          Gordon <gordon_cao@qq.com>
 * @createTime      2026-03-02 10:00:00
 * @lastModified    2026-03-02 12:30:00
 * Copyright © All rights reserved
*/

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isBackendLoggedIn } from '../../utils/storage';
import api from '../../api/index';
import './SensitiveWordManagement.css';

const SensitiveWordManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [words, setWords] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [isActive, setIsActive] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingWord, setEditingWord] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isBackendLoggedIn()) {
      navigate('/admin/login');
      return;
    }
    fetchWords();
  }, [navigate, page, pageSize, keyword, category, level, isActive]);

  const fetchWords = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        page_size: pageSize,
      };
      if (keyword) params.keyword = keyword;
      if (category) params.category = category;
      if (level !== '') params.level = parseInt(level);
      if (isActive !== '') params.is_active = parseInt(isActive);

      const response = await api.get('/sensitive_word/list', { params });
      if (response.code === 200) {
        setWords(response.data.list);
        setTotal(response.data.total);
      }
    } catch (err) {
      console.error('获取敏感词列表失败:', err);
      setError('获取敏感词列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchWords();
  };

  const handleAdd = () => {
    setEditingWord({ word: '', category: '', level: 1, description: '', is_active: 1 });
    setShowModal(true);
  };

  const handleEdit = (word) => {
    setEditingWord({ ...word });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('确定要删除这个敏感词吗？')) return;
    try {
      const response = await api.delete(`/sensitive_word/delete/${id}`);
      if (response.code === 200) {
        setSuccess('删除成功');
        fetchWords();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.msg || '删除失败');
      }
    } catch (err) {
      console.error('删除失败:', err);
      setError('删除失败');
    }
  };

  const handleSave = async () => {
    try {
      if (editingWord.id) {
        const response = await api.put(`/sensitive_word/update/${editingWord.id}`, editingWord);
        if (response.code === 200) {
          setSuccess('更新成功');
          setShowModal(false);
          fetchWords();
        } else {
          setError(response.msg || '更新失败');
        }
      } else {
        const response = await api.post('/sensitive_word/create', editingWord);
        if (response.code === 200) {
          setSuccess('添加成功');
          setShowModal(false);
          fetchWords();
        } else {
          setError(response.msg || '添加失败');
        }
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('操作失败:', err);
      setError('操作失败');
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/sensitive_word/export/download');
      if (response.code === 200) {
        const blob = new Blob([response.data.content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'sensitive_words.csv';
        link.click();
        setSuccess('导出成功');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('导出失败:', err);
      setError('导出失败');
    }
  };

  const handleImport = async () => {
    try {
      const words = importText.split('\n').filter(w => w.trim());
      const response = await api.post('/sensitive_word/batch_import', { words });
      if (response.code === 200) {
        setSuccess(`导入成功，成功导入 ${response.data.success_count} 条`);
        setShowImportModal(false);
        setImportText('');
        fetchWords();
      } else {
        setError(response.msg || '导入失败');
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('导入失败:', err);
      setError('导入失败');
    }
  };

  const getLevelName = (level) => {
    return level === 1 ? '警告' : '禁止';
  };

  const getCategoryName = (category) => {
    const categoryMap = {
      '政治': '政治敏感',
      '色情': '色情低俗',
      '暴力': '暴力血腥',
      '广告': '广告营销',
      '业务': '业务相关',
    };
    return categoryMap[category] || category || '未分类';
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="sensitive-word-container">
      <header className="page-header">
        <h1>敏感词管理</h1>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleAdd}>添加敏感词</button>
          <button className="btn btn-success" onClick={() => setShowImportModal(true)}>批量导入</button>
          <button className="btn btn-info" onClick={handleExport}>导出CSV</button>
        </div>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="search-bar">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="搜索敏感词"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">全部分类</option>
            <option value="政治">政治敏感</option>
            <option value="色情">色情低俗</option>
            <option value="暴力">暴力血腥</option>
            <option value="广告">广告营销</option>
            <option value="业务">业务相关</option>
          </select>
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="">全部级别</option>
            <option value="1">警告</option>
            <option value="2">禁止</option>
          </select>
          <select value={isActive} onChange={(e) => setIsActive(e.target.value)}>
            <option value="">全部状态</option>
            <option value="1">启用</option>
            <option value="0">禁用</option>
          </select>
          <button type="submit" className="btn btn-primary">搜索</button>
        </form>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>敏感词</th>
              <th>分类</th>
              <th>级别</th>
              <th>状态</th>
              <th>描述</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="text-center">加载中...</td></tr>
            ) : words.length === 0 ? (
              <tr><td colSpan="8" className="text-center">暂无数据</td></tr>
            ) : (
              words.map((word) => (
                <tr key={word.id}>
                  <td>{word.id}</td>
                  <td>{word.word}</td>
                  <td>{getCategoryName(word.category)}</td>
                  <td>
                    <span className={`level-badge level-${word.level}`}>
                      {getLevelName(word.level)}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${word.is_active === 1 ? 'active' : 'inactive'}`}>
                      {word.is_active === 1 ? '启用' : '禁用'}
                    </span>
                  </td>
                  <td>{word.description || '-'}</td>
                  <td>{new Date(word.create_time * 1000).toLocaleString()}</td>
                  <td>
                    <button className="btn btn-sm btn-primary" onClick={() => handleEdit(word)}>编辑</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(word.id)}>删除</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button className="btn btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>上一页</button>
        <span className="page-info">第 {page} 页，共 {totalPages} 页，总计 {total} 条</span>
        <button className="btn btn-sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>下一页</button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingWord.id ? '编辑敏感词' : '添加敏感词'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>敏感词 *</label>
                <input
                  type="text"
                  value={editingWord.word}
                  onChange={(e) => setEditingWord({ ...editingWord, word: e.target.value })}
                  maxLength="100"
                />
              </div>
              <div className="form-group">
                <label>分类</label>
                <select
                  value={editingWord.category || ''}
                  onChange={(e) => setEditingWord({ ...editingWord, category: e.target.value })}
                >
                  <option value="">请选择分类</option>
                  <option value="政治">政治敏感</option>
                  <option value="色情">色情低俗</option>
                  <option value="暴力">暴力血腥</option>
                  <option value="广告">广告营销</option>
                  <option value="业务">业务相关</option>
                </select>
              </div>
              <div className="form-group">
                <label>级别</label>
                <select
                  value={editingWord.level}
                  onChange={(e) => setEditingWord({ ...editingWord, level: parseInt(e.target.value) })}
                >
                  <option value={1}>警告</option>
                  <option value={2}>禁止</option>
                </select>
              </div>
              <div className="form-group">
                <label>状态</label>
                <select
                  value={editingWord.is_active}
                  onChange={(e) => setEditingWord({ ...editingWord, is_active: parseInt(e.target.value) })}
                >
                  <option value={1}>启用</option>
                  <option value={0}>禁用</option>
                </select>
              </div>
              <div className="form-group">
                <label>描述</label>
                <textarea
                  value={editingWord.description || ''}
                  onChange={(e) => setEditingWord({ ...editingWord, description: e.target.value })}
                  rows="3"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleSave}>保存</button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>取消</button>
            </div>
          </div>
        </div>
      )}

      {showImportModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>批量导入敏感词</h2>
              <button className="close-btn" onClick={() => setShowImportModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p className="help-text">每行一个敏感词</p>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="敏感词1&#10;敏感词2&#10;敏感词3"
                rows="10"
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleImport}>导入</button>
              <button className="btn btn-secondary" onClick={() => setShowImportModal(false)}>取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SensitiveWordManagement;
